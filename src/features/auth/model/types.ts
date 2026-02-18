export interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  profile: UserProfile | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  access_expired_at: string;
  refresh_expired_at: string;
}

export interface UserProfile {
  id: number;
  phone: string;
  email: string;
  name: string;
  lastName: string;
  secondName: string;
  roles: Array<Record<string, any>>;
  status: {
    code: number;
    name: string;
  };
  isActive: boolean;
  updatedAt: string;
  createdAt: string;
}
