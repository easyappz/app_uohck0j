import instance from './axios';

export async function getAds(params = {}) {
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
  const { data } = await instance.get(`/api/ads${qs ? `?${qs}` : ''}`);
  return data;
}

export async function createAd(payload) {
  const { data } = await instance.post('/api/ads', payload);
  return data;
}

export async function getAd(id) {
  const { data } = await instance.get(`/api/ads/${id}`);
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

export async function uploadImages(id, files) {
  const fd = new FormData();
  (files || []).forEach((file) => fd.append('images', file));
  const { data } = await instance.post(`/api/ads/${id}/images`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data;
}
