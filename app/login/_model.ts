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

export interface RegisterResponse {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
  isActive: boolean;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  name: string;
}

export interface ApiError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
    status?: number;
  };
  message?: string;
}
