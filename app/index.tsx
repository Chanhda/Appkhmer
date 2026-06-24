import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing, 
  FadeIn, 
  FadeInDown,
  runOnJS
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Spacing, BorderRadius, Shadows, FontFamily } from '@/constants/theme';
import { useColorSchemePreference } from '@/contexts/color-scheme-context';
import { useLanguage } from '@/contexts/language-context';

const SPLASH_DURATION = 7000; // 7 seconds

export default function WelcomeScreen() {
  const router = useRouter();
  const { resolvedColorScheme } = useColorSchemePreference();
  const C = Colors[resolvedColorScheme];
  const { t } = useLanguage();
  const [loadingText, setLoadingText] = useState('');

  const progress = useSharedValue(0);

  useEffect(() => {
    // Smooth progress animation over 7 seconds
    progress.value = withTiming(1, {
      duration: SPLASH_DURATION,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }, (finished) => {
      if (finished) {
        runOnJS(navigateToHome)();
      }
    });

    // Loading texts sequence to make it look premium
    const getTexts = () => {
      const isKhmer = t.auth.subtitle.includes('ច្រក');
      const isEnglish = t.auth.title === 'Heritage' && !t.auth.subtitle.includes('CỔNG');
      if (isKhmer) {
        return ['កំពុងផ្ទុកទិន្នន័យ...', 'កំពុងភ្ជាប់មូលដ្ឋានទិន្នន័យ...', 'កំពុងរៀបចំផែនទីបេតិកភណ្ឌ...', 'រួចរាល់!'];
      }
      if (isEnglish) {
        return ['Loading resources...', 'Connecting database...', 'Initializing heritage map...', 'Ready!'];
      }
      return ['Đang tải tài nguyên...', 'Kết nối cơ sở dữ liệu...', 'Khởi tạo bản đồ di sản...', 'Sẵn sàng!'];
    };

    const textList = getTexts();
    setLoadingText(textList[0]);

    const t1 = setTimeout(() => setLoadingText(textList[1]), 1800);
    const t2 = setTimeout(() => setLoadingText(textList[2]), 3800);
    const t3 = setTimeout(() => setLoadingText(textList[3]), 5800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [t]);

  const navigateToHome = () => {
    router.replace('/(tabs)');
  };

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  const isDark = resolvedColorScheme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Background patterns */}
      <View style={StyleSheet.absoluteFillObject}>
        <LinearGradient
          colors={isDark ? ['#131313', '#1C1B1B'] : ['#F9F6F0', '#F3EDE2']}
          style={StyleSheet.absoluteFillObject}
        />
        {/* Decorative gold gradient blob in background */}
        <View 
          style={[
            styles.decorBlob, 
            { 
              backgroundColor: isDark ? 'rgba(242, 202, 80, 0.03)' : 'rgba(182, 139, 30, 0.02)',
              borderColor: isDark ? 'rgba(242, 202, 80, 0.05)' : 'rgba(182, 139, 30, 0.03)',
            }
          ]} 
        />
      </View>



      {/* Main Content */}
      <View style={styles.contentContainer}>
        {/* Animated App Logo Container */}
        <Animated.View 
          entering={FadeIn.duration(1000)}
          style={[
            styles.logoContainer, 
            { 
              backgroundColor: 'transparent',
              borderColor: 'rgba(242, 202, 80, 0.3)',
              overflow: 'hidden',
            }
          ]}
        >
          <Image 
            source={require('../assets/images/icon.png')} 
            style={styles.logoImage} 
            resizeMode="cover"
          />
        </Animated.View>

        {/* Animated App Title */}
        <Animated.Text 
          entering={FadeInDown.delay(300).duration(800)}
          style={[styles.title, { color: C.primary, fontFamily: FontFamily.playfairBold }]}
        >
          Văn hóa Khmer Nam Bộ
        </Animated.Text>

        {/* Animated Subtitle */}
        <Animated.Text 
          entering={FadeInDown.delay(500).duration(800)}
          style={[styles.subtitle, { color: C.textTertiary, fontFamily: FontFamily.interMedium }]}
        >
          {t.auth.subtitle}
        </Animated.Text>
      </View>

      {/* Bottom Loading Progress Section */}
      <View style={styles.bottomSection}>
        <Text style={[styles.loadingText, { color: C.textSecondary }]}>{loadingText}</Text>
        
        {/* Progress Bar Container */}
        <View style={[styles.progressBarBg, { backgroundColor: isDark ? '#2A2A2A' : '#E9DEC9' }]}>
          <Animated.View 
            style={[
              styles.progressBarFill, 
              progressStyle,
              { 
                backgroundColor: C.primary,
                shadowColor: C.primary,
              }
            ]} 
          />
        </View>

        <Text style={[styles.copyright, { color: C.textTertiary }]}>
          {t.profile.copyright}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xl,
  },
  decorBlob: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 1,
    top: '30%',
    left: '50%',
    marginLeft: -150,
    transform: [{ scale: 1.5 }],
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: 4,
  },
  skipText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: FontFamily.interMedium,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingHorizontal: 30,
    marginTop: 100,
  },
  logoContainer: {
    width: 110,
    height: 110,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    ...Shadows.goldGlow,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 28, // Reduced from 44 to fit "Văn hóa Khmer Nam Bộ"
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    letterSpacing: 2.2,
    lineHeight: 18,
    textAlign: 'center',
    fontWeight: '700',
    marginTop: Spacing.xs,
  },
  bottomSection: {
    width: '100%',
    paddingHorizontal: 40,
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: 40,
  },
  loadingText: {
    fontSize: 13,
    fontFamily: FontFamily.inter,
    letterSpacing: 0.5,
    minHeight: 18,
  },
  progressBarBg: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  copyright: {
    fontSize: 11,
    fontFamily: FontFamily.inter,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
});
