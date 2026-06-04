export type ArticleItem = {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  coverImage?: string;
};

export const articleItems: ArticleItem[] = [
  {
    id: 'chuong-trinh-le-hoi',
    title: 'Sắc màu lễ hội Khmer Nam Bộ',
    category: 'Lễ hội',
    summary: 'Mẫu bài viết giới thiệu không khí lễ hội, nghi thức truyền thống và hoạt động cộng đồng.',
    content:
      'Đây là bài viết mẫu để demo giao diện hiển thị bài viết. Nội dung có thể thay bằng dữ liệu thật từ Firebase sau này. Bạn có thể dùng nó cho phần giới thiệu lễ hội, ảnh bìa, đoạn tóm tắt và nội dung đầy đủ.',
    author: 'Ban biên tập',
    date: '05/05/2026',
    coverImage: 'https://images.unsplash.com/photo-1524412529636-bb435f6c2d1d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'kien-truc-chua-khmer',
    title: 'Kiến trúc chùa Khmer trong không gian Nam Bộ',
    category: 'Kiến trúc',
    summary: 'Mẫu bài viết cho dạng nội dung dài, có thể hiển thị hình ảnh và phần đọc thêm.',
    content:
      'Bài viết mẫu này mô phỏng một trang nội dung dài. Trong bản thật, bạn có thể chèn nhiều đoạn, ảnh minh họa, video ngắn và trích dẫn để trình bày rõ hơn về kiến trúc chùa Khmer.',
    author: 'Nhóm nội dung',
    date: '05/05/2026',
    coverImage: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'am-thuc-truyen-thong',
    title: 'Ẩm thực truyền thống trong đời sống người Khmer',
    category: 'Ẩm thực',
    summary: 'Mẫu bài viết để demo phần nội dung ngắn gọn, dễ đọc trên mobile.',
    content:
      'Đây là bài viết mẫu về ẩm thực truyền thống. Khi triển khai thật, nội dung này sẽ được lưu trong Firestore, còn hình ảnh sẽ lấy từ Firebase Storage hoặc nguồn CDN.',
    author: 'Cộng tác viên',
    date: '05/05/2026',
    coverImage: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'nghe-thuat-ro-bam',
    title: 'Rô Băm và vai trò trong đời sống văn hóa Khmer',
    category: 'Nghệ thuật',
    summary: 'Mẫu nội dung về nghệ thuật biểu diễn truyền thống, dễ mở rộng thành trang chi tiết.',
    content:
      'Bài viết mẫu này giúp demo một chủ đề nghệ thuật biểu diễn. Trong bản thật, bạn có thể thêm video, trích dẫn nghệ nhân, ảnh hậu trường và các đoạn giải thích ngắn theo từng phần.',
    author: 'Ban nội dung',
    date: '06/05/2026',
    coverImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'du-lich-cong-dong',
    title: 'Gợi ý tuyến tham quan cộng đồng Khmer Nam Bộ',
    category: 'Lễ hội',
    summary: 'Một bài viết ngắn để demo nhóm nội dung khám phá và tuyến hành trình.',
    content:
      'Đây là nội dung mẫu để thử giao diện tuyến tham quan, bản đồ và các thẻ gợi ý địa điểm. Sau này bạn có thể thay thành bài viết hướng dẫn thực tế, lịch trình và liên kết bản đồ.',
    author: 'Nhóm biên soạn',
    date: '06/05/2026',
    coverImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  },
];

export function getArticleById(id: string) {
  return articleItems.find((item) => item.id === id);
}