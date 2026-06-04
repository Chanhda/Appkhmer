import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { fetchArticleById, updateArticle } from '@/lib/article-repository';

export default function AdminEditArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Lễ hội');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Admin');
  const [date, setDate] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [published, setPublished] = useState(true);
  const [viewsInput, setViewsInput] = useState('0');
  const [likesInput, setLikesInput] = useState('0');
  const [isSaving, setIsSaving] = useState(false);

  const categories = ['Lễ hội', 'Kiến trúc', 'Ẩm thực', 'Nghệ thuật', 'Cộng đồng', 'Du lịch'];

  useEffect(() => {
    async function loadArticle() {
      if (!id) return;
      try {
        setLoading(true);
        const article = await fetchArticleById(id);
        if (article) {
          setTitle(article.title);
          setCategory(article.category);
          setSummary(article.summary);
          setContent(article.content);
          setAuthor(article.author);
          setDate(article.date);
          setCoverImage(article.coverImage || '');
          setPublished(article.published !== false);
          setViewsInput(article.views !== undefined ? String(article.views) : '0');
          setLikesInput(article.likes !== undefined ? String(article.likes) : '0');
        } else {
          Alert.alert('Lỗi', 'Không tìm thấy bài viết.');
          router.back();
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Lỗi', 'Không thể tải dữ liệu bài viết.');
        router.back();
      } finally {
        setLoading(false);
      }
    }
    loadArticle();
  }, [id]);

  async function handleSave() {
    if (!title.trim() || !summary.trim() || !content.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ Tiêu đề, Tóm tắt và Nội dung.');
      return;
    }

    try {
      setIsSaving(true);
      const views = parseInt(viewsInput) || 0;
      const likes = parseInt(likesInput) || 0;
      await updateArticle(id, {
        title: title.trim(),
        category,
        summary: summary.trim(),
        content: content.trim(),
        author: author.trim(),
        date: date.trim(),
        coverImage: coverImage.trim() || undefined,
        published,
        views,
        likes,
      });

      if (Platform.OS === 'web') {
        alert('Cập nhật bài viết thành công!');
      } else {
        Alert.alert('Thành công', 'Đã cập nhật bài viết.');
      }
      router.back();
    } catch (error) {
      console.error(error);
      const msg = error instanceof Error ? error.message : 'Lỗi không xác định';
      Alert.alert('Lỗi', `Không thể cập nhật bài viết: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color={colors.primary} />
        <ThemedText style={[styles.loadingText, { color: colors.textSecondary }]}>Đang tải bài viết...</ThemedText>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Curved Header */}
      <Animated.View entering={FadeIn.duration(500)} style={[styles.header, { backgroundColor: colors.info, paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.headerTop}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
          >
            <IconSymbol name="chevron.left" size={22} color="#FFFFFF" />
          </Pressable>
          <View style={styles.headerTitleBox}>
            <ThemedText style={styles.headerTitle}>Chỉnh sửa bài viết</ThemedText>
            <ThemedText style={styles.headerSub}>Cập nhật nội dung bài viết</ThemedText>
          </View>
          <View style={[styles.headerIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <IconSymbol name="pencil.circle.fill" size={22} color="#FFFFFF" />
          </View>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section 1 - Core Content */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBg, { backgroundColor: colors.primary + '18' }]}>
              <IconSymbol name="doc.text.fill" size={18} color={colors.primary} />
            </View>
            <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>Nội dung bài viết</ThemedText>
          </View>

          <View style={[styles.formCard, { backgroundColor: colors.backgroundSecondary, borderColor: colors.borderLight }]}>
            <View style={styles.inputGroup}>
              <ThemedText style={[styles.label, { color: colors.textSecondary }]}>Tiêu đề bài viết *</ThemedText>
              <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
                placeholder="Nhập tiêu đề..."
                placeholderTextColor={colors.textTertiary}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={[styles.label, { color: colors.textSecondary }]}>Danh mục</ThemedText>
              <View style={styles.categoryRow}>
                {categories.map((cat) => {
                  const active = cat === category;
                  return (
                    <Pressable key={cat} onPress={() => setCategory(cat)}>
                      <Badge 
                        variant={active ? 'primary' : 'secondary'} 
                        size="medium"
                        style={active ? { backgroundColor: colors.primary } : undefined}
                        textStyle={active ? { color: '#FFFFFF' } : undefined}
                      >
                        {cat}
                      </Badge>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={[styles.label, { color: colors.textSecondary }]}>Tóm tắt ngắn *</ThemedText>
              <TextInput
                style={[styles.input, styles.textArea, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
                placeholder="Mô tả ngắn gọn nội dung bài viết..."
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={3}
                value={summary}
                onChangeText={setSummary}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={[styles.label, { color: colors.textSecondary }]}>Nội dung chi tiết *</ThemedText>
              <TextInput
                style={[styles.input, styles.largeTextArea, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
                placeholder="Viết nội dung chi tiết ở đây..."
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={8}
                value={content}
                onChangeText={setContent}
              />
            </View>
          </View>
        </Animated.View>

        {/* Section 2 - Meta Info */}
        <Animated.View entering={FadeInDown.delay(150).duration(600)}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBg, { backgroundColor: colors.primary + '18' }]}>
              <IconSymbol name="person.fill" size={18} color={colors.primary} />
            </View>
            <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>Thông tin xuất bản</ThemedText>
          </View>

          <View style={[styles.formCard, { backgroundColor: colors.backgroundSecondary, borderColor: colors.borderLight }]}>
            <View style={styles.inputGroup}>
              <ThemedText style={[styles.label, { color: colors.textSecondary }]}>Tác giả</ThemedText>
              <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
                placeholder="Tên người viết..."
                placeholderTextColor={colors.textTertiary}
                value={author}
                onChangeText={setAuthor}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={[styles.label, { color: colors.textSecondary }]}>Ngày hiển thị</ThemedText>
              <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
                placeholder="VD: 26/05/2026"
                placeholderTextColor={colors.textTertiary}
                value={date}
                onChangeText={setDate}
              />
            </View>

            <View style={[styles.switchRow, { borderTopColor: colors.borderLight }]}>
              <View style={styles.switchInfo}>
                <IconSymbol name={published ? 'eye.fill' : 'eye.slash.fill'} size={18} color={published ? colors.success : colors.textTertiary} />
                <View>
                  <ThemedText style={[styles.switchLabel, { color: colors.text }]}>Xuất bản bài viết</ThemedText>
                  <ThemedText style={[styles.switchHelp, { color: colors.textTertiary }]}>
                    Hiển thị bài viết cho người dùng.
                  </ThemedText>
                </View>
              </View>
              <Switch
                value={published}
                onValueChange={setPublished}
                trackColor={{ false: colors.border, true: colors.success + '80' }}
                thumbColor={published ? colors.success : colors.textTertiary}
              />
            </View>
          </View>
        </Animated.View>

        {/* Section 3 - Media */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBg, { backgroundColor: colors.primary + '18' }]}>
              <IconSymbol name="photo.fill" size={18} color={colors.primary} />
            </View>
            <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>Ảnh bìa & Thống kê</ThemedText>
          </View>

          <View style={[styles.formCard, { backgroundColor: colors.backgroundSecondary, borderColor: colors.borderLight }]}>
            <View style={styles.inputGroup}>
              <ThemedText style={[styles.label, { color: colors.textSecondary }]}>URL ảnh bìa (Unsplash/CDN)</ThemedText>
              <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
                placeholder="https://images.unsplash.com/..."
                placeholderTextColor={colors.textTertiary}
                autoCapitalize="none"
                autoCorrect={false}
                value={coverImage}
                onChangeText={setCoverImage}
              />
              {coverImage.trim().startsWith('http') ? (
                <View style={[styles.previewContainer, { borderColor: colors.borderLight }]}>
                  <Image
                    source={{ uri: coverImage.trim() }}
                    style={styles.imagePreview}
                    resizeMode="cover"
                  />
                </View>
              ) : null}
            </View>

            <View style={styles.coordsRow}>
              <View style={{ flex: 1, gap: Spacing.xs }}>
                <View style={styles.statLabelRow}>
                  <IconSymbol name="eye.fill" size={14} color={colors.textTertiary} />
                  <ThemedText style={[styles.miniLabel, { color: colors.textTertiary }]}>Lượt xem</ThemedText>
                </View>
                <TextInput
                  style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
                  placeholder="0"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="number-pad"
                  value={viewsInput}
                  onChangeText={setViewsInput}
                />
              </View>
              <View style={{ flex: 1, gap: Spacing.xs }}>
                <View style={styles.statLabelRow}>
                  <IconSymbol name="heart.fill" size={14} color={colors.textTertiary} />
                  <ThemedText style={[styles.miniLabel, { color: colors.textTertiary }]}>Lượt thích</ThemedText>
                </View>
                <TextInput
                  style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
                  placeholder="0"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="number-pad"
                  value={likesInput}
                  onChangeText={setLikesInput}
                />
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View entering={FadeInDown.delay(280).duration(600)} style={styles.buttonRow}>
          <Button
            variant="outline"
            size="large"
            style={{ flex: 1 }}
            onPress={() => router.back()}
            disabled={isSaving}
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            size="large"
            style={{ flex: 2, backgroundColor: colors.primary }}
            onPress={handleSave}
            disabled={isSaving}
            icon={isSaving ? <ActivityIndicator size="small" color="#FFFFFF" /> : undefined}
          >
            {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    ...Typography.bodyMedium,
    opacity: 0.7,
  },
  header: {
    paddingBottom: Spacing.xl + 8,
    paddingHorizontal: Spacing.lg,
    borderBottomLeftRadius: BorderRadius.xxl,
    borderBottomRightRadius: BorderRadius.xxl,
    ...Shadows.large,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleBox: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  sectionIconBg: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    ...Typography.titleSmall,
    fontWeight: '700',
  },
  formCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadows.small,
  },
  inputGroup: {
    gap: Spacing.xs,
  },
  label: {
    ...Typography.labelMedium,
    fontWeight: '600',
  },
  miniLabel: {
    ...Typography.labelSmall,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 15,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  largeTextArea: {
    minHeight: 200,
    textAlignVertical: 'top',
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
  },
  switchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  switchLabel: {
    ...Typography.bodyMedium,
    fontWeight: '700',
  },
  switchHelp: {
    ...Typography.bodySmall,
    marginTop: 2,
  },
  coordsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  previewContainer: {
    marginTop: Spacing.sm,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
  },
  imagePreview: {
    width: '100%',
    height: 160,
  },
});
