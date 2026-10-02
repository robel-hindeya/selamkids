import { NextRequest } from 'next/server';
import { requireAuth } from '@/backend/auth/guards';
import { UserService } from '@/backend/services/user.service';
import { updateUserProfileSchema } from '@/backend/validation/user.schema';
import { apiSuccess, apiNoContent } from '@/backend/utils/response';
import { handleApiError } from '@/backend/errors/api-error';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const userService = new UserService();
    const profile = await userService.getUserById(id);
    return apiSuccess(profile);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const validated = updateUserProfileSchema.parse(body);

    const userService = new UserService();
    const updated = await userService.updateProfile(user, id, validated);
    return apiSuccess(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const userService = new UserService();
    await userService.deleteUser(user, id);
    return apiNoContent();
  } catch (error) {
    return handleApiError(error);
  }
}
