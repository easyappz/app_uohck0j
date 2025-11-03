/* Easyappz: attach additional interceptors without modifying axios.js */
import instance from './axios';

let isRefreshing = false;
let failedQueue = [];

const REFRESH_URL = '/api/auth/refresh';

function isRefreshRequest(config) {
  const url = config?.url || '';
  return url.indexOf(REFRESH_URL) !== -1;
}

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

export function setupInterceptors() {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config || {};
      const status = error.response?.status;

      // If refresh endpoint itself failed — do not try to refresh again
      if (status === 401 && isRefreshRequest(originalRequest)) {
        return Promise.reject(error);
      }

      if (status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              return instance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refresh = localStorage.getItem('refresh');
          if (!refresh) {
            isRefreshing = false;
            processQueue(new Error('No refresh token'));
            return Promise.reject(error);
          }

          const { data } = await instance.post(REFRESH_URL, { refresh });
          const newToken = data?.access;
          const newRefresh = data?.refresh;

          if (newToken) localStorage.setItem('token', newToken);
          if (newRefresh) localStorage.setItem('refresh', newRefresh);

          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

          processQueue(null, newToken);
          return instance(originalRequest);
        } catch (e) {
          localStorage.removeItem('token');
          localStorage.removeItem('refresh');
          processQueue(e, null);
          return Promise.reject(e);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
}

export default setupInterceptors;
