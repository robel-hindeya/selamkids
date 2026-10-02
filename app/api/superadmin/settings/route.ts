import { NextRequest } from 'next/server';
import { requireSuperadmin } from '@/backend/auth/guards';
import { SuperadminService } from '@/backend/services/superadmin.service';
import { SystemSettingsRepository } from '@/backend/db/repositories/system-settings.repository';
import { updateSystemSettingSchema } from '@/backend/validation/admin.schema';
import { apiSuccess } from '@/backend/utils/response';
import { handleApiError } from '@/backend/errors/api-error';

export async function GET() {
  try {
    await requireSuperadmin();
    const settingsRepo = new SystemSettingsRepository();
    const settings = await settingsRepo.getAll();
    return apiSuccess(settings);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireSuperadmin();
    const body = await request.json();
    const validated = updateSystemSettingSchema.parse(body);

    const superadminService = new SuperadminService();
    await superadminService.updateSystemSetting(
      user,
      validated.key,
      validated.value,
      validated.description
    );
    return apiSuccess({ message: `Setting ${validated.key} updated successfully` });
  } catch (error) {
    return handleApiError(error);
  }
}
