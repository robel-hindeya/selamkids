import { z } from 'zod';

export const createKidSchema = z.object({
  userId: z.string().uuid('Invalid user ID').optional(),
  nickname: z.string().min(2, 'Nickname must be at least 2 characters').max(30).trim(),
  age: z.number().int().min(4, 'Minimum age is 4').max(18, 'Maximum age is 18'),
  gradeLevel: z.string().min(1, 'Grade level is required'),
  creatureName: z.string().max(50).optional(),
  creatureType: z.string().max(50).optional(),
  creatureImageUrl: z.string().optional().or(z.literal('')),
  readingLevel: z.string().default('Emerging'),
  familyId: z.string().uuid().optional(),
  classroomId: z.string().uuid().optional(),
});

export const updateKidSchema = createKidSchema.partial();

export const createKidStorySchema = z.object({
  title: z.string().min(3, 'Story title must be at least 3 characters').max(100),
  content: z.string().min(10, 'Story must have at least 10 words/characters'),
  creatureName: z.string().optional(),
  prompt: z.string().optional(),
  category: z.string().optional(),
});

export const awardOrbsSchema = z.object({
  amount: z.number().int().positive('Orb reward must be positive'),
  reason: z.string().min(3, 'Reason is required'),
});

export type CreateKidInput = z.infer<typeof createKidSchema>;
export type UpdateKidInput = z.infer<typeof updateKidSchema>;
export type CreateKidStoryInput = z.infer<typeof createKidStorySchema>;
export type AwardOrbsInput = z.infer<typeof awardOrbsSchema>;
