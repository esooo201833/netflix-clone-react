import React, { useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import useFavorites from '../hooks/useFavorites';

function MovieRow({ title, movies }) {
  const rowRef = useRef(null);
  const { t, lang } = useLanguage();

  const scroll = (direction) => {
    if (rowRef.current) {
      const scrollAmount = direction === 'left' ? -rowRef.current.clientWidth : rowRef.current.clientWidth;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="px-4 md:px-12 py-6">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white flex items-center gap-2">
        {t(title)}
        <span className="text-esl-light-blue text-sm font-normal cursor-pointer hover:underline">
          {t('viewAll')}
        </span>
      </h2>

      <div className="relative group">
        <button 
          onClick={() => scroll(lang === 'ar' ? 'right' : 'left')}
          className="absolute left-0 top-0 bottom-0 z-40 bg-black/50 w-12 opacity-0 group-hover:opacity-100 transition flex items-center justify-center hover:bg-black/70"
        >
          {lang === 'ar' ? <FaChevronRight className="text-white text-2xl" /> : <FaChevronLeft className="text-white text-2xl" />}
        </button>

        <button 
          onClick={() => scroll(lang === 'ar' ? 'left' : 'right')}
          className="absolute right-0 top-0 bottom-0 z-40 bg-black/50 w-12 opacity-0 group-hover:opacity-100 transition flex items-center justify-center hover:bg-black/70"
        >
          {lang === 'ar' ? <FaChevronLeft className="text-white text-2xl" /> : <FaChevronRight className="text-white text-2xl" />}
        </button>

        <div 
          ref={rowRef}
          className="flex gap-4 overflow-x-scroll scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MovieCard({ movie }) {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image';

  const fav = isFavorite(movie.id);

  return (
    <div 
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="relative flex-none w-[160px] md:w-[200px] cursor-pointer group/card"
    >
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden transition-transform duration-300 group-hover/card:scale-105 group-hover/card:z-50">
        <img 
          src={posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          <h3 className="font-semibold text-sm mb-1 line-clamp-2">{movie.title}</h3>
          <div className="flex items-center justify-between text-xs text-gray-300">
            <span className="text-green-400">{Math.round(movie.vote_average * 10)}%</span>
            <span>{movie.release_date?.split('-')[0]}</span>
          </div>
          <div className="flex gap-2 mt-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(movie);
              }}
              className={`rounded-full p-1.5 transition ${fav ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'}`}
            >
              <svg className="w-4 h-4" fill={fav ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button 
              onClick={(e) => e.stopPropagation()}
              className="bg-white text-black rounded-full p-1.5 hover:bg-gray-200"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieRow;