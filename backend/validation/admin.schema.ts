import { z } from 'zod';
import { ALL_ROLES } from '@/backend/constants/roles';
import { USER_STATUS, CONTENT_STATUS } from '@/backend/constants/status';

export const moderateUserSchema = z.object({
  status: z.enum([
    USER_STATUS.ACTIVE,
    USER_STATUS.INACTIVE,
    USER_STATUS.SUSPENDED,
    USER_STATUS.PENDING_VERIFICATION,
  ]),
  reason: z.string().min(5, 'Reason is required for moderation action').max(300),
});

export const assignRoleSchema = z.object({
  userId: z.string().uuid('Valid user ID required'),
  role: z.enum([ALL_ROLES[0], ...ALL_ROLES.slice(1)]),
});

export const moderateContentSchema = z.object({
  contentId: z.string().uuid('Valid content ID required'),
  status: z.enum([
    CONTENT_STATUS.DRAFT,
    CONTENT_STATUS.PUBLISHED,
    CONTENT_STATUS.PENDING_REVIEW,
    CONTENT_STATUS.FLAGGED,
    CONTENT_STATUS.ARCHIVED,
  ]),
  moderationNotes: z.string().optional(),
});

export const updateSystemSettingSchema = z.object({
  key: z.string().min(2),
  value: z.any(),
  description: z.string().optional(),
});

export type ModerateUserInput = z.infer<typeof moderateUserSchema>;
export type AssignRoleInput = z.infer<typeof assignRoleSchema>;
export type ModerateContentInput = z.infer<typeof moderateContentSchema>;
export type UpdateSystemSettingInput = z.infer<typeof updateSystemSettingSchema>;
