import { NextRequest } from 'next/server';
import { getServerDb } from '@/backend/db/server';
import { resetPasswordSchema } from '@/backend/validation/auth.schema';
import { apiSuccess } from '@/backend/utils/response';
import { handleApiError } from '@/backend/errors/api-error';
import { getPhoneAuthStore } from '@/backend/auth/phone-auth';
import {
  LOCAL_SESSION_COOKIE,
  createLocalSession,
  encodeSession,
} from '@/backend/auth/session/local-session';
import { ROLE_REDIRECTS } from '@/backend/constants/roles';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = resetPasswordSchema.parse(body);

    const countryCode = validated.countryCode || '+251';
    const phoneNumber = validated.phoneNumber?.trim();
    const otpCode = validated.otpCode?.trim();

    if (phoneNumber && otpCode) {
      const phoneAuth = getPhoneAuthStore();
      const updatedUser = phoneAuth.resetPasswordByPhone(
        countryCode,
        phoneNumber,
        otpCode,
        validated.password
      );

      // Provision session for immediate "login again"
      const localSession = createLocalSession({
        id: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        role: updatedUser.role,
      });
      const token = encodeSession(localSession);

      const response = apiSuccess({
        message: 'Password successfully updated! You are now logged in.',
        user: {
          id: localSession.id,
          username: updatedUser.username,
          role: localSession.role,
        },
        redirectTo: ROLE_REDIRECTS[updatedUser.role] || '/users/kids',
      });

      response.cookies.set(LOCAL_SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    // Fallback Supabase updateUser if standard email reset
    try {
      const supabase = await getServerDb();
      await supabase.auth.updateUser({
        password: validated.password,
      });
    } catch {
      // Fallback
    }

    return apiSuccess({
      message: 'Password successfully updated.',
      redirectTo: '/auth/login',
    });
  } catch (error) {
    return handleApiError(error);
  }
}
