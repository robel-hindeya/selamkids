import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/backend/auth/guards';
import { FamilyService } from '@/backend/services/family.service';
import { PARENT_PIN_COOKIE } from '@/backend/constants/roles';
import { apiSuccess } from '@/backend/utils/response';
import { handleApiError } from '@/backend/errors/api-error';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const familyService = new FamilyService();
    const status = await familyService.getParentPinStatus(user);
    const isUnlocked = request.cookies.get(PARENT_PIN_COOKIE)?.value === 'true';

    return apiSuccess({
      hasPin: status.hasPin,
      isUnlocked,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { action, pin, currentPin, newPin } = body;
    const familyService = new FamilyService();

    if (action === 'set') {
      if (!pin || !/^\d{4}$/.test(pin)) {
        return NextResponse.json(
          { success: false, error: { message: 'PIN must be exactly 4 digits.' } },
          { status: 400 }
        );
      }

      await familyService.setParentPin(user, pin);

      const response = apiSuccess({
        message: '4-digit Parent PIN set successfully.',
        unlocked: true,
      });

      // Set unlocked cookie for 30 minutes
      response.cookies.set(PARENT_PIN_COOKIE, 'true', {
        path: '/',
        httpOnly: false, // Accessible to client components for instant reactive UI
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 30, // 30 minutes
      });

      return response;
    }

    if (action === 'verify') {
      if (!pin || !/^\d{4}$/.test(pin)) {
        return NextResponse.json(
          { success: false, error: { message: 'Please enter a 4-digit PIN.' } },
          { status: 400 }
        );
      }

      const isValid = await familyService.verifyParentPin(user, pin);

      if (!isValid) {
        return NextResponse.json(
          { success: false, error: { message: 'Incorrect 4-digit PIN. Please try again.' } },
          { status: 401 }
        );
      }

      const response = apiSuccess({
        message: 'Parent PIN verified successfully.',
        unlocked: true,
      });

      response.cookies.set(PARENT_PIN_COOKIE, 'true', {
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 30, // 30 minutes
      });

      return response;
    }

    if (action === 'lock') {
      const response = apiSuccess({
        message: 'Parent Dashboard locked.',
        unlocked: false,
      });

      // Clear cookie immediately
      response.cookies.set(PARENT_PIN_COOKIE, '', {
        path: '/',
        maxAge: 0,
      });

      return response;
    }

    if (action === 'change') {
      if (!newPin || !/^\d{4}$/.test(newPin)) {
        return NextResponse.json(
          { success: false, error: { message: 'New PIN must be exactly 4 digits.' } },
          { status: 400 }
        );
      }

      await familyService.changeParentPin(user, currentPin, newPin);

      const response = apiSuccess({
        message: 'Parent PIN updated successfully.',
        unlocked: true,
      });

      response.cookies.set(PARENT_PIN_COOKIE, 'true', {
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 30,
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: { message: 'Unknown PIN action.' } },
      { status: 400 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
