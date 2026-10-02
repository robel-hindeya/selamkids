import { NextRequest } from 'next/server';
import { requireAuth } from '@/backend/auth/guards';
import { TeacherService } from '@/backend/services/teacher.service';
import { parsePaginationParams, createPaginationMeta } from '@/backend/utils/pagination';
import { apiSuccess } from '@/backend/utils/response';
import { handleApiError } from '@/backend/errors/api-error';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const searchParams = request.nextUrl.searchParams;
    const pagination = parsePaginationParams(searchParams);
    const search = searchParams.get('search') || undefined;

    const teacherService = new TeacherService();
    const { items, total } = await teacherService.listTeachers(user, pagination, search);
    const meta = createPaginationMeta(total, pagination.page, pagination.pageSize);

    return apiSuccess(items, meta);
  } catch (error) {
    return handleApiError(error);
  }
}
