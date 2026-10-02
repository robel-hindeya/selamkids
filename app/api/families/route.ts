import { NextRequest } from 'next/server';
import { requireAuth } from '@/backend/auth/guards';
import { FamilyService } from '@/backend/services/family.service';
import { parsePaginationParams, createPaginationMeta } from '@/backend/utils/pagination';
import { apiSuccess } from '@/backend/utils/response';
import { handleApiError } from '@/backend/errors/api-error';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const searchParams = request.nextUrl.searchParams;
    const pagination = parsePaginationParams(searchParams);
    const search = searchParams.get('search') || undefined;

    const familyService = new FamilyService();
    const { items, total } = await familyService.listFamilies(user, pagination, search);
    const meta = createPaginationMeta(total, pagination.page, pagination.pageSize);

    return apiSuccess(items, meta);
  } catch (error) {
    return handleApiError(error);
  }
}
