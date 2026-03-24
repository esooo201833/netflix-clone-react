import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    home: 'Home',
    movies: 'Movies',
    series: 'Series',
    popular: 'Popular',
    myList: 'My List',
    search: 'Search',
    play: 'Play',
    moreInfo: 'More Info',
    trending: 'Trending Now',
    topRated: 'Top Rated',
    eslmovies: 'ESL MOVIES',
    viewAll: 'View All',
    back: 'Back',
    yourListEmpty: 'Your list is empty',
    clickHeart: 'Click the heart to add movies',
    browseMovies: 'Browse Movies',
    remove: 'Remove'
  },
  ar: {
    home: 'الرئيسية',
    movies: 'أفلام',
    series: 'مسلسلات',
    popular: 'الأكثر شهرة',
    myList: 'قائمتي',
    search: 'بحث',
    play: 'تشغيل',
    moreInfo: 'المزيد من المعلومات',
    trending: 'الأكثر شيوعاً الآن',
    topRated: 'الأعلى تقييماً',
    eslmovies: 'ESL MOVIES',
    viewAll: 'عرض الكل',
    back: 'رجوع',
    yourListEmpty: 'قائمتك فارغة',
    clickHeart: 'اضغط على القلب لإضافة أفلام',
    browseMovies: 'تصفح الأفلام',
    remove: 'إزالة'
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('ar');

  const t = (key) => {
    return translations[lang][key] || key;
  };

  const toggleLang = () => {
    setLang(prev => prev === 'ar' ? 'en' : 'ar');
  };

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}