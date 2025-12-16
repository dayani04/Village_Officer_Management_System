export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'village_officer' | 'secretary';
  profileImage?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
