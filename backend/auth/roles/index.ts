import { UserRole, ROLES, ROLE_HIERARCHY } from '@/backend/constants/roles';
import { AuthUser } from '@/types/auth';

/**
 * Checks if a user has a specific role.
 */
export function hasRole(user: AuthUser | null | undefined, targetRole: UserRole): boolean {
  if (!user) return false;
  return user.role === targetRole;
}

/**
 * Checks if a user has at least the privilege level of the given role.
 */
export function hasMinimumRole(user: AuthUser | null | undefined, minimumRole: UserRole): boolean {
  if (!user) return false;
  const userLevel = ROLE_HIERARCHY[user.role] ?? 0;
  const targetLevel = ROLE_HIERARCHY[minimumRole] ?? 0;
  return userLevel >= targetLevel;
}

/**
 * Checks if a user is an administrative user (ADMIN or SUPERADMIN).
 */
export function isAdminOrSuperadmin(user: AuthUser | null | undefined): boolean {
  if (!user) return false;
  return user.role === ROLES.ADMIN || user.role === ROLES.SUPERADMIN;
}

/**
 * Strict check for Superadmin.
 */
export function isSuperadmin(user: AuthUser | null | undefined): boolean {
  if (!user) return false;
  return user.role === ROLES.SUPERADMIN;
}
