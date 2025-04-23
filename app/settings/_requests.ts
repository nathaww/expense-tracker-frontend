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
  profilePicture?: File;
}

export const userRequests = {
  getProfile: async (): Promise<UserProfile> => {
    const response: AxiosResponse<UserProfile> = await axiosInstance.get('/users');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileInput): Promise<UserProfile> => {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.email) formData.append('email', data.email);
    if (data.profilePicture) formData.append('profilePicture', data.profilePicture);

    const response: AxiosResponse<UserProfile> = await axiosInstance.patch('/users', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteAccount: async (): Promise<void> => {
    await axiosInstance.delete('/users');
  },
};