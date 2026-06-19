import { useRouter, useFocusEffect } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Text,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { CustomAlert } from '@/components/ui/custom-alert';
import { BorderRadius, Colors, FontFamily, Shadows, Spacing, Typography } from '@/constants/theme';
import { type ArticleDocument, fetchArticles } from '@/lib/article-repository';
import { useAuthSession } from '@/lib/auth-session';
import { useLanguage } from '@/contexts/language-context';
import { getArticleImageSource } from '@/constants/image-resolver';
import { useColorScheme } from '@/hooks/use-color-scheme';

const CAT_COLORS: Record<string, string> = {
  'Lễ hội': '#FFB4A8',
  'Kiến trúc': '#F2CA50',
  'Ẩm thực': '#7FDEDD',
  'Nghệ thuật': '#D0C5AF',
};

export default function ExploreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { firebaseUser } = useAuthSession();
  const { t, language } = useLanguage();
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? 'dark'];
  const isDark = colorScheme === 'dark';
  const styles = getStyles(C, colorScheme ?? 'dark');

  const [articles, setArticles] = useState<ArticleDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tất cả');

  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onClose?: () => void;
  }>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const showAlert = (
    title: string,
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    onConfirm?: () => void,
    confirmText?: string,
    cancelText?: string,
    onClose?: () => void
  ) => {
    setAlertConfig({
      visible: true,
      type,
      title,
      message,
      onConfirm,
      confirmText,
      cancelText,
      onClose,
    });
  };

  const categoriesList = [
    { key: 'Tất cả', label: t.home.categories.all },
    { key: 'Lễ hội', label: t.home.categories.festival },
    { key: 'Kiến trúc', label: t.heritage.categories.architecture || 'Kiến trúc' },
    { key: 'Ẩm thực', label: t.explore.categories.cuisine || 'Ẩm thực' },
    { key: 'Nghệ thuật', label: t.explore.categories.art || 'Nghệ thuật' },
  ];

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const data = await fetchArticles();
          setArticles(data);
        } finally {
          setLoading(false);
        }
      })();
    }, [])
  );

  const filtered = articles.filter(a => {
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'Tất cả' || a.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <View style={styles.screen}>
      {/* ── Header ── */}
      <Animated.View entering={FadeIn.duration(400)} style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <ThemedText style={styles.headerTitle} numberOfLines={1}>{t.explore.title}</ThemedText>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.searchWrap}>
          <View style={styles.searchBar}>
            <IconSymbol name="magnifyingglass" size={16} color={`${C.primary}70`} />
            <TextInput
              style={styles.searchInput}
              placeholder={t.common.search + '...'}
              placeholderTextColor={`${C.textTertiary}80`}
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </Animated.View>

        {/* Category chips */}
        <Animated.View entering={FadeInDown.delay(150).duration(500)}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {categoriesList.map(cat => (
              <Pressable
                key={cat.key}
                style={[styles.chip, activeCategory === cat.key && styles.chipActive]}
                onPress={() => setActiveCategory(cat.key)}
              >
                <ThemedText style={[styles.chipText, activeCategory === cat.key && styles.chipTextActive]}>
                  {cat.label}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Banner call-to-action */}
        <Animated.View entering={FadeInDown.delay(180).duration(500)} style={styles.bannerWrap}>
          <Pressable
            style={({ pressed }) => [
              styles.bannerCard,
              { backgroundColor: isDark ? 'rgba(242, 202, 80, 0.08)' : 'rgba(182, 139, 30, 0.05)', borderColor: `${C.primary}30` },
              pressed ? { opacity: 0.9 } : {},
            ]}
            onPress={() => {
              if (!firebaseUser) {
                if (Platform.OS === 'web') {
                  const confirmLogin = confirm(
                    language === 'vi' 
                      ? 'Bạn cần đăng nhập để viết bài. Đăng nhập ngay?' 
                      : language === 'km' 
                        ? 'អ្នកត្រូវតែចូលគណនីដើម្បីសរសេរអត្ថបទ។ ចូលឥឡូវនេះ?' 
                        : 'You need to sign in to write an article. Sign in now?'
                  );
                  if (confirmLogin) router.push({ pathname: '/auth', params: { redirectTo: '/articles/new' } });
                } else {
                  showAlert(
                    language === 'vi' ? 'Yêu cầu đăng nhập' : language === 'km' ? 'តម្រូវឱ្យចូលគណនី' : 'Login Required',
                    language === 'vi' ? 'Bạn cần đăng nhập để viết bài viết đóng góp.' : language === 'km' ? 'អ្នកត្រូវតែចូលគណនីដើម្បីសរសេរអត្ថបទ។' : 'You need to sign in to write an article.',
                    'warning',
                    () => {
                      setAlertConfig(prev => ({ ...prev, visible: false }));
                      router.push({ pathname: '/auth', params: { redirectTo: '/articles/new' } });
                    },
                    language === 'vi' ? 'Đăng nhập' : language === 'km' ? 'ចូល' : 'Sign In',
                    language === 'vi' ? 'Hủy' : language === 'km' ? 'បោះបង់' : 'Cancel'
                  );
                }
              } else {
                router.push('/articles/new');
              }
            }}
          >
            <View style={styles.bannerContent}>
              <View style={[styles.bannerIconBg, { backgroundColor: `${C.primary}20` }]}>
                <IconSymbol name="pencil.and.outline" size={20} color={C.primary} />
              </View>
              <View style={styles.bannerTextWrap}>
                <Text style={[styles.bannerTitle, { color: C.primary }]}>
                  {language === 'vi' ? 'Chia sẻ câu chuyện của bạn' : language === 'km' ? 'ចែករំលែករឿងរ៉ាវរបស់អ្នក' : 'Share Your Story'}
                </Text>
                <Text style={[styles.bannerDesc, { color: C.textSecondary }]}>
                  {language === 'vi'
                    ? 'Gửi bài viết giới thiệu văn hóa Khmer để được xuất bản lên cộng đồng.'
                    : language === 'km'
                      ? 'ដាក់ស្នើអត្ថបទណែនាំវប្បធម៌ខ្មែរដើម្បីផ្សព្វផ្សាយទៅសហគមន៍។'
                      : 'Submit an article introducing Khmer culture to be published to the community.'}
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={14} color={C.primary} />
            </View>
          </Pressable>
        </Animated.View>

        {/* Results count */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.resultRow}>
          <ThemedText style={styles.resultCount}>
            {filtered.length} {language === 'vi' ? 'bài viết' : language === 'km' ? 'អត្ថបទ' : 'articles'}
          </ThemedText>
        </Animated.View>

        {/* Articles */}
        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={C.primary} size="large" />
          </View>
        ) : (
          <View style={styles.articleList}>
            {filtered.map((article, idx) => (
              <Animated.View
                key={article.id}
                entering={FadeInDown.delay(240 + idx * 50).duration(400)}
              >
                <Pressable
                  style={({ pressed }) => [styles.articleCard, pressed && { opacity: 0.85 }]}
                  onPress={() => router.push(`/articles/${article.id}`)}
                >
                  <View style={styles.articleRow}>
                    {/* Thumbnail */}
                    <View style={styles.articleThumb}>
                      <Image source={getArticleImageSource(article.id, article.coverImage, article.category)} style={StyleSheet.absoluteFill} resizeMode="cover" />
                    </View>

                    {/* Text */}
                    <View style={styles.articleText}>
                      <View style={styles.articleMeta}>
                        <ThemedText style={[styles.articleCat, { color: CAT_COLORS[article.category] ?? C.primary }]}>
                          {(article.category ?? 'HERITAGE').toUpperCase()}
                        </ThemedText>
                        <View style={styles.metaDot} />
                        <ThemedText style={styles.readTime}>
                          {language === 'vi' ? '5 phút đọc' : language === 'km' ? '៥ នាទីអាន' : '5 min read'}
                        </ThemedText>
                      </View>
                      <ThemedText style={styles.articleTitle} numberOfLines={2}>
                        {article.title}
                      </ThemedText>
                      {article.author ? (
                        <ThemedText style={styles.articleAuthor}>{article.author}</ThemedText>
                      ) : null}
                    </View>
                  </View>
                </Pressable>
              </Animated.View>
            ))}

            {filtered.length === 0 && (
              <View style={styles.emptyState}>
                <IconSymbol name="doc.text" size={36} color={C.textTertiary} />
                <ThemedText style={styles.emptyText}>{t.messages.noResultsFound}</ThemedText>
              </View>
            )}
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        onConfirm={alertConfig.onConfirm}
        onClose={() => {
          setAlertConfig(prev => ({ ...prev, visible: false }));
          if (alertConfig.onClose) {
            alertConfig.onClose();
          }
        }}
      />
    </View>
  );
}

const getStyles = (C: typeof Colors.dark, scheme: string) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.background },

  header: {
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.containerMargin,
    backgroundColor: scheme === 'light' ? 'rgba(249, 246, 240, 0.95)' : 'rgba(19,19,19,0.95)',
    borderBottomWidth: 0.5,
    borderBottomColor: `${C.border}40`,
    overflow: 'visible',
  },
  headerTitle: { ...Typography.headlineMedium, color: C.primary },
  newArticleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: C.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    ...Shadows.goldGlow,
  },
  newArticleBtnText: {
    ...Typography.labelMedium,
    color: scheme === 'light' ? '#F9F6F0' : '#131313',
    fontWeight: '700',
  },

  scrollContent: { paddingBottom: 110 },

  searchWrap: { padding: Spacing.containerMargin, paddingBottom: Spacing.sm },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: C.backgroundSecondary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
    borderWidth: 0.5, borderColor: `${C.border}60`,
  },
  searchInput: {
    flex: 1, color: C.text, fontFamily: FontFamily.inter,
    fontSize: 15, padding: 0, height: 22,
  },

  chipRow: { paddingHorizontal: Spacing.containerMargin, gap: Spacing.sm, paddingBottom: Spacing.md },
  chip: {
    paddingHorizontal: Spacing.md, paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 0.5, borderColor: C.border,
  },
  chipActive: { backgroundColor: C.primary, borderColor: C.primary },
  chipText: { ...Typography.labelMedium, color: C.textTertiary },
  chipTextActive: { color: '#131313', fontWeight: '700' },

  resultRow: { paddingHorizontal: Spacing.containerMargin, marginBottom: Spacing.sm },
  resultCount: { ...Typography.labelMedium, color: C.textTertiary },

  loadingWrap: { padding: Spacing.xxl, alignItems: 'center' },

  articleList: { paddingHorizontal: Spacing.containerMargin, gap: Spacing.md },

  articleCard: {
    backgroundColor: scheme === 'light' ? '#FFFFFF' : C.backgroundSecondary,
    borderWidth: 0.5,
    borderColor: scheme === 'light' ? 'rgba(182, 139, 30, 0.15)' : 'rgba(242, 202, 80, 0.15)',
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    ...Platform.select({
      ios: Shadows.medium,
      web: Shadows.medium,
      default: {},
    }),
  },
  articleRow: { flexDirection: 'row', gap: Spacing.md, alignItems: 'center' },
  articleThumb: {
    width: 80, height: 80, borderRadius: BorderRadius.lg,
    overflow: 'hidden', flexShrink: 0,
    backgroundColor: C.surfaceHigh,
  },
  articleText: { flex: 1, justifyContent: 'center', gap: 5 },
  articleMeta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  articleCat: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: C.border },
  readTime: { ...Typography.labelSmall, color: `${C.textSecondary}80` },
  articleTitle: { ...Typography.headlineSmall, color: C.text, fontSize: 16, lineHeight: 22 },
  articleAuthor: { ...Typography.labelSmall, color: C.textTertiary },

  emptyState: { alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.xxl },
  emptyText: { ...Typography.bodyMedium, color: C.textTertiary },

  // ── Banner Card Styles ────────────────────────────
  bannerWrap: {
    paddingHorizontal: Spacing.containerMargin,
    marginBottom: Spacing.md,
  },
  bannerCard: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.small,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  bannerIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTextWrap: {
    flex: 1,
    gap: 2,
  },
  bannerTitle: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 15,
    fontWeight: '700',
  },
  bannerDesc: {
    fontFamily: FontFamily.inter,
    fontSize: 12,
    lineHeight: 16,
  },
});
