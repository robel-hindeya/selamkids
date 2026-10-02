import { NextRequest } from 'next/server';
import { requireAuth } from '@/backend/auth/guards';
import { TeacherService } from '@/backend/services/teacher.service';
import { updateTeacherSchema } from '@/backend/validation/teacher.schema';
import { apiSuccess } from '@/backend/utils/response';
import { handleApiError } from '@/backend/errors/api-error';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const teacherService = new TeacherService();
    const teacher = await teacherService.getTeacherById(user, id);
    return apiSuccess(teacher);
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
    const validated = updateTeacherSchema.parse(body);

    const teacherService = new TeacherService();
    const updated = await teacherService.updateTeacher(user, id, validated);
    return apiSuccess(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
