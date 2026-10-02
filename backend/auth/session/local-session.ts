import { ROLES, UserRole } from '@/backend/constants/roles';
import { Permission, ROLE_DEFAULT_PERMISSIONS } from '@/backend/constants/permissions';

export const LOCAL_SESSION_COOKIE = 'selam_local_session';

export interface LocalSessionPayload {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  permissions: Permission[];
  createdAt: number;
}

export const DEMO_ACCOUNTS: Record<string, { id: string; email: string; fullName: string; role: UserRole }> = {
  'kid@selamkids.com': {
    id: '11111111-aaaa-bbbb-cccc-111111111111',
    email: 'kid@selamkids.com',
    fullName: 'Leo Starlight',
    role: ROLES.KID,
  },
  'family@selamkids.com': {
    id: '22222222-aaaa-bbbb-cccc-222222222222',
    email: 'family@selamkids.com',
    fullName: 'The Vance Family',
    role: ROLES.FAMILY,
  },
  'teacher@selamkids.com': {
    id: '33333333-aaaa-bbbb-cccc-333333333333',
    email: 'teacher@selamkids.com',
    fullName: 'Ms. Clara Woods',
    role: ROLES.TEACHER,
  },
  'admin@selamkids.com': {
    id: '44444444-aaaa-bbbb-cccc-444444444444',
    email: 'admin@selamkids.com',
    fullName: 'Marcus Stone (Admin)',
    role: ROLES.ADMIN,
  },
  'superadmin@selamkids.com': {
    id: '55555555-aaaa-bbbb-cccc-555555555555',
    email: 'superadmin@selamkids.com',
    fullName: 'Grand Archon (Superadmin)',
    role: ROLES.SUPERADMIN,
  },
};

export function createLocalSession(user: {
  id?: string;
  email: string;
  fullName?: string;
  role?: UserRole;
}): LocalSessionPayload {
  const role = user.role || ROLES.KID;
  const permissions = ROLE_DEFAULT_PERMISSIONS[role] || [];
  const id = user.id || `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  return {
    id,
    email: user.email.toLowerCase().trim(),
    fullName: user.fullName || user.email.split('@')[0] || 'Young Author',
    role,
    permissions,
    createdAt: Date.now(),
  };
}

export function encodeSession(payload: LocalSessionPayload): string {
  const jsonStr = JSON.stringify(payload);
  const base64 = Buffer.from(jsonStr, 'utf-8').toString('base64');
  return base64;
}

export function decodeSession(token: string): LocalSessionPayload | null {
  try {
    const jsonStr = Buffer.from(token, 'base64').toString('utf-8');
    const parsed = JSON.parse(jsonStr) as LocalSessionPayload;
    if (parsed && parsed.id && parsed.role && parsed.email) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}
