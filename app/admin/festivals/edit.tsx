import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { CustomAlert } from '@/components/ui/custom-alert';
import { Colors, BorderRadius, FontFamily, Spacing, Typography } from '@/constants/theme';
import { useColorSchemePreference } from '@/contexts/color-scheme-context';
import { useRequireAdmin } from '@/lib/auth-session';
import { fetchFestivalById, updateFestival, createFestival } from '@/lib/festival-repository';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { isFirebaseConfigured, isDemoDataEnabled } from '@/lib/firebase';
import type { FestivalItem } from '@/constants/festivals';

async function uploadImageAsync(uri: string): Promise<string> {
  return await uploadImageToCloudinary(uri, 'festivals');
}

export default function EditFestivalScreen() {
  const { loading: authLoading } = useRequireAdmin();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const insets = useSafeAreaInsets();
  const { resolvedColorScheme } = useColorSchemePreference();
  const C = Colors[resolvedColorScheme];
  const isDark = resolvedColorScheme === 'dark';

  const festivalId = params.id;
  const isEditing = Boolean(festivalId);

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Form State
  const [titleVi, setTitleVi] = useState('');
  const [khmerTitle, setKhmerTitle] = useState('');
  const [subtitleVi, setSubtitleVi] = useState('');
  
  // Easy Date & Time inputs for Countdown Target
  const [targetDateString, setTargetDateString] = useState('2026-11-23'); // YYYY-MM-DD
  const [targetTimeString, setTargetTimeString] = useState('08:00'); // HH:mm

  // Dual Calendar Display (Lunar & Solar)
  const [lunarDateVi, setLunarDateVi] = useState('');
  const [solarDateVi, setSolarDateVi] = useState('');
  const [dateDisplayKm, setDateDisplayKm] = useState('');
  const [dateDisplayEn, setDateDisplayEn] = useState('');

  const [locationVi, setLocationVi] = useState('');
  const [descriptionVi, setDescriptionVi] = useState('');
  const [coverImage, setCoverImage] = useState('');

  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  useEffect(() => {
    if (!authLoading && festivalId) {
      (async () => {
        try {
          const item = await fetchFestivalById(festivalId);
          if (item) {
            setTitleVi(typeof item.title === 'string' ? item.title : item.title.vi || '');
            setKhmerTitle(item.khmerTitle || '');
            setSubtitleVi(typeof item.subtitle === 'string' ? item.subtitle : item.subtitle?.vi || '');
            
            // Extract Date & Time from targetDate ISO string
            if (item.targetDate) {
              try {
                const d = new Date(item.targetDate);
                const yyyy = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const dd = String(d.getDate()).padStart(2, '0');
                const hh = String(d.getHours()).padStart(2, '0');
                const min = String(d.getMinutes()).padStart(2, '0');
                setTargetDateString(`${yyyy}-${mm}-${dd}`);
                setTargetTimeString(`${hh}:${min}`);
              } catch {
                setTargetDateString('2026-11-23');
                setTargetTimeString('08:00');
              }
            }

            const rawDateVi = typeof item.dateDisplay === 'string' ? item.dateDisplay : item.dateDisplay?.vi || '';
            // Strip duplicate bracketed strings if present
            const cleanDateVi = rawDateVi.replace(/(\s*\([^)]*\))+$/g, '').trim();
            setLunarDateVi(cleanDateVi || rawDateVi);
            setSolarDateVi(typeof item.dateDisplay === 'object' ? item.dateDisplay?.en || '' : '');
            setDateDisplayKm(typeof item.dateDisplay === 'object' ? item.dateDisplay?.km || '' : '');
            setDateDisplayEn(typeof item.dateDisplay === 'object' ? item.dateDisplay?.en || '' : '');

            setLocationVi(typeof item.location === 'string' ? item.location : item.location?.vi || '');
            setDescriptionVi(typeof item.description === 'string' ? item.description : item.description?.vi || '');
            setCoverImage(item.coverImage || '');
          }
        } catch (err) {
          console.error('Error fetching festival details:', err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [authLoading, festivalId]);

  // Image Picker Functions
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setAlertConfig({ visible: true, type: 'warning', title: 'Quyền truy cập', message: 'Cần quyền truy cập thư viện ảnh.' });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        setIsUploadingImage(true);
        try {
          let uploadedUrl = selectedUri;
          if (isFirebaseConfigured() && !isDemoDataEnabled()) {
            uploadedUrl = await uploadImageAsync(selectedUri);
          }
          setCoverImage(uploadedUrl);
        } catch {
          setCoverImage(selectedUri);
        } finally {
          setIsUploadingImage(false);
        }
      }
    } catch (err) {
      console.error('Error picking image:', err);
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        setAlertConfig({ visible: true, type: 'warning', title: 'Quyền truy cập', message: 'Cần quyền truy cập máy ảnh.' });
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        setIsUploadingImage(true);
        try {
          let uploadedUrl = selectedUri;
          if (isFirebaseConfigured() && !isDemoDataEnabled()) {
            uploadedUrl = await uploadImageAsync(selectedUri);
          }
          setCoverImage(uploadedUrl);
        } catch {
          setCoverImage(selectedUri);
        } finally {
          setIsUploadingImage(false);
        }
      }
    } catch (err) {
      console.error('Error taking photo:', err);
    }
  };

  const handleSubmit = async () => {
    if (!titleVi.trim()) {
      setAlertConfig({
        visible: true,
        type: 'warning',
        title: 'Thiếu thông tin',
        message: 'Vui lòng nhập tên lễ hội.',
      });
      return;
    }

    try {
      setSubmitting(true);

      // Construct ISO Target Date cleanly
      let isoTarget = new Date().toISOString();
      if (targetDateString.trim()) {
        const timePart = targetTimeString.trim() || '08:00';
        const fullStr = `${targetDateString.trim()}T${timePart}:00.000Z`;
        const parsed = new Date(fullStr);
        if (!isNaN(parsed.getTime())) {
          isoTarget = parsed.toISOString();
        } else {
          isoTarget = new Date(targetDateString.trim()).toISOString();
        }
      }

      // Format Dual Calendar Display
      const cleanLunar = lunarDateVi.replace(/(\s*\([^)]*\))+$/g, '').trim();
      const cleanSolar = solarDateVi.trim();
      const combinedDisplayVi = cleanLunar 
        ? `${cleanLunar}${cleanSolar && !cleanLunar.includes(cleanSolar) ? ` (${cleanSolar})` : ''}`
        : cleanSolar || 'Hàng năm';

      const festivalData: Partial<FestivalItem> = {
        title: { vi: titleVi, km: khmerTitle || titleVi, en: titleVi },
        khmerTitle: khmerTitle || titleVi,
        subtitle: { vi: subtitleVi, km: subtitleVi, en: subtitleVi },
        targetDate: isoTarget,
        dateDisplay: {
          vi: combinedDisplayVi,
          km: dateDisplayKm.trim() || combinedDisplayVi,
          en: dateDisplayEn.trim() || solarDateVi.trim() || combinedDisplayVi,
        },
        location: { vi: locationVi, km: locationVi, en: locationVi },
        summary: { vi: subtitleVi, km: subtitleVi, en: subtitleVi },
        description: { vi: descriptionVi, km: descriptionVi, en: descriptionVi },
        coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80',
      };

      if (isEditing && festivalId) {
        await updateFestival(festivalId, festivalData);
      } else {
        await createFestival({
          ...festivalData,
          rituals: { vi: ['Nghi thức dâng hoa và thắp hương', 'Lễ cầu an truyền thống'], km: [], en: [] },
          foods: { vi: ['Cơm chè nhà chùa', 'Hoa quả tươi'], km: [], en: [] },
          highlights: { vi: ['Không khí trang nghiêm', 'Đồng bào tụ họp vui tươi'], km: [], en: [] },
          featured: true,
        } as any);
      }

      setAlertConfig({
        visible: true,
        type: 'success',
        title: 'Thành công',
        message: isEditing ? 'Đã cập nhật thông tin lễ hội.' : 'Đã tạo lễ hội mới thành công.',
        onConfirm: () => router.back(),
      });
    } catch {
      setAlertConfig({
        visible: true,
        type: 'error',
        title: 'Lỗi',
        message: 'Không thể lưu lễ hội. Vui lòng kiểm tra lại.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <View style={[styles.loadingScreen, { backgroundColor: C.background }]}>
        <ActivityIndicator size="large" color={C.primary} />
        <Text style={[styles.loadingText, { color: C.textSecondary }]}>Đang tải dữ liệu biểu mẫu...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: C.background }]}>
      {/* Header */}
      <View
        style={[
          styles.stickyHeader,
          {
            backgroundColor: isDark ? 'rgba(19,19,19,0.95)' : 'rgba(249,246,240,0.97)',
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
          <Text style={[styles.headerTitle, { color: C.primary }]}>
            {isEditing ? 'Chỉnh sửa Lễ hội' : 'Thêm Lễ hội Mới'}
          </Text>
          <View style={{ width: 36 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* SECTION 1: TÊN LỄ HỘI */}
        <View style={[styles.cardSection, { backgroundColor: isDark ? 'rgba(30,30,30,0.6)' : '#FFFDF9', borderColor: `${C.primary}30` }]}>
          <Text style={[styles.sectionTitle, { color: C.primary }]}>📌 Thông tin Tên Lễ Hội</Text>
          
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: C.text }]}>Tên Lễ Hội (Tiếng Việt) *</Text>
            <TextInput
              style={[styles.input, { color: C.text, backgroundColor: C.surfaceHigh, borderColor: `${C.primary}30` }]}
              value={titleVi}
              onChangeText={setTitleVi}
              placeholder="Ví dụ: Lễ hội Ók Om Bók & Đua Ghe Ngọ"
              placeholderTextColor={C.textTertiary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: C.text }]}>Tên Lễ Hội (Tiếng Khmer)</Text>
            <TextInput
              style={[styles.input, { color: C.text, backgroundColor: C.surfaceHigh, borderColor: `${C.primary}30` }]}
              value={khmerTitle}
              onChangeText={setKhmerTitle}
              placeholder="Ví dụ: ពិធីបុណ្យអុំទូក និងសំពះព្រះខែ"
              placeholderTextColor={C.textTertiary}
            />
          </View>
        </View>

        {/* SECTION 2: THỜI GIAN ĐẾM NGƯỢC (ĐƠN GIẢN NĂM-THÁNG-NGÀY) */}
        <View style={[styles.cardSection, { backgroundColor: isDark ? 'rgba(30,30,30,0.6)' : '#FFFDF9', borderColor: `${C.primary}30` }]}>
          <Text style={[styles.sectionTitle, { color: C.primary }]}>⏱️ Cài Đặt Đồng Hồ Đếm Ngược (Dễ dàng)</Text>
          
          <View style={styles.rowTwo}>
            <View style={[styles.formGroup, { flex: 1.5 }]}>
              <Text style={[styles.label, { color: C.text }]}>Ngày diễn ra (NĂM-THÁNG-NGÀY)</Text>
              <TextInput
                style={[styles.input, { color: C.text, backgroundColor: C.surfaceHigh, borderColor: `${C.primary}30` }]}
                value={targetDateString}
                onChangeText={setTargetDateString}
                placeholder="2026-11-23"
                placeholderTextColor={C.textTertiary}
              />
            </View>

            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={[styles.label, { color: C.text }]}>Giờ bắt đầu</Text>
              <TextInput
                style={[styles.input, { color: C.text, backgroundColor: C.surfaceHigh, borderColor: `${C.primary}30` }]}
                value={targetTimeString}
                onChangeText={setTargetTimeString}
                placeholder="08:00"
                placeholderTextColor={C.textTertiary}
              />
            </View>
          </View>
          <Text style={styles.helperText}>💡 Hệ thống tự động tính toán đồng hồ đếm ngược từng giây đến mốc thời gian này.</Text>
        </View>

        {/* SECTION 3: LỊCH ÂM KHMER & LỊCH DƯƠNG HIỂN THỊ */}
        <View style={[styles.cardSection, { backgroundColor: isDark ? 'rgba(30,30,30,0.6)' : '#FFFDF9', borderColor: `${C.primary}30` }]}>
          <Text style={[styles.sectionTitle, { color: C.primary }]}>📅 Hiển Thị Lịch Âm & Lịch Dương (Đa ngôn ngữ)</Text>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: C.text }]}>🌙 Lịch Âm Truyền Thống Khmer (Tiếng Việt)</Text>
            <TextInput
              style={[styles.input, { color: C.text, backgroundColor: C.surfaceHigh, borderColor: `${C.primary}30` }]}
              value={lunarDateVi}
              onChangeText={setLunarDateVi}
              placeholder="Ví dụ: Rằm tháng 10 Âm lịch (15/10 Âm)"
              placeholderTextColor={C.textTertiary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: C.text }]}>☀️ Lịch Dương Cụ Thể (Tiếng Việt / Anh)</Text>
            <TextInput
              style={[styles.input, { color: C.text, backgroundColor: C.surfaceHigh, borderColor: `${C.primary}30` }]}
              value={solarDateVi}
              onChangeText={setSolarDateVi}
              placeholder="Ví dụ: Ngày 23 - 25 tháng 11 năm 2026"
              placeholderTextColor={C.textTertiary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: C.text }]}>🇰🇭 Hiển Thị Ngày Lễ (Tiếng Khmer)</Text>
            <TextInput
              style={[styles.input, { color: C.text, backgroundColor: C.surfaceHigh, borderColor: `${C.primary}30` }]}
              value={dateDisplayKm}
              onChangeText={setDateDisplayKm}
              placeholder="Ví dụ: ថ្ងៃ ១៥ កើត ខែកត្តិក រៀងរាល់ឆ្នាំ"
              placeholderTextColor={C.textTertiary}
            />
          </View>
        </View>

        {/* SECTION 4: ẢNH BÌA (TẢI LÊN HOẶC LINK) */}
        <View style={[styles.cardSection, { backgroundColor: isDark ? 'rgba(30,30,30,0.6)' : '#FFFDF9', borderColor: `${C.primary}30` }]}>
          <Text style={[styles.sectionTitle, { color: C.primary }]}>🖼️ Hình Ảnh Lễ Hội (Tải lên hoặc Dùng Link)</Text>

          {/* Image Preview */}
          {coverImage.trim() ? (
            <View style={styles.imagePreviewWrap}>
              <Image source={{ uri: coverImage.trim() }} style={styles.imagePreview} />
              <Pressable style={styles.removeImgBtn} onPress={() => setCoverImage('')}>
                <IconSymbol name="xmark" size={16} color="#FFF" />
              </Pressable>
            </View>
          ) : null}

          {/* Upload buttons */}
          <View style={styles.photoActionsRow}>
            <TouchableOpacity
              style={[styles.photoActionBtn, { borderColor: `${C.primary}50`, backgroundColor: C.surfaceHigh }]}
              onPress={pickImage}
              disabled={isUploadingImage}
            >
              <IconSymbol name="photo.on.rectangle.angled" size={16} color={C.primary} />
              <Text style={[styles.photoActionText, { color: C.text }]}>
                {isUploadingImage ? 'Đang tải...' : '🖼️ Chọn từ thư viện'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.photoActionBtn, { borderColor: `${C.primary}50`, backgroundColor: C.surfaceHigh }]}
              onPress={takePhoto}
              disabled={isUploadingImage}
            >
              <IconSymbol name="camera.fill" size={16} color={C.primary} />
              <Text style={[styles.photoActionText, { color: C.text }]}>📷 Chụp ảnh mới</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: C.text }]}>Hoặc Nhập Liên Kết Ảnh Trực Tiếp (URL)</Text>
            <TextInput
              style={[styles.input, { color: C.text, backgroundColor: C.surfaceHigh, borderColor: `${C.primary}30` }]}
              value={coverImage}
              onChangeText={setCoverImage}
              placeholder="https://..."
              placeholderTextColor={C.textTertiary}
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* SECTION 5: ĐỊA ĐIỂM & MÔ TẢ */}
        <View style={[styles.cardSection, { backgroundColor: isDark ? 'rgba(30,30,30,0.6)' : '#FFFDF9', borderColor: `${C.primary}30` }]}>
          <Text style={[styles.sectionTitle, { color: C.primary }]}>📖 Nội Dung & Địa Điểm</Text>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: C.text }]}>Địa điểm Tổ chức</Text>
            <TextInput
              style={[styles.input, { color: C.text, backgroundColor: C.surfaceHigh, borderColor: `${C.primary}30` }]}
              value={locationVi}
              onChangeText={setLocationVi}
              placeholder="Ví dụ: Sóc Trăng & Trà Vinh"
              placeholderTextColor={C.textTertiary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: C.text }]}>Mô tả Ngắn (Subtitle)</Text>
            <TextInput
              style={[styles.input, { color: C.text, backgroundColor: C.surfaceHigh, borderColor: `${C.primary}30` }]}
              value={subtitleVi}
              onChangeText={setSubtitleVi}
              placeholder="Ví dụ: Di sản văn hóa phi vật thể cúng trăng"
              placeholderTextColor={C.textTertiary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: C.text }]}>Giới thiệu Chi tiết Nghi lễ</Text>
            <TextInput
              style={[styles.textArea, { color: C.text, backgroundColor: C.surfaceHigh, borderColor: `${C.primary}30` }]}
              value={descriptionVi}
              onChangeText={setDescriptionVi}
              multiline
              numberOfLines={4}
              placeholder="Mô tả chi tiết ý nghĩa và các hoạt động của lễ hội..."
              placeholderTextColor={C.textTertiary}
            />
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [styles.submitBtn, { backgroundColor: C.primary }, pressed && { opacity: 0.8 }]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#131313" />
          ) : (
            <Text style={styles.submitBtnText}>{isEditing ? 'Lưu Thay Đổi' : 'Tạo Lễ Hội Mới'}</Text>
          )}
        </Pressable>
      </ScrollView>

      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onConfirm={alertConfig.onConfirm}
        onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  loadingScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.md },
  loadingText: { ...Typography.bodyMedium },
  stickyHeader: { paddingBottom: 14, borderBottomWidth: 0.5, zIndex: 100 },
  headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.containerMargin },
  backBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: 'rgba(182,139,30,0.2)' },
  headerTitle: { ...Typography.headlineMedium, fontFamily: FontFamily.playfairBold, letterSpacing: -0.5 },
  scrollContent: { padding: Spacing.containerMargin, paddingBottom: 100, gap: 16 },
  cardSection: { padding: 14, borderRadius: BorderRadius.lg, borderWidth: 1, gap: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '700', fontFamily: FontFamily.playfairBold },
  formGroup: { gap: 6 },
  rowTwo: { flexDirection: 'row', gap: 10 },
  label: { fontSize: 13, fontWeight: '700' },
  input: { paddingHorizontal: 14, paddingVertical: 12, borderRadius: BorderRadius.md, borderWidth: 1, fontSize: 13 },
  textArea: { paddingHorizontal: 14, paddingVertical: 12, borderRadius: BorderRadius.md, borderWidth: 1, fontSize: 13, height: 100, textAlignVertical: 'top' },
  helperText: { fontSize: 11, color: '#A09580', marginTop: 2 },
  imagePreviewWrap: { height: 160, width: '100%', borderRadius: BorderRadius.md, overflow: 'hidden', marginVertical: 6 },
  imagePreview: { width: '100%', height: '100%' },
  removeImgBtn: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(186,26,26,0.8)', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  photoActionsRow: { flexDirection: 'row', gap: 10, marginVertical: 4 },
  photoActionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: BorderRadius.md, borderWidth: 1 },
  photoActionText: { fontSize: 12, fontWeight: '700' },
  submitBtn: { paddingVertical: 14, borderRadius: BorderRadius.md, alignItems: 'center', marginTop: 10 },
  submitBtnText: { color: '#131313', fontSize: 15, fontWeight: '800' },
});
