import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaSearch, FaArrowLeft, FaStar, FaCalendar } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import { useFavorites } from '../hooks/useFavorites';
import Header from '../components/Header';

const API_KEY = 'e5f2031436e3dfd50691582983faaca0';
const BASE_URL = 'https://api.themoviedb.org/3';

function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const query = searchParams.get('q') || '';
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    if (query) {
      searchMovies(query);
    }
  }, [query, lang]);

  const searchMovies = async (searchQuery) => {
    setLoading(true);
    try {
      const langParam = lang === 'ar' ? 'ar-SA' : 'en-US';
      const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&language=${langParam}&page=1`
      );
      const data = await response.json();
      setMovies(data.results || []);
    } catch (error) {
      console.log('Search error:', error);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput)}`);
    }
  };

  return (
    <div className="min-h-screen bg-esl-black pt-24" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Header />
      
      <div className="px-4 md:px-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
        >
          <FaArrowLeft className={lang === 'ar' ? 'rotate-180' : ''} />
          {lang === 'ar' ? 'رجوع' : 'Back'}
        </button>

        <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={lang === 'ar' ? 'ابحث عن أفلام...' : 'Search for movies...'}
              className="w-full bg-esl-dark border-2 border-gray-600 text-white text-xl px-6 py-4 rounded-lg focus:outline-none focus:border-esl-light-blue transition"
            />
            <button 
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <FaSearch className="text-2xl" />
            </button>
          </div>
        </form>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-16 h-16 border-4 border-esl-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {query && (
              <h2 className="text-2xl font-bold mb-6 text-gray-300">
                {lang === 'ar' ? `نتائج البحث عن: "${query}"` : `Search results for: "${query}"`}
                <span className="text-sm font-normal text-gray-500 mr-2">({movies.length} {lang === 'ar' ? 'نتيجة' : 'results'})</span>
              </h2>
            )}

            {movies.length === 0 && query && !loading && (
              <div className="text-center py-20">
                <FaSearch className="text-6xl text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl text-gray-400 mb-2">
                  {lang === 'ar' ? 'لا توجد نتائج' : 'No results found'}
                </h3>
                <p className="text-gray-500">
                  {lang === 'ar' ? 'جرب كلمة بحث مختلفة' : 'Try a different search term'}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {movies.map((movie) => (
                <div key={movie.id} className="group relative">
                  <div 
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    className="cursor-pointer"
                  >
                    <div className="aspect-[2/3] rounded-lg overflow-hidden mb-3 bg-esl-dark relative">
                      {movie.poster_path ? (
                        <img 
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          <span className="text-4xl">🎬</span>
                        </div>
                      )}
                      
                      <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-sm font-semibold flex items-center gap-1">
                        <FaStar className="text-yellow-400 text-xs" />
                        {movie.vote_average?.toFixed(1)}
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-white mb-1 line-clamp-1 group-hover:text-esl-light-blue transition">
                      {movie.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <FaCalendar className="text-xs" />
                      <span>{movie.release_date?.split('-')[0] || 'N/A'}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(movie);
                    }}
                    className={`absolute top-2 left-2 p-2 rounded-full transition ${
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
          </>
        )}
      </div>
    </div>
  );
}

export default SearchPage;