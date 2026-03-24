import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHeart, FaTrash } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import { useFavorites } from '../hooks/useFavorites';
import Header from '../components/Header';

function FavoritesPage() {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { favorites, removeFavorite, ready } = useFavorites();

  
  if (!ready) {
    return (
      <div className="min-h-screen bg-esl-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-esl-black pt-24" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Header />
      
      <div className="px-6 md:px-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
        >
          <FaArrowLeft className={lang === 'ar' ? 'rotate-180' : ''} />
          {t('back')}
        </button>

        <div className="flex items-center gap-3 mb-8">
          <FaHeart className="text-red-500 text-3xl" />
          <h1 className="text-3xl font-bold">{t('myList')}</h1>
          <span className="text-gray-500 text-lg">({favorites.length})</span>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <FaHeart className="text-6xl text-gray-700 mx-auto mb-4" />
            <h2 className="text-xl text-gray-400 mb-2">{t('yourListEmpty')}</h2>
            <p className="text-gray-600 mb-6">{t('clickHeart')}</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-white text-black px-6 py-3 rounded hover:bg-gray-200 transition font-medium"
            >
              {t('browseMovies')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {favorites.map(movie => (
              <div key={movie.id} className="group relative">
                <div 
                  onClick={() => navigate(`/movie/${movie.id}`)}
                  className="cursor-pointer"
                >
                  <div className="aspect-[2/3] rounded-lg overflow-hidden mb-2 bg-gray-800">
                    {movie.poster_path ? (
                      <img 
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-3xl">
                        🎬
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium text-white truncate group-hover:text-gray-300 transition">
                    {movie.title}
                  </h3>
                </div>

                <button
                  onClick={() => removeFavorite(movie.id)}
                  className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                  title={t('remove')}
                >
                  <FaTrash className="text-sm" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoritesPage;