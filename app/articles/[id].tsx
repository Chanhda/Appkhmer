import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, FontFamily, Shadows, Spacing, Typography } from '@/constants/theme';
import { useColorSchemePreference } from '@/contexts/color-scheme-context';
import { useLanguage } from '@/contexts/language-context';
import { type ArticleDocument, fetchArticleById, isArticleLikedLocally, toggleArticleLike, incrementArticleViews, fetchArticles } from '@/lib/article-repository';
import { useAuthSession } from '@/lib/auth-session';
import { type CommentDocument, fetchCommentsForArticle, addCommentToArticle } from '@/lib/comment-repository';
import { getTimeAgo } from '@/lib/time-utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SW, height: SH } = Dimensions.get('window');
const HERO_H = Math.min(SH * 0.4, 320);

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t, language } = useLanguage();
  const { resolvedColorScheme } = useColorSchemePreference();
  const C = Colors[resolvedColorScheme];
  const isDark = resolvedColorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const { firebaseUser, profile } = useAuthSession();
  const scrollViewRef = useRef<ScrollView>(null);
  const [article, setArticle] = useState<ArticleDocument | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<CommentDocument[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState<ArticleDocument[]>([]);

  const scrollCommentsToView = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || typeof id !== 'string') return;
    const authorName = profile?.displayName ?? firebaseUser?.email?.split('@')[0] ?? 'Người đóng góp';
    const text = newComment.trim();
    setNewComment('');
    
    try {
      const savedComment = await addCommentToArticle(
        id,
        text,
        authorName,
        firebaseUser?.uid
      );
      setComments(prev => [...prev, savedComment]);
      setTimeout(() => {
        scrollCommentsToView();
      }, 100);
    } catch (err) {
      console.error('Error adding comment:', err);
      Alert.alert('Lỗi', 'Không thể gửi bình luận của bạn lúc này.');
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function loadArticle() {
      if (typeof id !== 'string') {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await fetchArticleById(id);

        if (isMounted) {
          setArticle(result);
        }

        if (result) {
          const liked = await isArticleLikedLocally(id);
          if (isMounted) {
            setIsLiked(liked);
          }
          // Increment view count in Firestore
          await incrementArticleViews(id);

          // Fetch related articles
          try {
            const allArticles = await fetchArticles();
            let related = allArticles.filter(a => a.id !== id && a.category === result.category);
            if (related.length < 2) {
              const nonCategoryRelated = allArticles.filter(a => a.id !== id && a.category !== result.category);
              related = [...related, ...nonCategoryRelated];
            }
            if (isMounted) {
              setRelatedArticles(related.slice(0, 2));
            }
          } catch (relatedErr) {
            console.error('Error fetching related articles:', relatedErr);
          }
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : 'Không tải được bài viết');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadArticle();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    let isMounted = true;
    async function loadComments() {
      if (typeof id !== 'string') return;
      try {
        setCommentsLoading(true);
        const data = await fetchCommentsForArticle(id);
        if (isMounted) {
          setComments(data);
        }
      } catch (err) {
        console.error('Error loading comments:', err);
      } finally {
        if (isMounted) {
          setCommentsLoading(false);
        }
      }
    }
    loadComments();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleShare = async () => {
    if (!article) return;
    try {
      await Share.share({
        title: article.title,
        message: `${article.title}\n✍️ Tác giả: ${article.author || ''}\n\n${article.summary}\n\nĐọc tiếp tại ứng dụng Khmer Heritage!`,
      });
    } catch (shareError) {
      console.error('Lỗi chia sẻ:', shareError);
    }
  };

  const handleToggleLike = async () => {
    if (typeof id !== 'string') return;
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);

    if (article) {
      setArticle(prev => {
        if (!prev) return prev;
        const currentLikes = prev.likes ?? 0;
        return {
          ...prev,
          likes: Math.max(0, currentLikes + (nextLiked ? 1 : -1))
        };
      });
    }

    try {
      await toggleArticleLike(id, nextLiked);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleCopyLink = () => {
    if (!article) return;
    const shareUrl = Platform.OS === 'web'
      ? window.location.href
      : `https://khmerapp.com/articles/${article.id}`;

    if (Platform.OS === 'web') {
      navigator.clipboard.writeText(shareUrl);
      alert('Đã sao chép liên kết bài viết!');
    } else {
      Alert.alert('Thành công', 'Đã sao chép liên kết vào bộ nhớ tạm.');
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingScreen, { backgroundColor: C.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color={C.primary} />
        <Text style={[styles.loadingText, { color: C.textSecondary }]}>{t.common.loading}</Text>
      </View>
    );
  }

  if (error || !article) {
    return (
      <View style={[styles.loadingScreen, { backgroundColor: C.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <IconSymbol name="exclamationmark.triangle.fill" size={40} color={C.error} />
        <Text style={[styles.loadingText, { color: C.textSecondary }]}>{error || 'Không tìm thấy bài viết này trong cơ sở dữ liệu.'}</Text>
        <Pressable style={[styles.backPillBtn, { backgroundColor: C.primary }]} onPress={() => router.back()}>
          <Text style={styles.backPillBtnText}>{t.common.back}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: C.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Floating Header Actions */}
      <View style={[styles.floatingHeader, { top: Math.max(insets.top, 12) }]}>
        <Pressable
          style={({ pressed }) => [
            styles.floatBtn,
            { borderColor: `${C.primary}20`, backgroundColor: isDark ? 'rgba(30,30,30,0.7)' : 'rgba(255,255,255,0.85)' },
            pressed && { opacity: 0.7 },
          ]}
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={18} color={C.text} />
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.floatBtn,
            { borderColor: `${C.primary}20`, backgroundColor: isDark ? 'rgba(30,30,30,0.7)' : 'rgba(255,255,255,0.85)' },
            pressed && { opacity: 0.7 },
          ]}
          onPress={handleToggleLike}
        >
          <IconSymbol
            name={isLiked ? 'heart.fill' : 'heart'}
            size={18}
            color={isLiked ? C.secondary : C.text}
          />
        </Pressable>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Cover Hero Block */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.heroWrap}>
          {article.coverImage ? (
            <Image source={{ uri: article.coverImage }} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <View style={[styles.heroPlaceholder, { backgroundColor: C.backgroundTertiary }]}>
              <IconSymbol name="photo.fill" size={48} color={C.textTertiary} />
            </View>
          )}
        </Animated.View>

        {/* Content Overlap Card */}
        <Animated.View
          entering={FadeInUp.delay(100).duration(600)}
          style={[styles.contentCard, { backgroundColor: C.background }]}
        >
          {/* Badge & Metadata */}
          <View style={styles.metaHeader}>
            <View style={[styles.categoryBadge, { backgroundColor: `${C.accent}15`, borderColor: `${C.accent}40` }]}>
              <Text style={[styles.categoryBadgeText, { color: C.accent }]}>
                {article.category ? article.category.toUpperCase() : (language === 'vi' ? 'BÀI VIẾT' : language === 'km' ? 'អត្ថបទ' : 'ARTICLE')}
              </Text>
            </View>
            <View style={styles.authorDateRow}>
              <View style={styles.metaItem}>
                <IconSymbol name="person.fill" size={12} color={C.textTertiary} />
                <Text style={[styles.metaText, { color: C.textTertiary }]}>
                  {article.author || (language === 'vi' ? 'Tác giả ẩn danh' : language === 'km' ? 'អ្នកនិពន្ធមិនស្គាល់ឈ្មោះ' : 'Anonymous author')}
                </Text>
              </View>
              <Text style={[styles.metaDot, { color: C.textTertiary }]}>•</Text>
              <View style={styles.metaItem}>
                <IconSymbol name="clock.fill" size={12} color={C.textTertiary} />
                <Text style={[styles.metaText, { color: C.textTertiary }]}>
                  {article.date || (language === 'vi' ? 'Gần đây' : language === 'km' ? 'ថ្មីៗនេះ' : 'Recent')}
                </Text>
              </View>
            </View>
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: C.primary }]}>
            {article.title}
          </Text>

          {/* Summary / Blockquote Panel */}
          {article.summary ? (
            <View style={[styles.summaryPanel, { borderLeftColor: C.primary, backgroundColor: C.backgroundSecondary, borderColor: `${C.primary}20` }]}>
              <Text style={[styles.summaryTitle, { color: C.primary }]}>
                {language === 'vi' ? 'TÓM TẮT BÀI VIẾT' : language === 'km' ? 'សេចក្តីសង្ខេបអត្ថបទ' : 'ARTICLE SUMMARY'}
              </Text>
              <Text style={[styles.summaryText, { color: C.textSecondary }]}>
                {article.summary}
              </Text>
            </View>
          ) : null}

          {/* Main Content Body */}
          <View style={styles.bodyContainer}>
            <Text style={[styles.bodyText, { color: C.text }]}>
              {article.content}
            </Text>
          </View>

          {/* Dynamic illustration block */}
          <View style={[styles.illustrationCard, { backgroundColor: C.backgroundSecondary, borderColor: `${C.primary}15` }]}>
            <View style={styles.illustrationHeader}>
              <IconSymbol name="sparkles" size={16} color={C.primary} />
              <Text style={[styles.illustrationTitle, { color: C.text }]}>
                {language === 'vi' ? 'Khối minh họa & Tư liệu' : language === 'km' ? 'ឯកសារយោង និងគំនូរ' : 'Illustrations & Reference'}
              </Text>
            </View>
            <Text style={[styles.illustrationDescription, { color: C.textSecondary }]}>
              {language === 'vi' ? 'Hệ thống cung cấp thêm các tài liệu đính kèm, thước phim tư liệu và hình ảnh phục chế chất lượng cao liên quan đến bài viết này.' : language === 'km' ? 'ប្រព័ន្ធផ្តល់នូវឯកសារភ្ជាប់បន្ថែម វីដេអូឯកសារ និងរូបភាពស្តារឡើងវិញដែលមានគុណភាពខ្ពស់ទាក់ទងនឹងអត្ថបទនេះ។' : 'The system provides additional attachments, documentary films and high-quality restored images related to this article.'}
            </Text>
            <View style={styles.illustrationTags}>
              {[
                { icon: 'photo.fill' as const, label: language === 'vi' ? 'Hình ảnh' : language === 'km' ? 'រូបភាព' : 'Images' },
                { icon: 'video.fill' as const, label: language === 'vi' ? 'Video tư liệu' : language === 'km' ? 'វីដេអូឯកសារ' : 'Documentary Videos' },
                { icon: 'book.fill' as const, label: language === 'vi' ? 'Trích dẫn cổ' : language === 'km' ? 'សម្រង់បុរាណ' : 'Ancient Quotes' },
              ].map(tag => (
                <View key={tag.label} style={[styles.illustrationTag, { backgroundColor: C.backgroundTertiary, borderColor: `${C.border}40` }]}>
                  <IconSymbol name={tag.icon} size={12} color={C.primary} />
                  <Text style={[styles.illustrationTagText, { color: C.textSecondary }]}>{tag.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Comments Section */}
          <View style={styles.commentsSection}>
            <Text style={[styles.sectionTitleText, { color: C.text }]}>
              {language === 'vi' ? `Bình luận (${comments.length})` : language === 'km' ? `មតិយោបល់ (${comments.length})` : `Comments (${comments.length})`}
            </Text>

            {/* Comment Input */}
            <View style={[styles.commentInputRow, { borderColor: C.border, backgroundColor: C.backgroundSecondary }]}>
              <TextInput
                style={[styles.commentInput, { color: C.text }]}
                placeholder={language === 'vi' ? 'Viết bình luận...' : language === 'km' ? 'សរសេរមតិយោបល់...' : 'Write a comment...'}
                placeholderTextColor={C.textTertiary}
                value={newComment}
                onChangeText={setNewComment}
              />
              <Pressable
                style={({ pressed }) => [
                  styles.sendBtn,
                  { backgroundColor: C.primary },
                  pressed && { opacity: 0.8 },
                ]}
                onPress={handleAddComment}
              >
                <IconSymbol name="paperplane.fill" size={14} color="#131313" />
              </Pressable>
            </View>

            {/* Comments List */}
            <View style={styles.commentsList}>
              {commentsLoading ? (
                <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                  <ActivityIndicator size="small" color={C.primary} />
                </View>
              ) : comments.length > 0 ? (
                comments.map((comment) => (
                  <View key={comment.id} style={[styles.commentItem, { borderBottomColor: `${C.border}40` }]}>
                    <View style={[styles.commentAvatar, { backgroundColor: C.backgroundTertiary }]}>
                      <Text style={[styles.avatarLetter, { color: C.primary }]}>
                        {comment.authorName ? comment.authorName.charAt(0).toUpperCase() : 'U'}
                      </Text>
                    </View>
                    <View style={styles.commentContent}>
                      <View style={styles.commentHeader}>
                        <Text style={[styles.commentAuthor, { color: C.text }]}>{comment.authorName}</Text>
                        <Text style={[styles.commentTime, { color: C.textTertiary }]}>{getTimeAgo(comment.createdAt, language)}</Text>
                      </View>
                      <Text style={[styles.commentText, { color: C.textSecondary }]}>
                        {comment.text}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                  <Text style={{ color: C.textTertiary, fontStyle: 'italic', fontSize: 13 }}>
                    {language === 'vi' ? 'Chưa có bình luận nào. Hãy là người đầu tiên!' : language === 'km' ? 'មិនទាន់មានមតិយោបល់នៅឡើយទេ។' : 'No comments yet. Be the first to comment!'}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Related Articles List */}
          {relatedArticles.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={[styles.relatedTitle, { color: C.text }]}>
                {language === 'vi' ? 'Bài viết liên quan' : language === 'km' ? 'អត្ថបទពាក់ព័ន្ធ' : 'Related Articles'}
              </Text>
              <View style={styles.relatedList}>
                {relatedArticles.map((relArticle) => (
                  <Link key={relArticle.id} href={`/articles/${relArticle.id}`} asChild>
                    <Pressable
                      style={({ pressed }) => [
                        pressed && { opacity: 0.85 },
                      ]}
                    >
                      <View
                        style={[
                          styles.relatedItemCard,
                          { 
                            backgroundColor: isDark ? 'rgba(30,30,30,0.4)' : 'rgba(255,255,255,0.7)', 
                            borderColor: `${C.border}35`,
                            borderLeftWidth: 3,
                            borderLeftColor: C.primary,
                          }
                        ]}
                      >
                        <View style={styles.relatedLeftGroup}>
                          <View style={[styles.relatedIconWrap, { backgroundColor: `${C.primary}14` }]}>
                            <IconSymbol name="doc.text.fill" size={15} color={C.primary} />
                          </View>
                          <View style={styles.relatedTextWrap}>
                            <Text style={{ color: C.text, fontFamily: FontFamily.interSemiBold, fontSize: 14 }} numberOfLines={1}>
                              {relArticle.title}
                            </Text>
                            <Text style={{ color: C.textTertiary, fontFamily: FontFamily.inter, fontSize: 12, marginTop: 2 }} numberOfLines={1}>
                              {relArticle.summary || (language === 'vi' ? 'Tìm hiểu sâu sắc các di sản văn hóa Nam Bộ' : language === 'km' ? 'ស្វែងយល់ស៊ីជម្រៅអំពីបេតិកភណ្ឌវប្បធម៌' : 'Deeply understand the cultural heritage')}
                            </Text>
                          </View>
                        </View>
                        <IconSymbol name="chevron.right" size={12} color={C.textTertiary} />
                      </View>
                    </Pressable>
                  </Link>
                ))}
              </View>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Sticky Bottom Interaction Bar */}
      <View style={[
        styles.stickyBottomBar,
        {
          backgroundColor: isDark ? 'rgba(19, 19, 19, 0.96)' : 'rgba(251, 248, 242, 0.98)',
          borderTopColor: `${C.border}40`,
          paddingBottom: Math.max(insets.bottom, 16),
        },
      ]}>
        <Pressable
          style={({ pressed }) => [
            styles.interactionBtn,
            pressed && { transform: [{ scale: 0.95 }], opacity: 0.8 },
          ]}
          onPress={handleToggleLike}
        >
          <IconSymbol name={isLiked ? 'heart.fill' : 'heart'} size={20} color={isLiked ? C.secondary : C.primary} />
          <Text style={[styles.interactionBtnText, { color: isLiked ? C.secondary : C.primary }]}>
            {isLiked ? (language === 'vi' ? 'Đã thích' : language === 'km' ? 'បានចូលចិត្ត' : 'Liked') : (language === 'vi' ? 'Thích' : language === 'km' ? 'ចូលចិត្ត' : 'Like')}
          </Text>
        </Pressable>

        <View style={[styles.verticalDivider, { backgroundColor: `${C.border}25` }]} />

        <Pressable
          style={({ pressed }) => [
            styles.interactionBtn,
            pressed && { transform: [{ scale: 0.95 }], opacity: 0.8 },
          ]}
          onPress={scrollCommentsToView}
        >
          <IconSymbol name="bubble.left" size={20} color={C.primary} />
          <Text style={[styles.interactionBtnText, { color: C.primary }]}>
            {language === 'vi' ? 'Bình luận' : language === 'km' ? 'មតិ' : 'Comment'}
          </Text>
        </Pressable>

        <View style={[styles.verticalDivider, { backgroundColor: `${C.border}25` }]} />

        <Pressable
          style={({ pressed }) => [
            styles.interactionBtn,
            pressed && { transform: [{ scale: 0.95 }], opacity: 0.8 },
          ]}
          onPress={handleShare}
        >
          <IconSymbol name="square.and.arrow.up" size={20} color={C.primary} />
          <Text style={[styles.interactionBtnText, { color: C.primary }]}>
            {language === 'vi' ? 'Chia sẻ' : language === 'km' ? 'ចែករំលែក' : 'Share'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    ...Typography.bodyMedium,
  },
  backPillBtn: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  backPillBtnText: {
    ...Typography.labelLarge,
    color: '#131313',
  },
  floatingHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
  },
  floatBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    ...Platform.select({
      web: { backdropFilter: 'blur(8px)' } as any,
      default: {},
    }),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  heroWrap: {
    width: SW,
    height: HERO_H,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentCard: {
    paddingHorizontal: Spacing.containerMargin,
    paddingTop: Spacing.lg,
    minHeight: 450,
  },
  metaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    borderWidth: 0.5,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
  },
  categoryBadgeText: {
    ...Typography.labelSmall,
    letterSpacing: 1,
    fontWeight: '600',
  },
  authorDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...Typography.bodySmall,
  },
  metaDot: {
    fontSize: 10,
  },
  title: {
    ...Typography.headlineLarge,
    marginBottom: Spacing.md,
    lineHeight: 38,
    fontFamily: FontFamily.playfairBold,
  },
  summaryPanel: {
    borderLeftWidth: 3,
    borderWidth: 0.5,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
    gap: 4,
  },
  summaryTitle: {
    ...Typography.labelSmall,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  summaryText: {
    ...Typography.bodyMedium,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  bodyContainer: {
    marginBottom: Spacing.xl,
  },
  bodyText: {
    ...Typography.bodyMedium,
    lineHeight: 26,
    fontFamily: FontFamily.inter,
  },
  illustrationCard: {
    borderWidth: 0.5,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  illustrationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  illustrationTitle: {
    ...Typography.titleSmall,
  },
  illustrationDescription: {
    ...Typography.bodySmall,
    lineHeight: 18,
  },
  illustrationTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  illustrationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    borderWidth: 0.5,
  },
  illustrationTagText: {
    ...Typography.labelSmall,
  },
  relatedSection: {
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  relatedTitle: {
    ...Typography.titleMedium,
  },
  relatedList: {
    gap: Spacing.sm,
  },
  relatedItemCard: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    width: '100%',
    borderWidth: 0.5,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md, 
    paddingVertical: Spacing.md,
  },
  relatedLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  relatedIconWrap: {
    width: 36, height: 36, borderRadius: BorderRadius.md,
    justifyContent: 'center', alignItems: 'center',
  },
  relatedTextWrap: {
    flex: 1,
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: 12,
    borderTopWidth: 0.5,
    ...Shadows.medium,
  },
  interactionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 40,
  },
  interactionBtnText: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 14,
    fontWeight: '700',
  },
  verticalDivider: {
    width: 1,
    height: 24,
  },

  // ── Comments Styles ───────────────────────────────
  commentsSection: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  sectionTitleText: {
    fontFamily: FontFamily.playfairBold,
    fontSize: 20,
    fontWeight: '700',
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderRadius: BorderRadius.full,
    paddingLeft: Spacing.md,
    paddingRight: 6,
    height: 48,
  },
  commentInput: {
    flex: 1,
    fontFamily: FontFamily.inter,
    fontSize: 14,
    height: '100%',
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentsList: {
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  commentItem: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
    borderBottomWidth: 0.5,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 14,
    fontWeight: '700',
  },
  commentContent: {
    flex: 1,
    gap: 4,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentAuthor: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 14,
    fontWeight: '600',
  },
  commentTime: {
    fontFamily: FontFamily.inter,
    fontSize: 11,
  },
  commentText: {
    fontFamily: FontFamily.inter,
    fontSize: 13,
    lineHeight: 18,
  },
});