import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';

function MovieCard({ movie, index }) {
  const nav = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  let fav = isFavorite(movie.id);
  
  let delayClass = '';
  if (index % 5 === 0) delayClass = 'stagger-1';
  else if (index % 5 === 1) delayClass = 'stagger-2';
  else if (index % 5 === 2) delayClass = 'stagger-3';
  else if (index % 5 === 3) delayClass = 'stagger-4';
  else delayClass = 'stagger-5';

  function handleClick() {
    nav('/movie/' + movie.id);
  }

  function handleHeartClick(e) {
    e.stopPropagation();
    toggleFavorite(movie);
  }

  return (
    <div 
      className={`card-hover fade-in ${delayClass} group relative bg-gray-900 rounded-lg overflow-hidden`}
      style={{ animationFillMode: 'both' }}
    >
      <div onClick={handleClick} className="cursor-pointer">
        <div className="aspect-[2/3] relative overflow-hidden">
          {movie.poster_path ? (
            <img 
              src={'https://image.tmdb.org/t/p/w500' + movie.poster_path}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-600 text-4xl">
              🎬
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button className="pulse-btn bg-white text-black w-full py-2 rounded font-bold text-sm">
              شاهد الآن
            </button>
          </div>
        </div>
        
        <div className="p-2">
          <h3 className="text-white font-medium text-sm truncate group-hover:text-blue-400 transition-colors">
            {movie.title}
          </h3>
          <p className="text-gray-500 text-xs mt-1">
            {movie.release_date ? movie.release_date.split('-')[0] : '???'}
          </p>
        </div>
      </div>

      <button
        onClick={handleHeartClick}
        className={`
          absolute top-2 right-2 p-2 rounded-full transition-all duration-200
          ${fav ? 'bg-red-600 text-white scale-110' : 'bg-black/50 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600'}
        `}
        style={fav ? {animation: 'bounceIn 0.4s ease'} : {}}
      >
        <svg className="w-4 h-4" fill={fav ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {movie.vote_average > 7 && (
        <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded font-bold">
          {Math.round(movie.vote_average * 10)}%
        </span>
      )}
    </div>
  );
}

export default MovieCard;