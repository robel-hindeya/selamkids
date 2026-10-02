import { NextRequest } from 'next/server';
import { getServerDb } from '@/backend/db/server';
import { forgotPasswordSchema } from '@/backend/validation/auth.schema';
import { apiSuccess } from '@/backend/utils/response';
import { handleApiError } from '@/backend/errors/api-error';
import { getPhoneAuthStore } from '@/backend/auth/phone-auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = forgotPasswordSchema.parse(body);

    const countryCode = validated.countryCode || '+251';
    const phoneNumber = validated.phoneNumber?.trim();

    if (phoneNumber) {
      const phoneAuth = getPhoneAuthStore();
      const { otpCode, fullPhone } = phoneAuth.sendOtp(countryCode, phoneNumber);

      return apiSuccess({
        message: `OTP sent successfully to ${fullPhone}`,
        otpCode, // Returned for instant testing & simulated SMS display in UI
        fullPhone,
      });
    }

    if (validated.email) {
      try {
        const supabase = await getServerDb();
        await supabase.auth.resetPasswordForEmail(validated.email, {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password`,
        });
      } catch {
        // Fallback
      }
      return apiSuccess({
        message: 'Password reset instructions have been sent to your email.',
      });
    }

    throw new Error('Please provide a phone number to receive an OTP code.');
  } catch (error) {
    return handleApiError(error);
  }
}
