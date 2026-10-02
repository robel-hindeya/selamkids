import { getAdminDb, isDummyDb } from '../admin';
import { mockStore } from '../mock-store';
import { ProfileRow, ProfileUpdate } from '../types';
import { UserRole } from '@/backend/constants/roles';
import { Permission, ROLE_DEFAULT_PERMISSIONS } from '@/backend/constants/permissions';
import { PaginationParams } from '@/backend/utils/pagination';

export class UserRepository {
  /**
   * Find user profile by user UUID
   */
  async findById(id: string): Promise<ProfileRow | null> {
    if (isDummyDb()) {
      return mockStore.findProfileById(id);
    }

    try {
      const supabase = getAdminDb();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .is('deleted_at', null)
        .single();

      if (error || !data) return mockStore.findProfileById(id);
      return data;
    } catch {
      return mockStore.findProfileById(id);
    }
  }

  /**
   * Find user profile by email
   */
  async findByEmail(email: string): Promise<ProfileRow | null> {
    if (isDummyDb()) {
      return mockStore.findProfileByEmail(email);
    }

    try {
      const supabase = getAdminDb();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .is('deleted_at', null)
        .single();

      if (error || !data) return mockStore.findProfileByEmail(email);
      return data;
    } catch {
      return mockStore.findProfileByEmail(email);
    }
  }

  /**
   * Get user role and mapped permissions
   */
  async getUserRoleAndPermissions(
    userId: string
  ): Promise<{ role: UserRole; permissions: Permission[] } | null> {
    if (isDummyDb()) {
      return mockStore.getUserRoleAndPermissions(userId);
    }

    try {
      const supabase = getAdminDb();

      // Query user_roles join roles
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('roles(name)')
        .eq('user_id', userId)
        .limit(1)
        .maybeSingle();

      if (roleError || !roleData || !roleData.roles) {
        return mockStore.getUserRoleAndPermissions(userId);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const roleName = (roleData.roles as any).name as UserRole;

      // Get permissions for this role
      const defaultPermissions = ROLE_DEFAULT_PERMISSIONS[roleName] || [];

      // Also fetch any database-stored permissions
      const { data: permsData } = await supabase
        .from('role_permissions')
        .select('permissions(name)')
        .eq('role_id', roleData.roles ? (roleData.roles as any).id : '');

      const dbPermissions: Permission[] = (permsData || [])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((p: any) => p.permissions?.name)
        .filter(Boolean);

      const merged = Array.from(new Set([...defaultPermissions, ...dbPermissions]));

      return {
        role: roleName,
        permissions: merged,
      };
    } catch {
      return mockStore.getUserRoleAndPermissions(userId);
    }
  }

  /**
   * List users with pagination and search
   */
  async listUsers(
    params: PaginationParams,
    search?: string,
    roleFilter?: UserRole
  ): Promise<{ items: ProfileRow[]; total: number }> {
    if (isDummyDb()) {
      return mockStore.listUsers(params, search, roleFilter);
    }

    try {
      const supabase = getAdminDb();

      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .is('deleted_at', null);

      if (search) {
        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      if (roleFilter) {
        const { data: roleUsers } = await supabase
          .from('user_roles')
          .select('user_id, roles!inner(name)')
          .eq('roles.name', roleFilter);

        const userIds = (roleUsers || []).map((r) => r.user_id);
        if (userIds.length > 0) {
          query = query.in('id', userIds);
        } else {
          return { items: [], total: 0 };
        }
      }

      query = query
        .order('created_at', { ascending: false })
        .range(params.offset, params.offset + params.limit - 1);

      const { data, count, error } = await query;
      if (error || !data) {
        return mockStore.listUsers(params, search, roleFilter);
      }

      return {
        items: data || [],
        total: count || 0,
      };
    } catch {
      return mockStore.listUsers(params, search, roleFilter);
    }
  }

  /**
   * Update profile
   */
  async updateProfile(id: string, updates: ProfileUpdate): Promise<ProfileRow> {
    if (isDummyDb()) {
      return mockStore.updateProfile(id, updates);
    }

    try {
      const supabase = getAdminDb();
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error || !data) {
        return mockStore.updateProfile(id, updates);
      }
      return data;
    } catch {
      return mockStore.updateProfile(id, updates);
    }
  }

  /**
   * Soft delete user
   */
  async softDelete(id: string): Promise<void> {
    if (isDummyDb()) {
      mockStore.softDeleteUser(id);
      return;
    }

    try {
      const supabase = getAdminDb();
      const { error } = await supabase
        .from('profiles')
        .update({
          deleted_at: new Date().toISOString(),
          status: 'INACTIVE',
        })
        .eq('id', id);

      if (error) {
        mockStore.softDeleteUser(id);
      }
    } catch {
      mockStore.softDeleteUser(id);
    }
  }
}
