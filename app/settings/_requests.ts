import { AxiosResponse } from "axios";
import axiosInstance from "../lib/Axios";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileInput {
  name?: string;
  email?: string;
  profilePicture?: string; // Changed from File to string (URL)
}

export interface AppSettings {
  id: string;
  preferredCurrency: string
  hideAmounts: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateAppSettingsInput {
  preferredCurrency?: string
  hideAmounts?: boolean;
}

export const userRequests = {
  getProfile: async (): Promise<UserProfile> => {
    const response: AxiosResponse<UserProfile> = await axiosInstance.get('/users');
    return response.data;
  },
  updateProfile: async (data: UpdateProfileInput): Promise<UserProfile> => {
    const response: AxiosResponse<UserProfile> = await axiosInstance.patch('/users', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  deleteAccount: async (): Promise<void> => {
    await axiosInstance.delete('/users');
  },
};

export const appSettingsRequests = {
  getAppSettings: async (): Promise<AppSettings> => {
    try {
      const response: AxiosResponse<AppSettings> = await axiosInstance.get('/app-settings');
      return response.data;
    } catch (error) {
      console.error("Failed to fetch app settings:", error);
      return {
        id: "default",
        preferredCurrency: "USD",
        hideAmounts: false,
        userId: "default",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  },

  updateAppSettings: async (data: UpdateAppSettingsInput): Promise<AppSettings> => {
    try {
      const response: AxiosResponse<AppSettings> = await axiosInstance.patch('/app-settings', data);
      return response.data;
    } catch (error) {
      console.error("Failed to update app settings:", error);
      throw error;
    }
  },
};