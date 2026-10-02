export * from '@/types/database';
import { Database } from '@/types/database';

export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type RoleRow = Database['public']['Tables']['roles']['Row'];
export type PermissionRow = Database['public']['Tables']['permissions']['Row'];
export type UserRoleRow = Database['public']['Tables']['user_roles']['Row'];

export type KidRow = Database['public']['Tables']['kids']['Row'];
export type KidInsert = Database['public']['Tables']['kids']['Insert'];
export type KidUpdate = Database['public']['Tables']['kids']['Update'];

export type FamilyRow = Database['public']['Tables']['families']['Row'];
export type FamilyInsert = Database['public']['Tables']['families']['Insert'];
export type FamilyUpdate = Database['public']['Tables']['families']['Update'];

export type TeacherRow = Database['public']['Tables']['teachers']['Row'];
export type TeacherInsert = Database['public']['Tables']['teachers']['Insert'];
export type TeacherUpdate = Database['public']['Tables']['teachers']['Update'];

export type AdminProfileRow = Database['public']['Tables']['admin_profiles']['Row'];
export type AuditLogRow = Database['public']['Tables']['audit_logs']['Row'];
export type AuditLogInsert = Database['public']['Tables']['audit_logs']['Insert'];
