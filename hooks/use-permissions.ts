'use client';

import { useUser } from './use-user';
import { Permission } from '@/backend/constants/permissions';
import { UserRole, ROLES } from '@/backend/constants/roles';

export function usePermissions() {
  const { user, loading } = useUser();

  const hasRole = (role: UserRole): boolean => {
    if (!user) return false;
    return user.role === role;
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    if (user.role === ROLES.SUPERADMIN) return true;
    return user.permissions?.includes(permission) ?? false;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const isSuperadmin = (): boolean => {
    return user?.role === ROLES.SUPERADMIN;
  };

  const isAdmin = (): boolean => {
    return user?.role === ROLES.ADMIN || user?.role === ROLES.SUPERADMIN;
  };

  return {
    user,
    loading,
    hasRole,
    hasPermission,
    hasAnyRole,
    isSuperadmin,
    isAdmin,
  };
}
