import { NextRequest } from 'next/server';
import { requireSuperadmin } from '@/backend/auth/guards';
import { SuperadminService } from '@/backend/services/superadmin.service';
import { assignRoleSchema } from '@/backend/validation/admin.schema';
import { parsePaginationParams, createPaginationMeta } from '@/backend/utils/pagination';
import { apiSuccess } from '@/backend/utils/response';
import { handleApiError } from '@/backend/errors/api-error';

export async function GET(request: NextRequest) {
  try {
    const user = await requireSuperadmin();
    const searchParams = request.nextUrl.searchParams;
    const pagination = parsePaginationParams(searchParams);

    const superadminService = new SuperadminService();
    const { items, total } = await superadminService.listAdmins(user, pagination);
    const meta = createPaginationMeta(total, pagination.page, pagination.pageSize);

    return apiSuccess(items, meta);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireSuperadmin();
    const body = await request.json();
    const validated = assignRoleSchema.parse(body);

    const superadminService = new SuperadminService();
    await superadminService.assignUserRole(user, validated.userId, validated.role);
    return apiSuccess({ message: `Successfully assigned ${validated.role} to user ${validated.userId}` });
  } catch (error) {
    return handleApiError(error);
  }
}
