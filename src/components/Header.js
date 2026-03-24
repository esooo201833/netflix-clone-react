import React, { useState, useEffect } from 'react';
import { FaSearch, FaBell, FaUser, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useGenres } from '../hooks/useGenres';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [showGenres, setShowGenres] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  
  const { t, toggleLang, lang } = useLanguage();
  const { genres } = useGenres(lang);
  const nav = useNavigate();

  const [notifications, setNotifications] = useState([
    { id: 1, text: 'فيلم جديد نزل: The Batman', time: 'من 5 دقايق', read: false },
    { id: 2, text: 'تم اضافة المفضلة بنجاح', time: 'من ساعة', read: true },
    { id: 3, text: 'تصنيف جديد: افلام 2024', time: 'امبارح', read: false }
  ]);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const doSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      nav('/search?q=' + encodeURIComponent(query));
      setSearchOpen(false);
      setQuery('');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? {...n, read: true} : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({...n, read: true})));
  };

  let headerClass = 'fixed top-0 w-full z-50 transition-all duration-500 ';
  if (scrolled) headerClass += 'bg-black/95 backdrop-blur shadow-lg';
  else headerClass += 'bg-gradient-to-b from-black/80 to-transparent';

  return (
    <header className={headerClass}>
      <div className="flex items-center justify-between px-4 md:px-12 py-4">
        
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="" className="h-10 w-10 object-contain" onError={e => e.target.style.display='none'} />
          <span onClick={() => nav('/')} className="text-2xl font-bold text-white cursor-pointer">
            {t('eslmovies')}
          </span>

          <nav className="hidden md:flex items-center gap-6 ml-8">
            <a onClick={() => nav('/')} className="text-sm text-gray-300 hover:text-white cursor-pointer py-2 border-b-2 border-transparent hover:border-blue-500 transition">
              {t('home')}
            </a>
            
            <div className="relative">
              <button onMouseEnter={() => setShowGenres(true)} className="text-sm text-gray-300 hover:text-white flex items-center gap-1 py-2 border-b-2 border-transparent hover:border-blue-500 transition">
                {t('movies')} <span className="text-xs">▼</span>
              </button>
              {showGenres && (
                <div onMouseLeave={() => setShowGenres(false)} className="absolute top-full left-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded shadow-xl py-2 max-h-96 overflow-auto">
                  {genres.map(g => (
                    <button key={g.id} onClick={() => { nav('/category/' + g.id); setShowGenres(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-blue-600 hover:text-white">
                      {g.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <a onClick={() => nav('/series')} className="text-sm text-gray-300 hover:text-white cursor-pointer py-2 border-b-2 border-transparent hover:border-blue-500 transition">
              {t('series')}
            </a>
            
            <a onClick={() => nav('/popular')} className="text-sm text-gray-300 hover:text-white cursor-pointer py-2 border-b-2 border-transparent hover:border-blue-500 transition">
              {t('popular')}
            </a>
            
            <a onClick={() => nav('/favorites')} className="text-sm text-gray-300 hover:text-white cursor-pointer py-2 border-b-2 border-transparent hover:border-blue-500 transition">
              {t('myList')}
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          
          {searchOpen ? (
            <form onSubmit={doSearch} className="flex items-center">
              <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="بحث..." className="bg-black/70 border border-gray-500 text-white px-3 py-1 rounded w-48 focus:outline-none focus:border-blue-500" autoFocus />
              <button type="button" onClick={() => setSearchOpen(false)} className="ml-2 text-gray-400 hover:text-white"><FaTimes /></button>
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="text-white hover:text-blue-400"><FaSearch /></button>
          )}

          <button onClick={toggleLang} className="text-white hover:text-blue-400 font-bold">
            {lang === 'ar' ? 'EN' : 'عربي'}
          </button>

          <div className="relative">
            <button onClick={() => setNotifOpen(!notifOpen)} className="text-white hover:text-blue-400 relative">
              <FaBell />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
                <div className="flex items-center justify-between p-3 border-b border-gray-700">
                  <h3 className="font-bold text-white">الاشعارات</h3>
                  <button onClick={markAllRead} className="text-xs text-blue-400 hover:text-blue-300">علم الكل مقروء</button>
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-gray-500 text-center">مافيش اشعارات</p>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => markRead(n.id)}
                        className={'p-3 border-b border-gray-800 cursor-pointer hover:bg-gray-800 ' + (n.read ? 'opacity-50' : 'bg-gray-800/50')}
                      >
                        <p className="text-sm text-white mb-1">{n.text}</p>
                        <p className="text-xs text-gray-500">{n.time}</p>
                        {!n.read && <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1"></span>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center cursor-pointer">
            <FaUser className="text-white text-sm" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;