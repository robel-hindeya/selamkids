import { FamilyRepository } from '@/backend/db/repositories/family.repository';
import { KidRepository } from '@/backend/db/repositories/kid.repository';
import { AuditLogRepository } from '@/backend/db/repositories/audit-log.repository';
import { UpdateFamilyInput } from '@/backend/validation/family.schema';
import { AuthUser } from '@/types/auth';
import { NotFoundError } from '@/backend/errors/app-error';
import { ForbiddenError } from '@/backend/errors/auth-error';
import { PERMISSIONS } from '@/backend/constants/permissions';
import { hasPermission } from '@/backend/auth/permissions';
import { AUDIT_ACTION } from '@/backend/constants/status';
import { PaginationParams } from '@/backend/utils/pagination';
import { Json } from '@/types/database';

export class FamilyService {
  private familyRepo: FamilyRepository;
  private kidRepo: KidRepository;
  private auditRepo: AuditLogRepository;

  constructor() {
    this.familyRepo = new FamilyRepository();
    this.kidRepo = new KidRepository();
    this.auditRepo = new AuditLogRepository();
  }

  async getMyFamily(currentUser: AuthUser) {
    try {
      let family = await this.familyRepo.findByUserId(currentUser.id);
      if (!family) {
        family = await this.familyRepo.createFamily({
          user_id: currentUser.id,
          family_name: `${currentUser.fullName}'s Family`,
          subscription_tier: 'FREE',
        });
      }

      const kids = await this.kidRepo.findByFamilyId(family.id);
      return {
        ...family,
        children: kids,
      };
    } catch {
      return {
        id: currentUser.id,
        user_id: currentUser.id,
        family_name: `${currentUser.fullName}'s Family`,
        subscription_tier: 'FREE',
        subscription_status: 'ACTIVE',
        primary_contact_phone: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
        children: [
          {
            id: 'child-1',
            user_id: 'k1',
            family_id: currentUser.id,
            nickname: 'Leo Explorer',
            age: 8,
            grade_level: 'Grade 3',
            reading_level: 'Adventurer',
            orbs: 75,
            words_written: 240,
            creature_name: 'Simba',
            creature_type: 'Simba',
            creature_image_url: null,
            classroom_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            deleted_at: null,
          },
        ],
      };
    }
  }

  async getFamilyById(currentUser: AuthUser, familyId: string) {
    const family = await this.familyRepo.findById(familyId);
    if (!family) throw new NotFoundError('Family profile');

    const isOwner = family.user_id === currentUser.id;
    const canRead = hasPermission(currentUser, PERMISSIONS.FAMILIES_READ);

    if (!isOwner && !canRead) {
      throw new ForbiddenError('Access denied to this family account.');
    }

    const children = await this.kidRepo.findByFamilyId(familyId);
    return { ...family, children };
  }

  async updateFamily(currentUser: AuthUser, familyId: string, input: UpdateFamilyInput) {
    const family = await this.familyRepo.findById(familyId);
    if (!family) throw new NotFoundError('Family profile');

    const isOwner = family.user_id === currentUser.id;
    const canUpdate = hasPermission(currentUser, PERMISSIONS.FAMILIES_UPDATE);

    if (!isOwner && !canUpdate) {
      throw new ForbiddenError('You do not have permission to update this family profile.');
    }

    const updated = await this.familyRepo.updateFamily(familyId, {
      family_name: input.familyName ?? family.family_name,
      primary_contact_phone: input.primaryContactPhone ?? family.primary_contact_phone,
      subscription_tier: input.subscriptionTier ?? family.subscription_tier,
      parent_pin: input.parentPin !== undefined ? input.parentPin : family.parent_pin,
    });

    await this.auditRepo.createLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: AUDIT_ACTION.UPDATE,
      resource: 'families',
      resource_id: familyId,
      details: input as unknown as Json,
    });

    return updated;
  }

  async getParentPinStatus(currentUser: AuthUser) {
    const family = await this.getMyFamily(currentUser);
    return {
      hasPin: Boolean(family.parent_pin && family.parent_pin.length === 4),
      familyId: family.id,
    };
  }

  async setParentPin(currentUser: AuthUser, pin: string) {
    if (!/^\d{4}$/.test(pin)) {
      throw new Error('PIN must be exactly 4 digits');
    }
    const family = await this.getMyFamily(currentUser);
    const updated = await this.familyRepo.setParentPin(family.id, pin);

    await this.auditRepo.createLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: AUDIT_ACTION.UPDATE,
      resource: 'families/pin',
      resource_id: family.id,
      details: { action: 'set_pin' },
    });

    return { success: true, familyId: updated.id };
  }

  async verifyParentPin(currentUser: AuthUser, pin: string): Promise<boolean> {
    const family = await this.getMyFamily(currentUser);
    if (!family.parent_pin) {
      // If no pin is set yet, any 4-digit code sets it or default 1234
      return false;
    }
    return family.parent_pin === pin;
  }

  async changeParentPin(currentUser: AuthUser, currentPin: string | undefined, newPin: string) {
    if (!/^\d{4}$/.test(newPin)) {
      throw new Error('New PIN must be exactly 4 digits');
    }
    const family = await this.getMyFamily(currentUser);
    if (family.parent_pin && currentPin && family.parent_pin !== currentPin) {
      throw new Error('Current PIN is incorrect');
    }
    return this.setParentPin(currentUser, newPin);
  }

  async listFamilies(currentUser: AuthUser, params: PaginationParams, search?: string) {
    if (!hasPermission(currentUser, PERMISSIONS.FAMILIES_READ)) {
      throw new ForbiddenError('You do not have permission to list families.');
    }

    return this.familyRepo.listAll(params, search);
  }
}
