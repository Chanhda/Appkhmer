export type MultiLangText = {
  vi: string;
  km: string;
  en: string;
};

export type MultiLangArray = {
  vi: string[];
  km: string[];
  en: string[];
};

export type FestivalItem = {
  id: string;
  title: MultiLangText;
  khmerTitle: string;
  subtitle: MultiLangText;
  targetDate: string; // ISO string for live countdown
  dateDisplay: MultiLangText;
  location: MultiLangText;
  summary: MultiLangText;
  description: MultiLangText;
  rituals: MultiLangArray;
  foods: MultiLangArray;
  highlights: MultiLangArray;
  coverImage: string;
  featured?: boolean;
};

export const festivalItems: FestivalItem[] = [
  {
    id: 'dua-bo-that-son',
    title: {
      vi: 'Lễ hội Đua Bò Thất Sơn & Chùa Rô',
      km: 'ពិធីប្រណាំងគោភ្នំប្រាំពីរ',
      en: 'Seven Mountains Bull Racing Festival',
    },
    khmerTitle: 'ពិធីប្រណាំងគោ',
    subtitle: {
      vi: 'Môn thể thao nông nghiệp độc đáo vùng Bảy Núi',
      km: 'កីឡាកសិកម្មប្លែកនៃតំបន់ភ្នំប្រាំពីរ',
      en: 'Unique agrarian sport of the Seven Mountains region',
    },
    targetDate: '2026-09-10T08:00:00.000Z',
    dateDisplay: {
      vi: 'Tháng 8 - Tháng 9 Âm lịch hàng năm',
      km: 'ខែភទ្របទ-អស្សុជ រៀងរាល់ឆ្នាំ',
      en: 'August - September (Lunar Calendar)',
    },
    location: {
      vi: 'Tri Tôn & Tịnh Biên, An Giang',
      km: 'ទ្រីតូន និង ទិញបៀន, អានយ៉ាង',
      en: 'Tri Ton & Tinh Bien, An Giang Province',
    },
    summary: {
      vi: 'Lễ hội tranh tài quyết liệt giữa các đôi bò giỏi nhất vùng Bảy Núi, gắn liền với tập quán sản xuất nông nghiệp của đồng bào Khmer.',
      km: 'ពិធីប្រណាំងគោដ៏ស្វិតស្វាញរវាងគូគោពូកែបំផុតនៃតំបន់ភ្នំប្រាំពីរ ផ្សារភ្ជាប់នឹងទម្លាប់ផលិតកម្មកសិកម្មរបស់ជនជាតិខ្មែរ។',
      en: 'Fierce bull racing competition among the finest pairs in Seven Mountains, deeply rooted in Khmer agricultural traditions.',
    },
    description: {
      vi: 'Lễ hội đua bò Thất Sơn là hoạt động văn hóa thể thao đậm chất dân gian của đồng bào Khmer vùng Bảy Núi An Giang. Ban đầu diễn ra dịp lễ Sên Đôl-ta khi các phật tử đưa bò đến bừa đất giúp chùa, dần dần trở thành cuộc hội thao tranh tài quyết liệt thu hút hàng vạn du khách thập phương. Các đôi bò kéo bừa gỗ tranh tài trên đường đua rợp bùn đất với những pha bứt phá ngoạn mục.',
      km: 'ពិធីប្រណាំងគោភ្នំប្រាំពីរគឺជាសកម្មភាពវប្បធម៌កីឡាប្រជាប្រិយយ៉ាងជ្រាលជ្រៅរបស់ជនជាតិខ្មែរនៅតំបន់ភ្នំប្រាំពីរអានយ៉ាង។ ដើមឡើយប្រព្រឹត្តទៅក្នុងឱកាសបុណ្យសែនដូនតា នៅពេលពុទ្ធបរិស័ទយកគោទៅរាស់ដីជួយវត្ត បន្តិចម្តងៗបានក្លាយជាការប្រកួតប្រជែងកីឡាយ៉ាងស្វិតស្វាញទាក់ទាញទស្សនិកជនរាប់ម៉ឺននាក់។',
      en: 'The Seven Mountains bull racing is a traditional folk cultural and sporting event of the Khmer in An Giang. Originally arising during Sen Dol-ta when villagers brought cattle to plow pagoda fields, it evolved into an exhilarating spectacle attracting tens of thousands of visitors.',
    },
    rituals: {
      vi: [
        'Nghi thức cúng xin phép chư tăng và thần linh trước hội đua',
        'Vòng đua Hô (chạy lấy đà) và vòng đua Thả (bứt phá về đích)',
        'Trao phần thưởng biểu dương các chủ bò tài năng'
      ],
      km: [
        'ពិធីសុំការអនុញ្ញាតពីព្រះសង្ឃនិងអារក្សទេវតាមុនការប្រកួត',
        'ជុំរត់យកល្បឿន និងជុំរត់បុកទៅកាន់ទីព្រ័ត្រ',
        'ប្រគល់រង្វាន់លើកទឹកចិត្តម្ចាស់គោដែលមានថ្វីដៃ'
      ],
      en: [
        'Blessing ritual with monks and spirits before the race',
        'Warm-up lap (Ho) and final sprint lap (Tha) to the finish line',
        'Award ceremony honoring skilled cattle owners'
      ],
    },
    foods: {
      vi: ['Cơm nấm lá thốt nốt', 'Thịt bò xào giang', 'Bánh thốt nốt'],
      km: ['បាយក្តាំងស្លឹកត្នោត', 'សាច់គោឆាស្លឹកកៀង', 'នំត្នោត'],
      en: ['Palmyra palm rice', 'Stir-fried beef with sour leaves', 'Palmyra palm cake'],
    },
    highlights: {
      vi: ['Những đường đua rợp bùn kịch tính', 'Không khí cổ vũ náo nhiệt', 'Trải nghiệm văn hóa vùng Bảy Núi'],
      km: ['ផ្លូវប្រកួតភក់ជ្រាំយ៉ាងរំភើប', 'បរិយាកាសអបអរសាទរយ៉ាងអ៊ូអរ', 'បទពិសោធន៍វប្បធម៌តំបន់ភ្នំប្រាំពីរ'],
      en: ['Dramatic muddy racing tracks', 'Vibrant cheering atmosphere', 'Seven Mountains cultural experience'],
    },
    coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    featured: true,
  },
  {
    id: 'sen-dol-ta',
    title: {
      vi: 'Lễ hội Sên Đôl-ta (Lễ Cúng Ông Bà)',
      km: 'ពិធីបុណ្យសែនដូនតា (បុណ្យភ្ជុំបិណ្ឌ)',
      en: 'Sen Dol-ta Festival (Ancestors Day)',
    },
    khmerTitle: 'ពិធីបុណ្យសែនដូនតា',
    subtitle: {
      vi: 'Lễ hiếu kính tổ tiên và nhắc nhớ cội nguồn',
      km: 'បុណ្យកតញ្ញូចំពោះបុព្វបុរស និងរំលឹកដល់ប្រភពដើម',
      en: 'Ancestral veneration and remembrance of origins',
    },
    targetDate: '2026-10-08T08:00:00.000Z',
    dateDisplay: {
      vi: '29/8 - 1/9 Âm lịch hàng năm',
      km: 'ថ្ងៃ ២៩ ខែភទ្របទ ដល់ ថ្ងៃ ១ ខែអស្សុជ',
      en: 'Late August - Early September (Lunar Calendar)',
    },
    location: {
      vi: 'Khắp các phum sóc Khmer Nam Bộ',
      km: 'គ្រប់ភូមិឋានខ្មែរនៅភាគខាងត្បូង',
      en: 'Across all Khmer villages in Southern Vietnam',
    },
    summary: {
      vi: 'Một trong hai lễ hội lớn nhất năm của người Khmer, thể hiện lòng hiếu thảo, tri ân tổ tiên, ông bà và những người đã khuất.',
      km: 'បុណ្យធំមួយក្នុងចំណោមបុណ្យធំពីរប្រចាំឆ្នាំរបស់ជនជាតិខ្មែរ សម្តែងនូវទឹកចិត្តកតញ្ញូ ដឹងគុណដល់បុព្វបុរស ដូនតា។',
      en: 'One of the two largest annual Khmer festivals, honoring ancestors, grandparents, and departed souls with filial piety.',
    },
    description: {
      vi: 'Sên Đôl-ta mang ý nghĩa tương tự như lễ Vu Lan báo hiếu. Trong 3 ngày diễn ra lễ hội, mọi gia đình Khmer đều dọn dẹp nhà cửa, chuẩn bị mâm cỗ tươm tấp cúng gia tiên và mang thức ăn, kinh sách đến chùa dâng lên các chư tăng để cầu kinh siêu độ cho linh hồn người quá cố. Đây cũng là dịp để con cháu tụ họp, gắn kết tình thân gia tộc.',
      km: 'បុណ្យសែនដូនតាមិនត្រឹមតែជាឱកាសសម្តែងនូវការរំលឹកគុណប៉ុណ្ណោះទេ ប៉ុន្តែថែមទាំងជាឱកាសឲ្យកូនចៅជួបជុំគ្នា។ ក្នុងរយៈពេល ៣ ថ្ងៃនៃពិធីបុណ្យ គ្រួសារខ្មែរទាំងអស់រៀបចំផ្ទះសម្បែង រៀបចំថាសសែនដូនតា និងយកចង្ហាន់ទៅវត្តប្រគេនព្រះសង្ឃដើម្បីឧទ្ទិសកុសលដល់វិញ្ញាណក្ខន្ធអ្នកចែកឋាន។',
      en: 'Sen Dol-ta is an occasion of deep filial gratitude. Over three days, Khmer families clean their homes, prepare rich offerings for ancestors, and bring food and offerings to pagodas for monks to chant prayers for departed souls.',
    },
    rituals: {
      vi: [
        'Lễ Đặt cơm vắt (Bay Ben) lúc hừng sáng tại chùa',
        'Nghi thức cúng rước và tiễn ông bà tại gia đình',
        'Tụng kinh cầu siêu và đòn bánh tét làm quà dâng chùa'
      ],
      km: [
        'ពិធីបោះបាយបិណ្ឌនៅព្រលឹមស្រាងៗនៅវត្ត',
        'ពិធីសែនរៀបចំស្វាគមន៍និងជូនដំណើរដូនតានៅផ្ទះ',
        'ការសូត្រមន្តបង្សុកូល និងយកនំអន្សមទៅវត្ត'
      ],
      en: [
        'Bay Ben (rice ball throwing) ritual at dawn in pagodas',
        'Home welcoming and farewell rituals for ancestor spirits',
        'Chanting prayers for souls and offering cylindrical rice cakes'
      ],
    },
    foods: {
      vi: ['Bánh tét Khmer', 'Mắm prahok chưng', 'Thịt kho trứng', 'Chè thốt nốt'],
      km: ['នំអន្សមខ្មែរ', 'ប្រហុកចំហុយ', 'សាច់ជ្រូកខ្វៃ/ខ', 'បង្អែមត្នោត'],
      en: ['Khmer Cylindrical Rice Cake', 'Steamed Prahok', 'Braised Pork with Eggs', 'Palmyra Sweet Soup'],
    },
    highlights: {
      vi: ['Không khí ấm cúng tại gia đình', 'Nghi lễ Bay Ben độc đáo lúc bình minh', 'Văn hóa hiếu đạo sâu sắc'],
      km: ['បរិយាកាសកក់ក្តៅក្នុងគ្រួសារ', 'ពិធីបោះបាយបិណ្ឌដ៏ពិសេសនៅអរុណរះ', 'វប្បធម៌កតញ្ញូដ៏ជ្រាលជ្រៅ'],
      en: ['Warm family reunion atmosphere', 'Unique dawn Bay Ben ceremony', 'Profound cultural filial gratitude'],
    },
    coverImage: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80',
    featured: true,
  },
  {
    id: 'kathina',
    title: {
      vi: 'Lễ Dâng Y Kathina (Lễ Đại Thụ Cụ)',
      km: 'ពិធីបុណ្យកឋិនទាន',
      en: 'Kathina Robe Offering Ceremony',
    },
    khmerTitle: 'ពិធីបុណ្យកឋិន',
    subtitle: {
      vi: 'Nghi lễ cúng cầy y áo tôn nghiêm nhất Phật giáo Nam tông',
      km: 'ពិធីបុណ្យប្រគេនស្បង់ចីវរដ៏ខ្ពង់ខ្ពស់បំផុតនៃព្រះពុទ្ធសាសនាថេរវាទ',
      en: 'Most sacred robe offering ritual in Theravada Buddhism',
    },
    targetDate: '2026-10-25T08:00:00.000Z',
    dateDisplay: {
      vi: 'Từ 16/9 đến 15/10 Âm lịch',
      km: 'ចាប់ពីថ្ងៃ ១៦ ខែអស្សុជ ដល់ ថ្ងៃ ១៥ ខែកត្តិក',
      en: 'Mid-October to Mid-November (Lunar Calendar)',
    },
    location: {
      vi: 'Các ngôi Chùa Khmer Nam Bộ',
      km: 'បណ្តាវត្តអារាមខ្មែរនៅភាគខាងត្បូង',
      en: 'Theravada Khmer Pagodas across the region',
    },
    summary: {
      vi: 'Lễ hội mang tính phước báu cao nhất, khi các phật tử chuẩn bị y áo mới và vật dụng sinh hoạt dâng lên các vị sư sau 3 tháng an cư nhập hạ.',
      km: 'ពិធីបុណ្យដែលមានមហាកុសលខ្ពស់បំផុត នៅពេលពុទ្ធបរិស័ទរៀបចំស្បង់ចីវរថ្មី និងបរិក្ខារប្រគេនព្រះសង្ឃក្រោយចេញវស្សា។',
      en: 'A grand merit-making festival where devotees offer new saffron robes and requisites to monks following their 3-month rains retreat.',
    },
    description: {
      vi: 'Lễ Kathina là một trong những ngày hội từ thiện và tâm linh rực rỡ nhất. Mỗi ngôi chùa chỉ được tổ chức Lễ Kathina đúng một lần trong năm trong thời gian một tháng sau mùa an cư. Các phật tử diễu hành quanh phum sóc và quanh chánh điện với những mâm y vàng, cây hoa tiền báu vật để dâng lên chư tăng, tạo nên khung cảnh diễu hành vô cùng trang nghiêm và rực rỡ sắc màu.',
      km: 'ពិធីបុណ្យកឋិនទានគឺជាពិធីបុណ្យសប្បុរសធម៌ និងផ្លូវចិត្តដ៏ត្រចះត្រចង់បំផុត។ វត្តនីមួយៗអាចរៀបចំពិធីបុណ្យកឋិនបានតែម្តងគត់ក្នុងមួយឆ្នាំក្នុងរយៈពេលមួយខែក្រោយចេញវស្សា។ ពុទ្ធបរិស័ទដង្ហែជុំវិញភូមិនិងជុំវិញព្រះវិហារជាមួយនឹងពានស្បង់ចីវរពណ៌លឿង និងដើមផ្កាប្រាក់។',
      en: 'Kathina is one of the most vibrant spiritual festivals. Each pagoda can hold Kathina only once a year during the month following Vassa. Devotees parade with yellow robes and money trees around the main sanctuary in grand solemnity.',
    },
    rituals: {
      vi: [
        'Đoàn diễu hành Răm-vông tôn nghiêm quanh chánh điện',
        'Nghi thức tuyên ngôn dâng y Kathina của chư tăng',
        'Quyên góp từ thiện hỗ trợ tu sửa chùa và phum sóc'
      ],
      km: [
        'ក្បួនដង្ហែរាំវង់យ៉ាងខ្ពង់ខ្ពស់ជុំវិញព្រះវិហារ',
        'ពិធីក្រាលកឋិននិងកឋិនត្ថារកិច្ចរបស់ព្រះសង្ឃ',
        'ការបរិច្ចាគសប្បុរសធម៌ជួយកសាងវត្តនិងភូមិឋាន'
      ],
      en: [
        'Solemn Rom-vong procession around the main sanctuary',
        'Kathina robe acceptance and proclamation by the sangha',
        'Charitable donations supporting pagoda and community infrastructure'
      ],
    },
    foods: {
      vi: ['Bún nước lèo Sóc Trăng', 'Cơm chè nhà chùa', 'Hoa quả tươi'],
      km: ['នំបញ្ចុកសម្លប្រហើរ Soc Trang', 'បាយសម្លវត្តអារាម', 'ផ្លែឈើស្រស់'],
      en: ['Soc Trang Num Banh Chok Noodle', 'Temple Feast Dishes', 'Fresh Tropical Fruits'],
    },
    highlights: {
      vi: ['Đoàn diễu hành rực rỡ sắc vàng', 'Âm nhạc trống Chhay-dăm rộn rã', 'Không khí phước báu ngập tràn'],
      km: ['ក្បួនដង្ហែពណ៌លឿងទុំយ៉ាងស្រស់ស្អាត', 'តន្ត្រីស្គរឆៃយ៉ាំយ៉ាងរំភើប', 'បរិយាកាសមហាកុសលពេញបរិបូរណ៍'],
      en: ['Splendid golden procession', 'Joyous Chhay-dăm drum music', 'Abundant merit-making atmosphere'],
    },
    coverImage: 'https://images.unsplash.com/photo-1598908313407-4fbd48db2c96?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ok-om-bok',
    title: {
      vi: 'Lễ hội Ók Om Bók & Đua Ghe Ngọ',
      km: 'ពិធីបុណ្យអុំទូក និងសំពះព្រះខែ (អកអំបុក)',
      en: 'Ok Om Bok & Ngo Boat Race Festival',
    },
    khmerTitle: 'ពិធីបុណ្យអុំទូក និងសំពះព្រះខែ',
    subtitle: {
      vi: 'Di sản văn hóa phi vật thể quốc gia - Lễ cúng trăng',
      km: 'បេតិកភណ្ឌវប្បធម៌អរូបិយជាតិ - ពិធីសំពះព្រះខែ',
      en: 'National Intangible Heritage - Moon Worshipping Ceremony',
    },
    targetDate: '2026-11-23T08:00:00.000Z',
    dateDisplay: {
      vi: 'Rằm tháng 10 Âm lịch (15/10 Âm lịch)',
      km: 'ថ្ងៃ ១៥ កើត ខែកត្តិក រៀងរាល់ឆ្នាំ',
      en: 'Full Moon of the 10th Lunar Month (November)',
    },
    location: {
      vi: 'Sóc Trăng & Trà Vinh (Trung tâm chính)',
      km: 'សុកត្រាំង និង ត្រាវិញ (មជ្ឈមណ្ឌលដើម)',
      en: 'Soc Trang & Tra Vinh Provinces (Main Hubs)',
    },
    summary: {
      vi: 'Đại lễ cúng trăng cảm ơn thần Mặt Trăng đã bảo vệ mùa màng, kết hợp giải Đua ghe Ngọ rực rỡ trên sông Maspero.',
      km: 'ពិធីបុណ្យសំពះព្រះខែដើម្បីអរគុណដល់ព្រះខែដែលបានជួយថែរក្សាភោគផលកសិកម្ម បូករួមនឹងការប្រកួតទូក ង យ៉ាងអធិកអធម។',
      en: 'Grand moon worshipping ceremony thanking the Moon God for agricultural bounties, paired with spectacular Ngo boat races.',
    },
    description: {
      vi: 'Ók Om Bók là lễ hội náo nhiệt và lớn bậc nhất tại Miền Tây. Khi trăng tròn rúp đỉnh, mọi người tụ tập tại sân chùa hoặc sân nhà để cúng đút cốm dẹp (Cốm dẹp quết tươi thơm lừng vị dừa). Ngay sau đó là giải đua ghe Ngọ - những chiếc thuyền rồng uốn lượn dài hơn 30m với 50-60 tay chèo rèn luyện dũng mãnh, lướt sóng trong tiếng reo hò vang dội cả một vùng sông nước.',
      km: 'អកអំបុកគឺជាពិធីបុណ្យដ៏អ៊ូអរ និងធំបំផុតនៅភាគខាងត្បូង។ នៅពេលព្រះខែពេញបូណ៌មី មនុស្សគ្រប់គ្នាកកកុញនៅទីធ្លាវត្ត ឬទីធ្លាផ្ទះដើម្បីធ្វើពិធីអកអំបុក។ បន្ទាប់មកគឺការប្រកួតទូក ង - ទូកវែងជាង ៣០ម៉ែត្រ ដែលមានកីឡាករ ៥០-៦០នាក់ ចាយយ៉ាងក្លាហានលើផ្ទៃទឹក។',
      en: 'Ok Om Bok is the largest and most exhilarating festival in the Mekong Delta. Under the full moon, families gather to feed pounded rice (Ambok) to children for blessings, followed by thrilling Ngo dragon boat races with 50-60 rowers per boat.',
    },
    rituals: {
      vi: [
        'Nghi thức cúng trăng và đút Cốm Dẹp cho trẻ em',
        'Thả đèn gió (Khom Loy) và đèn nước (Khom Prout) lung linh trên bầu trời và dòng sông',
        'Giải thi đấu Đua ghe Ngọ truyền thống sôi động'
      ],
      km: [
        'ពិធីសំពះព្រះខែ និងអកអំបុកឲ្យក្មេងៗ',
        'ការបង្ហោះគោមខ្យល់ និងបណ្តែតប្រទីបលើផ្ទៃទឹក',
        'ការប្រកួតកីឡាប្រណាំងទូក ង ប្រពៃណីយ៉ាងសប្បាយរីករាយ'
      ],
      en: [
        'Moon worship ritual and Ambok feeding for children',
        'Releasing sky lanterns (Khom Loy) and floating water lanterns (Khom Prout)',
        'Exhilarating traditional Ngo boat racing regatta'
      ],
    },
    foods: {
      vi: ['Cốm dẹp trộn dừa nạo', 'Bún nước lèo', 'Bánh pía', 'Bánh dừa Khmer'],
      km: ['អំបុកដូងស្រស់', 'នំបញ្ចុកសម្លប្រហើរ', 'នំពីអា (Pia)', 'នំដូងខ្មែរ'],
      en: ['Fresh Ambok Pounded Rice with Coconut', 'Num Banh Chok Noodle', 'Pia Cake', 'Khmer Coconut Cake'],
    },
    highlights: {
      vi: ['Giải đua ghe Ngọ hàng chục vạn người xem', 'Hàng ngàn đèn gió lung linh đêm trăng', 'Tục đút cốm dẹp truyền thống'],
      km: ['ការប្រកួតទូក ង ទាក់ទាញទស្សនិកជនរាប់សែននាក់', 'គោមខ្យល់រាប់ពាន់រះត្រចះត្រចង់ក្នុងរាត្រីសមោសរ', 'ទំនៀមទម្លាប់អកអំបុកប្រពៃណី'],
      en: ['Ngo boat race with hundreds of thousands of spectators', 'Thousands of glowing sky lanterns in the moonlight', 'Traditional Ambok feeding custom'],
    },
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    featured: true,
  },
  {
    id: 'chol-chnam-thmay',
    title: {
      vi: 'Lễ hội Chôl Chnăm Thmây (Tết Cổ Truyền)',
      km: 'ពិធីបុណ្យចូលឆ្នាំថ្មីប្រពៃណីជាតិខ្មែរ',
      en: 'Chol Chnam Thmay (Khmer New Year)',
    },
    khmerTitle: 'ពិធីបុណ្យចូលឆ្នាំថ្មី',
    subtitle: {
      vi: 'Mừng năm mới theo lịch cổ truyền Khmer',
      km: 'អបអរសាទរឆ្នាំថ្មីតាមប្រតិទិនប្រពៃណីខ្មែរ',
      en: 'Welcoming the traditional Khmer New Year',
    },
    targetDate: '2027-04-14T08:00:00.000Z',
    dateDisplay: {
      vi: 'Ngày 14, 15, 16 tháng 4 Dương lịch',
      km: 'ថ្ងៃ ១៤, ១៥, ១៦ ខែមេសា រៀងរាល់ឆ្នាំ',
      en: 'April 14 - 16 Annually',
    },
    location: {
      vi: 'Toàn bộ cộng đồng Khmer Nam Bộ',
      km: 'សហគមន៍ខ្មែរទាំងមូលនៅភាគខាងត្បូង',
      en: 'All Khmer communities in Southern Vietnam',
    },
    summary: {
      vi: 'Tết mừng năm mới đánh dấu sự chuyển mùa, đắp núi cát cầu may mắn và nghi thức tắm Phật thanh tịnh.',
      km: 'បុណ្យចូលឆ្នាំថ្មីសម្គាល់ការផ្លាស់ប្តូររដូវកាល ការពូនភ្នំខ្សាច់សុំសេចក្តីសុខ និងពិធីស្រង់ព្រះដ៏ស្អាតស្អំ។',
      en: 'Grand New Year festival marking seasonal transition, featuring sand mountain building for fortune and Buddha bathing rituals.',
    },
    description: {
      vi: 'Chôl Chnăm Thmây có nghĩa là "Vào năm mới". Đây là dịp lễ hội vui tươi nhất trong năm. Mọi người diện những bộ trang phục truyền thống đẹp nhất, đến chùa đắp những ngọn núi cát (Mô-ha-sốt) tượng trưng cho vũ trụ để cầu may mắn, thực hiện nghi thức tắm tượng Phật và tắm rửa cho các vị cao tăng để rửa trôi những điều không may mắn của năm cũ.',
      km: 'ចូលឆ្នាំថ្មីមានន័យថា "ចូលสู่ឆ្នាំថ្មី"។ នេះជាឱកាសបុណ្យសប្បាយរីករាយបំផុតក្នុងឆ្នាំ។ មនុស្សគ្រប់គ្នាស្លៀកពាក់សម្លៀកបំពាក់ប្រពៃណីយ៉ាងស្អាតស្អំ ទៅវត្តពូនភ្នំខ្សាច់តំណាងឲ្យចក្រវាឡដើម្បីសុំសេចក្តីសុខ ធ្វើពិធីស្រង់ព្រះ និងស្រង់ព្រះសង្ឃដើម្បីលាងជម្រះឧបទ្រពចង្រៃឆ្នាំចាស់។',
      en: 'Chol Chnam Thmay literally means "Entering the New Year". It is the most joyous festival of the year. People don fine traditional attire, visit pagodas to build sand mounds symbolizing the cosmos for good luck, and perform Buddha bathing ceremonies to wash away past misfortunes.',
    },
    rituals: {
      vi: [
        'Rước đại lịch Maha Sangkran quanh chánh điện',
        'Nghi thức Đắp núi cát (Mô-ha-sốt) tích đức',
        'Lễ Tắm Phật (Tắm tượng Phật và rưới nước mát cho người lớn tuổi)'
      ],
      km: [
        'ក្បួនដង្ហែមហាសង្ក្រាន្តជុំវិញព្រះវិហារ',
        'ពិធីពូនភ្នំខ្សាច់ដើមបីសាងកុសល',
        'ពិធីស្រង់ព្រះ (ស្រង់ព្រះពុទ្ធរូប និងស្រង់ទឹកជូនចាស់ព្រឹទ្ធាចារ្យ)'
      ],
      en: [
        'Maha Sangkran procession around the sanctuary',
        'Building sand mounds (Mohasot) for merit making',
        'Buddha Bathing ceremony and offering refreshing water to elders'
      ],
    },
    foods: {
      vi: ['Bún cà ri Khmer', 'Bánh tét', 'Chè đậu trắng', 'Hoa quả tươi'],
      km: ['នំបញ្ចុកការីខ្មែរ', 'នំអន្សម', 'បង្អែមសណ្តែកស', 'ផ្លែឈើស្រស់'],
      en: ['Khmer Curry Num Banh Chok', 'Cylindrical Rice Cake', 'White Bean Sweet Soup', 'Fresh Fruits'],
    },
    highlights: {
      vi: ['Vũ điệu Lâm-thôn rộn rã đêm tết', 'Trò chơi dân gian như Kéo co, Đánh cù', 'Nghi thức tắm Phật thanh tịnh'],
      km: ['របាំរាំវង់យ៉ាងសប្បាយរីករាយនា đêmចូលឆ្នាំ', 'ល្បែងប្រជាប្រិយដូចជាទាញព្រ័ត្រ បោះអង្គុញ', 'ពិធីស្រង់ព្រះដ៏វិសុទ្ធ'],
      en: ['Joyous Rom-vong traditional dance nights', 'Folk games like tug-of-war and Angkunh nut throwing', 'Pure and auspicious Buddha bathing ritual'],
    },
    coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    featured: true,
  }
];
