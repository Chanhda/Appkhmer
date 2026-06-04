import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Shadows, Spacing, Typography, FontFamily } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { fetchHeritages, fetchLikedHeritagesLocally, toggleHeritageLike, type HeritageDocument } from '@/lib/heritage-repository';

export default function FavoritesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? 'dark'];
  const styles = getStyles(C, colorScheme ?? 'dark');

  const [favorites, setFavorites] = useState<HeritageDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      try {
        const likedIds = await fetchLikedHeritagesLocally();
        const allHeritages = await fetchHeritages();
        const likedHeritages = allHeritages.filter(h => likedIds.includes(h.id));
        setFavorites(likedHeritages);
      } catch (err) {
        console.error('Error loading favorites:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadFavorites();
  }, []);

  const removeFavorite = async (id: string) => {
    try {
      await toggleHeritageLike(id, false);
      setFavorites((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  const confirmRemoveFavorite = (id: string, title: string) => {
    Alert.alert('Xóa yêu thích', `Bỏ "${title}" khỏi danh sách yêu thích?`, [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: () => removeFavorite(id) },
    ]);
  };

  const openFavorite = (id: string) => {
    router.push(`/heritage/${id}`);
  };

  return (
    <View style={styles.screen}>
      {/* Header Info */}
      <Animated.View
        entering={FadeIn.duration(500)}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTextBox}>
            <ThemedText style={styles.headerTitle}>Yêu thích</ThemedText>
            <ThemedText style={styles.headerSub}>{favorites.length} di sản đã lưu</ThemedText>
          </View>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color={C.primary} style={{ marginTop: Spacing.xl }} />
        ) : favorites.length === 0 ? (
          <Animated.View entering={FadeInDown.duration(600)} style={styles.emptyContainer}>
            <View style={styles.emptyIconBg}>
              <IconSymbol name="heart" size={36} color={C.textTertiary} />
            </View>
            <ThemedText style={styles.emptyTitle}>Chưa có yêu thích</ThemedText>
            <ThemedText style={styles.emptySubtitle}>
              Nhấn biểu tượng trái tim trong trang chi tiết để lưu di sản vào danh sách yêu thích của bạn.
            </ThemedText>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.listContainer}>
            {favorites.map((item, idx) => (
              <View
                key={item.id}
                style={styles.favoriteCard}
              >
                <Pressable
                  style={styles.cardContent}
                  onPress={() => openFavorite(item.id)}
                >
                  {/* Thumbnail placeholder with icon */}
                  <View style={styles.thumbnail}>
                    <IconSymbol name="building.2.fill" size={24} color={C.primary} />
                    <View style={styles.indexBadge}>
                      <ThemedText style={styles.indexBadgeText}>{idx + 1}</ThemedText>
                    </View>
                  </View>

                  {/* Info */}
                  <View style={styles.cardText}>
                    <ThemedText style={styles.cardTitle} numberOfLines={1}>
                      {item.title}
                    </ThemedText>
                    <ThemedText style={styles.cardDescription} numberOfLines={2}>
                      {item.description}
                    </ThemedText>
                    <View style={styles.cardMeta}>
                      <View style={styles.metaItem}>
                        <IconSymbol name="location.fill" size={11} color={C.accent} />
                        <ThemedText style={styles.metaText}>{item.province}</ThemedText>
                      </View>
                      <View style={styles.metaItem}>
                        <IconSymbol name="star.fill" size={11} color={C.primary} />
                        <ThemedText style={styles.metaText}>4.8 (1.2k+)</ThemedText>
                      </View>
                    </View>
                  </View>

                  {/* Remove Button */}
                  <Pressable
                    style={({ pressed }) => [
                      styles.removeBtn,
                      pressed && { backgroundColor: `${C.secondary}25` }
                    ]}
                    onPress={() => confirmRemoveFavorite(item.id, item.title)}
                  >
                    <IconSymbol name="heart.fill" size={18} color={C.secondary} />
                  </Pressable>
                </Pressable>
              </View>
            ))}
          </Animated.View>
        )}

        <ThemedText style={styles.hint}>
          Bấm thẻ để mở chi tiết • Bấm trái tim để bỏ yêu thích
        </ThemedText>
      </ScrollView>
    </View>
  );
}

const getStyles = (C: typeof Colors.dark, scheme: string) => StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.background,
  },
  header: {
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.containerMargin,
    borderBottomWidth: 0.5,
    borderBottomColor: `${C.border}60`,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  headerTextBox: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: FontFamily.playfairBold,
    color: C.primary,
  },
  headerSub: {
    ...Typography.bodySmall,
    color: C.textTertiary,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.containerMargin,
    paddingBottom: 60,
    gap: Spacing.md,
  },
  listContainer: {
    gap: Spacing.sm,
  },
  favoriteCard: {
    backgroundColor: scheme === 'light' ? 'rgba(255, 254, 250, 0.95)' : 'rgba(28, 28, 28, 0.8)',
    borderWidth: 1,
    borderColor: scheme === 'light' ? 'rgba(182, 139, 30, 0.16)' : 'rgba(212, 175, 55, 0.15)',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#B68B1E',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      default: {
        shadowColor: '#B68B1E',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 4,
      },
    }),
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    backgroundColor: `${C.primary}12`,
    borderWidth: 0.5,
    borderColor: `${C.primary}30`,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    position: 'relative',
  },
  indexBadge: {
    position: 'absolute',
    top: -4,
    left: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: C.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.goldGlow,
  },
  indexBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#131313',
  },
  cardText: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    ...Typography.titleSmall,
    color: C.text,
    fontWeight: '700',
  },
  cardDescription: {
    ...Typography.bodySmall,
    color: C.textSecondary,
    lineHeight: 18,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    ...Typography.labelSmall,
    color: C.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  removeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `${C.secondary}12`,
    borderWidth: 0.5,
    borderColor: `${C.secondary}30`,
    flexShrink: 0,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.md,
  },
  emptyIconBg: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.lg,
    backgroundColor: C.backgroundTertiary,
    borderWidth: 0.5,
    borderColor: C.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    ...Typography.titleSmall,
    color: C.text,
    fontWeight: '700',
  },
  emptySubtitle: {
    ...Typography.bodySmall,
    color: C.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Spacing.md,
  },
  hint: {
    ...Typography.bodySmall,
    color: C.textTertiary,
    textAlign: 'center',
    paddingTop: Spacing.sm,
  },
});
