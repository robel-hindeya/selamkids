import { requireAdmin } from '@/backend/auth/guards';
import { AdminService } from '@/backend/services/admin.service';
import { apiSuccess } from '@/backend/utils/response';
import { handleApiError } from '@/backend/errors/api-error';

export async function GET() {
  try {
    const user = await requireAdmin();
    const adminService = new AdminService();
    const stats = await adminService.getDashboardStats(user);
    return apiSuccess(stats);
  } catch (error) {
    return handleApiError(error);
  }
}
