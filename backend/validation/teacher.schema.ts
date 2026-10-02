import { z } from 'zod';

export const createTeacherSchema = z.object({
  userId: z.string().uuid().optional(),
  schoolName: z.string().min(2, 'School name is required').max(100),
  department: z.string().max(60).optional(),
  gradeLevel: z.string().min(1, 'Grade level is required'),
});

export const updateTeacherSchema = createTeacherSchema.partial();

export const createClassroomSchema = z.object({
  name: z.string().min(2, 'Classroom name must be at least 2 characters').max(60),
  gradeLevel: z.string().min(1, 'Grade level is required'),
  description: z.string().optional(),
});

export const createAssignmentSchema = z.object({
  title: z.string().min(3, 'Assignment title is required').max(100),
  prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
  genre: z.string().default('Adventure Story'),
  minWords: z.number().int().min(10).default(50),
  dueDate: z.string().optional(),
});

export type CreateTeacherInput = z.infer<typeof createTeacherSchema>;
export type UpdateTeacherInput = z.infer<typeof updateTeacherSchema>;
export type CreateClassroomInput = z.infer<typeof createClassroomSchema>;
export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
