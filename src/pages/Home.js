import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaInfoCircle } from 'react-icons/fa';
import Header from '../components/Header';
import MovieCard from '../components/MovieCard';
import { useLanguage } from '../context/LanguageContext';

const API_KEY = 'e5f2031436e3dfd50691582983faaca0';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/original';

function Home() {
  const [movies, setMovies] = useState([]);
  const [hero, setHero] = useState(null);
  const { lang, t } = useLanguage();
  const nav = useNavigate();

  useEffect(() => {
    fetch(BASE_URL + '/trending/movie/week?api_key=' + API_KEY + '&language=' + (lang === 'ar' ? 'ar-SA' : 'en-US'))
      .then(res => res.json())
      .then(data => {
        setMovies(data.results || []);
        setHero(data.results[0]);
      })
      .catch(err => console.log('error:', err));
  }, [lang]);

  if (!hero) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-black" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Header />
      
      <div className="relative h-[85vh] w-full slide-right">
        <div className="absolute inset-0">
          <img src={IMAGE_BASE + hero.backdrop_path} alt="" className="w-full h-full object-cover" />
          <div className={'absolute inset-0 bg-gradient-to-' + (lang === 'ar' ? 'l' : 'r') + ' from-black via-black/50 to-transparent'} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        <div className="relative h-full flex items-center px-4 md:px-12 pt-20">
          <div className="max-w-2xl bounce-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight float-y">
              {hero.title}
            </h1>
            
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-300">
              <span className="text-green-400 font-bold">{Math.round(hero.vote_average * 10)}% {lang === 'ar' ? 'تطابق' : 'Match'}</span>
              <span>{hero.release_date?.split('-')[0]}</span>
              <span className="border border-gray-500 px-1 rounded text-xs">+16</span>
            </div>

            <p className="text-lg text-gray-200 mb-8 line-clamp-3">{hero.overview}</p>

            <div className="flex gap-4">
              <button onClick={() => nav('/watch/' + hero.id)} className="glow flex items-center gap-2 bg-white text-black px-8 py-3 rounded font-bold hover:bg-gray-200 transition">
                <FaPlay /> {t('play')}
              </button>
              <button onClick={() => nav('/movie/' + hero.id)} className="flex items-center gap-2 bg-gray-500/70 text-white px-8 py-3 rounded font-bold hover:bg-gray-500/50 backdrop-blur-sm transition">
                <FaInfoCircle /> {t('moreInfo')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-12 py-8">
        <h2 className="text-2xl font-bold mb-6">{lang === 'ar' ? 'الأكثر شيوعاً' : 'Trending Now'}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.slice(1).map((m, i) => (
            <MovieCard key={m.id} movie={m} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;