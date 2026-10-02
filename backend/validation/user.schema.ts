import { z } from 'zod';
import { USER_STATUS } from '@/backend/constants/status';

export const updateUserProfileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
  avatarUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  status: z
    .enum([
      USER_STATUS.ACTIVE,
      USER_STATUS.INACTIVE,
      USER_STATUS.SUSPENDED,
      USER_STATUS.PENDING_VERIFICATION,
    ])
    .optional(),
});

export const updateRoleSchema = z.object({
  role: z.enum(['KID', 'FAMILY', 'TEACHER', 'ADMIN', 'SUPERADMIN']),
});

export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
