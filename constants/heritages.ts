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
};

export const heritageItems: HeritageItem[] = [
  {
    id: 'chua-chantarangsay',
    title: 'Chùa Chantarangsay',
    province: 'TP. Hồ Chí Minh',
    category: 'Kiến trúc tôn giáo',
    type: 'tangible',
    subtitle: 'Ngôi chùa Khmer tiêu biểu trong đô thị lớn.',
    body: 'Chùa Chantarangsay (còn gọi là chùa Candaransĩ) tọa lạc tại Quận 3, TP. Hồ Chí Minh, là ngôi chùa Khmer đầu tiên được xây dựng tại thành phố vào năm 1946. Ngôi chùa đóng vai trò là trung tâm sinh hoạt tôn giáo, văn hóa và xã hội quan trọng của cộng đồng người Khmer đang sinh sống, học tập và làm việc tại TP.HCM.\n\nVề mặt kiến trúc, chùa Chantarangsay mang đậm phong cách truyền thống của Phật giáo Nam tông Khmer. Ngôi chính điện có mái nhiều tầng uốn cong thanh thoát, đỉnh mái trang trí hình đuôi rồng thần Naga uốn lượn uy nghiêm. Các hàng cột, bờ tường được chạm khắc hoa văn tinh xảo như chim thần Krud, tượng Phật bốn mặt và các hình ảnh mô phỏng cuộc đời của Đức Phật Thích Ca.\n\nKhông gian bên trong chùa rất thanh tịnh với khuôn viên nhiều cây xanh. Đây không chỉ là nơi cầu an, tu học của các sư sãi mà còn là nơi tổ chức các lễ hội truyền thống lớn của người Khmer như Tết Chol Chnam Thmay, lễ Sen Dolta và lễ hội Oóc Om Bóc, thu hút đông đảo người dân và du khách đến tham quan, trải nghiệm nét đẹp văn hóa độc đáo.',
    tag: 'Nổi bật',
    description:
      'Chùa Chantarangsay là một điểm tiêu biểu để giới thiệu kiến trúc chùa Khmer Nam Bộ và sinh hoạt cộng đồng.',
    highlights: [
      'Mái chùa nhiều tầng',
      'Không gian thờ tự đặc trưng',
      'Phần lớn hoa văn rồng Naga',
    ],
    coverImage: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'le-hoi-ooc-om-bok',
    title: 'Lễ hội Oóc Om Bóc',
    province: 'Sóc Trăng',
    category: 'Lễ hội truyền thống',
    type: 'intangible',
    subtitle: 'Lễ cúng trăng và đua ghe ngo.',
    body: 'Lễ hội Oóc Om Bóc (hay còn gọi là Lễ cúng Trăng) là di sản văn hóa phi vật thể quốc gia, được tổ chức vào rằm tháng 10 Âm lịch hằng năm khi mùa mưa kết thúc. Đây là ngày hội lớn nhất của người Khmer Nam Bộ nhằm tạ ơn Mặt Trăng - vị thần điều tiết thời tiết, mang lại mùa màng tươi tốt và sự no ấm cho người dân.\n\nNghi lễ chính được thực hiện vào đêm rằm tại các ngôi chùa hoặc khuôn viên rộng lớn. Người dân chuẩn bị mâm cúng gồm bánh cốm dẹp (nguyên liệu chính giã từ nếp mới), chuối, dừa, khoai lang và các loại hoa quả. Dưới sự hướng dẫn của các vị bô lão, mọi người cùng chắp tay cầu nguyện bình an và tài lộc, sau đó thực hiện nghi thức đút cốm dẹp cho trẻ nhỏ để cầu chúc sự thông minh, khỏe mạnh.\n\nPhần hội vô cùng sôi động với hoạt động Đua ghe Ngo truyền thống trên dòng sông Maspero (Sóc Trăng), thu hút hàng chục đội ghe từ các tỉnh vùng Đồng bằng sông Cửu Long tham gia tranh tài. Tiếng trống vang dội, tiếng reo hò cổ vũ của hàng vạn khán giả tạo nên một bầu không khí lễ hội ngập tràn năng lượng và tinh thần đoàn kết cộng đồng sắc son.',
    tag: 'Mới',
    description:
      'Lễ hội Oóc Om Bóc là một trong những lễ hội tiêu biểu của người Khmer Nam Bộ, thích hợp để giới thiệu nét đẹp lễ hội văn hóa đặc sắc.',
    highlights: [
      'Nghi lễ cúng trăng',
      'Hoạt động đua ghe ngo',
      'Nội dung giàu hình ảnh',
    ],
    coverImage: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'ro-bam',
    title: 'Nghệ thuật Rô Băm',
    province: 'Trà Vinh',
    category: 'Nghệ thuật biểu diễn',
    type: 'intangible',
    subtitle: 'Sân khấu truyền thống đặc trưng.',
    body: 'Nghệ thuật Rô Băm (hay Rô-băm) là loại hình sân khấu múa cổ điển có lịch sử lâu đời của người Khmer Nam Bộ. Trải qua hàng trăm năm gìn giữ, Rô Băm đã được công nhận là Di sản văn hóa phi vật thể quốc gia. Thể loại này nổi bật với sự kết hợp nhuần nhuyễn giữa nghệ thuật múa cung đình, kịch nghệ độc đáo và âm nhạc truyền thống Khmer.\n\nNội dung biểu diễn của các vở Rô Băm thường xoay quanh các câu chuyện thần thoại, truyền thuyết Phật giáo, đặc biệt là sử thi Reamker (phiên bản Khmer của sử thi Ramayana Ấn Độ). Các nghệ sĩ khi biểu diễn sẽ hóa thân thành các nhân vật quen thuộc như hoàng tử Preah Ream, nàng Seda xinh đẹp, tướng khỉ Hanuman trung thành hay quỷ vương Krong Reap độc ác. Mỗi nhân vật đều có trang phục rực rỡ và những chiếc mặt nạ gỗ chạm khắc tinh xảo thể hiện rõ tính cách chính - tà.\n\nSân khấu Rô Băm cuốn hút người xem bởi các động tác múa tay uốn cong điêu luyện, những bước đi uyển chuyển kết hợp với điệu nhạc réo rắt của dàn nhạc ngũ âm (Pinpeat). Nghệ thuật Rô Băm không chỉ mang tính chất giải trí mà còn giáo dục sâu sắc về đạo đức con người, hướng thiện và ca ngợi lẽ phải trong cuộc sống hằng ngày.',
    tag: 'Xem nhanh',
    description:
      'Rô Băm là một loại hình nghệ thuật biểu diễn truyền thống độc đáo của đồng bào Khmer.',
    highlights: [
      'Sân khấu truyền thống',
      'Mặt nạ cổ điển Reamker',
      'Kết hợp nhạc cụ Pinpeat',
    ],
    coverImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'chua-doi',
    title: 'Chùa Dơi',
    province: 'Sóc Trăng',
    category: 'Kiến trúc tôn giáo',
    type: 'tangible',
    subtitle: 'Một điểm đến tiêu biểu có giá trị du lịch và văn hóa.',
    body: 'Chùa Dơi, tên Khmer là Serây Tê Chô Mahatup, tọa lạc tại thành phố Sóc Trăng, tỉnh Sóc Trăng. Đây là ngôi chùa cổ kính được xây dựng từ thế kỷ 16, nổi tiếng không chỉ bởi kiến trúc độc đáo mà còn là nơi cư ngụ của hàng vạn con dơi ngựa quý hiếm treo mình trên những tán cây cổ thụ trong khuôn viên chùa suốt nhiều năm qua.\n\nNgôi chùa mang đậm dấu ấn kiến trúc Khmer truyền thống với mái vòm cong hai tầng rực rỡ sắc vàng, đầu đao uốn cong hình rồng thần Naga. Chính điện thờ tượng Đức Phật Thích Ca bằng đá nguyên khối ngự trên đài sen lớn. Xung quanh tường là những bức tranh sống động kể về cuộc đời hành đạo của Phật Thích Ca từ lúc đản sinh đến khi nhập Niết bàn, được vẽ vô cùng tinh tế.\n\nKhuôn viên chùa Dơi rộng lớn, rợp bóng mát của những cây dầu, cây sao cổ thụ, tạo nên không khí trong lành, bình yên. Buổi chiều tà, du khách đến đây sẽ được chiêm ngưỡng cảnh tượng độc đáo khi đàn dơi khổng lồ bay lượn trên bầu trời trước khi đi kiếm ăn. Chùa Dơi là điểm tham quan văn hóa và du lịch tâm linh không thể bỏ lỡ khi ghé thăm vùng đất Sóc Trăng.',
    tag: 'Khám phá',
    description:
      'Chùa Dơi là một địa điểm nổi tiếng thường được nhắc đến khi nói về di sản Khmer Nam Bộ.',
    highlights: ['Khuôn viên dơi tự nhiên', 'Kiến trúc Mahatup cổ kính', 'Tượng Phật đá nguyên khối'],
    coverImage: 'https://images.unsplash.com/photo-1524412529636-bb435f6c2d1d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'ghe-ngo',
    title: 'Đua ghe ngo',
    province: 'Trà Vinh',
    category: 'Lễ hội truyền thống',
    type: 'intangible',
    subtitle: 'Hoạt động thể thao - lễ hội rất đặc trưng của cộng đồng Khmer.',
    body: 'Đua ghe Ngo (hay Lôi Pro-têp) là hoạt động thể thao dân gian có tính biểu diễn cộng đồng cực kỳ cao của đồng bào người Khmer Nam Bộ. Được tổ chức chính trong dịp lễ hội Oóc Om Bóc hằng năm, đua ghe Ngo không chỉ là một giải đấu thể thao mà còn là nghi thức tâm linh nhằm tạ ơn thần Nước và cầu mong dòng sông mang lại tôm cá đầy khoang, phù sa cho ruộng đồng màu mỡ.\n\nChiếc ghe Ngo (tên Khmer là Ngo) dài khoảng 25 đến 30 mét, có hình dáng thon dài như con rắn, được đục đẽo từ thân cây gỗ sao nguyên khối tốt nhất. Thân ghe được trang trí hoa văn rực rỡ với họa tiết vảy rồng, đầu và đuôi ghe uốn cong vút lên trên. Mỗi chiếc ghe Ngo thuộc sở hữu của một ngôi chùa và đại diện cho niềm tự hào của cả một phum sóc (ngôi làng) tham gia cuộc đua.\n\nMỗi đội đua ghe Ngo gồm khoảng 50 đến 60 tay chèo lực lưỡng dưới sự điều khiển của người chỉ huy đứng ở mũi ghe thổi còi giữ nhịp. Khi cuộc đua bắt đầu, những chiếc ghe lao vút đi trên mặt nước trong tiếng reo hò cuồng nhiệt của hàng vạn người dân dọc hai bờ sông. Sự kiện mang tính kết nối cộng đồng mạnh mẽ, lan tỏa tinh thần thượng võ và đoàn kết của đồng bào các dân tộc Nam Bộ.',
    tag: 'Sự kiện',
    description:
      'Đua ghe ngo là một hoạt động lễ hội giàu năng lượng, biểu trưng tinh thần thượng võ.',
    highlights: ['Ghe đẽo gỗ sao rực rỡ', 'Sức mạnh chèo đồng đội', 'Nhạc hội còi trống thúc giục'],
    coverImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  },
];

export function getHeritageById(id: string) {
  return heritageItems.find((item) => item.id === id);
}