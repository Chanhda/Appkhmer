export type HeritageItem = {
  id: string;
  title: string;
  province: string;
  category: string;
  type: 'tangible' | 'intangible';
  subtitle: string;
  body: string;
  tag: string;
  description: string;
  highlights: string[];
  coverImage?: string;
  gallery?: string[];
  createdAt?: string;
  location?: {
    lat?: number;
    lng?: number;
  } | null;
  builtYear?: string | number;
};

export const heritageItems: HeritageItem[] = [
  {
    id: 'chua-som-rong',
    title: 'Chùa Som Rông',
    province: 'Sóc Trăng',
    category: 'Kiến trúc tôn giáo',
    type: 'tangible',
    subtitle: 'Ngôi chùa Khmer với bảo tháp uy nghi và tượng Phật nằm 63 mét.',
    body: 'Chùa Som Rông (Wat Pătum Wôngsa Som Rông) tọa lạc tại phường 5, thành phố Sóc Trăng. Ngôi chùa có lịch sử hàng trăm năm, nổi bật với bảo tháp cao 32 mét lộng lẫy sơn màu xám hiện đại và tượng Phật Thích Ca nhập Niết bàn ngoài trời dài 63 mét, cao 22.5 mét. Kiến trúc chùa là kiệt tác nghệ thuật điêu khắc hoa văn Khmer tinh xảo, thể hiện nét văn hóa Phật giáo Nam tông đặc trưng.',
    tag: 'Nổi bật',
    description: 'Ngôi chùa tiêu biểu của tỉnh Sóc Trăng sở hữu tượng Phật nằm lớn nhất Việt Nam.',
    highlights: ['Tượng Phật nằm 63m ngoài trời', 'Tòa bảo tháp xám uy nghi', 'Kiến trúc điêu khắc chạm trổ tinh xảo'],
    coverImage: 'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1608958416733-1492ba666e5f?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1548625361-155deee223c2?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?auto=format&fit=crop&w=600&q=80'
    ],
    createdAt: '2026-06-04T08:00:00.000Z',
    location: { lat: 9.6092, lng: 105.9811 },
    builtYear: 'Thế kỷ XV',
  },
  {
    id: 'chua-doi',
    title: 'Chùa Dơi (Mã Tộc)',
    province: 'Sóc Trăng',
    category: 'Kiến trúc tôn giáo',
    type: 'tangible',
    subtitle: 'Di tích quốc gia cổ kính hơn 400 tuổi và đàn dơi tự nhiên.',
    body: 'Chùa Dơi (Wat Mahatup) tọa lạc tại thành phố Sóc Trăng, tỉnh Sóc Trăng. Đây là di tích lịch sử - văn hóa cấp quốc gia xây dựng từ thế kỷ XVI. Ngôi chùa mang đậm phong cách kiến trúc chùa Khmer truyền thống với mái ngói cong đuôi rồng Naga vàng rực rỡ. Nơi đây nổi tiếng vì là nơi cư ngụ tự nhiên của hàng vạn con dơi ngựa quý hiếm treo mình trên những tán cây cổ thụ trong khuôn viên chùa.',
    tag: 'Khám phá',
    description: 'Ngôi chùa cổ kính linh thiêng nổi tiếng gắn liền với đàn dơi quạ tự nhiên sinh sống.',
    highlights: ['Khuôn viên dơi tự nhiên trú ngụ', 'Kiến trúc Mahatup cổ kính 400 năm', 'Hệ thống bích họa cổ trong chánh điện'],
    coverImage: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1566121933407-3c7ccdd26763?auto=format&fit=crop&w=600&q=80'
    ],
    createdAt: '2026-06-04T08:05:00.000Z',
    location: { lat: 9.5775, lng: 105.9728 },
    builtYear: 'Thế kỷ XVI',
  },
  {
    id: 'chua-chantarangsay',
    title: 'Chùa Chantarangsay',
    province: 'TP. Hồ Chí Minh',
    category: 'Kiến trúc tôn giáo',
    type: 'tangible',
    subtitle: 'Ngôi chùa Khmer đầu tiên và là trung tâm văn hóa giữa lòng đô thị.',
    body: 'Chùa Chantarangsay (Wat Candaransĩ) nằm tại Quận 3, TP. Hồ Chí Minh, được xây dựng năm 1946. Là ngôi chùa Khmer đầu tiên được xây dựng tại thành phố, chùa đóng vai trò là điểm sinh hoạt tôn giáo, tín ngưỡng và văn hóa lễ hội lớn của toàn bộ đồng bào người Khmer Nam Bộ đang sinh sống học tập tại TP.HCM.',
    tag: 'Nổi bật',
    description: 'Ngôi chùa Phật giáo Nam tông Khmer duy nhất và lâu đời bậc nhất giữa trung tâm TP.HCM.',
    highlights: ['Ngôi chùa Khmer đầu tiên tại TP.HCM', 'Mái chồng nhiều tầng uốn rồng Naga', 'Địa điểm sinh hoạt văn hóa lễ hội Khmer đô thị'],
    coverImage: 'https://images.unsplash.com/photo-1566121933407-3c7ccdd26763?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1566121933407-3c7ccdd26763?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1598908313407-4fbd48db2c96?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1507666400095-46726aa17986?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80'
    ],
    createdAt: '2026-06-04T08:10:00.000Z',
    location: { lat: 10.7905, lng: 106.6806 },
    builtYear: '1946',
  },
  {
    id: 'chua-hang',
    title: 'Chùa Hang',
    province: 'Trà Vinh',
    category: 'Kiến trúc tôn giáo',
    type: 'tangible',
    subtitle: 'Ngôi chùa Kompong Chrây với cổng hang đá độc đáo và xưởng khắc gỗ.',
    body: 'Chùa Hang (Wat Kompong Chrây) tọa lạc tại huyện Châu Thành, tỉnh Trà Vinh. Chùa nổi tiếng với chiếc cổng phụ độc đáo được xây dựng giống như lối vào một hang đá thiên nhiên sâu thẳm. Khuôn viên chùa là một cánh rừng sao dầu rộng lớn rợp bóng mát, nơi lưu giữ xưởng khắc điêu khắc gỗ thủ công từ những gốc cây khô của các nhà sư.',
    tag: 'Khám phá',
    description: 'Chùa nổi bật với cổng hang tự nhiên độc lạ và nghề khắc gỗ nghệ thuật lâu năm.',
    highlights: ['Chiếc cổng hình hang đá độc đáo', 'Nghề khắc gỗ mỹ nghệ từ gốc cây khô', 'Rừng cây sao dầu rộng lớn'],
    coverImage: 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1608976478549-3652f4007b7b?auto=format&fit=crop&w=600&q=80'
    ],
    createdAt: '2026-06-04T08:15:00.000Z',
    location: { lat: 9.8789, lng: 106.3123 },
    builtYear: '1637',
  },
  {
    id: 'chua-ghositaram',
    title: 'Chùa Ghositaram',
    province: 'Bạc Liêu',
    category: 'Kiến trúc tôn giáo',
    type: 'tangible',
    subtitle: 'Kiệt tác mỹ thuật chánh điện Khmer rực rỡ và lớn nhất Việt Nam.',
    body: 'Chùa Ghositaram tại huyện Vĩnh Lợi, tỉnh Bạc Liêu được hoàn thành chánh điện mới năm 2010. Đây là ngôi chánh điện lớn nhất và rực rỡ nhất trong hệ thống chùa Khmer Việt Nam, mang màu sắc đỏ vàng đặc trưng và những đường nét điêu khắc, chạm trổ phù điêu nổi sống động của nghệ nhân dân gian Khmer.',
    tag: 'Nổi bật',
    description: 'Chánh điện chùa Khmer lớn và rực rỡ bậc nhất miền Tây Nam Bộ.',
    highlights: ['Chánh điện Khmer quy mô lớn nhất Việt Nam', 'Màu sắc đỏ vàng rực rỡ nổi bật', 'Họa tiết chim thần Krud nâng đỡ mái'],
    coverImage: 'https://images.unsplash.com/photo-1598908313407-4fbd48db2c96?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1598908313407-4fbd48db2c96?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80'
    ],
    createdAt: '2026-06-04T08:20:00.000Z',
    location: { lat: 9.3082, lng: 105.7489 },
    builtYear: '1860',
  },
  {
    id: 'le-hoi-ooc-om-bok',
    title: 'Lễ hội Oóc Om Bóc',
    province: 'Sóc Trăng',
    category: 'Lễ hội truyền thống',
    type: 'intangible',
    subtitle: 'Lễ hội cúng trăng tạ ơn và giải đua ghe ngo rực lửa trên sông.',
    body: 'Lễ hội Oóc Om Bóc (Lễ cúng Trăng) diễn ra vào đêm rằm tháng 10 âm lịch khi mùa mưa kết thúc. Đây là Di sản văn hóa phi vật thể quốc gia quan trọng bậc nhất của đồng bào Khmer Nam Bộ nhằm tạ ơn thần Mặt Trăng đã ban mùa màng tươi tốt. Lễ hội đặc sắc với hội đua ghe ngo độc mộc thu hút hàng chục đội chèo tranh tài trên sông Maspero.',
    tag: 'Mới',
    description: 'Lễ hội lớn bậc nhất vùng Nam Bộ được công nhận là Di sản phi vật thể quốc gia.',
    highlights: ['Nghi thức cúng trăng đút cốm dẹp', 'Đua ghe ngo truyền thống rực rỡ', 'Hội thả đèn nước Lôi Pro-têp trên sông'],
    coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1524412529636-bb435f6c2d1d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1530128118208-89f9e73c4d7f?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=600&q=80'
    ],
    createdAt: '2026-06-04T08:25:00.000Z',
    location: { lat: 9.6008, lng: 105.9745 },
  },
  {
    id: 'le-hoi-sene-dolta',
    title: 'Lễ hội Sene Dolta',
    province: 'An Giang',
    category: 'Lễ hội truyền thống',
    type: 'intangible',
    subtitle: 'Lễ cúng tế báo hiếu tổ tiên và hội đua bò Bảy Núi kịch tính.',
    body: 'Lễ hội Sene Dolta (lễ cúng ông bà) của người Khmer diễn ra vào cuối tháng 8 âm lịch hằng năm. Lễ hội thể hiện truyền thống uống nước nhớ nguồn, lòng hiếu thảo của con cháu đối với ông bà tổ tiên đã khuất. Tại vùng Bảy Núi (An Giang), lễ hội gắn liền với hội đua bò truyền thống kịch tính đầy kịch tính thu hút đông đảo du khách.',
    tag: 'Xem nhanh',
    description: 'Lễ báo hiếu tổ tiên ấm áp kết hợp hội đua bò Bảy Núi vang danh Nam Bộ.',
    highlights: ['Nghi lễ cúng báo hiếu tổ tiên tại gia định', 'Hội đua bò Bảy Núi nghẹt thở kịch tính', 'Ẩm thực bánh gừng, canh sim-lo đặc sắc'],
    coverImage: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1568043210943-0e8aac4b9734?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1598866594230-a7c12756260f?auto=format&fit=crop&w=600&q=80'
    ],
    createdAt: '2026-06-04T08:30:00.000Z',
    location: { lat: 10.4282, lng: 105.0256 },
  },
  {
    id: 'nghe-thuat-ro-bam',
    title: 'Nghệ thuật Rô Băm',
    province: 'Trà Vinh',
    category: 'Nghệ thuật biểu diễn',
    type: 'intangible',
    subtitle: 'Sân khấu kịch múa cổ điển truyền thuyết sử thi Reamker thần thoại.',
    body: 'Nghệ thuật Rô Băm là loại hình sân khấu múa cổ điển cung đình lâu đời của đồng bào Khmer. Diễn viên sử dụng ngôn ngữ điệu múa uốn cong cơ thể Apsara và đeo mặt nạ gỗ tinh xảo hóa thân thành hoàng tử Preah Ream, khỉ thần Hanuman, quỷ vương kể lại sử thi Reamker nhằm răn dạy đạo lý làm người sâu sắc.',
    tag: 'Nổi bật',
    description: 'Di sản kịch múa cổ truyền quý hiếm được bảo tồn khẩn cấp của người Khmer.',
    highlights: ['Các vũ điệu kịch múa sử thi Reamker', 'Mặt nạ gỗ điêu khắc sơn son thếp vàng', 'Dàn nhạc ngũ âm Pinpeat đệm trầm bổng'],
    coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=600&q=80'
    ],
    createdAt: '2026-06-04T08:35:00.000Z',
    location: { lat: 9.9347, lng: 106.3456 },
  },
  {
    id: 'le-hoi-kathina',
    title: 'Lễ hội Kathina',
    province: 'Sóc Trăng',
    category: 'Lễ hội truyền thống',
    type: 'intangible',
    subtitle: 'Lễ dâng y phục cà sa cúng dường chư tăng sau mùa an cư.',
    body: 'Lễ hội Kathina (Lễ dâng y cà sa) diễn ra trong 1 tháng từ rằm tháng 9 đến rằm tháng 10 âm lịch sau mùa an cư kiết hạ. Phật tử quyên góp và diễu hành dâng cúng y phục cà sa mới cùng vật dụng sinh hoạt cúng dường lên các vị sư sãi để cầu phước đức bình an và thịnh vượng cho phum sóc.',
    tag: 'Sự kiện',
    description: 'Nghi lễ dâng y tôn giáo linh thiêng và lớn nhất của Phật giáo Nam tông Khmer.',
    highlights: ['Nghi thức dâng y cà sa cúng dường trang trọng', 'Diễu hành xe hoa phum sóc nhộn nhịp', 'Quyên góp tu sửa cơ sở vật chất chùa chiền'],
    coverImage: 'https://images.unsplash.com/photo-1608976478549-3652f4007b7b?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1608976478549-3652f4007b7b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1507666400095-46726aa17986?auto=format&fit=crop&w=600&q=80'
    ],
    createdAt: '2026-06-04T08:40:00.000Z',
    location: { lat: 9.6012, lng: 105.9734 },
  },
  {
    id: 'nghe-thuat-chapei-don-ca',
    title: 'Nghệ thuật Chapei Don Ca',
    province: 'Sóc Trăng',
    category: 'Nghệ thuật biểu diễn',
    type: 'intangible',
    subtitle: 'Hát kể tự sự độc tấu đàn Chapey hai dây điêu luyện.',
    body: 'Nghệ thuật Chapei Don Ca (Chapey Dong Veng) là di sản phi vật thể nhân loại được UNESCO công nhận. Người nghệ nhân vừa tự gảy chiếc đàn Chapey hai dây thùng vuông cần dài đặc trưng, vừa ứng khẩu hát tự sự kể về các câu chuyện lịch sử phum sóc, giáo dục đạo đức và răn dạy con cháu.',
    tag: 'Nổi bật',
    description: 'Di sản phi vật thể nhân loại UNESCO tôn vinh lối hát tự sự dân gian độc đáo.',
    highlights: ['Độc tấu đàn Chapey hai dây cần dài', 'Lối hát tự sự ứng khẩu sâu sắc', 'Tác phẩm ca ngợi tình yêu quê hương lao động'],
    coverImage: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=600&q=80'
    ],
    createdAt: '2026-06-04T08:45:00.000Z',
    location: { lat: 9.5823, lng: 105.9612 },
  },
];

export function getHeritageById(id: string) {
  return heritageItems.find((item) => item.id === id);
}

export function getHeritageCover(coverImage?: string, type?: 'tangible' | 'intangible'): string {
  if (coverImage && coverImage.trim().length > 0) return coverImage.trim();
  return type === 'intangible'
    ? 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=600&q=80'
    : 'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=600&q=80';
}