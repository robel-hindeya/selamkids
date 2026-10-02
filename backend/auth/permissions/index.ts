import { Permission, ALL_PERMISSIONS } from '@/backend/constants/permissions';
import { ROLES } from '@/backend/constants/roles';
import { AuthUser } from '@/types/auth';

/**
 * Checks if a user has a specific permission.
 * Superadmin automatically bypasses and has all permissions.
 */
export function hasPermission(
  user: AuthUser | null | undefined,
  requiredPermission: Permission
): boolean {
  if (!user) return false;

  // Superadmin has all permissions unconditionally
  if (user.role === ROLES.SUPERADMIN) {
    return true;
  }

  return user.permissions?.includes(requiredPermission) ?? false;
}

/**
 * Checks if a user has all of the listed permissions.
 */
export function hasAllPermissions(
  user: AuthUser | null | undefined,
  requiredPermissions: Permission[]
): boolean {
  if (!user) return false;
  if (user.role === ROLES.SUPERADMIN) return true;

  return requiredPermissions.every((perm) => user.permissions?.includes(perm));
}

/**
 * Checks if a user has at least one of the listed permissions.
 */
export function hasAnyPermission(
  user: AuthUser | null | undefined,
  permissions: Permission[]
): boolean {
  if (!user) return false;
  if (user.role === ROLES.SUPERADMIN) return true;

  return permissions.some((perm) => user.permissions?.includes(perm));
}
