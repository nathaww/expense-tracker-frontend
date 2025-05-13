import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { toast } from "sonner";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://expense-tracker-backend-csxl.onrender.com";

const api: AxiosInstance = axios.create({ baseURL });

let isRefreshing = false;

// Define public routes where token refresh should be skipped
const publicRoutes = [
  "/",
  "/register",
  "/login",
  "/verify-email",
  "/verify-code",
  "/forgot-password",
  "/reset-password",
];

// Define type for API error response
interface ApiErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
}

// Function to check if current path is a public route
const isPublicRoute = (): boolean => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    return publicRoutes.some(route => path === route);
  }
  return false;
};

type FailedRequest = {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
};

let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired token response
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Skip token refresh for public routes or if user isn't authenticated
    if (error.response?.status === 401 && !originalRequest._retry && !isPublicRoute()) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            // Show toast notification instead of throwing error
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            toast.error(errorMessage);
            return Promise.reject(err);
          });
      }

      isRefreshing = true;      try {
        const refreshToken = localStorage.getItem("refreshToken");
        
        // If no refresh token exists, don't attempt to refresh
        if (!refreshToken) {
          toast.error("Session expired. Please login again.");
          throw new Error('No refresh token found');
        }

        // Explicitly create the request body with refreshToken
        const requestBody = { refreshToken };

        // Use a direct axios call instead of the api instance to avoid interceptors loop
        const { data } = await axios.post(
          `${baseURL}/auth/refresh-access-token`,
          requestBody,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        // Make sure we have all the expected data from the response
        if (!data.accessToken || !data.refreshToken || !data.user) {
          throw new Error('Invalid response from refresh token endpoint');
        }

        const { accessToken: newAccessToken, refreshToken: newRefreshToken, user } = data;
        
        // Update tokens and user data in localStorage
        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        // Update the Authorization header for future requests
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        
        // Process any queued requests with the new token
        processQueue(null, newAccessToken);

        // Update the current request with the new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        // Retry the original request with the new token
        return api(originalRequest);
      } catch (err) {
        // Show toast notification instead of throwing error
        let errorMessage = 'Authentication failed';
        
        if (err instanceof AxiosError) {
          // Safely access message with type checking
          const responseData = err.response?.data as ApiErrorResponse | undefined;
          errorMessage = responseData?.message || responseData?.error || 'Authentication failed';
          console.error('Token refresh failed:', err.response?.data);
        } else if (err instanceof Error) {
          errorMessage = err.message;
          console.error('Token refresh error:', err.message);
        }
        
        toast.error(errorMessage);
        
        // If refresh token fails, clear all auth data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        
        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Show toast for other errors
    if (error.response) {
      const status = error.response.status;
      let message = 'An error occurred';
      
      // Type-safe access to error response data
      const responseData = error.response.data as ApiErrorResponse | undefined;
      if (responseData) {
        message = responseData.message || responseData.error || 'An error occurred';
      }

      // Don't show auth errors for public routes
      if (!(status === 401 && isPublicRoute())) {
        toast.error(message);
      }
    } else if (error.request) {
      // The request was made but no response was received
      toast.error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request
      toast.error('Error setting up request');
    }

    return Promise.reject(error);
  }
);

export default api;
