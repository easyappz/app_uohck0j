import instance from './axios';

export async function listAds(params = {}) {
  const { data } = await instance.get('/api/ads', { params });
  return data;
}

export const getAds = listAds;

export async function getAd(id) {
  const { data } = await instance.get(`/api/ads/${id}`);
  return data;
}

export async function createAd(payload) {
  const { data } = await instance.post('/api/ads', payload);
  return data;
}

export async function updateAd(id, payload) {
  const { data } = await instance.patch(`/api/ads/${id}`, payload);
  return data;
}

export async function deleteAd(id) {
  const { data } = await instance.delete(`/api/ads/${id}`);
  return data;
}

export async function uploadImages(adId, files) {
  const formData = new FormData();
  if (Array.isArray(files)) {
    files.forEach((f) => formData.append('images', f));
  } else if (files) {
    formData.append('image', files);
  }
  const { data } = await instance.post(`/api/ads/${adId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

// Kept for backward compatibility; prefer using ../api/favorites
export async function addFavorite(id) {
  const { data } = await instance.post(`/api/ads/${id}/favorite`);
  return data;
}

export async function removeFavorite(id) {
  const { data } = await instance.delete(`/api/ads/${id}/favorite`);
  return data;
}

export async function contactSeller(id, payload) {
  const { data } = await instance.post(`/api/ads/${id}/contact`, payload);
  return data;
}
