import instance from './axios';

export async function getMetaOptions() {
  const { data } = await instance.get('/api/meta/options');
  return data;
}

export async function getModelsByMake(makeId) {
  const { data } = await instance.get('/api/meta/models', { params: { make_id: makeId } });
  return data;
}
