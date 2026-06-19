export type Language = 'vi' | 'km' | 'en';

export interface Translations {
  // Common
  common: {
    loading: string;
    error: string;
    noResults: string;
    seeAll: string;
    search: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    back: string;
    next: string;
    done: string;
  };

  // Home Screen
  home: {
    title: string;
    subtitle: string;
    badge: string;
    stats: {
      heritage: string;
      articles: string;
      provinces: string;
    };
    categories: {
      all: string;
      temple: string;
      festival: string;
      art: string;
    };
    sections: {
      featured: string;
      featuredSubtitle: string;
      articles: string;
      articlesSubtitle: string;
      quickActions: string;
    };
    quickActions: {
      map: string;
      explore: string;
      articles: string;
    };
    admin: {
      title: string;
      description: string;
    };
  };

  // Heritage Screen
  heritage: {
    title: string;
    subtitle: string;
    stats: {
      locations: string;
      provinces: string;
      rating: string;
    };
    categories: {
      all: string;
      festival: string;
      architecture: string;
      art: string;
    };
    types: {
      all: string;
      tangible: string;
      intangible: string;
    };
    listTitle: string;
    results: string;
    viewDetail: string;
  };

  // Explore Screen
  explore: {
    title: string;
    subtitle: string;
    collections: {
      title: string;
      new: string;
      popular: string;
      nearby: string;
      favorites: string;
    };
    categories: {
      title: string;
      temple: string;
      festival: string;
      art: string;
      tradition: string;
      cuisine: string;
      music: string;
    };
    featured: {
      title: string;
      subtitle: string;
    };
    articles: {
      title: string;
      subtitle: string;
    };
    stats: {
      title: string;
      heritage: string;
      articles: string;
      provinces: string;
    };
  };

  // Profile Screen
  profile: {
    title: string;
    guest: string;
    notLoggedIn: string;
    stats: {
      viewed: string;
      favorites: string;
      reviews: string;
    };
    language: {
      title: string;
      vietnamese: string;
      khmer: string;
      english: string;
    };
    menu: {
      title: string;
      admin: string;
      settings: string;
      notifications: string;
      favorites: string;
      history: string;
      help: string;
      about: string;
    };
    signOut: string;
    login: string;
    appInfo: string;
    copyright: string;
  };

  // Map Screen
  map: {
    title: string;
    subtitle: string;
    mapTitle: string;
    mapSubtitle: string;
    comingSoon: string;
    stats: {
      markers: string;
      areas: string;
      distance: string;
    };
    filter: string;
    destinations: string;
  };

  // Messages
  messages: {
    loadingData: string;
    errorOccurred: string;
    noResultsFound: string;
    tryDifferentSearch: string;
    tryDifferentCategory: string;
  };
  admin: {
    dashboardTitle: string;
    articlesTitle: string;
    heritagesTitle: string;
    totalArticles: string;
    pendingArticles: string;
    viewsStats: string;
    articlesLink: string;
    heritagesLink: string;
    itemCount: string;
    tabPending: string;
    tabPublished: string;
    tabRejected: string;
    emptyPending: string;
    emptyPublished: string;
    emptyRejected: string;
    actionApprove: string;
    actionReject: string;
    actionEdit: string;
    actionView: string;
    actionDelete: string;
    actionApproveAgain: string;
    actionDeletePermanent: string;
    addNewArticle: string;
    addNewHeritage: string;
    searchPlaceholderArticles: string;
    searchPlaceholderHeritages: string;
    filterAll: string;
    resultCountArticles: string;
    resultCountHeritages: string;
    refresh: string;
    statusBadgePending: string;
    statusBadgePublished: string;
    statusBadgeRejected: string;
    authorLabel: string;
    authorAnonymous: string;
    reasonLabel: string;
    loading: string;
    processing: string;
    switchShow: string;
    switchHide: string;
    statsTotal: string;
    statsTangible: string;
    statsIntangible: string;
    statsSubtitle: string;
    greetings: {
      morning: string;
      morningSub: string;
      afternoon: string;
      afternoonSub: string;
      evening: string;
      eveningSub: string;
    };
    alerts: {
      confirmDeleteTitle: string;
      confirmDeleteMsg: string;
      cancel: string;
      delete: string;
      success: string;
      error: string;
      deleteSuccess: string;
      deleteError: string;
      rejectTitle: string;
      rejectMsg: string;
      rejectOptionAppropriate: string;
      rejectOptionEdit: string;
      rejectError: string;
      approveError: string;
      togglePublishError: string;
    };
  };
}

export const translations: Record<Language, Translations> = {
  vi: {
    common: {
      loading: 'Đang tải...',
      error: 'Có lỗi xảy ra',
      noResults: 'Không tìm thấy kết quả',
      seeAll: 'Xem tất cả',
      search: 'Tìm kiếm',
      cancel: 'Hủy',
      save: 'Lưu',
      delete: 'Xóa',
      edit: 'Sửa',
      back: 'Quay lại',
      next: 'Tiếp theo',
      done: 'Hoàn thành',
    },
    home: {
      title: 'Văn hóa Khmer Nam Bộ',
      subtitle: 'Hành trình khám phá những giá trị văn hóa độc đáo',
      badge: '✨ Khám phá di sản',
      stats: {
        heritage: 'Di sản',
        articles: 'Bài viết',
        provinces: 'Tỉnh thành',
      },
      categories: {
        all: 'Tất cả',
        temple: 'Chùa',
        festival: 'Lễ hội',
        art: 'Nghệ thuật',
      },
      sections: {
        featured: 'Di sản nổi bật',
        featuredSubtitle: 'Khám phá những địa điểm văn hóa đặc sắc',
        articles: 'Bài viết mới nhất',
        articlesSubtitle: 'Cập nhật kiến thức văn hóa',
        quickActions: 'Truy cập nhanh',
      },
      quickActions: {
        map: 'Bản đồ',
        explore: 'Khám phá',
        articles: 'Bài viết',
      },
      admin: {
        title: 'Quản trị viên',
        description: 'Quản lý nội dung và cài đặt hệ thống',
      },
    },
    heritage: {
      title: 'Di Sản Văn Hóa',
      subtitle: 'di sản Khmer Nam Bộ',
      stats: {
        locations: 'Địa điểm',
        provinces: 'Tỉnh thành',
        rating: 'Đánh giá',
      },
      categories: {
        all: 'Tất cả',
        festival: 'Lễ hội',
        architecture: 'Kiến trúc',
        art: 'Nghệ thuật',
      },
      types: {
        all: 'Tất cả di sản',
        tangible: 'Di sản vật thể',
        intangible: 'Di sản phi vật thể',
      },
      listTitle: 'Tất cả di sản',
      results: 'kết quả',
      viewDetail: 'Xem chi tiết',
    },
    explore: {
      title: 'Khám Phá',
      subtitle: 'Tìm hiểu sâu hơn về văn hóa Khmer Nam Bộ',
      collections: {
        title: 'Bộ sưu tập',
        new: 'Mới nhất',
        popular: 'Phổ biến',
        nearby: 'Gần đây',
        favorites: 'Yêu thích',
      },
      categories: {
        title: 'Danh mục',
        temple: 'Chùa',
        festival: 'Lễ hội',
        art: 'Nghệ thuật',
        tradition: 'Truyền thống',
        cuisine: 'Ẩm thực',
        music: 'Âm nhạc',
      },
      featured: {
        title: 'Nổi bật',
        subtitle: 'Những di sản được yêu thích nhất',
      },
      articles: {
        title: 'Bài viết hay',
        subtitle: 'Kiến thức về văn hóa Khmer',
      },
      stats: {
        title: 'Thống kê',
        heritage: 'Di sản',
        articles: 'Bài viết',
        provinces: 'Tỉnh thành',
      },
    },
    profile: {
      title: 'Hồ Sơ',
      guest: 'Người dùng',
      notLoggedIn: 'Chưa đăng nhập',
      stats: {
        viewed: 'Đã xem',
        favorites: 'Yêu thích',
        reviews: 'Đánh giá',
      },
      language: {
        title: 'Ngôn ngữ',
        vietnamese: 'Tiếng Việt',
        khmer: 'ខ្មែរ',
        english: 'English',
      },
      menu: {
        title: 'Cài đặt & Hỗ trợ',
        admin: 'Quản trị viên',
        settings: 'Cài đặt',
        notifications: 'Thông báo',
        favorites: 'Yêu thích',
        history: 'Lịch sử',
        help: 'Trợ giúp',
        about: 'Về chúng tôi',
      },
      signOut: 'Đăng xuất',
      login: 'Đăng nhập',
      appInfo: 'Khmer Heritage App v1.0.0',
      copyright: '© 2026 Văn hóa Khmer Nam Bộ',
    },
    map: {
      title: 'Bản Đồ Di Sản',
      subtitle: 'địa điểm văn hóa trên bản đồ',
      mapTitle: 'Bản đồ tương tác',
      mapSubtitle: 'Tích hợp Google Maps hoặc Leaflet',
      comingSoon: 'Sắp ra mắt',
      stats: {
        markers: 'Điểm di sản',
        areas: 'Khu vực',
        distance: 'km',
      },
      filter: 'Lọc theo danh mục',
      destinations: 'Điểm đến',
    },
    messages: {
      loadingData: 'Đang tải dữ liệu...',
      errorOccurred: 'Có lỗi xảy ra',
      noResultsFound: 'Không tìm thấy kết quả',
      tryDifferentSearch: 'Thử tìm kiếm với từ khóa khác',
      tryDifferentCategory: 'Thử chọn danh mục khác',
    },
    admin: {
      dashboardTitle: 'Heritage Admin',
      articlesTitle: 'Quản lý Bài viết',
      heritagesTitle: 'Quản lý Di sản',
      totalArticles: 'TỔNG BÀI VIẾT',
      pendingArticles: 'CHỜ DUYỆT',
      viewsStats: 'LƯỢT XEM',
      articlesLink: 'Bài viết',
      heritagesLink: 'Di sản',
      itemCount: ' mục',
      tabPending: 'Chờ duyệt',
      tabPublished: 'Đã đăng',
      tabRejected: 'Từ chối',
      emptyPending: 'Không có bài chờ duyệt',
      emptyPublished: 'Chưa có bài đã đăng',
      emptyRejected: 'Không có bài bị từ chối',
      actionApprove: 'Duyệt',
      actionReject: 'Từ chối',
      actionEdit: 'Sửa',
      actionView: 'Xem',
      actionDelete: 'Xóa',
      actionApproveAgain: 'Duyệt lại',
      actionDeletePermanent: 'Xóa hẳn',
      addNewArticle: 'Thêm bài viết mới',
      addNewHeritage: 'Thêm di sản mới',
      searchPlaceholderArticles: 'Tìm kiếm tiêu đề, tác giả...',
      searchPlaceholderHeritages: 'Tìm tên di sản, tỉnh thành...',
      filterAll: 'Tất cả',
      resultCountArticles: 'Tìm thấy {count} bài viết',
      resultCountHeritages: '{count} kết quả',
      refresh: 'Làm mới',
      statusBadgePending: 'CHỜ DUYỆT',
      statusBadgePublished: 'ĐÃ ĐĂNG',
      statusBadgeRejected: 'TỪ CHỐI',
      authorLabel: 'Tác giả: ',
      authorAnonymous: 'Ẩn danh',
      reasonLabel: 'Lý do: ',
      loading: 'Đang tải...',
      processing: 'Đang xử lý...',
      switchShow: 'Hiển thị',
      switchHide: 'Đang ẩn',
      statsTotal: 'Tổng cộng',
      statsTangible: 'Vật thể',
      statsIntangible: 'Phi vật thể',
      statsSubtitle: '{total} di sản · {tangible} vật thể · {intangible} phi vật thể',
      greetings: {
        morning: 'Chào buổi sáng ☀️',
        morningSub: 'Chúc bạn một ngày làm việc đầy năng lượng!',
        afternoon: 'Xin chào Admin! ✨',
        afternoonSub: 'Chúc bạn một buổi chiều quản lý hiệu quả và ngập tràn niềm vui!',
        evening: 'Chào buổi tối 🌙',
        eveningSub: 'Chúc bạn một buổi tối thư giãn!',
      },
      alerts: {
        confirmDeleteTitle: 'Xác nhận xóa',
        confirmDeleteMsg: 'Bạn có chắc chắn muốn xóa không?',
        cancel: 'Hủy',
        delete: 'Xóa',
        success: 'Thành công',
        error: 'Lỗi',
        deleteSuccess: 'Xóa thành công!',
        deleteError: 'Không thể xóa!',
        rejectTitle: 'Từ chối bài viết',
        rejectMsg: 'Bạn muốn từ chối bài viết này vì lý do gì?',
        rejectOptionAppropriate: 'Từ chối (Không phù hợp)',
        rejectOptionEdit: 'Từ chối (Cần chỉnh sửa)',
        rejectError: 'Không thể từ chối bài viết.',
        approveError: 'Không thể duyệt bài viết.',
        togglePublishError: 'Không thể thay đổi trạng thái bài viết.',
      },
    },
  },
  km: {
    common: {
      loading: 'កំពុងផ្ទុក...',
      error: 'មានបញ្ហា',
      noResults: 'រកមិនឃើញលទ្ធផល',
      seeAll: 'មើលទាំងអស់',
      search: 'ស្វែងរក',
      cancel: 'បោះបង់',
      save: 'រក្សាទុក',
      delete: 'លុប',
      edit: 'កែសម្រួល',
      back: 'ត្រឡប់ក្រោយ',
      next: 'បន្ទាប់',
      done: 'រួចរាល់',
    },
    home: {
      title: 'វប្បធម៌ខ្មែរកម្ពុជាក្រោម',
      subtitle: 'ដំណើរស្វែងយល់ពីតម្លៃវប្បធម៌ពិសេស',
      badge: '✨ ស្វែងរកបេតិកភណ្ឌ',
      stats: {
        heritage: 'បេតិកភណ្ឌ',
        articles: 'អត្ថបទ',
        provinces: 'ខេត្ត',
      },
      categories: {
        all: 'ទាំងអស់',
        temple: 'វត្ត',
        festival: 'ពិធីបុណ្យ',
        art: 'សិល្បៈ',
      },
      sections: {
        featured: 'បេតិកភណ្ឌលេចធ្លោ',
        featuredSubtitle: 'ស្វែងរកទីតាំងវប្បធម៌ពិសេស',
        articles: 'អត្ថបទថ្មីៗ',
        articlesSubtitle: 'ធ្វើបច្ចុប្បន្នភាពចំណេះដឹងវប្បធម៌',
        quickActions: 'ចូលប្រើរហ័ស',
      },
      quickActions: {
        map: 'ផែនទី',
        explore: 'ស្វែងរក',
        articles: 'អត្ថបទ',
      },
      admin: {
        title: 'អ្នកគ្រប់គ្រង',
        description: 'គ្រប់គ្រងមាតិកា និងការកំណត់ប្រព័ន្ធ',
      },
    },
    heritage: {
      title: 'បេតិកភណ្ឌវប្បធម៌',
      subtitle: 'បេតិកភណ្ឌខ្មែរកម្ពុជាក្រោម',
      stats: {
        locations: 'ទីតាំង',
        provinces: 'ខេត្ត',
        rating: 'ការវាយតម្លៃ',
      },
      categories: {
        all: 'ទាំងអស់',
        festival: 'ពិធីបុណ្យ',
        architecture: 'ស្ថាបត្យកម្ម',
        art: 'សិល្បៈ',
      },
      types: {
        all: 'បេតិកភណ្ឌទាំងអស់',
        tangible: 'បេតិកភណ្ឌរូបវន្ត',
        intangible: 'បេតិកភណ្ឌអរូបវន្ត',
      },
      listTitle: 'បេតិកភណ្ឌទាំងអស់',
      results: 'លទ្ធផល',
      viewDetail: 'មើលលម្អិត',
    },
    explore: {
      title: 'ស្វែងរក',
      subtitle: 'ស្វែងយល់បន្ថែមអំពីវប្បធម៌ខ្មែរកម្ពុជាក្រោម',
      collections: {
        title: 'ការប្រមូល',
        new: 'ថ្មីៗ',
        popular: 'ពេញនិយម',
        nearby: 'ជិតៗ',
        favorites: 'ចូលចិត្ត',
      },
      categories: {
        title: 'ប្រភេទ',
        temple: 'វត្ត',
        festival: 'ពិធីបុណ្យ',
        art: 'សិល្បៈ',
        tradition: 'ប្រពៃណី',
        cuisine: 'ម្ហូបអាហារ',
        music: 'តន្ត្រី',
      },
      featured: {
        title: 'លេចធ្លោ',
        subtitle: 'បេតិកភណ្ឌដែលត្រូវបានចូលចិត្តបំផុត',
      },
      articles: {
        title: 'អត្ថបទល្អៗ',
        subtitle: 'ចំណេះដឹងអំពីវប្បធម៌ខ្មែរ',
      },
      stats: {
        title: 'ស្ថិតិ',
        heritage: 'បេតិកភណ្ឌ',
        articles: 'អត្ថបទ',
        provinces: 'ខេត្ត',
      },
    },
    profile: {
      title: 'ប្រវត្តិរូប',
      guest: 'អ្នកប្រើប្រាស់',
      notLoggedIn: 'មិនទាន់ចូល',
      stats: {
        viewed: 'បានមើល',
        favorites: 'ចូលចិត្ត',
        reviews: 'ការវាយតម្លៃ',
      },
      language: {
        title: 'ភាសា',
        vietnamese: 'Tiếng Việt',
        khmer: 'ខ្មែរ',
        english: 'English',
      },
      menu: {
        title: 'ការកំណត់ & ជំនួយ',
        admin: 'អ្នកគ្រប់គ្រង',
        settings: 'ការកំណត់',
        notifications: 'ការជូនដំណឹង',
        favorites: 'ចូលចិត្ត',
        history: 'ប្រវត្តិ',
        help: 'ជំនួយ',
        about: 'អំពីយើង',
      },
      signOut: 'ចាកចេញ',
      login: 'ចូល',
      appInfo: 'កម្មវិធីបេតិកភណ្ឌខ្មែរ v1.0.0',
      copyright: '© 2026 វប្បធម៌ខ្មែរកម្ពុជាក្រោម',
    },
    map: {
      title: 'ផែនទីបេតិកភណ្ឌ',
      subtitle: 'ទីតាំងវប្បធម៌នៅលើផែនទី',
      mapTitle: 'ផែនទីអន្តរកម្ម',
      mapSubtitle: 'រួមបញ្ចូល Google Maps ឬ Leaflet',
      comingSoon: 'នឹងមកដល់ឆាប់ៗ',
      stats: {
        markers: 'ចំណុច',
        areas: 'តំបន់',
        distance: 'គម',
      },
      filter: 'ច្រោះតាមប្រភេទ',
      destinations: 'គោលដៅ',
    },
    messages: {
      loadingData: 'កំពុងផ្ទុកទិន្នន័យ...',
      errorOccurred: 'មានបញ្ហា',
      noResultsFound: 'រកមិនឃើញលទ្ធផល',
      tryDifferentSearch: 'សាកល្បងស្វែងរកដោយពាក្យគន្លឹះផ្សេង',
      tryDifferentCategory: 'សាកល្បងជ្រើសរើសប្រភេទផ្សេង',
    },
    admin: {
      dashboardTitle: 'អ្នកគ្រប់គ្រងបេតិកភណ្ឌ',
      articlesTitle: 'គ្រប់គ្រងអត្ថបទ',
      heritagesTitle: 'គ្រប់គ្រងបេតិកភណ្ឌ',
      totalArticles: 'អត្ថបទសរុប',
      pendingArticles: 'រង់ចាំអនុម័ត',
      viewsStats: 'ការចូលមើល',
      articlesLink: 'អត្ថបទ',
      heritagesLink: 'បេតិកភណ្ឌ',
      itemCount: ' ធាតុ',
      tabPending: 'រង់ចាំអនុម័ត',
      tabPublished: 'បានផ្សព្វផ្សាយ',
      tabRejected: 'បានបដិសេធ',
      emptyPending: 'គ្មានអត្ថបទរង់ចាំការអនុម័តទេ',
      emptyPublished: 'មិនទាន់មានអត្ថបទបានផ្សព្វផ្សាយទេ',
      emptyRejected: 'គ្មានអត្ថបទដែលត្រូវបានបដិសេធទេ',
      actionApprove: 'អនុម័ត',
      actionReject: 'បដិសេធ',
      actionEdit: 'កែសម្រួល',
      actionView: 'មើល',
      actionDelete: 'លុប',
      actionApproveAgain: 'អនុម័តឡើងវិញ',
      actionDeletePermanent: 'លុបជាស្ថាពរ',
      addNewArticle: 'បន្ថែមអត្ថបទថ្មី',
      addNewHeritage: 'បន្ថែមបេតិកភណ្ឌថ្មី',
      searchPlaceholderArticles: 'ស្វែងរកចំណងជើង អ្នកនិពន្ធ...',
      searchPlaceholderHeritages: 'ស្វែងរកឈ្មោះបេតិកភណ្ឌ ខេត្ត...',
      filterAll: 'ទាំងអស់',
      resultCountArticles: 'រកឃើញអត្ថបទចំនួន {count}',
      resultCountHeritages: 'លទ្ធផល {count}',
      refresh: 'ផ្ទុកឡើងវិញ',
      statusBadgePending: 'រង់ចាំអនុម័ត',
      statusBadgePublished: 'បានផ្សាយ',
      statusBadgeRejected: 'បដិសេធ',
      authorLabel: 'អ្នកនិពន្ធ: ',
      authorAnonymous: 'មិនស្គាល់ឈ្មោះ',
      reasonLabel: 'ហេតុផល: ',
      loading: 'កំពុងផ្ទុក...',
      processing: 'កំពុងដំណើរការ...',
      switchShow: 'បង្ហាញ',
      switchHide: 'លាក់',
      statsTotal: 'សរុប',
      statsTangible: 'រូបវន្ត',
      statsIntangible: 'អរូបវន្ត',
      statsSubtitle: '{total} បេតិកភណ្ឌ · {tangible} រូបវន្ត · {intangible} អរូបវន្ត',
      greetings: {
        morning: 'អរុណសួស្តី ☀️',
        morningSub: 'សូមជូនពរឱ្យមានថ្ងៃធ្វើការដែលពោរពេញដោយថាមពល!',
        afternoon: 'សួស្តីលោក Admin! ✨',
        afternoonSub: 'សូមជូនពរឱ្យការងារគ្រប់គ្រងរបស់អ្នកទទួលបានជោគជ័យ និងរីករាយ!',
        evening: 'សាយ័ណ្ហសួស្តី 🌙',
        eveningSub: 'សូមជូនពរឱ្យមានពេលល្ងាចដ៏រីករាយ និងសម្រាកលំហែកាយ!',
      },
      alerts: {
        confirmDeleteTitle: 'បញ្ជាក់ការលុប',
        confirmDeleteMsg: 'តើអ្នកប្រាកដជាចង់លុបមែនទេ?',
        cancel: 'បោះបង់',
        delete: 'លុប',
        success: 'ជោគជ័យ',
        error: 'កំហុស',
        deleteSuccess: 'លុបបានជោគជ័យ!',
        deleteError: 'មិនអាចលុបបានទេ!',
        rejectTitle: 'បដិសេធអត្ថបទ',
        rejectMsg: 'តើអ្នកចង់បដិសេធអត្ថបទនេះដោយសារមូលហេតុអ្វី?',
        rejectOptionAppropriate: 'បដិសេធ (មិនសមស្រប)',
        rejectOptionEdit: 'បដិសេធ (ត្រូវការកែសម្រួល)',
        rejectError: 'មិនអាចបដិសេធអត្ថបទបានទេ។',
        approveError: 'មិនអាចអនុម័តអត្ថបទបានទេ។',
        togglePublishError: 'មិនអាចផ្លាស់ប្តូរស្ថានភាពអត្ថបទបានទេ។',
      },
    },
  },
  en: {
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      noResults: 'No results found',
      seeAll: 'See all',
      search: 'Search',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      back: 'Back',
      next: 'Next',
      done: 'Done',
    },
    home: {
      title: 'Khmer Culture in Southern Vietnam',
      subtitle: 'Journey to discover unique cultural values',
      badge: '✨ Discover heritage',
      stats: {
        heritage: 'Heritage',
        articles: 'Articles',
        provinces: 'Provinces',
      },
      categories: {
        all: 'All',
        temple: 'Temple',
        festival: 'Festival',
        art: 'Art',
      },
      sections: {
        featured: 'Featured Heritage',
        featuredSubtitle: 'Discover special cultural sites',
        articles: 'Latest Articles',
        articlesSubtitle: 'Update cultural knowledge',
        quickActions: 'Quick Access',
      },
      quickActions: {
        map: 'Map',
        explore: 'Explore',
        articles: 'Articles',
      },
      admin: {
        title: 'Administrator',
        description: 'Manage content and system settings',
      },
    },
    heritage: {
      title: 'Cultural Heritage',
      subtitle: 'Khmer heritage in Southern Vietnam',
      stats: {
        locations: 'Locations',
        provinces: 'Provinces',
        rating: 'Rating',
      },
      categories: {
        all: 'All',
        festival: 'Festival',
        architecture: 'Architecture',
        art: 'Art',
      },
      types: {
        all: 'All Heritage',
        tangible: 'Tangible Heritage',
        intangible: 'Intangible Heritage',
      },
      listTitle: 'All heritage',
      results: 'results',
      viewDetail: 'View details',
    },
    explore: {
      title: 'Explore',
      subtitle: 'Learn more about Khmer culture in Southern Vietnam',
      collections: {
        title: 'Collections',
        new: 'New',
        popular: 'Popular',
        nearby: 'Nearby',
        favorites: 'Favorites',
      },
      categories: {
        title: 'Categories',
        temple: 'Temple',
        festival: 'Festival',
        art: 'Art',
        tradition: 'Tradition',
        cuisine: 'Cuisine',
        music: 'Music',
      },
      featured: {
        title: 'Featured',
        subtitle: 'Most loved heritage sites',
      },
      articles: {
        title: 'Great Articles',
        subtitle: 'Knowledge about Khmer culture',
      },
      stats: {
        title: 'Statistics',
        heritage: 'Heritage',
        articles: 'Articles',
        provinces: 'Provinces',
      },
    },
    profile: {
      title: 'Profile',
      guest: 'User',
      notLoggedIn: 'Not logged in',
      stats: {
        viewed: 'Viewed',
        favorites: 'Favorites',
        reviews: 'Reviews',
      },
      language: {
        title: 'Language',
        vietnamese: 'Tiếng Việt',
        khmer: 'ខ្មែរ',
        english: 'English',
      },
      menu: {
        title: 'Settings & Support',
        admin: 'Admin Panel',
        settings: 'Settings',
        notifications: 'Notifications',
        favorites: 'Favorites',
        history: 'History',
        help: 'Help',
        about: 'About us',
      },
      signOut: 'Sign out',
      login: 'Login',
      appInfo: 'Khmer Heritage App v1.0.0',
      copyright: '© 2026 Khmer Culture Southern Vietnam',
    },
    map: {
      title: 'Heritage Map',
      subtitle: 'cultural sites on the map',
      mapTitle: 'Interactive map',
      mapSubtitle: 'Integrated with Google Maps or Leaflet',
      comingSoon: 'Coming soon',
      stats: {
        markers: 'Markers',
        areas: 'Areas',
        distance: 'km',
      },
      filter: 'Filter by category',
      destinations: 'Destinations',
    },
    messages: {
      loadingData: 'Loading data...',
      errorOccurred: 'An error occurred',
      noResultsFound: 'No results found',
      tryDifferentSearch: 'Try searching with different keywords',
      tryDifferentCategory: 'Try selecting a different category',
    },
    admin: {
      dashboardTitle: 'Heritage Admin',
      articlesTitle: 'Manage Articles',
      heritagesTitle: 'Manage Heritage',
      totalArticles: 'TOTAL ARTICLES',
      pendingArticles: 'PENDING',
      viewsStats: 'TOTAL VIEWS',
      articlesLink: 'Articles',
      heritagesLink: 'Heritage',
      itemCount: ' items',
      tabPending: 'Pending',
      tabPublished: 'Published',
      tabRejected: 'Rejected',
      emptyPending: 'No articles pending approval',
      emptyPublished: 'No published articles yet',
      emptyRejected: 'No rejected articles',
      actionApprove: 'Approve',
      actionReject: 'Reject',
      actionEdit: 'Edit',
      actionView: 'View',
      actionDelete: 'Delete',
      actionApproveAgain: 'Re-approve',
      actionDeletePermanent: 'Delete Permanently',
      addNewArticle: 'Add New Article',
      addNewHeritage: 'Add New Heritage',
      searchPlaceholderArticles: 'Search title, author...',
      searchPlaceholderHeritages: 'Search heritage name, province...',
      filterAll: 'All',
      resultCountArticles: 'Found {count} articles',
      resultCountHeritages: '{count} results',
      refresh: 'Refresh',
      statusBadgePending: 'PENDING',
      statusBadgePublished: 'PUBLISHED',
      statusBadgeRejected: 'REJECTED',
      authorLabel: 'Author: ',
      authorAnonymous: 'Anonymous',
      reasonLabel: 'Reason: ',
      loading: 'Loading...',
      processing: 'Processing...',
      switchShow: 'Visible',
      switchHide: 'Hidden',
      statsTotal: 'Total',
      statsTangible: 'Tangible',
      statsIntangible: 'Intangible',
      statsSubtitle: '{total} heritage · {tangible} tangible · {intangible} intangible',
      greetings: {
        morning: 'Good morning ☀️',
        morningSub: 'Have an energetic working day!',
        afternoon: 'Hello Admin! ✨',
        afternoonSub: 'Wishing you a productive and joyful afternoon of management!',
        evening: 'Good evening 🌙',
        eveningSub: 'Wish you a relaxing evening!',
      },
      alerts: {
        confirmDeleteTitle: 'Confirm Delete',
        confirmDeleteMsg: 'Are you sure you want to delete this?',
        cancel: 'Cancel',
        delete: 'Delete',
        success: 'Success',
        error: 'Error',
        deleteSuccess: 'Deleted successfully!',
        deleteError: 'Failed to delete!',
        rejectTitle: 'Reject Article',
        rejectMsg: 'What is the reason for rejecting this article?',
        rejectOptionAppropriate: 'Reject (Inappropriate)',
        rejectOptionEdit: 'Reject (Needs Editing)',
        rejectError: 'Failed to reject article.',
        approveError: 'Failed to approve article.',
        togglePublishError: 'Failed to change article status.',
      },
    },
  },
};
