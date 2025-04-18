import axios from 'axios';
import { AuthResponse } from './app/login/_model';
import { jwtDecode } from 'jwt-decode';

const isProduction = process.env.NODE_ENV === 'production';
const baseURL = isProduction ? '/api' : process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const makeReq = axiosInstance;

// Track if we're currently refreshing
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

interface JWTPayload {
  exp: number;
  sub: string;
}

makeReq.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('accessToken');
    
    if (token) {
      try {
        const decoded = jwtDecode<JWTPayload>(token);
        const expirationTime = decoded.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const REFRESH_BUFFER = 60 * 1000; // 1 minute before expiration

        // If token is expired or will expire soon
        if (expirationTime - currentTime <= REFRESH_BUFFER) {
          if (!isRefreshing) {
            isRefreshing = true;
            refreshPromise = refreshToken();
          }
          
          if (refreshPromise) {
            token = await refreshPromise;
            refreshPromise = null;
          }
        }
      } catch (error) {
        console.error('Error checking token expiration:', error);
      }
    }

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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token available');

        const response = await makeReq.post<AuthResponse>('/auth/refresh-access-token', {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken, user } = response.data;
        
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return makeReq(originalRequest);
      } catch (err) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

async function refreshToken(): Promise<string | null> {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token available');

    const response = await makeReq.post<AuthResponse>('/auth/refresh-access-token', {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken, user } = response.data;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    localStorage.setItem('user', JSON.stringify(user));

    return accessToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
    return null;
  } finally {
    isRefreshing = false;
  }
}