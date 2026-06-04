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
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, FontFamily, Shadows, Spacing, Typography } from '@/constants/theme';
import { useColorSchemePreference } from '@/contexts/color-scheme-context';
import { fetchAllArticlesAdmin, approveArticle, rejectArticle, deleteArticle, type ArticleDocument } from '@/lib/article-repository';
import { useRequireAdmin } from '@/lib/auth-session';
import { fetchHeritages } from '@/lib/heritage-repository';
import { getTimeAgo } from '@/lib/time-utils';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80';

type TabType = 'pending' | 'published' | 'rejected';

export default function AdminDashboardScreen() {
  const { loading: authLoading } = useRequireAdmin();
  const router = useRouter();
  const { resolvedColorScheme } = useColorSchemePreference();
  const C = Colors[resolvedColorScheme];
  const isDark = resolvedColorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const [articles, setArticles] = useState<ArticleDocument[]>([]);
  const [heritageCount, setHeritageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('pending');

  useEffect(() => {
    if (authLoading) return;
    (async () => {
      try {
        const [articleData, heritageData] = await Promise.all([
          fetchAllArticlesAdmin(),
          fetchHeritages(),
        ]);
        setArticles(articleData);
        setHeritageCount(heritageData.length);
      } finally {
        setLoading(false);
      }
    })();
  }, [authLoading]);

  const handleApprove = async (id: string) => {
    try {
      await approveArticle(id);
      setArticles(prev =>
        prev.map(a => a.id === id ? { ...a, status: 'published', published: true } : a)
      );
      if (Platform.OS === 'web') alert('Duyệt bài viết thành công!');
      else Alert.alert('Thành công', 'Đã duyệt bài viết.');
    } catch {
      Alert.alert('Lỗi', 'Không thể duyệt bài viết.');
    }
  };

  const handleReject = (article: ArticleDocument) => {
    const doReject = async (reason?: string) => {
      try {
        await rejectArticle(article.id, reason);
        setArticles(prev =>
          prev.map(a => a.id === article.id
            ? { ...a, status: 'rejected', published: false, rejectReason: reason }
            : a
          )
        );
        if (Platform.OS === 'web') alert('Đã từ chối bài viết.');
        else Alert.alert('Thành công', 'Đã từ chối bài viết.');
      } catch {
        Alert.alert('Lỗi', 'Không thể từ chối bài viết.');
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

  const handleDelete = (id: string, title: string) => {
    const doDelete = async () => {
      try {
        await deleteArticle(id);
        setArticles(prev => prev.filter(a => a.id !== id));
        if (Platform.OS === 'web') alert('Xóa bài viết thành công!');
        else Alert.alert('Thành công', 'Đã xóa bài viết.');
      } catch {
        Alert.alert('Lỗi', 'Không thể xóa bài viết.');
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

  function getStatus(a: ArticleDocument) {
    if (a.status) return a.status;
    return a.published ? 'published' : 'pending';
  }

  const pending = articles.filter(a => getStatus(a) === 'pending');
  const published = articles.filter(a => getStatus(a) === 'published');
  const rejected = articles.filter(a => getStatus(a) === 'rejected');
  const tabArticles = activeTab === 'pending' ? pending : activeTab === 'published' ? published : rejected;

  const totalViews = articles.reduce((s, a) => s + (a.views ?? 0), 0);

  if (authLoading || loading) {
    return (
      <View style={[styles.loadingScreen, { backgroundColor: C.background }]}>
        <ActivityIndicator size="large" color={C.primary} />
        <Text style={[styles.loadingText, { color: C.textSecondary }]}>Đang tải...</Text>
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
          <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backBtn, { backgroundColor: `${C.primary}15` }, pressed && { opacity: 0.7 }]}>
            <IconSymbol name="chevron.left" size={18} color={C.primary} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: C.primary }]}>Heritage</Text>
          <View style={[styles.avatarPlaceholder, { borderColor: `${C.primary}30`, backgroundColor: C.surfaceHigh }]}>
            <IconSymbol name="person.fill" size={16} color={C.primary} />
          </View>
        </View>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Hero Banner ── */}
        <Animated.View entering={FadeIn.duration(600)} style={styles.heroWrap}>
          <Image source={{ uri: HERO_IMAGE }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroGradient} />
          <View style={styles.heroContent}>
            <Text style={[styles.heroTitle, { color: C.primary }]}>Quản trị viên</Text>
            <Text style={[styles.heroSub, { color: C.textSecondary }]}>Hệ thống quản lý di sản</Text>
          </View>
        </Animated.View>

        <View style={styles.body}>
          {/* ── Bento Stats Grid ── */}
          <Animated.View entering={FadeInDown.delay(200).duration(500)}>
            {/* Wide card — total */}
            <View style={[
              styles.glassCard, styles.wideCard,
              { backgroundColor: isDark ? 'rgba(30,30,30,0.6)' : 'rgba(255,255,255,0.8)', borderColor: `${C.primary}20` },
            ]}>
              <View>
                <Text style={[styles.statLabel, { color: C.textTertiary }]}>TỔNG BÀI VIẾT</Text>
                <Text style={[styles.statBig, { color: C.primary }]}>{articles.length.toLocaleString()}</Text>
              </View>
              <View style={[styles.statIcon, { backgroundColor: `${C.primary}10` }]}>
                <IconSymbol name="book.fill" size={28} color={C.primary} />
              </View>
            </View>

            {/* 2-col mini stats */}
            <View style={styles.miniStatsRow}>
              <View style={[
                styles.glassCard, styles.miniCard,
                { backgroundColor: isDark ? 'rgba(30,30,30,0.6)' : 'rgba(255,255,255,0.8)', borderColor: `${C.primary}20` },
              ]}>
                <Text style={[styles.statLabel, { color: C.textTertiary }]}>CHỜ DUYỆT</Text>
                <View style={styles.miniStatBottom}>
                  <Text style={[styles.statMedium, { color: C.primary }]}>{pending.length}</Text>
                  {pending.length > 0 && (
                    <Text style={[styles.statSubGold, { color: C.primaryContainer }]}>+{pending.length} hôm nay</Text>
                  )}
                </View>
              </View>
              <View style={[
                styles.glassCard, styles.miniCard,
                { backgroundColor: isDark ? 'rgba(30,30,30,0.6)' : 'rgba(255,255,255,0.8)', borderColor: `${C.primary}20` },
              ]}>
                <Text style={[styles.statLabel, { color: C.textTertiary }]}>LƯỢT XEM</Text>
                <View style={styles.miniStatBottom}>
                  <Text style={[styles.statMedium, { color: C.text }]}>
                    {totalViews > 1000 ? `${(totalViews / 1000).toFixed(0)}K` : totalViews}
                  </Text>
                  <Text style={[styles.statSubTeal, { color: C.accent }]}>↑ 12%</Text>
                </View>
              </View>
            </View>

            {/* Quick links */}
            <View style={styles.quickLinksRow}>
              {[
                { label: 'Bài viết', icon: 'doc.text.fill' as const, href: '/admin/articles', count: articles.length, color: C.accent },
                { label: 'Di sản', icon: 'building.columns.fill' as const, href: '/admin/heritages', count: heritageCount, color: C.primary },
              ].map(item => (
                <TouchableOpacity
                  key={item.label}
                  style={[
                    styles.quickLink,
                    { 
                      backgroundColor: isDark ? 'rgba(30,30,30,0.4)' : 'rgba(255,255,255,0.7)', 
                      borderColor: `${C.border}35`,
                      borderLeftWidth: 3,
                      borderLeftColor: item.color,
                    }
                  ]}
                  activeOpacity={0.8}
                  onPress={() => router.push(item.href as Href)}
                >
                  <View style={[styles.quickLinkIcon, { backgroundColor: `${item.color}14` }]}>
                    <IconSymbol name={item.icon} size={15} color={item.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.quickLinkLabel, { color: C.text }]}>{item.label}</Text>
                    <Text style={[styles.quickLinkCount, { color: C.textTertiary }]}>{item.count} mục</Text>
                  </View>
                  <IconSymbol name="chevron.right" size={12} color={C.textTertiary} />
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* ── Tabs ── */}
          <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.tabsWrap}>
            {([
              { key: 'pending', label: 'Chờ duyệt', count: pending.length },
              { key: 'published', label: 'Đã đăng', count: published.length },
              { key: 'rejected', label: 'Từ chối', count: rejected.length },
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

          {/* ── Articles List ── */}
          <View style={styles.articlesList}>
            {tabArticles.length === 0 ? (
              <View style={styles.emptyState}>
                <IconSymbol name="doc.text" size={32} color={C.textTertiary} />
                <Text style={[styles.emptyText, { color: C.textTertiary }]}>
                  {activeTab === 'pending' ? 'Không có bài chờ duyệt'
                    : activeTab === 'published' ? 'Chưa có bài đã đăng'
                    : 'Không có bài bị từ chối'}
                </Text>
              </View>
            ) : (
              tabArticles.slice(0, 10).map((article, idx) => (
                <Animated.View
                  key={article.id}
                  entering={FadeInDown.delay(350 + idx * 50).duration(400)}
                >
                  <AdminArticleCard
                    article={article}
                    tab={activeTab}
                    C={C}
                    isDark={isDark}
                    onNavigate={() => router.push(`/admin/articles/${article.id}/edit` as Href)}
                    onApprove={() => handleApprove(article.id)}
                    onReject={() => handleReject(article)}
                    onDelete={() => handleDelete(article.id, article.title)}
                  />
                </Animated.View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* ── FAB ── */}
      <Animated.View entering={FadeIn.delay(600).duration(400)} style={styles.fab}>
        <Pressable
          style={({ pressed }) => [styles.fabBtn, { backgroundColor: C.primary }, pressed && { transform: [{ scale: 0.9 }], opacity: 0.9 }]}
          onPress={() => router.push('/admin/articles/new' as Href)}
        >
          <IconSymbol name="plus" size={26} color="#131313" />
        </Pressable>
      </Animated.View>
    </View>
  );
}

// ── Article Card sub-component ──────────────────────────────
function AdminArticleCard({
  article,
  tab,
  C,
  isDark,
  onNavigate,
  onApprove,
  onReject,
  onDelete,
}: {
  article: ArticleDocument;
  tab: TabType;
  C: typeof Colors.dark;
  isDark: boolean;
  onNavigate: () => void;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
}) {
  const router = useRouter();
  const statusColors = {
    pending: { bg: `${C.primary}20`, border: `${C.primary}30`, text: C.primary },
    published: { bg: `${C.accent}20`, border: `${C.accent}30`, text: C.accent },
    rejected: { bg: `${C.error}20`, border: `${C.error}30`, text: C.error },
  };
  const status = tab;
  const sc = statusColors[status];
  const statusLabel = { pending: 'CHỜ DUYỆT', published: 'ĐÃ ĐĂNG', rejected: 'TỪ CHỐI' }[status];
  const timeAgo = article.createdAt
    ? getTimeAgo(article.createdAt)
    : '';

  return (
    <View style={[
      styles.articleCard,
      { backgroundColor: isDark ? 'rgba(30,30,30,0.6)' : 'rgba(255,255,255,0.8)', borderColor: `${C.primary}20` },
      tab === 'rejected' && { opacity: 0.75 },
    ]}>
      <View style={styles.articleCardTop}>
        {/* Thumbnail */}
        <View style={[styles.articleThumb, { backgroundColor: C.surfaceHigh }, tab === 'rejected' && { opacity: 0.6 }]}>
          {article.coverImage ? (
            <Image source={{ uri: article.coverImage }} style={StyleSheet.absoluteFill} resizeMode="cover" />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: C.surfaceHigh, justifyContent: 'center', alignItems: 'center' }]}>
              <IconSymbol name="photo" size={20} color={C.textTertiary} />
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.articleCardInfo}>
          <View style={styles.articleCardHeaderRow}>
            <View style={[styles.statusBadge, { backgroundColor: sc.bg, borderColor: sc.border }]}>
              <Text style={[styles.statusBadgeText, { color: sc.text }]}>{statusLabel}</Text>
            </View>
            <Text style={[styles.timeAgo, { color: C.textTertiary }]}>{timeAgo}</Text>
          </View>
          <Text style={[styles.articleCardTitle, { color: C.text }]} numberOfLines={2}>{article.title}</Text>
          <Text style={[styles.articleCardAuthor, { color: C.textTertiary }]}>Tác giả: {article.author}</Text>
        </View>
      </View>

      {/* Reject reason */}
      {tab === 'rejected' && article.rejectReason && (
        <Text style={[styles.rejectReason, { color: C.error, borderTopColor: `${C.border}40` }]}>Lý do: {article.rejectReason}</Text>
      )}

      {/* Actions */}
      <View style={[styles.articleCardActions, { borderTopColor: `${C.border}40` }]}>
        {tab === 'pending' && (
          <>
            <Pressable
              style={({ pressed }) => [styles.actionBtn, styles.approveActionBtn, { backgroundColor: C.primary }, pressed && { opacity: 0.8 }]}
              onPress={onApprove}
            >
              <IconSymbol name="checkmark.circle.fill" size={14} color="#131313" />
              <Text style={styles.approveActionBtnText}>Duyệt bài</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.actionBtn, styles.rejectActionBtn, { backgroundColor: 'rgba(186, 26, 26, 0.08)', borderColor: 'rgba(186, 26, 26, 0.25)' }, pressed && { opacity: 0.8 }]}
              onPress={onReject}
            >
              <IconSymbol name="xmark.circle.fill" size={14} color={C.error} />
              <Text style={[styles.rejectActionBtnText, { color: C.error }]}>Từ chối</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.actionBtn, styles.editActionBtnFull, { backgroundColor: `${C.primary}12`, borderColor: `${C.primary}30` }, pressed && { opacity: 0.8 }]}
              onPress={onNavigate}
            >
              <IconSymbol name="pencil" size={14} color={C.primary} />
              <Text style={[styles.editActionBtnText, { color: C.primary }]}>Sửa</Text>
            </Pressable>
          </>
        )}
        {tab === 'published' && (
          <>
            <Pressable
              style={({ pressed }) => [styles.actionBtn, styles.viewActionBtn, { backgroundColor: 'rgba(0, 112, 115, 0.08)', borderColor: 'rgba(0, 112, 115, 0.25)' }, pressed && { opacity: 0.8 }]}
              onPress={() => router.push(`/articles/${article.id}` as Href)}
            >
              <IconSymbol name="eye.fill" size={14} color={C.accent} />
              <Text style={[styles.viewActionBtnText, { color: C.accent }]}>Xem</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.actionBtn, styles.editActionBtnFull, { backgroundColor: `${C.primary}12`, borderColor: `${C.primary}30` }, pressed && { opacity: 0.8 }]}
              onPress={onNavigate}
            >
              <IconSymbol name="pencil" size={14} color={C.primary} />
              <Text style={[styles.editActionBtnText, { color: C.primary }]}>Sửa</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.actionBtn, styles.deleteActionBtn, { backgroundColor: 'rgba(186, 26, 26, 0.08)', borderColor: 'rgba(186, 26, 26, 0.25)' }, pressed && { opacity: 0.8 }]}
              onPress={onDelete}
            >
              <IconSymbol name="trash.fill" size={14} color={C.error} />
              <Text style={[styles.deleteActionBtnText, { color: C.error }]}>Xóa</Text>
            </Pressable>
          </>
        )}
        {tab === 'rejected' && (
          <>
            <Pressable
              style={({ pressed }) => [styles.actionBtn, styles.approveActionBtn, { backgroundColor: C.primary }, pressed && { opacity: 0.8 }]}
              onPress={onApprove}
            >
              <IconSymbol name="arrow.uturn.left" size={14} color="#131313" />
              <Text style={styles.approveActionBtnText}>Duyệt lại</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.actionBtn, styles.deleteActionBtn, { backgroundColor: 'rgba(186, 26, 26, 0.08)', borderColor: 'rgba(186, 26, 26, 0.25)' }, pressed && { opacity: 0.8 }]}
              onPress={onDelete}
            >
              <IconSymbol name="trash.fill" size={14} color={C.error} />
              <Text style={[styles.deleteActionBtnText, { color: C.error }]}>Xóa hẳn</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}


// ── Styles ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1 },
  loadingScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.md },
  loadingText: { ...Typography.bodyMedium },

  // Header
  stickyHeader: {
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    zIndex: 100,
  },
  headerInner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.containerMargin,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { ...Typography.headlineMedium },
  avatarPlaceholder: {
    width: 36, height: 36, borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center', alignItems: 'center',
  },

  scrollContent: { paddingBottom: 120 },

  // Hero
  heroWrap: { width: '100%', height: 192, position: 'relative', overflow: 'hidden' },
  heroImage: { width: '100%', height: '100%', opacity: 0.55 },
  heroGradient: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: '70%',
    backgroundColor: 'rgba(19,19,19,0.8)',
  },
  heroContent: {
    position: 'absolute', bottom: Spacing.lg, left: Spacing.containerMargin, right: Spacing.containerMargin,
  },
  heroTitle: { ...Typography.headlineLarge },
  heroSub: { ...Typography.labelMedium, marginTop: 2 },

  body: { padding: Spacing.containerMargin, gap: Spacing.lg },

  // Glass card
  glassCard: {
    borderWidth: 0.5,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Platform.select({
      web: { backdropFilter: 'blur(12px)' } as any,
      default: { ...Shadows.medium },
    }),
  },
  wideCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md },
  miniStatsRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md },
  miniCard: { flex: 1 },
  statLabel: { ...Typography.labelSmall, letterSpacing: 0.8, marginBottom: Spacing.xs },
  statBig: { ...Typography.headlineLarge, fontFamily: FontFamily.playfairBold },
  statMedium: { ...Typography.headlineMedium, fontFamily: FontFamily.playfairBold },
  miniStatBottom: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: Spacing.xs },
  statSubGold: { ...Typography.labelSmall },
  statSubTeal: { ...Typography.labelSmall },
  statIcon: {
    width: 48, height: 48, borderRadius: BorderRadius.md,
    justifyContent: 'center', alignItems: 'center',
  },

  // Quick links
  quickLinksRow: { gap: Spacing.sm },
  quickLink: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    borderWidth: 0.5,
    borderRadius: BorderRadius.lg, padding: Spacing.md,
  },
  quickLinkIcon: {
    width: 36, height: 36, borderRadius: BorderRadius.md,
    justifyContent: 'center', alignItems: 'center',
  },
  quickLinkLabel: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 14,
  },
  quickLinkCount: { ...Typography.labelSmall, marginTop: 2 },

  // Tabs
  tabsWrap: { flexDirection: 'row', gap: Spacing.sm },
  tabPill: {
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 0.5,
  },
  tabPillText: { ...Typography.labelMedium },

  // Articles
  articlesList: { gap: Spacing.md },
  emptyState: { alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.xl },
  emptyText: { ...Typography.bodyMedium },
  articleCard: {
    borderWidth: 0.5,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadows.medium,
  },
  articleCardTop: { flexDirection: 'row', gap: Spacing.md },
  articleThumb: {
    width: 72, height: 72, borderRadius: BorderRadius.md,
    overflow: 'hidden', flexShrink: 0,
  },
  articleCardInfo: { flex: 1, gap: 5, justifyContent: 'center' },
  articleCardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: {
    borderWidth: 0.5, borderRadius: BorderRadius.xs,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  statusBadgeText: { fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  timeAgo: { ...Typography.labelSmall },
  articleCardTitle: { ...Typography.bodyLarge, fontWeight: '700', lineHeight: 22, fontSize: 16 },
  articleCardAuthor: { ...Typography.labelSmall },
  rejectReason: {
    ...Typography.labelSmall, fontStyle: 'italic',
    borderTopWidth: 0.5, paddingTop: Spacing.sm,
  },
  articleCardActions: {
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

  // FAB
  fab: { position: 'absolute', bottom: 100, right: Spacing.lg },
  fabBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2CA50',
    ...Shadows.goldGlow,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});