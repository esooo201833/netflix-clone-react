import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaFire, FaStar } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import { useFavorites } from '../hooks/useFavorites';
import Header from '../components/Header';

const API_KEY = 'e5f2031436e3dfd50691582983faaca0';
const BASE_URL = 'https://api.themoviedb.org/3';

function PopularPage() {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPopularMovies();
  }, [lang, page]);

  const fetchPopularMovies = async () => {
    setLoading(true);
    try {
      const langParam = lang === 'ar' ? 'ar-SA' : 'en-US';
      const res = await fetch(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=${langParam}&page=${page}`
      );
      const data = await res.json();
      
      if (page === 1) {
        setMovies(data.results || []);
      } else {
        setMovies(prev => [...prev, ...(data.results || [])]);
      }
      
      setHasMore(data.page < data.total_pages);
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-esl-black pt-24" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Header />
      
      <div className="px-4 md:px-12">
        {/* Header */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
        >
          <FaArrowLeft className={lang === 'ar' ? 'rotate-180' : ''} />
          {t('back')}
        </button>

        <div className="flex items-center gap-3 mb-8">
          <FaFire className="text-orange-500 text-3xl" />
          <h1 className="text-3xl font-bold">{t('popular')}</h1>
        </div>

        {/* Movies Grid */}
        {loading && page === 1 ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {movies.map((movie, index) => (
                <div key={`${movie.id}-${index}`} className="group relative">
                  {/* Ranking Number */}
                  <div className="absolute -top-2 -left-2 z-10 w-8 h-8 bg-esl-blue rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>

                  <div 
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    className="cursor-pointer"
                  >
                    <div className="aspect-[2/3] rounded-lg overflow-hidden mb-2 bg-esl-dark relative">
                      {movie.poster_path ? (
                        <img 
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-4xl">
                          🎬
                        </div>
                      )}
                      
                      {/* Rating Badge */}
                      <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded flex items-center gap-1">
                        <FaStar className="text-yellow-400 text-xs" />
                        <span className="text-xs font-semibold">{movie.vote_average?.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-white line-clamp-1 group-hover:text-esl-light-blue transition">
                      {movie.title}
                    </h3>
                    <p className="text-sm text-gray-500">{movie.release_date?.split('-')[0]}</p>
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(movie);
                    }}
                    className={`absolute top-2 left-10 p-2 rounded-full transition ${
                      isFavorite(movie.id) 
                        ? 'bg-red-500 text-white' 
                        : 'bg-black/50 text-white opacity-0 group-hover:opacity-100 hover:bg-red-500'
                    }`}
                  >
                    <svg className="w-4 h-4" fill={isFavorite(movie.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="bg-esl-dark hover:bg-esl-blue text-white px-8 py-3 rounded-full transition disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      {lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                    </span>
                  ) : (
                    lang === 'ar' ? 'تحميل المزيد' : 'Load More'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default PopularPage;