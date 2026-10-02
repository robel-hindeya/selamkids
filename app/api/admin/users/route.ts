import { NextRequest } from 'next/server';
import { requireAdmin } from '@/backend/auth/guards';
import { AdminService } from '@/backend/services/admin.service';
import { moderateUserSchema } from '@/backend/validation/admin.schema';
import { apiSuccess } from '@/backend/utils/response';
import { handleApiError } from '@/backend/errors/api-error';

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAdmin();
    const body = await request.json();
    const { userId, ...rest } = body;
    const validated = moderateUserSchema.parse(rest);

    const adminService = new AdminService();
    const updated = await adminService.moderateUser(user, userId, validated);
    return apiSuccess(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
