export const PERMISSIONS = {
  // Users
  USERS_READ: 'users.read',
  USERS_CREATE: 'users.create',
  USERS_UPDATE: 'users.update',
  USERS_DELETE: 'users.delete',

  // Kids
  KIDS_READ: 'kids.read',
  KIDS_CREATE: 'kids.create',
  KIDS_UPDATE: 'kids.update',
  KIDS_DELETE: 'kids.delete',

  // Families
  FAMILIES_READ: 'families.read',
  FAMILIES_CREATE: 'families.create',
  FAMILIES_UPDATE: 'families.update',
  FAMILIES_DELETE: 'families.delete',

  // Teachers
  TEACHERS_READ: 'teachers.read',
  TEACHERS_CREATE: 'teachers.create',
  TEACHERS_UPDATE: 'teachers.update',
  TEACHERS_DELETE: 'teachers.delete',

  // Content (creatures, stories, activities)
  CONTENT_READ: 'content.read',
  CONTENT_CREATE: 'content.create',
  CONTENT_UPDATE: 'content.update',
  CONTENT_DELETE: 'content.delete',

  // Reports
  REPORTS_READ: 'reports.read',

  // Admins
  ADMINS_READ: 'admins.read',
  ADMINS_CREATE: 'admins.create',
  ADMINS_UPDATE: 'admins.update',
  ADMINS_DELETE: 'admins.delete',

  // Roles & Permissions
  ROLES_READ: 'roles.read',
  ROLES_CREATE: 'roles.create',
  ROLES_UPDATE: 'roles.update',
  ROLES_DELETE: 'roles.delete',

  // System
  SYSTEM_SETTINGS: 'system.settings',
  AUDIT_LOGS_READ: 'audit_logs.read',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS: Permission[] = Object.values(PERMISSIONS);

// Default role permissions matrix
export const ROLE_DEFAULT_PERMISSIONS: Record<string, Permission[]> = {
  KID: [
    PERMISSIONS.CONTENT_READ,
    PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.CONTENT_UPDATE,
  ],
  FAMILY: [
    PERMISSIONS.KIDS_READ,
    PERMISSIONS.FAMILIES_READ,
    PERMISSIONS.FAMILIES_UPDATE,
    PERMISSIONS.CONTENT_READ,
    PERMISSIONS.REPORTS_READ,
  ],
  TEACHER: [
    PERMISSIONS.KIDS_READ,
    PERMISSIONS.TEACHERS_READ,
    PERMISSIONS.TEACHERS_UPDATE,
    PERMISSIONS.CONTENT_READ,
    PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.CONTENT_UPDATE,
    PERMISSIONS.REPORTS_READ,
  ],
  ADMIN: [
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_UPDATE,
    PERMISSIONS.KIDS_READ,
    PERMISSIONS.KIDS_CREATE,
    PERMISSIONS.KIDS_UPDATE,
    PERMISSIONS.KIDS_DELETE,
    PERMISSIONS.FAMILIES_READ,
    PERMISSIONS.FAMILIES_CREATE,
    PERMISSIONS.FAMILIES_UPDATE,
    PERMISSIONS.TEACHERS_READ,
    PERMISSIONS.TEACHERS_CREATE,
    PERMISSIONS.TEACHERS_UPDATE,
    PERMISSIONS.CONTENT_READ,
    PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.CONTENT_UPDATE,
    PERMISSIONS.CONTENT_DELETE,
    PERMISSIONS.REPORTS_READ,
    PERMISSIONS.AUDIT_LOGS_READ,
  ],
  SUPERADMIN: [
    ...ALL_PERMISSIONS,
  ],
};
