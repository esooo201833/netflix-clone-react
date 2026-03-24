// Tubi TV API (غير رسمي)
const TUBI_BASE = 'https://tubitv.com/oz/videos';

export const searchTubi = async (query) => {
  try {
    const res = await fetch(`${TUBI_BASE}/search?q=${encodeURIComponent(query)}`);
    return await res.json();
  } catch (e) {
    console.error('Tubi search failed:', e);
    return null;
  }
};

export const getTubiVideo = async (id) => {
  try {
    const res = await fetch(`${TUBI_BASE}/${id}`);
    return await res.json();
  } catch (e) {
    console.error('Tubi video failed:', e);
    return null;
  }
};