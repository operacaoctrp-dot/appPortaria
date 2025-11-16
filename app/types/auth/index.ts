export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  role?: UserRole;
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  user_id: string;
  nome?: string;
  avatar_url?: string;
  telefone?: string;
  cargo?: string;
  filial?: string;
  created_at: string;
  updated_at: string;
}

export type UserRole = "admin" | "porteiro" | "visualizador";

export interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user?: User;
  error?: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface RolePermission {
  role: UserRole;
  permissions: string[];
}
