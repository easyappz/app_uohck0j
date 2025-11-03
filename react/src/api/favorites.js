import instance from './axios';

export async function addFavorite(id) {
  const { data } = await instance.post(`/api/ads/${id}/favorite`);
  return data;
}

export async function removeFavorite(id) {
  const { data } = await instance.delete(`/api/ads/${id}/favorite`);
  return data;
}

export async function getFavorites(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === '' || v == null) return;
    if (Array.isArray(v)) {
      if (v.length) search.set(k, v.join(','));
    } else {
      search.set(k, String(v));
    }
  });
  const qs = search.toString();
  const { data } = await instance.get(`/api/favorites${qs ? `?${qs}` : ''}`);
  return data;
}
