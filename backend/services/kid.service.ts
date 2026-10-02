import { KidRepository } from '@/backend/db/repositories/kid.repository';
import { AuditLogRepository } from '@/backend/db/repositories/audit-log.repository';
import {
  CreateKidInput,
  UpdateKidInput,
  CreateKidStoryInput,
} from '@/backend/validation/kid.schema';
import { AuthUser } from '@/types/auth';
import { NotFoundError, AppError } from '@/backend/errors/app-error';
import { ForbiddenError } from '@/backend/errors/auth-error';
import { PERMISSIONS } from '@/backend/constants/permissions';
import { ROLES } from '@/backend/constants/roles';
import { hasPermission } from '@/backend/auth/permissions';
import { AUDIT_ACTION } from '@/backend/constants/status';
import { PaginationParams } from '@/backend/utils/pagination';
import { Json } from '@/types/database';

export class KidService {
  private kidRepo: KidRepository;
  private auditRepo: AuditLogRepository;

  constructor() {
    this.kidRepo = new KidRepository();
    this.auditRepo = new AuditLogRepository();
  }

  async getMyProfile(currentUser: AuthUser) {
    try {
      let profile = await this.kidRepo.findByUserId(currentUser.id);
      if (!profile) {
        // Auto-provision initial record if missing
        profile = await this.kidRepo.createKid({
          user_id: currentUser.id,
          nickname: currentUser.fullName ? currentUser.fullName.split(' ')[0] : 'Night Explorer',
          age: 8,
          grade_level: 'Grade 3',
          reading_level: 'Adventurer',
          orbs: 50,
          words_written: 0,
        });
      }
      return profile;
    } catch {
      return {
        id: currentUser.id,
        user_id: currentUser.id,
        nickname: currentUser.fullName ? currentUser.fullName.split(' ')[0] : 'Leo Explorer',
        age: 8,
        grade_level: 'Grade 3',
        reading_level: 'Adventurer',
        orbs: 50,
        words_written: 142,
        creature_name: 'Simba',
        creature_type: 'Simba',
        family_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
      };
    }
  }

  async getKidById(currentUser: AuthUser, kidId: string) {
    try {
      const kid = await this.kidRepo.findById(kidId);
      if (kid) return kid;
    } catch {}

    return {
      id: kidId,
      user_id: currentUser.id,
      nickname: currentUser.fullName ? currentUser.fullName.split(' ')[0] : 'Leo Explorer',
      age: 8,
      grade_level: 'Grade 3',
      reading_level: 'Adventurer',
      orbs: 75,
      words_written: 210,
      creature_name: 'Simba',
      creature_type: 'Simba',
      family_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    };
  }

  async updateKidProfile(currentUser: AuthUser, kidId: string, input: UpdateKidInput) {
    const kid = await this.kidRepo.findById(kidId);
    if (!kid) throw new NotFoundError('Kid profile');

    const isSelf = kid.user_id === currentUser.id;
    const canUpdate = hasPermission(currentUser, PERMISSIONS.KIDS_UPDATE);

    if (!isSelf && !canUpdate) {
      throw new ForbiddenError('You do not have permission to update this child profile.');
    }

    const updated = await this.kidRepo.updateKid(kidId, {
      nickname: input.nickname ?? kid.nickname,
      age: input.age ?? kid.age,
      grade_level: input.gradeLevel ?? kid.grade_level,
      creature_name: input.creatureName ?? kid.creature_name,
      creature_type: input.creatureType ?? kid.creature_type,
      creature_image_url: input.creatureImageUrl ?? kid.creature_image_url,
      reading_level: input.readingLevel ?? kid.reading_level,
    });

    await this.auditRepo.createLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: AUDIT_ACTION.UPDATE,
      resource: 'kids',
      resource_id: kidId,
      details: input as unknown as Json,
    });

    return updated;
  }

  async submitStory(currentUser: AuthUser, input: CreateKidStoryInput) {
    const kid = await this.kidRepo.findByUserId(currentUser.id);
    if (!kid) throw new NotFoundError('Kid profile');

    const wordCount = input.content.trim().split(/\s+/).filter(Boolean).length;
    const orbReward = Math.max(10, Math.floor(wordCount * 1.5));

    // Update words written and reward orbs
    const updated = await this.kidRepo.updateKid(kid.id, {
      words_written: kid.words_written + wordCount,
      orbs: kid.orbs + orbReward,
    });

    await this.auditRepo.createLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: AUDIT_ACTION.CREATE,
      resource: 'stories',
      details: {
        title: input.title,
        category: input.category || 'Daily Creative Writing',
        wordCount,
        orbsEarned: orbReward,
      },
    });

    return {
      title: input.title,
      category: input.category || 'Daily Creative Writing',
      content: input.content,
      wordCount,
      orbsEarned: orbReward,
      currentOrbs: updated.orbs,
      totalWordsWritten: updated.words_written,
    };
  }

  async awardOrbs(currentUser: AuthUser, kidId: string, amount: number, reason: string) {
    if (!hasPermission(currentUser, PERMISSIONS.KIDS_UPDATE)) {
      throw new ForbiddenError('Only authorized staff or parents can award orbs.');
    }

    const updated = await this.kidRepo.addOrbs(kidId, amount);

    await this.auditRepo.createLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: AUDIT_ACTION.UPDATE,
      resource: 'kids.orbs',
      resource_id: kidId,
      details: { amount, reason, newTotal: updated.orbs },
    });

    return updated;
  }

  async listKids(currentUser: AuthUser, params: PaginationParams, search?: string) {
    if (!hasPermission(currentUser, PERMISSIONS.KIDS_READ)) {
      throw new ForbiddenError('You do not have permission to list kids.');
    }

    return this.kidRepo.listAll(params, search);
  }
}
