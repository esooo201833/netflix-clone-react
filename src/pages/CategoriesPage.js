import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import { useGenres } from '../hooks/useGenres';
import { useFavorites } from '../hooks/useFavorites';
import Header from '../components/Header';

const API_KEY = 'e5f2031436e3dfd50691582983faaca0';
const BASE_URL = 'https://api.themoviedb.org/3';

function CategoriesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { genres } = useGenres(lang);
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchMoviesByGenre(id);
    }
  }, [id, lang]);

  const fetchMoviesByGenre = async (gid) => {
    setLoading(true);
    try {
      const langParam = lang === 'ar' ? 'ar-SA' : 'en-US';
      const res = await fetch(
        `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${gid}&language=${langParam}&sort_by=popularity.desc&page=1`
      );
      const data = await res.json();
      setMovies(data.results || []);
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  const genreName = genres.find(g => g.id === parseInt(id))?.name || t('movies');

  return (
    <div className="min-h-screen bg-esl-black pt-24" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Header />
      
      <div className="px-4 md:px-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
        >
          <FaArrowLeft className={lang === 'ar' ? 'rotate-180' : ''} />
          {t('back')}
        </button>

        <h1 className="text-3xl font-bold mb-6">{genreName}</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-16 h-16 border-4 border-esl-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map(movie => (
              <div key={movie.id} className="group relative">
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
                      <div className="w-full h-full flex items-center justify-center text-gray-500">🎬</div>
                    )}
                    <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-sm font-semibold text-green-400">
                      {Math.round(movie.vote_average * 10)}%
                    </div>
                  </div>
                  <h3 className="font-semibold text-white line-clamp-1 group-hover:text-esl-light-blue transition">{movie.title}</h3>
                  <p className="text-sm text-gray-500">{movie.release_date?.split('-')[0]}</p>
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
        )}
      </div>
    </div>
  );
}

export default CategoriesPage;