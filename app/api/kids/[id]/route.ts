import { NextRequest } from 'next/server';
import { requireAuth } from '@/backend/auth/guards';
import { KidService } from '@/backend/services/kid.service';
import { updateKidSchema } from '@/backend/validation/kid.schema';
import { apiSuccess } from '@/backend/utils/response';
import { handleApiError } from '@/backend/errors/api-error';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const kidService = new KidService();
    const kid = await kidService.getKidById(user, id);
    return apiSuccess(kid);
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
    const validated = updateKidSchema.parse(body);

    const kidService = new KidService();
    const updated = await kidService.updateKidProfile(user, id, validated);
    return apiSuccess(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
