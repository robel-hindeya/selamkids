export const ROLES = {
  KID: 'KID',
  FAMILY: 'FAMILY',
  TEACHER: 'TEACHER',
  ADMIN: 'ADMIN',
  SUPERADMIN: 'SUPERADMIN',
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export const ALL_ROLES: UserRole[] = [
  ROLES.KID,
  ROLES.FAMILY,
  ROLES.TEACHER,
  ROLES.ADMIN,
  ROLES.SUPERADMIN,
];

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [ROLES.KID]: 1,
  [ROLES.FAMILY]: 1,
  [ROLES.TEACHER]: 2,
  [ROLES.ADMIN]: 3,
  [ROLES.SUPERADMIN]: 4,
};

export const PARENT_PIN_COOKIE = 'selam_parent_unlocked';

export const ROLE_REDIRECTS: Record<UserRole, string> = {
  [ROLES.KID]: '/users/kids',
  [ROLES.FAMILY]: '/users/kids',
  [ROLES.TEACHER]: '/users/teachers',
  [ROLES.ADMIN]: '/admin',
  [ROLES.SUPERADMIN]: '/superadmin',
};
