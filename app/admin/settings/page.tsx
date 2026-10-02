import { requireAdmin } from '@/backend/auth/guards';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SystemSettingsRepository } from '@/backend/db/repositories/system-settings.repository';
import { AuditLogRepository } from '@/backend/db/repositories/audit-log.repository';
import { revalidatePath } from 'next/cache';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdmin();
  const settingsRepo = new SystemSettingsRepository();
  const settings = await settingsRepo.getAll();
  const params = await searchParams;
  const isSaved = params.saved === 'true';

  async function saveSettingsAction(formData: FormData) {
    'use server';
    const currentUser = await requireAdmin();
    const repo = new SystemSettingsRepository();
    const audit = new AuditLogRepository();

    const profanity = formData.get('profanityFilter') === 'on';
    const teacherDirect = formData.get('teacherDirect') === 'on';
    const dailyCap = parseInt(formData.get('dailyOrbCap') as string, 10) || 500;
    const aiAssistant = formData.get('aiAssistant') === 'on';

    await repo.set('moderation.coppa_strict_filter', profanity, currentUser.id);
    await repo.set('moderation.teacher_direct_publish', teacherDirect, currentUser.id);
    await repo.set('economy.daily_orb_cap', dailyCap, currentUser.id);
    await repo.set('ai.story_assistant_enabled', aiAssistant, currentUser.id);

    await audit.createLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'UPDATE',
      resource: 'admin.settings',
      details: { profanity, teacherDirect, dailyCap, aiAssistant },
    });

    revalidatePath('/admin/settings');
  }

  const strictFilter = settings['moderation.coppa_strict_filter'] !== false;
  const teacherPublish = settings['moderation.teacher_direct_publish'] !== false;
  const dailyOrbCap = (settings['economy.daily_orb_cap'] as number) || 500;
  const aiAssist = settings['ai.story_assistant_enabled'] !== false;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Admin Operational Settings"
        description="Configure classroom moderation thresholds, safety filters, and student economy parameters."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Settings' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="success" className="gap-1 py-1 px-3">
              <ShieldCheck className="h-3.5 w-3.5" />
              Settings Synced
            </Badge>
          </div>
        }
      />

      {isSaved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Operational settings successfully saved and applied across the realm.</span>
        </div>
      )}

      <form action={saveSettingsAction} className="space-y-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Content Moderation Preferences</CardTitle>
            <CardDescription>
              Rules governing automatic filtering of young author stories
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="pr-4">
                <p className="text-xs font-bold text-slate-800">Strict COPPA Profanity & PII Filter</p>
                <p className="text-[11px] text-slate-500">Automatically mask flagged words and prevent personal identifier leaks</p>
              </div>
              <input
                type="checkbox"
                name="profanityFilter"
                defaultChecked={strictFilter}
                className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="pr-4">
                <p className="text-xs font-bold text-slate-800">Teacher Direct Publishing Clearance</p>
                <p className="text-[11px] text-slate-500">Allow verified educators to approve student writing to the Night Zoo Magazine directly</p>
              </div>
              <input
                type="checkbox"
                name="teacherDirect"
                defaultChecked={teacherPublish}
                className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="pr-4">
                <p className="text-xs font-bold text-slate-800">Creative AI Story Assistant</p>
                <p className="text-[11px] text-slate-500">Provide gentle grammar suggestions and vocabulary boosts to young authors</p>
              </div>
              <input
                type="checkbox"
                name="aiAssistant"
                defaultChecked={aiAssist}
                className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Economy & Rewards</CardTitle>
            <CardDescription>
              Rules governing orb distributions and creative quest caps
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-800">Daily Student Orb Cap</p>
                <p className="text-[11px] text-slate-500">Maximum orbs a student can earn per 24 hours to balance engagement</p>
              </div>
              <input
                type="number"
                name="dailyOrbCap"
                defaultValue={dailyOrbCap}
                min="50"
                max="5000"
                className="w-28 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold font-mono focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="magic" size="sm">
                Save Operational Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
