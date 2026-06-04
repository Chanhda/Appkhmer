import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Shadows, Spacing, Typography, FontFamily } from '@/constants/theme';
import { useMemo, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function NotificationsScreen() {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? 'dark'];
  const styles = getStyles(C, colorScheme ?? 'dark');
  const initialNotifications = useMemo(() => ([
    {
      id: 1,
      title: 'Chào mừng đến với Khmer Heritage',
      description: 'Cảm ơn bạn đã cài đặt ứng dụng khám phá di sản.',
      time: '2 giờ trước',
      icon: 'checkmark.circle.fill' as const,
      color: C.accent,
      isNew: true,
    },
    {
      id: 2,
      title: 'Bài viết mới: Angkor Wat',
      description: 'Khám phá lịch sử của ngôi đền vĩ đại qua bài viết mới.',
      time: '5 giờ trước',
      icon: 'star.fill' as const,
      color: C.primary,
      isNew: true,
    },
    {
      id: 3,
      title: 'Cập nhật ứng dụng',
      description: 'Phiên bản v1.0.1 đã sẵn sàng với nhiều tính năng mới.',
      time: 'Hôm qua',
      icon: 'arrow.down.circle.fill' as const,
      color: C.accent,
      isNew: false,
    },
    {
      id: 4,
      title: 'Có di sản gần bạn',
      description: 'Khám phá các địa điểm di sản văn hóa gần bạn ngay hôm nay.',
      time: '2 ngày trước',
      icon: 'mappin.circle.fill' as const,
      color: C.secondary,
      isNew: false,
    },
  ]), []);

  const [notifications, setNotifications] = useState(initialNotifications);

  const clearNotifications = () => {
    Alert.alert('Xóa thông báo', 'Bạn muốn xóa tất cả thông báo?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa tất cả', style: 'destructive', onPress: () => setNotifications([]) },
    ]);
  };

  const dismissNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const newCount = notifications.filter(n => n.isNew).length;

  return (
    <View style={styles.screen}>
      {/* Curved Header */}
      <Animated.View
        entering={FadeIn.duration(500)}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTextBox}>
            <ThemedText style={styles.headerTitle}>Thông báo</ThemedText>
            <ThemedText style={styles.headerSub}>
              {newCount > 0 ? `${newCount} thông báo chưa đọc` : 'Không có thông báo mới'}
            </ThemedText>
          </View>
          {notifications.length > 0 && (
            <Pressable
              onPress={clearNotifications}
              style={({ pressed }) => [styles.clearBtn, pressed && { opacity: 0.7 }]}
            >
              <IconSymbol name="trash.fill" size={16} color={C.primary} />
            </Pressable>
          )}
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length === 0 ? (
          <Animated.View entering={FadeInDown.duration(600)} style={styles.emptyContainer}>
            <View style={styles.emptyIconBg}>
              <IconSymbol name="bell.slash.fill" size={36} color={C.textTertiary} />
            </View>
            <ThemedText style={styles.emptyTitle}>Không có thông báo</ThemedText>
            <ThemedText style={styles.emptySubtitle}>
              Bạn đã xem tất cả thông báo. Chúng tôi sẽ thông báo khi có nội dung mới!
            </ThemedText>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInDown.delay(100).duration(600)}>
            <View style={styles.listCard}>
              {notifications.map((notification, index) => (
                <View
                  key={notification.id}
                  style={[
                    styles.notifRow,
                    index !== notifications.length - 1 && styles.rowBorder,
                  ]}
                >
                  <View style={styles.notifContent}>
                    <View style={[styles.notifIcon, { backgroundColor: `${notification.color}15` }]}>
                      <IconSymbol name={notification.icon} size={20} color={notification.color} />
                    </View>
                    <View style={styles.notifText}>
                      <View style={styles.notifTitleRow}>
                        <ThemedText style={styles.notifTitle} numberOfLines={1}>
                          {notification.title}
                        </ThemedText>
                        {notification.isNew && (
                          <View style={[styles.newBadge, { backgroundColor: `${notification.color}25` }]}>
                            <ThemedText style={[styles.newBadgeText, { color: notification.color }]}>Mới</ThemedText>
                          </View>
                        )}
                      </View>
                      <ThemedText style={styles.notifDescription} numberOfLines={2}>
                        {notification.description}
                      </ThemedText>
                      <View style={styles.notifFooter}>
                        <IconSymbol name="clock" size={11} color={C.textTertiary} />
                        <ThemedText style={styles.notifTime}>
                          {notification.time}
                        </ThemedText>
                      </View>
                    </View>
                    <Pressable
                      onPress={() => dismissNotification(notification.id)}
                      style={({ pressed }) => [styles.dismissBtn, pressed && { backgroundColor: 'rgba(255,255,255,0.05)' }]}
                    >
                      <IconSymbol name="xmark" size={12} color={C.textTertiary} />
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>
        )}
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
  clearBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `${C.primary}15`,
    borderWidth: 0.5,
    borderColor: `${C.primary}30`,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.containerMargin,
    paddingBottom: 60,
  },
  listContainer: {
    gap: Spacing.sm,
  },
  listCard: {
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
  notifRow: {
    padding: Spacing.md,
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: `${C.border}60`,
  },
  notifContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: `${C.border}40`,
    flexShrink: 0,
  },
  notifText: {
    flex: 1,
    gap: 4,
  },
  notifTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  notifTitle: {
    ...Typography.titleSmall,
    color: C.text,
    fontWeight: '700',
    flex: 1,
  },
  newBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  newBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  notifDescription: {
    ...Typography.bodySmall,
    color: C.textSecondary,
    lineHeight: 18,
  },
  notifFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  notifTime: {
    ...Typography.labelSmall,
    color: C.textTertiary,
    fontSize: 11,
  },
  dismissBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
});
