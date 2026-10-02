import { NextRequest } from 'next/server';
import { requireAuth } from '@/backend/auth/guards';
import { KidService } from '@/backend/services/kid.service';
import { createKidStorySchema } from '@/backend/validation/kid.schema';
import { apiCreated } from '@/backend/utils/response';
import { handleApiError } from '@/backend/errors/api-error';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const validated = createKidStorySchema.parse(body);

    const kidService = new KidService();
    const result = await kidService.submitStory(user, validated);
    return apiCreated(result);
  } catch (error) {
    return handleApiError(error);
  }
}
