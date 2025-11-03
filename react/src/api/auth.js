import instance from './axios';

export async function register(username, email, password) {
  const { data } = await instance.post('/api/auth/register', { username, email, password });
  if (data?.access) {
    localStorage.setItem('token', data.access);
  }
  return data;
}

export async function login(loginValue, password) {
  const { data } = await instance.post('/api/auth/login', { login: loginValue, password });
  if (data?.access) {
    localStorage.setItem('token', data.access);
  }
  return data;
}

export async function refresh(refreshToken) {
  const { data } = await instance.post('/api/auth/refresh', { refresh: refreshToken });
  if (data?.access) {
    localStorage.setItem('token', data.access);
  }
  return data;
}

export async function me() {
  const { data } = await instance.get('/api/auth/me');
  return data;
}
