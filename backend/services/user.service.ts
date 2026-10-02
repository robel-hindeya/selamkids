import { UserRepository } from '@/backend/db/repositories/user.repository';
import { AuditLogRepository } from '@/backend/db/repositories/audit-log.repository';
import { UpdateUserProfileInput } from '@/backend/validation/user.schema';
import { AuthUser } from '@/types/auth';
import { NotFoundError } from '@/backend/errors/app-error';
import { requireSelfOrPermission } from '@/backend/auth/guards';
import { PERMISSIONS } from '@/backend/constants/permissions';
import { AUDIT_ACTION } from '@/backend/constants/status';
import { PaginationParams } from '@/backend/utils/pagination';
import { UserRole } from '@/backend/constants/roles';
import { Json } from '@/types/database';

export class UserService {
  private userRepo: UserRepository;
  private auditRepo: AuditLogRepository;

  constructor() {
    this.userRepo = new UserRepository();
    this.auditRepo = new AuditLogRepository();
  }

  async getUserById(id: string) {
    const profile = await this.userRepo.findById(id);
    if (!profile) {
      throw new NotFoundError('User profile');
    }
    const roleAndPerms = await this.userRepo.getUserRoleAndPermissions(id);
    return {
      ...profile,
      role: roleAndPerms?.role,
      permissions: roleAndPerms?.permissions || [],
    };
  }

  async listUsers(
    currentUser: AuthUser,
    params: PaginationParams,
    search?: string,
    roleFilter?: UserRole
  ) {
    // Requires users.read permission
    await requireSelfOrPermission(currentUser.id, PERMISSIONS.USERS_READ);
    return this.userRepo.listUsers(params, search, roleFilter);
  }

  async updateProfile(
    currentUser: AuthUser,
    targetUserId: string,
    input: UpdateUserProfileInput
  ) {
    // Only self or user with users.update can edit
    await requireSelfOrPermission(targetUserId, PERMISSIONS.USERS_UPDATE);

    const existing = await this.userRepo.findById(targetUserId);
    if (!existing) {
      throw new NotFoundError('User profile');
    }

    const updated = await this.userRepo.updateProfile(targetUserId, {
      full_name: input.fullName ?? existing.full_name,
      avatar_url: input.avatarUrl ?? existing.avatar_url,
      status: input.status ?? existing.status,
    });

    await this.auditRepo.createLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: AUDIT_ACTION.UPDATE,
      resource: 'profiles',
      resource_id: targetUserId,
      details: input as unknown as Json,
    });

    return updated;
  }

  async deleteUser(currentUser: AuthUser, targetUserId: string) {
    // Only users with users.delete can delete
    await requireSelfOrPermission(targetUserId, PERMISSIONS.USERS_DELETE);

    await this.userRepo.softDelete(targetUserId);

    await this.auditRepo.createLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: AUDIT_ACTION.DELETE,
      resource: 'profiles',
      resource_id: targetUserId,
    });
  }
}
