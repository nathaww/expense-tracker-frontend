export interface User {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  isVerified: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  sessionId: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  name: string;
}