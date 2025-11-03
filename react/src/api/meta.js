import instance from './axios';

export async function getOptions() {
  const { data } = await instance.get('/api/meta/options');
  return data;
}

export async function getModelsByMake(make_id) {
  const params = new URLSearchParams();
  params.set('make_id', String(make_id));
  const { data } = await instance.get(`/api/meta/models?${params.toString()}`);
  return data;
}
