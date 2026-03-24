import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'esl_movies_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [ready, setReady] = useState(false);

 
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading favorites:', e);
      }
    }
    setReady(true);
  }, []);


  useEffect(() => {
    if (ready) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    }
  }, [favorites, ready]);

  const isFavorite = useCallback((movieId) => {
    return favorites.some(f => f.id === movieId);
  }, [favorites]);

  const toggleFavorite = useCallback((movie) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.id === movie.id);
      if (exists) {
        return prev.filter(f => f.id !== movie.id);
      }
      return [...prev, movie];
    });
  }, []);

  const removeFavorite = useCallback((movieId) => {
    setFavorites(prev => prev.filter(f => f.id !== movieId));
  }, []);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    ready
  };
}