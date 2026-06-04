import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { CustomAlert } from '@/components/ui/custom-alert';
import { BorderRadius, Colors, Spacing, Typography, Shadows, FontFamily } from '@/constants/theme';
import { useColorSchemePreference } from '@/contexts/color-scheme-context';
import { loginWithEmail, registerWithEmail, resetPasswordWithEmail } from '@/lib/auth';
import { isFirebaseConfigured } from '@/lib/firebase';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function AuthScreen() {
  const router = useRouter();
  const { redirectTo } = useLocalSearchParams<{ redirectTo?: string }>();
  const { resolvedColorScheme } = useColorSchemePreference();
  const C = Colors[resolvedColorScheme];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | 'confirmPassword' | null>(null);
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
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
    onClose?: () => void
  ) => {
    setAlertConfig({
      visible: true,
      type,
      title,
      message,
      onClose,
    });
  };

  const canUseFirebase = isFirebaseConfigured();

  async function handleResetPassword() {
    if (!email.trim() || !email.includes('@')) {
      showAlert('Email không hợp lệ', 'Vui lòng nhập địa chỉ email chính xác.', 'error');
      return;
    }

    try {
      setLoading(true);
      await resetPasswordWithEmail(email.trim());
      showAlert(
        'Đã gửi yêu cầu',
        'Một liên kết khôi phục mật khẩu đã được gửi đến email của bạn. Hãy kiểm tra hộp thư đến (và cả hòm thư rác).',
        'success',
        () => setIsForgotPasswordMode(false)
      );
    } catch (error) {
      showAlert('Lỗi', error instanceof Error ? error.message : 'Không gửi được email khôi phục', 'error');
    } finally {
      setLoading(false);
    }
  }

  function validateInputs() {
    if (!email.trim() || !password.trim()) {
      showAlert('Thiếu thông tin', 'Vui lòng nhập email và mật khẩu.', 'warning');
      return false;
    }

    if (!email.includes('@')) {
      showAlert('Email không hợp lệ', 'Hãy nhập đúng địa chỉ email.', 'warning');
      return false;
    }

    if (password.trim().length < 6) {
      showAlert('Mật khẩu quá ngắn', 'Mật khẩu phải có ít nhất 6 ký tự.', 'warning');
      return false;
    }

    if (isRegisterMode) {
      if (!confirmPassword.trim()) {
        showAlert('Thiếu thông tin', 'Vui lòng nhập lại mật khẩu để xác nhận.', 'warning');
        return false;
      }
      if (password !== confirmPassword) {
        showAlert('Mật khẩu không khớp', 'Mật khẩu nhập lại không trùng khớp.', 'warning');
        return false;
      }
    }

    return true;
  }

  async function handleLogin() {
    if (!validateInputs()) {
      return;
    }

    try {
      setLoading(true);
      const result = await loginWithEmail(email.trim(), password);
      showAlert('Thành công', 'Đăng nhập thành công.', 'success', () => {
        if (redirectTo) {
          router.replace(redirectTo as any);
        } else {
          router.replace(result.profile.role === 'admin' ? ('/admin' as never) : '/');
        }
      });
    } catch (error) {
      showAlert('Lỗi', error instanceof Error ? error.message : 'Không đăng nhập được', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    if (!validateInputs()) {
      return;
    }

    try {
      setLoading(true);
      const result = await registerWithEmail(email.trim(), password);
      showAlert('Thành công', 'Đăng ký tài khoản thành công.', 'success', () => {
        if (redirectTo) {
          router.replace(redirectTo as any);
        } else {
          router.replace(result.profile.role === 'admin' ? ('/admin' as never) : '/');
        }
      });
    } catch (error) {
      showAlert('Lỗi', error instanceof Error ? error.message : 'Không đăng ký được', 'error');
    } finally {
      setLoading(false);
    }
  }

  const isDark = resolvedColorScheme === 'dark';

  return (
    <View style={[styles.screen, { backgroundColor: C.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Floating Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={[
            styles.backButton,
            {
              backgroundColor: isDark ? '#1C1B1B' : '#FFFFFF',
              borderColor: isDark ? 'rgba(242, 202, 80, 0.45)' : 'rgba(182, 139, 30, 0.35)',
              borderWidth: 1,
            },
          ]}
          activeOpacity={0.7}
        >
          <IconSymbol name="chevron.left" size={20} color={C.text} />
        </TouchableOpacity>

        {/* Branding Hero Block */}
        <Animated.View
          entering={FadeIn.duration(600)}
          style={styles.brandingContainer}
        >
          <View style={[styles.logoBadge, { backgroundColor: `${C.primary}12`, borderColor: `${C.primary}30` }]}>
            <IconSymbol name="building.columns.fill" size={32} color={C.primary} />
          </View>
          <Text style={[styles.brandTitle, { color: C.primary }]}>Heritage</Text>
          <Text style={[styles.brandSubtitle, { color: C.textTertiary }]}>CỔNG KẾT NỐI DI SẢN VĂN HÓA KHMER</Text>
        </Animated.View>

        {/* Input Form Section */}
        <Animated.View
          entering={FadeInDown.delay(150).duration(600)}
          style={[
            styles.formSection,
            {
              backgroundColor: isDark ? '#1C1B1B' : '#FFFFFF',
              borderColor: isDark ? 'rgba(242, 202, 80, 0.3)' : 'rgba(182, 139, 30, 0.25)',
              borderWidth: 1.5,
            },
          ]}
        >
          <Text style={[styles.formTitle, { color: C.primary, fontFamily: FontFamily.playfairMedium }]}>
            {isForgotPasswordMode 
              ? 'Khôi phục mật khẩu' 
              : isRegisterMode 
                ? 'Đăng ký tài khoản' 
                : 'Đăng nhập tài khoản'}
          </Text>

          {!canUseFirebase && (
            <View 
              style={[
                styles.noticeCard, 
                { 
                  backgroundColor: isDark ? 'rgba(242, 202, 80, 0.08)' : 'rgba(182, 139, 30, 0.06)', 
                  borderColor: isDark ? 'rgba(242, 202, 80, 0.3)' : 'rgba(182, 139, 30, 0.35)' 
                }
              ]}
            >
              <View style={styles.noticeHeader}>
                <IconSymbol 
                  name="exclamationmark.triangle.fill" 
                  size={14} 
                  color={isDark ? C.primary : C.primaryDark} 
                />
                <Text style={[styles.noticeTitle, { color: isDark ? C.primary : C.primaryDark }]}>
                  Firebase chưa kết nối
                </Text>
              </View>
              <Text style={[styles.noticeText, { color: C.textSecondary }]}>
                Hãy điền cấu hình EXPO_PUBLIC_FIREBASE_* vào .env để kích hoạt tài khoản thật.
              </Text>
            </View>
          )}

          {isForgotPasswordMode && (
            <Text style={[styles.forgotPasswordDesc, { color: C.textSecondary }]}>
              Nhập địa chỉ email của bạn bên dưới. Hệ thống sẽ gửi liên kết khôi phục qua email để bạn cài đặt lại mật khẩu mới.
            </Text>
          )}

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: C.textSecondary }]}>ĐỊA CHỈ EMAIL</Text>
            <View 
              style={[
                styles.inputWrapper, 
                { 
                  backgroundColor: isDark ? '#121212' : '#FFFFFF',
                  borderColor: focusedField === 'email' 
                    ? (isDark ? C.primary : C.primaryDark) 
                    : (isDark ? 'rgba(242, 202, 80, 0.65)' : 'rgba(182, 139, 30, 0.65)')
                }
              ]}
            >
              <IconSymbol 
                name="envelope.fill" 
                size={14} 
                color={focusedField === 'email' ? (isDark ? C.primary : C.primaryDark) : C.textSecondary} 
              />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="email@vidu.com"
                placeholderTextColor={isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'}
                autoCapitalize="none"
                keyboardType="email-address"
                style={[styles.input, { color: C.text }]}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          {/* Password Input */}
          {!isForgotPasswordMode && (
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: C.textSecondary }]}>MẬT KHẨU</Text>
              <View 
                style={[
                  styles.inputWrapper, 
                  { 
                    backgroundColor: isDark ? '#121212' : '#FFFFFF',
                    borderColor: focusedField === 'password' 
                      ? (isDark ? C.primary : C.primaryDark) 
                      : (isDark ? 'rgba(242, 202, 80, 0.65)' : 'rgba(182, 139, 30, 0.65)')
                  }
                ]}
              >
                <IconSymbol 
                  name="lock.fill" 
                  size={14} 
                  color={focusedField === 'password' ? (isDark ? C.primary : C.primaryDark) : C.textSecondary} 
                />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Nhập ít nhất 6 ký tự"
                  placeholderTextColor={isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'}
                  secureTextEntry={!showPassword}
                  style={[styles.input, { color: C.text }]}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                  <IconSymbol
                    name={showPassword ? 'eye.slash.fill' : 'eye.fill'}
                    size={14}
                    color={focusedField === 'password' ? (isDark ? C.primary : C.primaryDark) : C.textSecondary}
                  />
                </Pressable>
              </View>
              {!isRegisterMode && (
                <Pressable 
                  onPress={() => setIsForgotPasswordMode(true)} 
                  style={styles.forgotPasswordLink}
                >
                  <Text style={[styles.forgotPasswordText, { color: isDark ? C.primary : C.primaryDark }]}>Quên mật khẩu?</Text>
                </Pressable>
              )}
            </View>
          )}

          {/* Confirm Password Input (Only in Register Mode) */}
          {!isForgotPasswordMode && isRegisterMode && (
            <Animated.View entering={FadeInDown.duration(400)} style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: C.textSecondary }]}>NHẬP LẠI MẬT KHẨU</Text>
              <View 
                style={[
                  styles.inputWrapper, 
                  { 
                    backgroundColor: isDark ? '#121212' : '#FFFFFF',
                    borderColor: focusedField === 'confirmPassword' 
                      ? (isDark ? C.primary : C.primaryDark) 
                      : (isDark ? 'rgba(242, 202, 80, 0.65)' : 'rgba(182, 139, 30, 0.65)')
                  }
                ]}
              >
                <IconSymbol 
                  name="lock.fill" 
                  size={14} 
                  color={focusedField === 'confirmPassword' ? (isDark ? C.primary : C.primaryDark) : C.textSecondary} 
                />
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Xác nhận lại mật khẩu"
                  placeholderTextColor={isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'}
                  secureTextEntry={!showPassword}
                  style={[styles.input, { color: C.text }]}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </Animated.View>
          )}

          {/* Button actions */}
          <View style={styles.buttonSpacing}>
            <TouchableOpacity
              style={styles.primaryButtonWrapper}
              onPress={isForgotPasswordMode ? handleResetPassword : (isRegisterMode ? handleRegister : handleLogin)}
              disabled={loading}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={isDark ? ['#FFE082', '#C99E2E'] : ['#F9D368', '#B68B1E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryButtonGradient}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#131313" />
                ) : (
                  <View style={styles.primaryButtonContent}>
                    <View style={styles.primaryButtonIconWrap}>
                      <IconSymbol 
                        name={isForgotPasswordMode ? "paperplane.fill" : (isRegisterMode ? "person.badge.plus.fill" : "lock.fill")} 
                        size={16} 
                        color="#131313" 
                      />
                    </View>
                    <Text style={styles.primaryButtonText}>
                      {isForgotPasswordMode ? 'Gửi liên kết khôi phục' : (isRegisterMode ? 'Đăng Ký Ngay' : 'Đăng Nhập')}
                    </Text>
                    <IconSymbol name="chevron.right" size={14} color="rgba(19,19,19,0.6)" />
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.secondaryButton,
                {
                  borderColor: isDark ? '#F2CA50' : '#B68B1E',
                  backgroundColor: isDark ? '#201F1F' : '#F9F6F0',
                },
              ]}
              onPress={() => {
                if (isForgotPasswordMode) {
                  setIsForgotPasswordMode(false);
                } else {
                  setIsRegisterMode(!isRegisterMode);
                  setConfirmPassword('');
                }
              }}
              disabled={loading}
              activeOpacity={0.8}
            >
              <View style={styles.secondaryButtonContent}>
                <View style={[styles.primaryButtonIconWrap, { backgroundColor: isDark ? 'rgba(242, 202, 80, 0.15)' : 'rgba(182, 139, 30, 0.12)' }]}>
                  <IconSymbol 
                    name={isForgotPasswordMode ? "arrow.left" : (isRegisterMode ? "lock.fill" : "person.badge.plus.fill")} 
                    size={16} 
                    color={isDark ? C.primary : C.primaryDark} 
                  />
                </View>
                <Text style={[styles.secondaryButtonText, { color: isDark ? C.primary : C.primaryDark }]}>
                  {isForgotPasswordMode 
                    ? 'Quay lại đăng nhập' 
                    : (isRegisterMode ? 'Đã có tài khoản? Đăng nhập' : 'Tạo tài khoản mới')}
                </Text>
                <IconSymbol name="chevron.right" size={14} color={isDark ? `${C.primary}90` : `${C.primaryDark}90`} />
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: SCREEN_HEIGHT * 0.1,
    paddingBottom: Spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: Spacing.lg,
  },
  brandingContainer: {
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.goldGlow,
  },
  brandTitle: {
    fontSize: 36,
    fontFamily: FontFamily.playfairBold,
    letterSpacing: 1,
  },
  brandSubtitle: {
    ...Typography.labelSmall,
    letterSpacing: 1.5,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
  },
  formSection: {
    borderWidth: 0.5,
    borderRadius: BorderRadius.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
    ...Shadows.medium,
  },
  formTitle: {
    ...Typography.titleLarge,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  noticeCard: {
    borderWidth: 0.5,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  noticeTitle: {
    ...Typography.labelMedium,
    fontWeight: '700',
  },
  noticeText: {
    ...Typography.bodySmall,
    fontSize: 12,
    lineHeight: 16,
  },
  inputGroup: {
    gap: Spacing.xs,
  },
  inputLabel: {
    ...Typography.labelSmall,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 12,
    height: 48,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    ...Typography.bodyMedium,
    height: '100%',
    padding: 0,
    fontFamily: FontFamily.inter,
  },
  eyeButton: {
    padding: Spacing.xs,
  },
  buttonSpacing: {
    marginTop: Spacing.lg,
    gap: 22,
  },
  primaryButtonWrapper: {
    alignSelf: 'center',
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    shadowColor: '#B68B1E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: BorderRadius.full,
    minWidth: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  primaryButtonIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(19,19,19,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 15,
    letterSpacing: 0.5,
    fontWeight: '700',
    color: '#131313',
  },
  secondaryButton: {
    alignSelf: 'center',
    minWidth: 280,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  secondaryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  secondaryButtonText: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 14,
    letterSpacing: 0.5,
    fontWeight: '700',
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginTop: Spacing.xs,
  },
  forgotPasswordText: {
    ...Typography.bodySmall,
    fontSize: 13,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  forgotPasswordDesc: {
    ...Typography.bodySmall,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.xs,
  },
});