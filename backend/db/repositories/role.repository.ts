import { getAdminDb, isDummyDb } from '../admin';
import { mockStore } from '../mock-store';
import { RoleRow, PermissionRow } from '../types';
import { UserRole } from '@/backend/constants/roles';

export class RoleRepository {
  async listRoles(): Promise<RoleRow[]> {
    if (isDummyDb()) {
      return mockStore.listRoles();
    }

    try {
      const supabase = getAdminDb();
      const { data, error } = await supabase.from('roles').select('*').order('name');
      if (error || !data) return mockStore.listRoles();
      return data;
    } catch {
      return mockStore.listRoles();
    }
  }

  async findByName(name: string): Promise<RoleRow | null> {
    if (isDummyDb()) {
      return mockStore.findRoleByName(name);
    }

    try {
      const supabase = getAdminDb();
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .eq('name', name)
        .single();

      if (error || !data) return mockStore.findRoleByName(name);
      return data;
    } catch {
      return mockStore.findRoleByName(name);
    }
  }

  async assignRoleToUser(
    userId: string,
    roleName: UserRole,
    assignedBy?: string
  ): Promise<void> {
    if (isDummyDb()) {
      mockStore.assignRoleToUser(userId, roleName, assignedBy);
      return;
    }

    try {
      const supabase = getAdminDb();
      const role = await this.findByName(roleName);
      if (!role) {
        mockStore.assignRoleToUser(userId, roleName, assignedBy);
        return;
      }

      // Delete existing roles for single-primary-role architecture
      await supabase.from('user_roles').delete().eq('user_id', userId);

      const { error } = await supabase.from('user_roles').insert({
        user_id: userId,
        role_id: role.id,
        assigned_by: assignedBy || null,
      });

      if (error) {
        mockStore.assignRoleToUser(userId, roleName, assignedBy);
      }
    } catch {
      mockStore.assignRoleToUser(userId, roleName, assignedBy);
    }
  }

  async listAllPermissions(): Promise<PermissionRow[]> {
    if (isDummyDb()) {
      return mockStore.listAllPermissions();
    }

    try {
      const supabase = getAdminDb();
      const { data, error } = await supabase.from('permissions').select('*').order('name');
      if (error || !data) return mockStore.listAllPermissions();
      return data;
    } catch {
      return mockStore.listAllPermissions();
    }
  }

  async getRolePermissions(roleId: string): Promise<PermissionRow[]> {
    if (isDummyDb()) {
      return mockStore.listAllPermissions();
    }

    try {
      const supabase = getAdminDb();
      const { data, error } = await supabase
        .from('role_permissions')
        .select('permissions(*)')
        .eq('role_id', roleId);

      if (error || !data) return mockStore.listAllPermissions();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.map((d: any) => d.permissions).filter(Boolean);
    } catch {
      return mockStore.listAllPermissions();
    }
  }
}
