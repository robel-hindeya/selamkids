import { getCurrentUser } from '@/backend/auth/session';
import { apiSuccess } from '@/backend/utils/response';
import { UnauthorizedError } from '@/backend/errors/auth-error';
import { handleApiError } from '@/backend/errors/api-error';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new UnauthorizedError();
    }

    return apiSuccess(user);
  } catch (error) {
    return handleApiError(error);
  }
}
