import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlay, FaHeart, FaStar, FaCalendar } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import { useFavorites } from '../hooks/useFavorites';
import Header from '../components/Header';

const API_KEY = 'e5f2031436e3dfd50691582983faaca0';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/original';

function SeriesDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const { lang, t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const [series, setSeries] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    loadSeriesData();
  }, [id, lang]);

  const loadSeriesData = async () => {
    setLoading(true);
    try {
      let langParam = lang === 'ar' ? 'ar-SA' : 'en-US';
      
      let res1 = await fetch(BASE_URL + '/tv/' + id + '?api_key=' + API_KEY + '&language=' + langParam + '&append_to_response=videos');
      let data1 = await res1.json();
      setSeries(data1);
      setSeasons(data1.seasons || []);
      
      if (data1.seasons && data1.seasons.length > 0) {
        loadEpisodes(data1.seasons[0].season_number);
      }
      
      let res2 = await fetch(BASE_URL + '/tv/' + id + '/similar?api_key=' + API_KEY + '&language=' + langParam + '&page=1');
      let data2 = await res2.json();
      setSimilar(data2.results.slice(0, 6));
    } catch (err) {
      console.log('error:', err);
    }
    setLoading(false);
  };

  const loadEpisodes = async (seasonNum) => {
    try {
      let langParam = lang === 'ar' ? 'ar-SA' : 'en-US';
      let res = await fetch(BASE_URL + '/tv/' + id + '/season/' + seasonNum + '?api_key=' + API_KEY + '&language=' + langParam);
      let data = await res.json();
      setEpisodes(data.episodes || []);
      setSelectedSeason(seasonNum);
    } catch (err) {
      console.log('error loading episodes:', err);
    }
  };

  const getTrailer = () => {
    if (!series || !series.videos || !series.videos.results) return null;
    for (let i = 0; i < series.videos.results.length; i++) {
      if (series.videos.results[i].type === 'Trailer' && series.videos.results[i].site === 'YouTube') {
        return series.videos.results[i];
      }
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!series) return null;

  let trailer = getTrailer();
  let fav = isFavorite(series.id);

  return (
    <div className="min-h-screen bg-black" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Header />
      
      <button 
        onClick={() => nav(-1)}
        className="fixed top-24 left-4 z-40 flex items-center gap-2 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full backdrop-blur-sm transition"
      >
        <FaArrowLeft className={lang === 'ar' ? 'rotate-180' : ''} />
        {t('back')}
      </button>

      <div className="relative h-[70vh] w-full">
        <div className="absolute inset-0">
          <img 
            src={IMAGE_BASE + (series.backdrop_path || series.poster_path)} 
            alt={series.name}
            className="w-full h-full object-cover"
          />
          <div className={'absolute inset-0 bg-gradient-to-' + (lang === 'ar' ? 'l' : 'r') + ' from-black via-black/60 to-transparent'} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        <div className="relative h-full flex items-end px-4 md:px-12 pb-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{series.name}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
              <span className="text-green-400 font-bold flex items-center gap-1">
                <FaStar className="text-yellow-400" />
                {series.vote_average ? series.vote_average.toFixed(1) : '0'}
              </span>
              <span className="text-gray-300 flex items-center gap-1">
                <FaCalendar />
                {series.first_air_date ? series.first_air_date.split('-')[0] : ''}
              </span>
              <span className="text-gray-300">
                {series.number_of_seasons} {lang === 'ar' ? 'مواسم' : 'Seasons'}
              </span>
              <span className="text-gray-300">
                {series.number_of_episodes} {lang === 'ar' ? 'حلقات' : 'Episodes'}
              </span>
            </div>

            <p className="text-lg text-gray-200 mb-6 line-clamp-3">{series.overview}</p>

            <div className="flex flex-wrap gap-4">
              {trailer && (
                <a 
                  href={'https://youtube.com/watch?v=' + trailer.key}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded font-bold hover:bg-gray-200 transition"
                >
                  <FaPlay />
                  {lang === 'ar' ? 'التريلر' : 'Trailer'}
                </a>
              )}
              
              <button 
                onClick={() => toggleFavorite(series)}
                className={'flex items-center gap-2 px-6 py-3 rounded font-bold transition ' + (fav ? 'bg-red-500 text-white' : 'bg-gray-500/70 text-white hover:bg-gray-500/50 backdrop-blur-sm')}
              >
                <FaHeart className={fav ? 'fill-current' : ''} />
                {fav ? (lang === 'ar' ? 'في القائمة' : 'In List') : t('myList')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-12 py-8">
        <h2 className="text-2xl font-bold mb-6">{lang === 'ar' ? 'المواسم والحلقات' : 'Seasons & Episodes'}</h2>
        
        {seasons.length > 0 && (
          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {seasons.map(s => (
                <button
                  key={s.id}
                  onClick={() => loadEpisodes(s.season_number)}
                  className={'px-4 py-2 rounded font-medium whitespace-nowrap transition ' + (selectedSeason === s.season_number ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700')}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-4">
          {episodes.map((ep, idx) => (
            <div key={ep.id} className="flex gap-4 bg-gray-900 p-4 rounded hover:bg-gray-800 transition cursor-pointer group">
              <div className="w-32 aspect-video bg-gray-800 rounded overflow-hidden flex-shrink-0 relative">
                {ep.still_path ? (
                  <img 
                    src={'https://image.tmdb.org/t/p/w300' + ep.still_path}
                    alt={ep.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-2xl">📺</div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                  <FaPlay className="text-white text-2xl" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white mb-1">
                  {lang === 'ar' ? 'حلقة' : 'Episode'} {ep.episode_number}: {ep.name}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-2">{ep.overview || (lang === 'ar' ? 'لا يوجد وصف' : 'No description')}</p>
                <span className="text-gray-500 text-xs">{ep.air_date || ''}</span>
              </div>
            </div>
          ))}
        </div>

        {similar.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">{lang === 'ar' ? 'مسلسلات مشابهة' : 'Similar Series'}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {similar.map(s => (
                <div 
                  key={s.id}
                  onClick={() => nav('/series/' + s.id)}
                  className="cursor-pointer group"
                >
                  <div className="aspect-[2/3] rounded overflow-hidden mb-2">
                    <img 
                      src={'https://image.tmdb.org/t/p/w500' + s.poster_path}
                      alt={s.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <h3 className="text-sm font-medium line-clamp-1 group-hover:text-blue-400 transition">{s.name}</h3>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SeriesDetails;