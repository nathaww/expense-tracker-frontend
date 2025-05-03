'use client';

import { createContext, useContext } from 'react';
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

// Query key constants for app settings
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

// Default settings if API fails
const DEFAULT_SETTINGS: AppSettings = {
  id: "default",
  preferredCurrency: "USD",
  hideAmounts: false,
  userId: "default",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  // Fetch app settings with React Query
  const { 
    data: settings, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: QUERY_KEYS.appSettings,
    queryFn: appSettingsRequests.getAppSettings,
  });

  // Update app settings mutation
  const { mutateAsync: updateSettingsMutation } = useMutation({
    mutationFn: (data: UpdateAppSettingsInput) => appSettingsRequests.updateAppSettings(data),
    onSuccess: (updatedSettings) => {
      // Update the cache with new settings
      queryClient.setQueryData(QUERY_KEYS.appSettings, updatedSettings);
    },
  });

  // Update settings handler
  const updateSettings = async (newSettings: UpdateAppSettingsInput) => {
    try {
      await updateSettingsMutation(newSettings);
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  };

  // Helper function to refetch app settings
  const refetchSettings = async () => {
    await refetch();
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

// Helper hook to invalidate app settings from any component
export const useInvalidateAppSettings = () => {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.appSettings });
  };
};