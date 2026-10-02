import { requireSuperadmin } from '@/backend/auth/guards';
import { SuperadminService } from '@/backend/services/superadmin.service';
import { SystemSettingsRepository } from '@/backend/db/repositories/system-settings.repository';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { revalidatePath } from 'next/cache';
import { Json } from '@/types/database';

export default async function SuperadminSettingsPage() {
  await requireSuperadmin();
  const settingsRepo = new SystemSettingsRepository();
  const settings = await settingsRepo.getAll();

  async function updateSettingAction(formData: FormData) {
    'use server';
    const currentUser = await requireSuperadmin();
    const service = new SuperadminService();
    const key = formData.get('key') as string;
    const valueRaw = formData.get('value') as string;

    let parsedValue: Json = valueRaw;
    try {
      parsedValue = JSON.parse(valueRaw);
    } catch {
      parsedValue = valueRaw;
    }

    await service.updateSystemSetting(currentUser, key, parsedValue);
    revalidatePath('/superadmin/settings');
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Core System Settings"
        description="Global platform parameters, economy rewards, and public registration policies."
        breadcrumbs={[
          { label: 'Superadmin', href: '/superadmin' },
          { label: 'Settings' },
        ]}
      />

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>System Key-Value Store</CardTitle>
          <CardDescription>
            Direct runtime parameters controlling application behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(settings).length === 0 ? (
            <p className="text-xs text-slate-500">No system settings initialized yet.</p>
          ) : (
            Object.entries(settings).map(([key, val]) => (
              <form
                key={key}
                action={updateSettingAction}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50"
              >
                <div className="space-y-1">
                  <span className="font-mono text-xs font-bold text-slate-800">{key}</span>
                  <input type="hidden" name="key" value={key} />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    name="value"
                    defaultValue={typeof val === 'object' ? JSON.stringify(val) : String(val)}
                    className="flex-1 sm:w-64 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-purple-500"
                  />
                  <Button type="submit" variant="magic" size="sm" className="text-xs h-8">
                    Save
                  </Button>
                </div>
              </form>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
