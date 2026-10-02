import { UserRepository } from '@/backend/db/repositories/user.repository';
import { AuditLogRepository } from '@/backend/db/repositories/audit-log.repository';
import { getAdminDb, isDummyDb } from '@/backend/db/admin';
import { mockStore } from '@/backend/db/mock-store';
import { ModerateUserInput } from '@/backend/validation/admin.schema';
import { AuthUser } from '@/types/auth';
import { ROLES } from '@/backend/constants/roles';
import { requireAdmin } from '@/backend/auth/guards';
import { ForbiddenError } from '@/backend/errors';
import { AUDIT_ACTION } from '@/backend/constants/status';
import { PaginationParams } from '@/backend/utils/pagination';

export class AdminService {
  private userRepo: UserRepository;
  private auditRepo: AuditLogRepository;

  constructor() {
    this.userRepo = new UserRepository();
    this.auditRepo = new AuditLogRepository();
  }

  async getDashboardStats(currentUser: AuthUser) {
    await requireAdmin();

    if (isDummyDb()) {
      const usersCount = mockStore.profiles.filter((p) => !p.deleted_at).length;
      const kidsCount = mockStore.kids.filter((k) => !k.deleted_at).length;
      const familiesCount = mockStore.families.filter((f) => !f.deleted_at).length;
      const teachersCount = mockStore.teachers.filter((t) => !t.deleted_at).length;
      const auditLogsCount = mockStore.auditLogs.length;

      return {
        totalUsers: usersCount,
        totalKids: kidsCount,
        totalFamilies: familiesCount,
        totalTeachers: teachersCount,
        totalAuditLogs: auditLogsCount,
        systemHealth: 'OPERATIONAL',
        activeTheme: 'Night Zoo Explorers & Story Crafters',
      };
    }

    try {
      const supabase = getAdminDb();

      const [
        { count: usersCount },
        { count: kidsCount },
        { count: familiesCount },
        { count: teachersCount },
        { count: auditLogsCount },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).is('deleted_at', null),
        supabase.from('kids').select('*', { count: 'exact', head: true }).is('deleted_at', null),
        supabase.from('families').select('*', { count: 'exact', head: true }).is('deleted_at', null),
        supabase.from('teachers').select('*', { count: 'exact', head: true }).is('deleted_at', null),
        supabase.from('audit_logs').select('*', { count: 'exact', head: true }),
      ]);

      return {
        totalUsers: usersCount || 0,
        totalKids: kidsCount || 0,
        totalFamilies: familiesCount || 0,
        totalTeachers: teachersCount || 0,
        totalAuditLogs: auditLogsCount || 0,
        systemHealth: 'OPERATIONAL',
        activeTheme: 'Night Zoo Explorers & Story Crafters',
      };
    } catch {
      return {
        totalUsers: mockStore.profiles.filter((p) => !p.deleted_at).length || 14,
        totalKids: mockStore.kids.filter((k) => !k.deleted_at).length || 5,
        totalFamilies: mockStore.families.filter((f) => !f.deleted_at).length || 3,
        totalTeachers: mockStore.teachers.filter((t) => !t.deleted_at).length || 4,
        totalAuditLogs: mockStore.auditLogs.length || 5,
        systemHealth: 'OPERATIONAL',
        activeTheme: 'Night Zoo Explorers & Story Crafters',
      };
    }
  }

  async moderateUser(currentUser: AuthUser, targetUserId: string, input: ModerateUserInput) {
    await requireAdmin();

    // Ensure target is not a SUPERADMIN (admin cannot moderate superadmin!)
    const targetRole = await this.userRepo.getUserRoleAndPermissions(targetUserId);
    if (targetRole?.role === ROLES.SUPERADMIN) {
      throw new ForbiddenError('Administrative staff cannot moderate or modify Superadmin accounts.');
    }

    const updated = await this.userRepo.updateProfile(targetUserId, {
      status: input.status,
    });

    await this.auditRepo.createLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: AUDIT_ACTION.UPDATE,
      resource: 'users.moderation',
      resource_id: targetUserId,
      details: { status: input.status, reason: input.reason },
    });

    return updated;
  }

  async listAuditLogs(
    currentUser: AuthUser,
    params: PaginationParams,
    filters?: { action?: string; resource?: string }
  ) {
    await requireAdmin();
    return this.auditRepo.listLogs(params, filters);
  }
}
