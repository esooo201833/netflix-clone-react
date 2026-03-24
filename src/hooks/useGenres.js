import { useState, useEffect } from 'react';

const API_KEY = 'e5f2031436e3dfd50691582983faaca0';
const BASE_URL = 'https://api.themoviedb.org/3';

export function useGenres(lang) {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const langParam = lang === 'ar' ? 'ar-SA' : 'en-US';
        const res = await fetch(
          `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=${langParam}`
        );
        const data = await res.json();
        setGenres(data.genres || []);
      } catch (err) {
        console.error('Error loading genres:', err);
      }
      setLoading(false);
    };

    fetchGenres();
  }, [lang]);

  return { genres, loading };
}