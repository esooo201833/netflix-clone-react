import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlay, FaPlus, FaArrowLeft, FaStar, FaClock, FaCalendar, FaHeart } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import { useFavorites } from '../hooks/useFavorites';
import Header from '../components/Header';

const API_KEY = 'e5f2031436e3dfd50691582983faaca0';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/original';

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovieDetails();
    window.scrollTo(0, 0);
  }, [id, lang]);

  const fetchMovieDetails = async () => {
    setLoading(true);
    try {
      const langParam = lang === 'ar' ? 'ar-SA' : 'en-US';
      
      const [movieRes, creditsRes, similarRes] = await Promise.all([
        fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=${langParam}&append_to_response=videos,external_ids`),
        fetch(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=${langParam}`),
        fetch(`${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}&language=${langParam}&page=1`)
      ]);

      const movieData = await movieRes.json();
      const creditsData = await creditsRes.json();
      const similarData = await similarRes.json();

      setMovie(movieData);
      setCast(creditsData.cast.slice(0, 10));
      setSimilar(similarData.results.slice(0, 6));
    } catch (error) {
      console.log('Error:', error);
    }
    setLoading(false);
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return lang === 'ar' ? `${hours}س ${mins}د` : `${hours}h ${mins}m`;
  };

  const getTrailer = () => {
    if (!movie?.videos?.results) return null;
    return movie.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-esl-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-esl-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!movie) return null;

  const trailer = getTrailer();
  const fav = isFavorite(movie.id);

  return (
    <div className="min-h-screen bg-esl-black" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Header />
      
      <button 
        onClick={() => navigate(-1)}
        className="fixed top-24 left-4 md:left-8 z-40 flex items-center gap-2 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full backdrop-blur-sm transition"
      >
        <FaArrowLeft className={lang === 'ar' ? 'rotate-180' : ''} />
        {t('back')}
      </button>

      <div className="relative h-[70vh] w-full">
        <div className="absolute inset-0">
          <img 
            src={`${IMAGE_BASE}${movie.backdrop_path}`} 
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-${lang === 'ar' ? 'l' : 'r'} from-esl-black via-esl-black/60 to-transparent`} />
          <div className="absolute inset-0 bg-gradient-to-t from-esl-black via-transparent to-transparent" />
        </div>

        <div className="relative h-full flex items-end px-4 md:px-12 pb-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
              <span className="text-green-400 font-semibold flex items-center gap-1">
                <FaStar className="text-yellow-400" />
                {movie.vote_average?.toFixed(1)}
              </span>
              <span className="text-gray-300 flex items-center gap-1">
                <FaCalendar />
                {movie.release_date?.split('-')[0]}
              </span>
              <span className="text-gray-300 flex items-center gap-1">
                <FaClock />
                {formatRuntime(movie.runtime)}
              </span>
              {movie.genres?.map(g => (
                <span key={g.id} className="border border-gray-500 px-2 py-0.5 rounded text-xs">
                  {g.name}
                </span>
              ))}
            </div>

            <p className="text-lg text-gray-200 mb-6 line-clamp-3">{movie.overview}</p>

            <div className="flex flex-wrap items-center gap-4">
              {/* زرار شاهد الآن */}
              <button 
                onClick={() => navigate(`/watch/${movie.id}`)}
                className="flex items-center gap-2 bg-esl-blue text-white px-8 py-3 rounded font-semibold hover:bg-esl-light-blue transition"
              >
                <FaPlay />
                {lang === 'ar' ? 'شاهد الآن' : 'Watch Now'}
              </button>

              {/* زرار التريلر */}
              {trailer && (
                <a 
                  href={`https://youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded font-semibold hover:bg-gray-200 transition"
                >
                  <FaPlay />
                  {lang === 'ar' ? 'التريلر' : 'Trailer'}
                </a>
              )}
              
              {/* زرار المفضلة */}
              <button 
                onClick={() => toggleFavorite(movie)}
                className={`flex items-center gap-2 px-6 py-3 rounded font-semibold transition ${
                  fav
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-500/70 text-white hover:bg-gray-500/50 backdrop-blur-sm'
                }`}
              >
                <FaHeart className={fav ? 'fill-current' : ''} />
                {fav ? (lang === 'ar' ? 'في القائمة' : 'In List') : t('myList')}
              </button>
            </div>

            {/* IMDb ID لو موجود */}
            {movie.imdb_id && (
              <div className="mt-4 text-sm text-gray-500">
                IMDb: {movie.imdb_id}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* المحتوى */}
      <div className="px-4 md:px-12 py-8">
        {/* طاقم التمثيل */}
        {cast.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">
              {lang === 'ar' ? 'طاقم التمثيل' : 'Cast'}
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {cast.map(actor => (
                <div key={actor.id} className="flex-none w-24 text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-2 bg-esl-dark">
                    {actor.profile_path ? (
                      <img 
                        src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                        alt={actor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl">
                        {actor.name[0]}
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium truncate">{actor.name}</p>
                  <p className="text-xs text-gray-400 truncate">{actor.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* أفلام مشابهة */}
        {similar.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">
              {lang === 'ar' ? 'أفلام مشابهة' : 'More Like This'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {similar.map(similarMovie => (
                <div 
                  key={similarMovie.id}
                  onClick={() => navigate(`/movie/${similarMovie.id}`)}
                  className="cursor-pointer group"
                >
                  <div className="aspect-[2/3] rounded-lg overflow-hidden mb-2">
                    <img 
                      src={`https://image.tmdb.org/t/p/w500${similarMovie.poster_path}`}
                      alt={similarMovie.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-sm font-medium line-clamp-1 group-hover:text-esl-light-blue transition">
                    {similarMovie.title}
                  </h3>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default MovieDetails;