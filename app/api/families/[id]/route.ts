import { NextRequest } from 'next/server';
import { requireAuth } from '@/backend/auth/guards';
import { FamilyService } from '@/backend/services/family.service';
import { updateFamilySchema } from '@/backend/validation/family.schema';
import { apiSuccess } from '@/backend/utils/response';
import { handleApiError } from '@/backend/errors/api-error';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const familyService = new FamilyService();
    const family = await familyService.getFamilyById(user, id);
    return apiSuccess(family);
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
    const validated = updateFamilySchema.parse(body);

    const familyService = new FamilyService();
    const updated = await familyService.updateFamily(user, id, validated);
    return apiSuccess(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
