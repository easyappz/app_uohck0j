import instance from './axios';

export async function listFavorites(params = {}) {
  const { data } = await instance.get('/api/favorites', { params });
  return data;
}

export async function getFavorites(params = {}) {
  return await listFavorites(params);
}

export async function addFavorite(id) {
  const { data } = await instance.post(`/api/ads/${id}/favorite`);
  return data;
}

export async function removeFavorite(id) {
  const { data } = await instance.delete(`/api/ads/${id}/favorite`);
  return data;
}
