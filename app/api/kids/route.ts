import { NextRequest } from 'next/server';
import { requireAuth } from '@/backend/auth/guards';
import { KidService } from '@/backend/services/kid.service';
import { parsePaginationParams, createPaginationMeta } from '@/backend/utils/pagination';
import { apiSuccess } from '@/backend/utils/response';
import { handleApiError } from '@/backend/errors/api-error';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const searchParams = request.nextUrl.searchParams;
    const pagination = parsePaginationParams(searchParams);
    const search = searchParams.get('search') || undefined;

    const kidService = new KidService();
    const { items, total } = await kidService.listKids(user, pagination, search);
    const meta = createPaginationMeta(total, pagination.page, pagination.pageSize);

    return apiSuccess(items, meta);
  } catch (error) {
    return handleApiError(error);
  }
}
