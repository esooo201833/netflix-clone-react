import React from 'react';
import { FaPlay, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

function Hero({ movie }) {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  
  if (!movie) return null;

  const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;

  return (
    <div className="relative h-[85vh] w-full">
      <div className="absolute inset-0">
        <img 
          src={backdropUrl} 
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-${lang === 'ar' ? 'l' : 'r'} from-esl-black via-esl-black/50 to-transparent`} />
        <div className="absolute inset-0 bg-gradient-to-t from-esl-black via-transparent to-transparent" />
      </div>

      <div className="relative h-full flex items-center px-4 md:px-12 pt-20">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
            {movie.title}
          </h1>
          
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-300">
            <span className="text-green-400 font-semibold">
              {Math.round(movie.vote_average * 10)}% {lang === 'ar' ? 'تطابق' : 'Match'}
            </span>
            <span>{movie.release_date?.split('-')[0]}</span>
            <span className="border border-gray-500 px-1 rounded text-xs">+16</span>
            <span>{lang === 'ar' ? '2 ساعة 15 دقيقة' : '2h 15m'}</span>
          </div>

          <p className="text-lg text-gray-200 mb-8 line-clamp-3 leading-relaxed">
            {movie.overview}
          </p>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(`/movie/${movie.id}`)}
              className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded font-semibold hover:bg-gray-200 transition"
            >
              <FaPlay />
              {t('play')}
            </button>
            <button 
              onClick={() => navigate(`/movie/${movie.id}`)}
              className="flex items-center gap-2 bg-gray-500/70 text-white px-8 py-3 rounded font-semibold hover:bg-gray-500/50 transition backdrop-blur-sm"
            >
              <FaInfoCircle />
              {t('moreInfo')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;