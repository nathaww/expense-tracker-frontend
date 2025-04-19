import api from '../lib/Axios';
import { AuthResponse, LoginInput, RegisterInput, RegisterResponse } from './_model';

export const authRequests = {
  login: async (data: LoginInput): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', data);
    return res.data;
  },

  register: async (data: RegisterInput): Promise<RegisterResponse> => {
    const res = await api.post<RegisterResponse>('/auth/register', data);
    return res.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/refresh-access-token', { refreshToken });
    return res.data;
  },

  requestEmailVerification: async (email: string): Promise<void> => {
    await api.post('/auth/email-verification/request', {email});
  },

  verifyEmailCode: async (otp: string): Promise<void> => {
    await api.post('/auth/email-verification/verify', { otp });
  },
};
