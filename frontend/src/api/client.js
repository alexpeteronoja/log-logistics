import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Access Token
client.interceptors.request.use(
  (config) => {
    const token = Cookies.get('userAccessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle 401 (Refresh Token Flow)
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return client(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = Cookies.get('userRefreshToken');
        const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken }, {
          withCredentials: true 
        });

        // Some backends return the new access token in the response body
        // and set the refresh token in an httpOnly cookie
        const newAccessToken = res.data.accessToken || res.data.token || res.data.userAccessToken;
        if (newAccessToken) {
            Cookies.set('userAccessToken', newAccessToken);
            client.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
            originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
            processQueue(null, newAccessToken);
            return client(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        handleAuthFailure();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

const handleAuthFailure = () => {
  Cookies.remove('userAccessToken');
  Cookies.remove('userId');
  Cookies.remove('userEmail');
  Cookies.remove('userRole');
  Cookies.remove('userRefreshToken');
  window.location.href = '/admin'; // Redirect to login
};

export default client;
