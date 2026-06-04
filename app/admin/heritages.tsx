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
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { useLanguage } from '@/contexts/language-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRequireAdmin } from '@/lib/auth-session';
import {
  deleteHeritage,
  fetchHeritages,
  type HeritageDocument,
} from '@/lib/heritage-repository';

const FILTER_TYPES = ['Tất cả', 'tangible', 'intangible'] as const;
const FILTER_CATEGORIES = ['Tất cả', 'Kiến trúc tôn giáo', 'Lễ hội truyền thống', 'Nghệ thuật biểu diễn', 'Ẩm thực', 'Khác'];

export default function AdminHeritagesScreen() {
  const { loading: authLoading } = useRequireAdmin();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  const [heritages, setHeritages] = useState<HeritageDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'Tất cả' | 'tangible' | 'intangible'>('Tất cả');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  useEffect(() => {
    loadHeritages();
  }, []);

  const loadHeritages = async () => {
    try {
      setLoading(true);
      const data = await fetchHeritages();
      const sorted = [...data].sort((a, b) => {
        const da = a.createdAt || '';
        const db = b.createdAt || '';
        return db.localeCompare(da);
      });
      setHeritages(sorted);
    } catch (error) {
      console.error('Error loading heritages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string, title: string) => {
    const doDelete = async () => {
      try {
        await deleteHeritage(id);
        setHeritages(prev => prev.filter(h => h.id !== id));
        if (Platform.OS === 'web') {
          alert('Đã xóa di sản!');
        } else {
          Alert.alert('Thành công', 'Đã xóa di sản!');
        }
      } catch {
        Alert.alert('Lỗi', 'Không thể xóa di sản!');
      }
    };

    if (Platform.OS === 'web') {
      if (confirm(`Xóa di sản "${title}"?`)) doDelete();
    } else {
      Alert.alert('Xác nhận xóa', `Bạn có chắc muốn xóa di sản "${title}"?`, [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', style: 'destructive', onPress: doDelete },
      ]);
    }
  };

  // ── Filter ──
  const filteredHeritages = heritages.filter(h => {
    const matchSearch =
      !searchQuery.trim() ||
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.province.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = selectedType === 'Tất cả' || h.type === selectedType;
    const matchCat = selectedCategory === 'Tất cả' || h.category === selectedCategory;
    return matchSearch && matchType && matchCat;
  });

  // ── Stats ──
  const tangibleCount = heritages.filter(h => h.type === 'tangible').length;
  const intangibleCount = heritages.filter(h => h.type === 'intangible').length;

  if (authLoading || loading) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <ThemedText style={[styles.loadingText, { color: colors.textSecondary }]}>
            Đang tải danh sách di sản...
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* ── Curved Header ── */}
      <Animated.View
        entering={FadeIn.duration(500)}
        style={[styles.header, { backgroundColor: colors.secondary, paddingTop: Math.max(insets.top, 12) }]}
      >
        <View style={styles.headerTop}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
          >
            <IconSymbol name="chevron.left" size={22} color="#FFFFFF" />
          </Pressable>
          <View style={styles.headerTitleBox}>
            <ThemedText style={styles.headerTitle}>Quản lý Di sản</ThemedText>
            <ThemedText style={styles.headerSub}>
              {heritages.length} di sản · {tangibleCount} vật thể · {intangibleCount} phi vật thể
            </ThemedText>
          </View>
          <View style={[styles.headerIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <IconSymbol name="building.2.fill" size={22} color="#FFFFFF" />
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
            <ThemedText style={styles.statNum}>{heritages.length}</ThemedText>
            <ThemedText style={styles.statLabel}>Tổng cộng</ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
            <ThemedText style={styles.statNum}>{tangibleCount}</ThemedText>
            <ThemedText style={styles.statLabel}>Vật thể</ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
            <ThemedText style={styles.statNum}>{intangibleCount}</ThemedText>
            <ThemedText style={styles.statLabel}>Phi vật thể</ThemedText>
          </View>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Add New Button ── */}
        <Animated.View entering={FadeInDown.delay(80).duration(500)}>
          <Button
            variant="primary"
            size="large"
            fullWidth
            onPress={() => router.push('/admin/heritages/new' as Href)}
            icon={<IconSymbol name="plus.circle.fill" size={20} color="#FFFFFF" />}
            iconPosition="left"
            style={{ backgroundColor: colors.secondary }}
          >
            Thêm di sản mới
          </Button>
        </Animated.View>

        {/* ── Search Bar ── */}
        <Animated.View entering={FadeInDown.delay(120).duration(500)}>
          <View
            style={[styles.searchBar, { backgroundColor: colors.backgroundSecondary, borderColor: colors.borderLight }]}
          >
            <IconSymbol name="magnifyingglass" size={16} color={colors.textTertiary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Tìm tên di sản, tỉnh thành..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <IconSymbol name="xmark.circle.fill" size={16} color={colors.textTertiary} />
              </Pressable>
            )}
          </View>
        </Animated.View>

        {/* ── Type Filter ── */}
        <Animated.View entering={FadeInDown.delay(140).duration(500)}>
          <View style={styles.typeRow}>
            {FILTER_TYPES.map(tp => {
              const active = tp === selectedType;
              let label = tp === 'Tất cả' ? 'Tất cả' : tp === 'tangible' ? t.heritage.types.tangible : t.heritage.types.intangible;
              let color = active ? colors.secondary : colors.backgroundSecondary;
              return (
                <Pressable
                  key={tp}
                  onPress={() => setSelectedType(tp)}
                  style={[
                    styles.typeChip,
                    { backgroundColor: color, borderColor: active ? colors.secondary : colors.borderLight },
                  ]}
                >
                  <ThemedText
                    style={[styles.typeChipText, { color: active ? '#FFFFFF' : colors.textSecondary }]}
                  >
                    {label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* ── Category Filter ── */}
        <Animated.View entering={FadeInDown.delay(160).duration(500)}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {FILTER_CATEGORIES.map(cat => {
              const active = cat === selectedCategory;
              return (
                <Pressable key={cat} onPress={() => setSelectedCategory(cat)}>
                  <Badge
                    variant={active ? 'warning' : 'secondary'}
                    size="medium"
                    style={active
                      ? { ...styles.filterChip, backgroundColor: colors.warning }
                      : { ...styles.filterChip, backgroundColor: colors.backgroundSecondary, borderColor: colors.borderLight }
                    }
                    textStyle={active ? { color: '#FFFFFF', fontWeight: '700' } : { color: colors.textSecondary }}
                  >
                    {cat}
                  </Badge>
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* ── Heritage List ── */}
        <View style={styles.listSection}>
          {/* Result row */}
          <View style={styles.resultRow}>
            <ThemedText style={[styles.resultCount, { color: colors.textSecondary }]}>
              {filteredHeritages.length} kết quả
              {selectedType !== 'Tất cả' ? ` · ${selectedType === 'tangible' ? 'Vật thể' : 'Phi vật thể'}` : ''}
            </ThemedText>
            <Pressable onPress={loadHeritages} style={styles.refreshBtn}>
              <IconSymbol name="arrow.clockwise" size={14} color={colors.secondary} />
              <ThemedText style={[styles.refreshText, { color: colors.secondary }]}>Làm mới</ThemedText>
            </Pressable>
          </View>

          {filteredHeritages.length === 0 ? (
            <Animated.View entering={FadeInDown.duration(500)}>
              <Card variant="outlined" style={[styles.emptyCard, { borderColor: colors.borderLight }]}>
                <View style={[styles.emptyIconBg, { backgroundColor: colors.backgroundTertiary }]}>
                  <IconSymbol name="building.2" size={40} color={colors.textTertiary} />
                </View>
                <ThemedText style={[styles.emptyTitle, { color: colors.text }]}>
                  {heritages.length === 0 ? 'Chưa có di sản nào' : 'Không tìm thấy kết quả'}
                </ThemedText>
                <ThemedText style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                  {heritages.length === 0
                    ? 'Bấm nút "Thêm di sản mới" để tạo di sản đầu tiên'
                    : 'Thử thay đổi từ khóa hoặc bộ lọc'}
                </ThemedText>
              </Card>
            </Animated.View>
          ) : (
            filteredHeritages.map((item, index) => (
              <Animated.View
                key={item.id}
                entering={FadeInDown.delay(180 + index * 40).duration(450)}
              >
                <Card variant="elevated" style={styles.heritageCard}>
                  {/* ── Top Row ── */}
                  <View style={styles.cardTop}>
                    {item.coverImage ? (
                      <Image source={{ uri: item.coverImage }} style={styles.thumbnail} />
                    ) : (
                      <View style={[styles.thumbnailPlaceholder, { backgroundColor: colors.secondary + '18' }]}>
                        <IconSymbol name="building.2.fill" size={24} color={colors.secondary} />
                      </View>
                    )}

                    <View style={styles.cardInfo}>
                      <ThemedText style={[styles.cardTitle, { color: colors.text }]} numberOfLines={2}>
                        {item.title}
                      </ThemedText>
                      <View style={styles.cardBadgeRow}>
                        <Badge
                          variant={item.type === 'tangible' ? 'success' : 'info'}
                          size="small"
                        >
                          {item.type === 'tangible' ? t.heritage.types.tangible : t.heritage.types.intangible}
                        </Badge>
                        <Badge variant="secondary" size="small">{item.category}</Badge>
                      </View>
                      <View style={styles.locationRow}>
                        <IconSymbol name="location.fill" size={12} color={colors.secondary} />
                        <ThemedText style={[styles.locationText, { color: colors.textSecondary }]}>
                          {item.province}
                        </ThemedText>
                      </View>
                    </View>
                  </View>

                  {/* ── Subtitle ── */}
                  {item.subtitle ? (
                    <View style={[styles.subtitleRow, { borderTopColor: colors.borderLight }]}>
                      <ThemedText style={[styles.subtitleText, { color: colors.textSecondary }]} numberOfLines={2}>
                        {item.subtitle}
                      </ThemedText>
                    </View>
                  ) : null}

                  {/* ── Stats ── */}
                  <View style={[styles.statsBar, { borderTopColor: colors.borderLight }]}>
                    <View style={styles.statItem}>
                      <IconSymbol name="eye.fill" size={13} color={colors.info} />
                      <ThemedText style={[styles.statVal, { color: colors.textSecondary }]}>
                        {item.views ?? 0} lượt xem
                      </ThemedText>
                    </View>
                    <View style={styles.statItem}>
                      <IconSymbol name="heart.fill" size={13} color={colors.accent} />
                      <ThemedText style={[styles.statVal, { color: colors.textSecondary }]}>
                        {item.likes ?? 0} thích
                      </ThemedText>
                    </View>
                    {item.location?.lat && (
                      <View style={styles.statItem}>
                        <IconSymbol name="map.fill" size={13} color={colors.accentGreen} />
                        <ThemedText style={[styles.statVal, { color: colors.textSecondary }]}>
                          Có tọa độ
                        </ThemedText>
                      </View>
                    )}
                  </View>

                  {/* ── Action Buttons ── */}
                  <View style={styles.actionsRow}>
                    <Pressable
                      style={({ pressed }) => [
                        {
                          flex: 1,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                          height: 38,
                          borderRadius: 19,
                          borderWidth: 1.2,
                          backgroundColor: colors.info + '18',
                          borderColor: colors.info + '60',
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                        },
                        pressed && { opacity: 0.75, transform: [{ scale: 0.97 }] },
                      ]}
                      onPress={() => router.push(`/heritage/${item.id}` as Href)}
                    >
                      <IconSymbol name="eye.fill" size={14} color={colors.info} />
                      <ThemedText style={{ fontSize: 13, fontWeight: '700', color: colors.info }}>Xem</ThemedText>
                    </Pressable>

                    <Pressable
                      style={({ pressed }) => [
                        {
                          flex: 1,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                          height: 38,
                          borderRadius: 19,
                          borderWidth: 1.2,
                          backgroundColor: colors.primary + '18',
                          borderColor: colors.primary + '60',
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                        },
                        pressed && { opacity: 0.75, transform: [{ scale: 0.97 }] },
                      ]}
                      onPress={() => router.push(`/admin/heritages/${item.id}/edit` as Href)}
                    >
                      <IconSymbol name="pencil" size={14} color={colors.primary} />
                      <ThemedText style={{ fontSize: 13, fontWeight: '700', color: colors.primary }}>Sửa</ThemedText>
                    </Pressable>

                    <Pressable
                      style={({ pressed }) => [
                        {
                          flex: 1,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                          height: 38,
                          borderRadius: 19,
                          borderWidth: 1.2,
                          backgroundColor: colors.error + '18',
                          borderColor: colors.error + '60',
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                        },
                        pressed && { opacity: 0.75, transform: [{ scale: 0.97 }] },
                      ]}
                      onPress={() => handleDelete(item.id, item.title)}
                    >
                      <IconSymbol name="trash.fill" size={14} color={colors.error} />
                      <ThemedText style={{ fontSize: 13, fontWeight: '700', color: colors.error }}>Xóa</ThemedText>
                    </Pressable>
                  </View>
                </Card>
              </Animated.View>
            ))
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

  // ── Header ──
  header: {
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    borderBottomLeftRadius: BorderRadius.xxl,
    borderBottomRightRadius: BorderRadius.xxl,
    gap: Spacing.md,
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
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    gap: 2,
  },
  statNum: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },

  // ── Scroll ──
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
    paddingBottom: Spacing.xxl,
  },

  // ── Search ──
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    height: 48,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    ...Shadows.small,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    height: '100%',
    padding: 0,
  },

  // ── Type Filter ──
  typeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  typeChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
  },
  typeChipText: {
    ...Typography.labelMedium,
    fontWeight: '700',
  },

  // ── Category Filter ──
  filterRow: {
    gap: Spacing.xs,
    paddingVertical: 2,
  },
  filterChip: {
    borderWidth: 1,
  },

  // ── List ──
  listSection: {
    gap: Spacing.sm,
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

  // ── Empty ──
  emptyCard: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  emptyIconBg: {
    width: 70,
    height: 70,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    ...Typography.titleMedium,
    fontWeight: '700',
  },
  emptySubtitle: {
    ...Typography.bodyMedium,
    textAlign: 'center',
    lineHeight: 22,
  },

  // ── Heritage Card ──
  heritageCard: {
    padding: 0,
    overflow: 'hidden',
    gap: 0,
  },
  cardTop: {
    flexDirection: 'row',
    gap: Spacing.md,
    padding: Spacing.md,
  },
  thumbnail: {
    width: 76,
    height: 76,
    borderRadius: BorderRadius.md,
    resizeMode: 'cover',
    flexShrink: 0,
  },
  thumbnailPlaceholder: {
    width: 76,
    height: 76,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  cardInfo: {
    flex: 1,
    gap: 5,
    justifyContent: 'center',
  },
  cardTitle: {
    ...Typography.titleSmall,
    fontWeight: '700',
    lineHeight: 20,
  },
  cardBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  locationText: {
    ...Typography.bodySmall,
    fontWeight: '600',
  },

  // ── Subtitle ──
  subtitleRow: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    borderTopWidth: 1,
    paddingTop: Spacing.sm,
  },
  subtitleText: {
    ...Typography.bodySmall,
    lineHeight: 18,
    fontStyle: 'italic',
  },

  // ── Stats bar ──
  statsBar: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    flexWrap: 'wrap',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statVal: {
    ...Typography.bodySmall,
    fontWeight: '600',
  },

  // ── Actions ──
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  actionText: {
    ...Typography.labelSmall,
    fontWeight: '800',
  },
});
