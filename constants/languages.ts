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
  },
};
