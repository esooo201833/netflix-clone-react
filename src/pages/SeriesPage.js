import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useLanguage } from '../context/LanguageContext';
import { useFavorites } from '../hooks/useFavorites';

const API_KEY = 'e5f2031436e3dfd50691582983faaca0';
const BASE_URL = 'https://api.themoviedb.org/3';

function SeriesPage() {
  const nav = useNavigate();
  const { lang, t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedSeries, setSelectedSeries] = useState(null);

  useEffect(() => {
    loadSeries();
  }, [lang, page]);

  const loadSeries = async () => {
    setLoading(true);
    try {
      let url = BASE_URL + '/tv/popular?api_key=' + API_KEY + '&language=' + (lang === 'ar' ? 'ar-SA' : 'en-US') + '&page=' + page;
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (page === 1) {
        setSeries(data.results);
        if (data.results.length > 0) {
          setSelectedSeries(data.results[0]);
        }
      } else {
        setSeries([...series, ...data.results]);
      }
    } catch (err) {
      console.log('error loading series:', err);
    }
    setLoading(false);
  };

  const loadMore = () => {
    setPage(page + 1);
  };

  const handleSeriesClick = (s) => {
    setSelectedSeries(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToDetails = (id) => {
    nav('/series/' + id);
  };

  if (loading && page === 1) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Header />
      
      {selectedSeries && (
        <div className="relative h-[70vh] w-full mt-16">
          <div className="absolute inset-0">
            <img 
              src={'https://image.tmdb.org/t/p/original' + (selectedSeries.backdrop_path || selectedSeries.poster_path)} 
              className="w-full h-full object-cover"
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black"></div>
          </div>
          
          <div className="relative h-full flex items-end pb-12 px-6 md:px-12">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{selectedSeries.name}</h1>
              <p className="text-gray-300 text-lg mb-2">
                {selectedSeries.first_air_date ? selectedSeries.first_air_date.split('-')[0] : ''} | 
                {selectedSeries.vote_average ? ' ⭐ ' + selectedSeries.vote_average.toFixed(1) : ''}
              </p>
              <p className="text-gray-400 mb-6 line-clamp-3">{selectedSeries.overview}</p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => goToDetails(selectedSeries.id)}
                  className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200"
                >
                  {lang === 'ar' ? 'شاهد الحلقات' : 'Watch Episodes'}
                </button>
                <button 
                  onClick={() => toggleFavorite(selectedSeries)}
                  className="bg-gray-700 text-white px-6 py-2 rounded font-bold hover:bg-gray-600"
                >
                  {isFavorite(selectedSeries.id) ? (lang === 'ar' ? 'في المفضلة' : 'In List') : (lang === 'ar' ? 'اضف للمفضلة' : 'Add to List')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="px-6 md:px-12 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">{lang === 'ar' ? 'المسلسلات الشائعة' : 'Popular Series'}</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {series.map((s, index) => (
            <div 
              key={s.id + '-' + index} 
              className="relative group cursor-pointer"
              onClick={() => handleSeriesClick(s)}
            >
              <div className="aspect-[2/3] rounded overflow-hidden bg-gray-800">
                {s.poster_path ? (
                  <img 
                    src={'https://image.tmdb.org/t/p/w500' + s.poster_path}
                    alt={s.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-3xl">📺</div>
                )}
              </div>
              
              <div className="mt-2">
                <h3 className="text-white font-medium truncate group-hover:text-blue-400">{s.name}</h3>
                <p className="text-gray-500 text-sm">{s.first_air_date ? s.first_air_date.split('-')[0] : ''}</p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(s);
                }}
                className="absolute top-2 right-2 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <svg className="w-4 h-4 text-white" fill={isFavorite(s.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {loading && page > 1 && (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {!loading && (
          <div className="text-center mt-8">
            <button 
              onClick={loadMore}
              className="bg-gray-800 text-white px-8 py-3 rounded hover:bg-gray-700 transition"
            >
              {lang === 'ar' ? 'تحميل المزيد' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SeriesPage;