import { useRouter, type Href } from 'expo-router';
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
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Shadows, Spacing, Typography, FontFamily } from '@/constants/theme';
import { useColorSchemePreference } from '@/contexts/color-scheme-context';
import {
  approveArticle,
  deleteArticle,
  fetchAllArticlesAdmin,
  rejectArticle,
  updateArticle,
  type ArticleDocument,
  type ArticleStatus,
} from '@/lib/article-repository';
import { useRequireAdmin } from '@/lib/auth-session';

type TabType = 'pending' | 'published' | 'rejected';

const FILTER_CATEGORIES = ['Tất cả', 'Lễ hội', 'Kiến trúc', 'Ẩm thực', 'Nghệ thuật', 'Cộng đồng', 'Du lịch'];

export default function AdminArticlesScreen() {
  const { loading: authLoading } = useRequireAdmin();
  const router = useRouter();
  const { resolvedColorScheme } = useColorSchemePreference();
  const C = Colors[resolvedColorScheme];
  const isDark = resolvedColorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const [allArticles, setAllArticles] = useState<ArticleDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await fetchAllArticlesAdmin();
      setAllArticles(data);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  // ── Stats ──
  const pendingArticles = allArticles.filter(a => getStatus(a) === 'pending');
  const publishedArticles = allArticles.filter(a => getStatus(a) === 'published');
  const rejectedArticles = allArticles.filter(a => getStatus(a) === 'rejected');

  function getStatus(article: ArticleDocument): ArticleStatus {
    if (article.status) return article.status;
    return article.published ? 'published' : 'pending';
  }

  // ── Tab data ──
  const tabArticles = allArticles.filter(a => {
    const status = getStatus(a);
    if (activeTab === 'pending') return status === 'pending';
    if (activeTab === 'published') return status === 'published';
    return status === 'rejected';
  });

  const filteredArticles = tabArticles.filter(a => {
    const matchSearch =
      !searchQuery.trim() ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.author || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'Tất cả' || a.category === selectedCategory;
    return matchSearch && matchCat;
  });

  // ── Approve ──
  const handleApprove = async (article: ArticleDocument) => {
    setTogglingId(article.id);
    try {
      await approveArticle(article.id);
      setAllArticles(prev =>
        prev.map(a => a.id === article.id ? { ...a, status: 'published', published: true } : a)
      );
    } catch {
      Alert.alert('Lỗi', 'Không thể duyệt bài viết.');
    } finally {
      setTogglingId(null);
    }
  };

  // ── Reject ──
  const handleReject = (article: ArticleDocument) => {
    const doReject = async (reason?: string) => {
      setRejectingId(article.id);
      try {
        await rejectArticle(article.id, reason);
        setAllArticles(prev =>
          prev.map(a => a.id === article.id
            ? { ...a, status: 'rejected', published: false, rejectReason: reason }
            : a
          )
        );
      } catch {
        Alert.alert('Lỗi', 'Không thể từ chối bài viết.');
      } finally {
        setRejectingId(null);
      }
    };

    if (Platform.OS === 'web') {
      const reason = prompt(`Lý do từ chối bài "${article.title}" (bỏ trống = mặc định):`);
      if (reason !== null) doReject(reason || undefined);
    } else {
      Alert.alert(
        'Từ chối bài viết',
        `Từ chối bài "${article.title}"?`,
        [
          { text: 'Hủy', style: 'cancel' },
          {
            text: 'Từ chối (Không phù hợp)',
            style: 'destructive',
            onPress: () => doReject('Nội dung không phù hợp với tiêu chí đăng tải'),
          },
          {
            text: 'Từ chối (Cần chỉnh sửa)',
            style: 'destructive',
            onPress: () => doReject('Bài viết cần được chỉnh sửa và bổ sung thêm'),
          },
        ]
      );
    }
  };

  // ── Unpublish toggle (for published articles) ──
  const handleTogglePublish = async (article: ArticleDocument) => {
    const newPublished = !article.published;
    setTogglingId(article.id);
    try {
      await updateArticle(article.id, {
        published: newPublished,
        status: newPublished ? 'published' : 'pending',
      });
      setAllArticles(prev =>
        prev.map(a => a.id === article.id
          ? { ...a, published: newPublished, status: newPublished ? 'published' : 'pending' }
          : a
        )
      );
    } catch {
      Alert.alert('Lỗi', 'Không thể thay đổi trạng thái bài viết.');
    } finally {
      setTogglingId(null);
    }
  };

  // ── Delete ──
  const handleDelete = (articleId: string, title: string) => {
    const doDelete = async () => {
      try {
        await deleteArticle(articleId);
        setAllArticles(prev => prev.filter(a => a.id !== articleId));
      } catch {
        Alert.alert('Lỗi', 'Không thể xóa bài viết!');
      }
    };
    if (Platform.OS === 'web') {
      if (confirm(`Xóa bài viết "${title}"?`)) doDelete();
    } else {
      Alert.alert('Xác nhận xóa', `Xóa bài "${title}"?`, [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', style: 'destructive', onPress: doDelete },
      ]);
    }
  };

  if (authLoading || loading) {
    return (
      <View style={[styles.screen, { backgroundColor: C.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={C.primary} />
          <Text style={[styles.loadingText, { color: C.textSecondary }]}>Đang tải bài viết...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: C.background }]}>
      {/* ── Sticky Header ── */}
      <Animated.View
        entering={FadeIn.duration(400)}
        style={[
          styles.stickyHeader,
          {
            backgroundColor: isDark ? 'rgba(19,19,19,0.95)' : 'rgba(245,240,230,0.97)',
            borderBottomColor: `${C.border}40`,
            paddingTop: Math.max(insets.top, 12),
          },
        ]}
      >
        <View style={styles.headerInner}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, { backgroundColor: `${C.primary}15` }, pressed && { opacity: 0.7 }]}
          >
            <IconSymbol name="chevron.left" size={18} color={C.primary} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: C.primary }]}>Quản lý Bài viết</Text>
          <View style={[styles.headerBadge, { backgroundColor: `${C.primary}20`, borderColor: `${C.primary}40` }]}>
            <Text style={[styles.headerBadgeText, { color: C.primary }]}>{allArticles.length}</Text>
          </View>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Add New Button */}
        <Animated.View entering={FadeInDown.delay(60).duration(500)}>
          <Pressable
            style={({ pressed }) => [styles.addNewBtn, { backgroundColor: C.primary }, pressed && { opacity: 0.9 }]}
            onPress={() => router.push('/admin/articles/new' as Href)}
          >
            <IconSymbol name="plus" size={18} color="#131313" />
            <Text style={styles.addNewBtnText}>Thêm bài viết mới</Text>
          </Pressable>
        </Animated.View>

        {/* ── Tabs ── */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.tabsWrap}>
          {([
            { key: 'pending', label: 'Chờ duyệt', count: pendingArticles.length },
            { key: 'published', label: 'Đã đăng', count: publishedArticles.length },
            { key: 'rejected', label: 'Từ chối', count: rejectedArticles.length },
          ] as const).map(tab => {
            const active = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                style={[styles.tabPill, { borderColor: C.border }, active && { backgroundColor: C.primary, borderColor: C.primary }]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text style={[styles.tabPillText, { color: C.textTertiary }, active && { color: '#131313', fontWeight: '700' }]}>
                  {tab.label}
                  {tab.count > 0 ? ` (${tab.count})` : ''}
                </Text>
              </Pressable>
            );
          })}
        </Animated.View>

        {/* Search */}
        <Animated.View entering={FadeInDown.delay(130).duration(500)}>
          <View style={[styles.searchBar, { backgroundColor: isDark ? 'rgba(30,30,30,0.6)' : 'rgba(255,255,255,0.7)', borderColor: `${C.primary}25` }]}>
            <IconSymbol name="magnifyingglass" size={16} color={C.textTertiary} />
            <TextInput
              style={[styles.searchInput, { color: C.text }]}
              placeholder="Tìm kiếm tiêu đề, tác giả..."
              placeholderTextColor={C.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <IconSymbol name="xmark.circle.fill" size={16} color={C.textTertiary} />
              </Pressable>
            )}
          </View>
        </Animated.View>

        {/* Category filter (only for published tab) */}
        {activeTab === 'published' && (
          <Animated.View entering={FadeInDown.delay(150).duration(500)}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
              {FILTER_CATEGORIES.map(cat => {
                const active = cat === selectedCategory;
                return (
                  <Pressable key={cat} onPress={() => setSelectedCategory(cat)}>
                    <View style={[
                      styles.filterChip,
                      { backgroundColor: isDark ? 'rgba(30,30,30,0.5)' : 'rgba(255,255,255,0.7)', borderColor: C.border },
                      active && { backgroundColor: `${C.primary}20`, borderColor: C.primary },
                    ]}>
                      <Text style={[styles.filterChipText, { color: C.textSecondary }, active && { color: C.primary, fontWeight: '700' }]}>
                        {cat}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Animated.View>
        )}

        {/* ── List ── */}
        <View style={styles.listSection}>
          {/* Result count / Refresh */}
          <View style={styles.resultRow}>
            <Text style={[styles.resultCount, { color: C.textTertiary }]}>
              Tìm thấy {filteredArticles.length} bài viết
            </Text>
            <Pressable onPress={loadArticles} style={styles.refreshBtn}>
              <IconSymbol name="arrow.clockwise" size={13} color={C.primary} />
              <Text style={[styles.refreshText, { color: C.primary }]}>Làm mới</Text>
            </Pressable>
          </View>

          {/* Empty state */}
          {filteredArticles.length === 0 ? (
            <Animated.View entering={FadeInDown.duration(500)}>
              <View style={[styles.emptyCard, { backgroundColor: isDark ? 'rgba(30,30,30,0.4)' : 'rgba(255,255,255,0.7)', borderColor: C.border }]}>
                <View style={[styles.emptyIconBg, { backgroundColor: C.backgroundTertiary }]}>
                  <IconSymbol
                    name={activeTab === 'pending' ? 'clock.fill' : activeTab === 'published' ? 'checkmark.circle' : 'xmark.circle'}
                    size={36}
                    color={C.textTertiary}
                  />
                </View>
                <Text style={[styles.emptyTitle, { color: C.text }]}>
                  {activeTab === 'pending' ? 'Không có bài chờ duyệt'
                    : activeTab === 'published' ? 'Chưa có bài đã xuất bản'
                    : 'Không có bài bị từ chối'}
                </Text>
                <Text style={[styles.emptySubtitle, { color: C.textSecondary }]}>
                  {activeTab === 'pending'
                    ? 'Khi người dùng gửi bài, bài viết sẽ xuất hiện ở đây để chờ duyệt.'
                    : activeTab === 'published'
                    ? 'Chưa có bài viết nào được hiển thị cho người dùng.'
                    : 'Các bài viết bị từ chối sẽ hiển thị ở đây.'}
                </Text>
              </View>
            </Animated.View>
          ) : (
            filteredArticles.map((article, index) => {
              const status = getStatus(article);
              const statusColors = {
                pending: { bg: `${C.primary}18`, border: `${C.primary}30`, text: C.primary, label: 'CHỜ DUYỆT' },
                published: { bg: `${C.accent}18`, border: `${C.accent}30`, text: C.accent, label: 'ĐÃ ĐĂNG' },
                rejected: { bg: `${C.error}18`, border: `${C.error}30`, text: C.error, label: 'TỪ CHỐI' },
              };
              const sc = statusColors[status];
              return (
                <Animated.View
                  key={article.id}
                  entering={FadeInDown.delay(180 + index * 40).duration(450)}
                >
                  <View style={[
                    styles.articleCard,
                    { backgroundColor: isDark ? 'rgba(30,30,30,0.6)' : 'rgba(255,255,255,0.8)', borderColor: `${C.primary}20` },
                  ]}>
                    {/* Top Row: Thumbnail + Details */}
                    <View style={styles.cardTop}>
                      {article.coverImage ? (
                        <Image source={{ uri: article.coverImage }} style={styles.thumbnail} />
                      ) : (
                        <View style={[styles.thumbnailPlaceholder, { backgroundColor: C.backgroundTertiary, borderColor: C.border }]}>
                          <IconSymbol name="newspaper" size={20} color={C.textTertiary} />
                        </View>
                      )}
                      <View style={styles.cardInfo}>
                        <View style={styles.cardHeaderRow}>
                          <View style={[styles.statusBadge, { backgroundColor: sc.bg, borderColor: sc.border }]}>
                            <Text style={[styles.statusBadgeText, { color: sc.text }]}>
                              {sc.label}
                            </Text>
                          </View>
                          <Text style={[styles.categoryBadgeText, { color: C.textTertiary }]}>
                            {article.category ? article.category.toUpperCase() : 'BÀI VIẾT'}
                          </Text>
                        </View>
                        <Text style={[styles.cardTitle, { color: C.text }]} numberOfLines={2}>
                          {article.title}
                        </Text>
                        <View style={styles.authorRow}>
                          <IconSymbol name="person.fill" size={11} color={C.textTertiary} />
                          <Text style={[styles.metaText, { color: C.textSecondary }]}>
                            {article.author || 'Ẩn danh'}
                          </Text>
                          <Text style={[styles.dotSep, { color: C.textTertiary }]}>•</Text>
                          <Text style={[styles.metaText, { color: C.textSecondary }]}>
                            {article.date || (article.createdAt ? new Date(article.createdAt).toLocaleDateString('vi-VN') : '')}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Summary preview */}
                    {article.summary ? (
                      <View style={[styles.summaryRow, { borderTopColor: `${C.border}60` }]}>
                        <Text style={[styles.summaryText, { color: C.textSecondary }]} numberOfLines={2}>
                          {article.summary}
                        </Text>
                      </View>
                    ) : null}

                    {/* Reject reason banner */}
                    {status === 'rejected' && article.rejectReason && (
                      <View style={[styles.rejectReasonRow, { borderTopColor: `${C.border}60` }]}>
                        <Text style={[styles.rejectReasonText, { color: C.error }]}>
                          Lý do từ chối: {article.rejectReason}
                        </Text>
                      </View>
                    )}

                    {/* Action buttons — PENDING TAB */}
                    {status === 'pending' && (
                      <View style={[styles.actionsRow, { borderTopColor: `${C.border}60` }]}>
                        {togglingId === article.id ? (
                          <View style={styles.loadingRow}>
                            <ActivityIndicator size="small" color={C.primary} />
                            <Text style={[styles.processingText, { color: C.textSecondary }]}>Đang xử lý...</Text>
                          </View>
                        ) : (
                          <>
                            <Pressable
                              style={({ pressed }) => [styles.actionBtn, styles.approveActionBtn, { backgroundColor: C.primary }, pressed && { opacity: 0.8 }]}
                              onPress={() => handleApprove(article)}
                            >
                              <IconSymbol name="checkmark.circle.fill" size={14} color="#131313" />
                              <Text style={styles.approveActionBtnText}>Duyệt bài</Text>
                            </Pressable>

                            <Pressable
                              style={({ pressed }) => [styles.actionBtn, styles.rejectActionBtn, { backgroundColor: `${C.error}18`, borderColor: `${C.error}40` }, pressed && { opacity: 0.8 }]}
                              onPress={() => handleReject(article)}
                            >
                              <IconSymbol name="xmark.circle.fill" size={14} color={C.error} />
                              <Text style={[styles.rejectActionBtnText, { color: C.error }]}>Từ chối</Text>
                            </Pressable>

                            <Pressable
                              style={({ pressed }) => [styles.actionBtn, styles.editActionBtnFull, { backgroundColor: `${C.primary}12`, borderColor: `${C.primary}30` }, pressed && { opacity: 0.8 }]}
                              onPress={() => router.push(`/admin/articles/${article.id}/edit` as Href)}
                            >
                              <IconSymbol name="pencil" size={14} color={C.primary} />
                              <Text style={[styles.editActionBtnText, { color: C.primary }]}>Sửa</Text>
                            </Pressable>
                          </>
                        )}
                      </View>
                    )}

                    {/* Action buttons — PUBLISHED TAB */}
                    {status === 'published' && (
                      <>
                        <View style={[styles.publishToggleRow, { borderTopColor: `${C.border}60` }]}>
                          <View style={styles.statsGroup}>
                            <View style={styles.statItm}>
                              <IconSymbol name="eye.fill" size={12} color={C.accent} />
                              <Text style={[styles.statVal, { color: C.textSecondary }]}>{article.views ?? 0}</Text>
                            </View>
                            <View style={styles.statItm}>
                              <IconSymbol name="heart.fill" size={12} color={C.secondary} />
                              <Text style={[styles.statVal, { color: C.textSecondary }]}>{article.likes ?? 0}</Text>
                            </View>
                          </View>
                          <View style={styles.switchRow}>
                            {togglingId === article.id ? (
                              <ActivityIndicator size="small" color={C.primary} />
                            ) : (
                              <>
                                <Text style={[styles.switchLabel, { color: article.published ? C.accent : C.textTertiary }]}>
                                  {article.published ? 'Hiển thị' : 'Đang ẩn'}
                                </Text>
                                <Switch
                                  value={article.published ?? false}
                                  onValueChange={() => handleTogglePublish(article)}
                                  trackColor={{ false: C.border, true: `${C.accent}70` }}
                                  thumbColor={article.published ? C.accent : C.textTertiary}
                                  style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                                />
                              </>
                            )}
                          </View>
                        </View>

                        <View style={[styles.actionsRow, { borderTopColor: `${C.border}60` }]}>
                          <Pressable
                            style={({ pressed }) => [styles.actionBtn, styles.viewActionBtn, { backgroundColor: `${C.accent}12`, borderColor: `${C.accent}30` }, pressed && { opacity: 0.8 }]}
                            onPress={() => router.push(`/articles/${article.id}` as Href)}
                          >
                            <IconSymbol name="eye.fill" size={14} color={C.accent} />
                            <Text style={[styles.viewActionBtnText, { color: C.accent }]}>Xem</Text>
                          </Pressable>

                          <Pressable
                            style={({ pressed }) => [styles.actionBtn, styles.editActionBtnFull, { backgroundColor: `${C.primary}12`, borderColor: `${C.primary}30` }, pressed && { opacity: 0.8 }]}
                            onPress={() => router.push(`/admin/articles/${article.id}/edit` as Href)}
                          >
                            <IconSymbol name="pencil" size={14} color={C.primary} />
                            <Text style={[styles.editActionBtnText, { color: C.primary }]}>Sửa</Text>
                          </Pressable>

                          <Pressable
                            style={({ pressed }) => [styles.actionBtn, styles.deleteActionBtn, { backgroundColor: `${C.error}12`, borderColor: `${C.error}30` }, pressed && { opacity: 0.8 }]}
                            onPress={() => handleDelete(article.id, article.title)}
                          >
                            <IconSymbol name="trash.fill" size={14} color={C.error} />
                            <Text style={[styles.deleteActionBtnText, { color: C.error }]}>Xóa</Text>
                          </Pressable>
                        </View>
                      </>
                    )}

                    {/* Action buttons — REJECTED TAB */}
                    {status === 'rejected' && (
                      <View style={[styles.actionsRow, { borderTopColor: `${C.border}60` }]}>
                        {togglingId === article.id ? (
                          <View style={styles.loadingRow}>
                            <ActivityIndicator size="small" color={C.primary} />
                            <Text style={[styles.processingText, { color: C.textSecondary }]}>Đang xử lý...</Text>
                          </View>
                        ) : (
                          <>
                            <Pressable
                              style={({ pressed }) => [styles.actionBtn, styles.approveActionBtn, { backgroundColor: C.primary }, pressed && { opacity: 0.8 }]}
                              onPress={() => handleApprove(article)}
                            >
                              <IconSymbol name="arrow.uturn.left" size={14} color="#131313" />
                              <Text style={styles.approveActionBtnText}>Duyệt lại</Text>
                            </Pressable>

                            <Pressable
                              style={({ pressed }) => [styles.actionBtn, styles.deleteActionBtn, { backgroundColor: `${C.error}12`, borderColor: `${C.error}30` }, pressed && { opacity: 0.8 }, { flex: 1 }]}
                              onPress={() => handleDelete(article.id, article.title)}
                            >
                              <IconSymbol name="trash.fill" size={14} color={C.error} />
                              <Text style={[styles.deleteActionBtnText, { color: C.error }]}>Xóa hẳn</Text>
                            </Pressable>
                          </>
                        )}
                      </View>
                    )}
                  </View>
                </Animated.View>
              );
            })
          )}
        </View>
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
    minHeight: 400,
  },
  loadingText: {
    ...Typography.bodyMedium,
  },
  stickyHeader: {
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    zIndex: 100,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.containerMargin,
    gap: Spacing.md,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.headlineMedium,
    fontFamily: FontFamily.playfairBold,
    flex: 1,
  },
  headerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    borderWidth: 0.5,
  },
  headerBadgeText: {
    ...Typography.labelSmall,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.containerMargin,
    gap: Spacing.md,
    paddingBottom: 100,
  },
  addNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.full,
    paddingVertical: 12,
    gap: Spacing.sm,
    ...Shadows.goldGlow,
    shadowColor: '#B68B1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  addNewBtnText: {
    ...Typography.labelLarge,
    color: '#131313',
    fontWeight: '800',
  },
  tabsWrap: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  tabPill: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabPillText: {
    ...Typography.labelMedium,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    height: 48,
    borderRadius: BorderRadius.lg,
    borderWidth: 0.5,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: FontFamily.inter,
    height: '100%',
  },
  filterRow: {
    gap: Spacing.xs,
    paddingVertical: 2,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 0.5,
  },
  filterChipText: {
    ...Typography.labelSmall,
  },
  listSection: {
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultCount: {
    ...Typography.bodySmall,
    fontWeight: '600',
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  refreshText: {
    ...Typography.labelSmall,
    fontWeight: '700',
  },
  emptyCard: {
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 0.5,
  },
  emptyIconBg: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    ...Typography.titleSmall,
    fontWeight: '700',
  },
  emptySubtitle: {
    ...Typography.bodySmall,
    textAlign: 'center',
    lineHeight: 20,
  },
  articleCard: {
    borderWidth: 0.5,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadows.medium,
  },
  cardTop: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.md,
    resizeMode: 'cover',
    flexShrink: 0,
  },
  thumbnailPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    borderWidth: 0.5,
  },
  cardInfo: {
    flex: 1,
    gap: 4,
    justifyContent: 'center',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    borderWidth: 0.5,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  categoryBadgeText: {
    ...Typography.labelSmall,
    fontSize: 10,
    fontWeight: '600',
  },
  cardTitle: {
    ...Typography.titleSmall,
    fontWeight: '700',
    lineHeight: 20,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...Typography.bodySmall,
    fontSize: 12,
  },
  dotSep: {
    fontSize: 10,
  },
  summaryRow: {
    borderTopWidth: 0.5,
    paddingTop: Spacing.sm,
  },
  summaryText: {
    ...Typography.bodySmall,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  rejectReasonRow: {
    borderTopWidth: 0.5,
    paddingTop: Spacing.sm,
  },
  rejectReasonText: {
    ...Typography.bodySmall,
    fontSize: 12,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    borderTopWidth: 0.5,
    paddingTop: Spacing.md,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    height: 38,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  approveActionBtn: {
    flex: 2,
    ...Shadows.goldGlow,
    shadowColor: '#B68B1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  approveActionBtnText: {
    ...Typography.labelSmall,
    color: '#131313',
    fontWeight: '800',
  },
  rejectActionBtn: {
    flex: 1,
  },
  rejectActionBtnText: {
    ...Typography.labelSmall,
    fontWeight: '800',
  },
  editActionBtn: {
    width: 38,
  },
  editActionBtnFull: {
    flex: 1,
  },
  editActionBtnText: {
    ...Typography.labelSmall,
    fontWeight: '800',
  },
  viewActionBtn: {
    flex: 1,
  },
  viewActionBtnText: {
    ...Typography.labelSmall,
    fontWeight: '800',
  },
  deleteActionBtn: {
    flex: 1,
  },
  deleteActionBtnText: {
    ...Typography.labelSmall,
    fontWeight: '800',
  },
  processingText: {
    ...Typography.bodySmall,
  },
  loadingRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    height: 38,
  },
  publishToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    paddingTop: Spacing.sm,
  },
  statsGroup: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statItm: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statVal: {
    ...Typography.labelMedium,
    fontWeight: '700',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  switchLabel: {
    ...Typography.labelSmall,
    fontWeight: '700',
  },
});
