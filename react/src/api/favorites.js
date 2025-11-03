import instance from './axios';

export async function listFavorites(params = {}) {
  const { data } = await instance.get('/api/favorites', { params });
  return data;
}
