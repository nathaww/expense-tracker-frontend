'use client';

import { createContext, useContext, useEffect, useCallback, useState } from 'react';
import { User } from '@/app/login/_model';
import { authRequests } from '@/app/login/_requests';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  isInitialized: boolean;
  logout: () => void;
  getAccessToken: () => Promise<string | null>;
}

interface JWTPayload {
  exp: number;
  sub: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const REFRESH_BUFFER = 60 * 1000; // 1 minute before expiration

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  }, []);
  const refreshTokenAndUpdateUser = useCallback(async () => {
    if (isRefreshing) return null;
    
    try {
      setIsRefreshing(true);
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authRequests.refreshToken(refreshToken);
      
      // If we get here, the refresh was successful
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      setIsAuthenticated(true);
      return response.accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Only log out if there was an actual refresh attempt that failed
      // (not if there was no refresh token to begin with)
      logout();
      return null;
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, logout]);

  const getAccessToken = useCallback(async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return null;

    try {
      const decoded = jwtDecode<JWTPayload>(accessToken);
      const expirationTime = decoded.exp * 1000;
      const currentTime = Date.now();

      if (expirationTime - currentTime <= REFRESH_BUFFER) {
        return refreshTokenAndUpdateUser();
      }

      return accessToken;
    } catch (error) {
      console.error('Error decoding token:', error);
      return refreshTokenAndUpdateUser();
    }
  }, [refreshTokenAndUpdateUser]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
          await getAccessToken(); // Initial token check
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        logout();
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [getAccessToken, logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: (newUser) => {
          setUser(newUser);
          setIsAuthenticated(!!newUser);
        },
        isAuthenticated,
        isInitialized,
        logout,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
