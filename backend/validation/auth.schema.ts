import { z } from 'zod';
import { ROLES, ALL_ROLES } from '@/backend/constants/roles';

export const loginSchema = z
  .object({
    username: z.string().trim().optional(),
    phoneNumber: z.string().trim().optional(),
    email: z.string().trim().optional(),
    password: z.string().min(1, 'Please enter your password'),
  })
  .refine((data) => data.username || data.phoneNumber || data.email, {
    message: 'Please provide a username, phone number, or email',
    path: ['username'],
  });

export const registerSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters').trim().optional(),
  countryCode: z.string().default('+251'),
  phoneNumber: z.string().min(4, 'Please enter a valid phone number').trim().optional(),
  email: z.string().trim().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  fullName: z.string().optional(),
  role: z
    .enum([ALL_ROLES[0], ...ALL_ROLES.slice(1)])
    .default(ROLES.KID)
    .optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const forgotPasswordSchema = z.object({
  countryCode: z.string().default('+251'),
  phoneNumber: z.string().trim().optional(),
  email: z.string().trim().optional(),
});

export const resetPasswordSchema = z.object({
  countryCode: z.string().default('+251'),
  phoneNumber: z.string().trim().optional(),
  email: z.string().trim().optional(),
  otpCode: z.string().min(4, 'Please enter the 6-digit verification code').trim().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
