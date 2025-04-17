import { makeReq } from '@/makeReq';
import { AuthResponse, LoginInput, RegisterInput, RegisterResponse } from './_model';

export const authRequests = {
  login: async (data: LoginInput): Promise<AuthResponse> => {
    const res = await makeReq.post<AuthResponse>('/auth/login', data);
    return res.data;
  },

  register: async (data: RegisterInput): Promise<RegisterResponse> => {
    const res = await makeReq.post<RegisterResponse>('/auth/register', data);
    return res.data;
  },

  logout: async (): Promise<void> => {
    await makeReq.post('/auth/logout');
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const res = await makeReq.post<AuthResponse>('/auth/refresh-access-token', { refreshToken });
    return res.data;
  },

  requestEmailVerification: async (email: string): Promise<void> => {
    await makeReq.post('/auth/email-verification/request', {email});
  },

  verifyEmailCode: async (otp: string): Promise<void> => {
    await makeReq.post('/auth/email-verification/verify', { otp });
  },
};
