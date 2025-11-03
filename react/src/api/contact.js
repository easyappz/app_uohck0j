import instance from './axios';

export async function sendContact(id, payload) {
  const { data } = await instance.post(`/api/ads/${id}/contact`, payload);
  return data;
}
