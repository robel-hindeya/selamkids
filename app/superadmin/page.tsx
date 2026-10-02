import { requireSuperadmin } from '@/backend/auth/guards';
import { SuperadminService } from '@/backend/services/superadmin.service';
import { PageHeader } from '@/components/dashboard/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Database, ScrollText, Users, Lock } from 'lucide-react';
import Link from 'next/link';

export default async function SuperadminDashboardPage() {
  const user = await requireSuperadmin();
  const superadminService = new SuperadminService();
  const overview = await superadminService.getSystemOverview(user);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <PageHeader
        title="Superadmin Command Center"
        description="High-security administrative platform control, database health, role permissions, and immutable audit logs."
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="superadmin" className="py-1 px-3 gap-1">
              <Lock className="h-3 w-3" />
              SUPERADMIN PRIVILEGED
            </Badge>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Commissioned Admins"
          value={overview.adminCount}
          description="Operational staff accounts"
          icon={<ShieldCheck className="h-5 w-5" />}
          variant="magic"
        />
        <StatCard
          title="Platform Users"
          value={overview.totalUsers}
          description="Kids, families & teachers"
          icon={<Users className="h-5 w-5" />}
          variant="default"
        />
        <StatCard
          title="Audit Trail Logs"
          value={overview.totalAuditEvents}
          description="Security activities logged"
          icon={<ScrollText className="h-5 w-5" />}
          variant="amber"
        />
        <StatCard
          title="Database Status"
          value={overview.databaseStatus}
          description={`Security: ${overview.securityLevel}`}
          icon={<Database className="h-5 w-5" />}
          variant="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-purple-200/60 shadow-md">
          <CardHeader>
            <CardTitle>System Privilege Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/superadmin/admins"
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-purple-300 hover:bg-purple-50/30 transition-all text-xs font-semibold text-slate-800"
            >
              <span>Commission or Demote Admin Accounts</span>
              <span className="text-purple-700 font-bold">Manage Admins &rarr;</span>
            </Link>

            <Link
              href="/superadmin/roles"
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-purple-300 hover:bg-purple-50/30 transition-all text-xs font-semibold text-slate-800"
            >
              <span>Role Permissions Matrix</span>
              <span className="text-purple-700 font-bold">Configure Matrix &rarr;</span>
            </Link>

            <Link
              href="/superadmin/system"
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-purple-300 hover:bg-purple-50/30 transition-all text-xs font-semibold text-slate-800"
            >
              <span>Platform Core Health & Diagnostic Telemetry</span>
              <span className="text-purple-700 font-bold">Diagnostics &rarr;</span>
            </Link>

            <Link
              href="/superadmin/audit-logs"
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-purple-300 hover:bg-purple-50/30 transition-all text-xs font-semibold text-slate-800"
            >
              <span>Global Audit Logs & Tamper Inspection</span>
              <span className="text-purple-700 font-bold">Inspect Trail &rarr;</span>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Active System Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(overview.activeSettings).length === 0 ? (
              <p className="text-xs text-slate-400">Default settings active from environment.</p>
            ) : (
              Object.entries(overview.activeSettings).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs"
                >
                  <span className="font-mono text-slate-600 font-bold">{key}</span>
                  <span className="font-mono text-slate-800 font-semibold truncate max-w-[200px]">
                    {JSON.stringify(value)}
                  </span>
                </div>
              ))
            )}
            <div className="pt-2">
              <Link href="/superadmin/settings">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Update System Settings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
