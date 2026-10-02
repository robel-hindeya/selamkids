import { getCurrentUser } from '../session';
import { AuthUser } from '@/types/auth';
import { UserRole, ROLES } from '@/backend/constants/roles';
import { Permission } from '@/backend/constants/permissions';
import {
  UnauthorizedError,
  InsufficientRoleError,
  InsufficientPermissionError,
  ForbiddenError,
} from '@/backend/errors/auth-error';
import { hasRole, isAdminOrSuperadmin, isSuperadmin } from '../roles';
import { hasPermission } from '../permissions';

/**
 * Server guard: Enforces that a user is logged in.
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new UnauthorizedError();
  }
  return user;
}

/**
 * Server guard: Enforces that the user has a specific role.
 */
export async function requireRole(expectedRole: UserRole): Promise<AuthUser> {
  const user = await requireAuth();
  if (!hasRole(user, expectedRole)) {
    throw new InsufficientRoleError(expectedRole, user.role);
  }
  return user;
}

/**
 * Server guard: Enforces that the user has one of the allowed roles.
 */
export async function requireAnyRole(allowedRoles: UserRole[]): Promise<AuthUser> {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    throw new ForbiddenError(
      `Access denied. Allowed roles: ${allowedRoles.join(', ')}. Your role: ${user.role}`
    );
  }
  return user;
}

/**
 * Server guard: Enforces that the user has a specific permission.
 */
export async function requirePermission(permission: Permission): Promise<AuthUser> {
  const user = await requireAuth();
  if (!hasPermission(user, permission)) {
    throw new InsufficientPermissionError(permission);
  }
  return user;
}

/**
 * Server guard: Enforces that the user is an ADMIN or SUPERADMIN.
 */
export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireAuth();
  if (!isAdminOrSuperadmin(user)) {
    throw new ForbiddenError('Administrative privileges required to access this resource.');
  }
  return user;
}

/**
 * Server guard: Enforces that the user is strictly a SUPERADMIN.
 */
export async function requireSuperadmin(): Promise<AuthUser> {
  const user = await requireAuth();
  if (!isSuperadmin(user)) {
    throw new ForbiddenError('Superadmin access level required.');
  }
  return user;
}

/**
 * Server guard: Enforces that the user is either modifying their own resource,
 * or possesses the administrative permission to do so.
 */
export async function requireSelfOrPermission(
  targetUserId: string,
  permission: Permission
): Promise<AuthUser> {
  const user = await requireAuth();
  if (user.id === targetUserId) {
    return user;
  }
  if (!hasPermission(user, permission)) {
    throw new InsufficientPermissionError(permission);
  }
  return user;
}
