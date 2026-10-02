import { UserRole } from '@/backend/constants/roles';
import { Permission } from '@/backend/constants/permissions';

export interface AuthSession {
  user: AuthUser | null;
  accessToken?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  fullName?: string;
  avatarUrl?: string;
  status: string;
  metadata?: Record<string, unknown>;
}

export interface LoginCredentials {
  email?: string;
  username?: string;
  phoneNumber?: string;
  password: string;
}

export interface RegisterCredentials {
  username?: string;
  countryCode?: string;
  phoneNumber?: string;
  email?: string;
  password: string;
  fullName?: string;
  role?: UserRole;
  metadata?: Record<string, unknown>;
}

export interface AuthResponse {
  user: AuthUser;
  redirectTo: string;
}
