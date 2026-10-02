import { z } from 'zod';

export const createFamilySchema = z.object({
  userId: z.string().uuid().optional(),
  familyName: z.string().min(2, 'Family name must be at least 2 characters').max(60),
  primaryContactPhone: z.string().optional(),
  subscriptionTier: z.enum(['FREE', 'STARTER', 'PREMIUM']).default('FREE'),
  parentPin: z.string().regex(/^\d{4}$/, 'Parent PIN must be exactly 4 digits').nullable().optional(),
});

export const updateFamilySchema = createFamilySchema.partial();

export const addChildToFamilySchema = z.object({
  kidNickname: z.string().min(2, 'Nickname must be at least 2 characters'),
  age: z.number().int().min(4).max(18),
  gradeLevel: z.string().min(1),
  readingLevel: z.string().default('Emerging'),
});

export const setParentPinSchema = z.object({
  pin: z.string().regex(/^\d{4}$/, 'PIN must be exactly 4 digits'),
});

export const verifyParentPinSchema = z.object({
  pin: z.string().regex(/^\d{4}$/, 'PIN must be exactly 4 digits'),
});

export const changeParentPinSchema = z.object({
  currentPin: z.string().regex(/^\d{4}$/, 'Current PIN must be exactly 4 digits').optional(),
  newPin: z.string().regex(/^\d{4}$/, 'New PIN must be exactly 4 digits'),
});

export type CreateFamilyInput = z.infer<typeof createFamilySchema>;
export type UpdateFamilyInput = z.infer<typeof updateFamilySchema>;
export type AddChildToFamilyInput = z.infer<typeof addChildToFamilySchema>;
export type SetParentPinInput = z.infer<typeof setParentPinSchema>;
export type VerifyParentPinInput = z.infer<typeof verifyParentPinSchema>;
export type ChangeParentPinInput = z.infer<typeof changeParentPinSchema>;
