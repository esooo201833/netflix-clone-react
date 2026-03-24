import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlay } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const API_KEY = 'e5f2031436e3dfd50691582983faaca0';
const TMDB_BASE = 'https://api.themoviedb.org/3';

function WatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    try {
      const res = await fetch(
        `${TMDB_BASE}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`
      );
      const data = await res.json();
      setMovie(data);

      
      const trailers = data.videos?.results?.filter(
        v => v.site === 'YouTube' && v.type === 'Trailer'
      );
      setTrailer(trailers?.[0] || null);
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <p>Film not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-white/10">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white/10 rounded-full transition"
        >
          <FaArrowLeft className={lang === 'ar' ? 'rotate-180' : ''} />
        </button>
        <h1 className="text-lg font-medium truncate">{movie.title}</h1>
      </div>

      {}
      <div className="w-full aspect-video bg-black">
        {trailer ? (
          <iframe
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
            className="w-full h-full"
            allowFullScreen
            title={movie.title}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/50">
            <FaPlay className="text-4xl mb-4" />
            <p>{lang === 'ar' ? 'لا يوجد تريلر متاح' : 'No trailer available'}</p>
          </div>
        )}
      </div>

      {}
      <div className="px-6 py-6 max-w-3xl">
        <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
        <p className="text-white/60 text-sm leading-relaxed mb-4">
          {movie.overview}
        </p>
        <div className="flex gap-4 text-sm text-white/40">
          <span>{movie.release_date?.split('-')[0]}</span>
          <span>•</span>
          <span>{Math.round(movie.vote_average * 10)}% rating</span>
          <span>•</span>
          <span>{movie.runtime} min</span>
        </div>
      </div>
    </div>
  );
}

export default WatchPage;