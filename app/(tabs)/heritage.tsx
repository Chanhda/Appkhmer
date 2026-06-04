import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
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
import { useColorScheme } from '@/hooks/use-color-scheme';
import { type HeritageDocument, fetchHeritages } from '@/lib/heritage-repository';
import { useLanguage } from '@/contexts/language-context';
import { useAuthSession } from '@/lib/auth-session';

export default function HeritageScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { firebaseUser } = useAuthSession();
  const { t, language } = useLanguage();
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? 'dark'];
  const styles = getStyles(C, colorScheme ?? 'dark');
  const [heritages, setHeritages] = useState<HeritageDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'tangible' | 'intangible'>('all');
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

  const typeFilters = [
    { key: 'all' as const, label: t.heritage.types.all },
    { key: 'tangible' as const, label: t.heritage.types.tangible },
    { key: 'intangible' as const, label: t.heritage.types.intangible },
  ];

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchHeritages();
        setHeritages(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = heritages.filter(h => {
    const matchSearch = !search || h.title.toLowerCase().includes(search.toLowerCase())
      || (h.province ?? '').toLowerCase().includes(search.toLowerCase());
    const matchType = filter === 'all' || h.type === filter;
    return matchSearch && matchType;
  });

  return (
    <View style={styles.screen}>
      {/* Header */}
      <Animated.View entering={FadeIn.duration(400)} style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <ThemedText style={styles.headerTitle}>{t.heritage.title}</ThemedText>
        <Pressable
          style={({ pressed }) => [styles.newArticleBtn, pressed && { opacity: 0.8 }]}
          onPress={() => {
            if (!firebaseUser) {
              if (Platform.OS === 'web') {
                const confirmLogin = confirm(
                  language === 'vi' 
                    ? 'Bạn cần đăng nhập để đóng góp di sản. Đăng nhập ngay?' 
                    : language === 'km' 
                      ? 'អ្នកត្រូវតែចូលគណនីដើម្បីចូលរួមចំណែក។ ចូលឥឡូវនេះ?' 
                      : 'You need to sign in to contribute. Sign in now?'
                );
                if (confirmLogin) router.push({ pathname: '/auth', params: { redirectTo: '/articles/new' } });
              } else {
                showAlert(
                  language === 'vi' ? 'Yêu cầu đăng nhập' : language === 'km' ? 'តម្រូវឱ្យចូលគណនី' : 'Login Required',
                  language === 'vi' ? 'Bạn cần đăng nhập để đóng góp di sản.' : language === 'km' ? 'អ្នកត្រូវតែចូលគណនីដើម្បីចូលរួមចំណែក។' : 'You need to sign in to contribute.',
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
          <IconSymbol name="plus" size={12} color={colorScheme === 'light' ? '#F9F6F0' : '#131313'} />
          <Text style={styles.newArticleBtnText}>
            {language === 'vi' ? 'Đóng góp' : language === 'km' ? 'ចូលរួមចំណែក' : 'Contribute'}
          </Text>
        </Pressable>
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
            <Pressable style={styles.filterIconBtn}>
              <IconSymbol name="slider.horizontal.3" size={18} color={`${C.primary}80`} />
            </Pressable>
          </View>
        </Animated.View>

        {/* Type filter pills */}
        <Animated.View entering={FadeInDown.delay(150).duration(500)}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
            {typeFilters.map(tf => (
              <Pressable
                key={tf.key}
                style={[styles.filterPill, filter === tf.key && styles.filterPillActive]}
                onPress={() => setFilter(tf.key)}
              >
                <ThemedText style={[styles.filterPillText, filter === tf.key && styles.filterPillTextActive]}>
                  {tf.label}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Near You section */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>{t.home.sections.featured}</ThemedText>
            <ThemedText style={styles.sectionCount}>
              {filtered.length} {language === 'vi' ? 'địa điểm' : language === 'km' ? 'ទីតាំង' : 'locations'}
            </ThemedText>
          </View>
        </Animated.View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={C.primary} size="large" />
          </View>
        ) : (
          <View style={styles.cardList}>
            {filtered.map((h, idx) => (
              <Animated.View key={h.id} entering={FadeInDown.delay(250 + idx * 40).duration(400)}>
                <Pressable
                  style={({ pressed }) => [styles.heritageCard, pressed && { opacity: 0.85 }]}
                  onPress={() => router.push(`/heritage/${h.id}`)}
                >
                  {/* Image */}
                  <View style={styles.cardThumb}>
                    <Image
                      source={{ uri: h.coverImage ?? 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=400&q=80' }}
                      style={StyleSheet.absoluteFill}
                      resizeMode="cover"
                    />
                  </View>

                  {/* Content */}
                  <View style={styles.cardContent}>
                    {/* Badge and Location Row */}
                    <View style={styles.cardHeaderRow}>
                      <View style={[styles.typeBadge, h.type === 'intangible' && styles.typeBadgeTeal]}>
                        <ThemedText style={[styles.typeBadgeText, h.type === 'intangible' && { color: C.accent }]}>
                          {h.type === 'tangible' ? t.heritage.types.tangible.toUpperCase() : h.type === 'intangible' ? t.heritage.types.intangible.toUpperCase() : 'DI SẢN'}
                        </ThemedText>
                      </View>

                      <View style={styles.cardMeta}>
                        <IconSymbol name="location.fill" size={11} color={C.textTertiary} />
                        <ThemedText style={styles.cardMetaText}>{h.province ?? 'Nam Bộ'}</ThemedText>
                      </View>
                    </View>

                    <ThemedText style={styles.cardTitle} numberOfLines={2}>{h.title}</ThemedText>
                    <ThemedText style={styles.cardSubtitle} numberOfLines={2}>{h.subtitle ?? h.description}</ThemedText>
                  </View>
                </Pressable>
              </Animated.View>
            ))}

            {filtered.length === 0 && (
              <View style={styles.emptyState}>
                <IconSymbol name="building.columns" size={36} color={C.textTertiary} />
                <ThemedText style={styles.emptyText}>{t.common.noResults}</ThemedText>
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
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.containerMargin,
    backgroundColor: scheme === 'light' ? 'rgba(249, 246, 240, 0.95)' : 'rgba(19,19,19,0.95)',
    borderBottomWidth: 0.5, borderBottomColor: `${C.border}40`,
  },
  headerTitle: { ...Typography.headlineMedium, color: C.primary },
  newArticleBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: C.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md, paddingVertical: 7,
    ...Shadows.goldGlow,
  },
  newArticleBtnText: { ...Typography.labelMedium, color: scheme === 'light' ? '#F9F6F0' : '#131313', fontWeight: '700' },

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
  filterIconBtn: { padding: 2 },

  filterRow: { paddingHorizontal: Spacing.containerMargin, gap: Spacing.sm, paddingBottom: Spacing.md },
  filterPill: {
    paddingHorizontal: Spacing.md, paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 0.5, borderColor: C.border,
  },
  filterPillActive: { backgroundColor: C.primary, borderColor: C.primary },
  filterPillText: { ...Typography.labelMedium, color: C.textTertiary },
  filterPillTextActive: { color: '#131313', fontWeight: '700' },

  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.containerMargin, marginBottom: Spacing.md,
  },
  sectionTitle: { ...Typography.headlineLarge, color: C.text },
  sectionCount: { ...Typography.labelMedium, color: C.primary },

  loadingWrap: { padding: Spacing.xxl, alignItems: 'center' },

  cardList: { paddingHorizontal: Spacing.containerMargin, gap: Spacing.md },

  heritageCard: {
    flexDirection: 'column',
    backgroundColor: scheme === 'light' ? 'rgba(243, 237, 226, 0.6)' : 'rgba(30,30,30,0.6)',
    borderWidth: 0.5, borderColor: `${C.primary}20`,
    borderRadius: BorderRadius.xl, overflow: 'hidden',
    ...Shadows.medium,
    position: 'relative',
  },
  cardThumb: {
    width: '100%', height: 200,
    overflow: 'hidden',
    backgroundColor: C.surfaceHigh,
  },
  cardContent: {
    width: '100%',
    padding: Spacing.md,
    gap: 8,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: `${C.primary}20`,
    borderWidth: 0.5, borderColor: `${C.primary}30`,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  typeBadgeTeal: { backgroundColor: `${C.accent}18`, borderColor: `${C.accent}30` },
  typeBadgeText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.8, color: C.primary },
  cardTitle: { ...Typography.headlineSmall, color: C.text, lineHeight: 24, fontSize: 18, fontWeight: '700' },
  cardSubtitle: { ...Typography.bodySmall, color: C.textTertiary, lineHeight: 18 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardMetaText: { ...Typography.labelSmall, color: C.textTertiary },
  emptyState: { alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.xxl },
  emptyText: { ...Typography.bodyMedium, color: C.textTertiary },
});
