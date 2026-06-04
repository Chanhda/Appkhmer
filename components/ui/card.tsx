import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import {
    Pressable,
    StyleSheet,
    View,
    type PressableProps,
    type ViewStyle,
    type StyleProp,
} from 'react-native';

interface CardProps extends Omit<PressableProps, 'style'> {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: keyof typeof Spacing;
  style?: StyleProp<ViewStyle>;
  pressable?: boolean;
}

export function Card({
  children,
  variant = 'elevated',
  padding = 'md',
  style,
  pressable = false,
  ...props
}: CardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.card,
          ...Shadows.medium,
        };
      case 'outlined':
        return {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'filled':
        return {
          backgroundColor: colors.backgroundSecondary,
        };
    }
  };

  const cardStyle = [
    styles.card,
    getVariantStyles(),
    { padding: Spacing[padding] },
    style,
  ];

  if (pressable) {
    return (
      <Pressable
        style={({ pressed }) => [
          ...cardStyle,
          pressed && styles.pressed,
        ]}
        {...props}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
