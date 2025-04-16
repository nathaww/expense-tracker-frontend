import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const makeReq = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

makeReq.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

makeReq.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const token = localStorage.getItem('accessToken');
    if (error.response?.status === 401 && token && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${baseURL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return makeReq(originalRequest);
      } catch (err) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);