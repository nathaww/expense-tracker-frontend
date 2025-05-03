'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  AppSettings, 
  UpdateAppSettingsInput, 
  appSettingsRequests 
} from '@/app/settings/_requests';
import { 
  useQuery, 
  useMutation, 
  useQueryClient 
} from '@tanstack/react-query';


export const QUERY_KEYS = {
  appSettings: ['app-settings']
};

interface AppSettingsContextType {
  settings: AppSettings | undefined;
  isLoading: boolean;
  error: Error | null;
  preferredCurrency: string;
  hideAmounts: boolean;
  updateSettings: (newSettings: UpdateAppSettingsInput) => Promise<void>;
  refetch: () => Promise<void>;
}

const DEFAULT_SETTINGS: AppSettings = {
  id: "default",
  preferredCurrency: "USD",
  hideAmounts: false,
  userId: "default",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Define public routes where app settings don't need to be fetched
const publicRoutes = [
  "/",
  "/register",
  "/login",
  "/verify-email",
  "/verify-code",
  "/forgot-password",
];

// Function to check if current path is a public route
const isPublicRoute = (): boolean => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    return publicRoutes.some(route => path === route);
  }
  return false;
};

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [isOnPublicRoute, setIsOnPublicRoute] = useState(true); 
  
  useEffect(() => {
    const checkRoute = () => {
      setIsOnPublicRoute(isPublicRoute());
    };
    checkRoute();
    
    window.addEventListener('popstate', checkRoute);
    
    return () => {
      window.removeEventListener('popstate', checkRoute);
    };
  }, []);

  const { 
    data: settings, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: QUERY_KEYS.appSettings,
    queryFn: appSettingsRequests.getAppSettings,
    enabled: !isOnPublicRoute, // Only fetch if NOT on a public route
  });

  const { mutateAsync: updateSettingsMutation } = useMutation({
    mutationFn: (data: UpdateAppSettingsInput) => appSettingsRequests.updateAppSettings(data),
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(QUERY_KEYS.appSettings, updatedSettings);
    },
  });

  const updateSettings = async (newSettings: UpdateAppSettingsInput) => {
    try {
      await updateSettingsMutation(newSettings);
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  };

  const refetchSettings = async () => {
    if (!isOnPublicRoute) {
      await refetch();
    }
  };

  return (
    <AppSettingsContext.Provider
      value={{
        settings,
        isLoading,
        error: error as Error | null,
        preferredCurrency: settings?.preferredCurrency || DEFAULT_SETTINGS.preferredCurrency,
        hideAmounts: settings?.hideAmounts || DEFAULT_SETTINGS.hideAmounts,
        updateSettings,
        refetch: refetchSettings,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
}

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
};

export const useInvalidateAppSettings = () => {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.appSettings });
  };
};