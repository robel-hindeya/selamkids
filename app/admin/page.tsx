import { requireAdmin } from '@/backend/auth/guards';
import { AdminService } from '@/backend/services/admin.service';
import { PageHeader } from '@/components/dashboard/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Compass, Heart, GraduationCap, ScrollText, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const user = await requireAdmin();
  const adminService = new AdminService();
  const stats = await adminService.getDashboardStats(user);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <PageHeader
        title="Admin Operations Center"
        description="Monitor educational activity, manage users, moderate creative prompts, and inspect audit logs."
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="success" className="gap-1.5 py-1 px-3">
              <ShieldCheck className="h-3.5 w-3.5" />
              {stats.systemHealth}
            </Badge>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          description="Registered profiles"
          icon={<Users className="h-5 w-5" />}
          variant="default"
        />
        <StatCard
          title="Kid Authors"
          value={stats.totalKids}
          description="Active creative learners"
          icon={<Compass className="h-5 w-5" />}
          variant="magic"
        />
        <StatCard
          title="Families"
          value={stats.totalFamilies}
          description="Parent subscriptions"
          icon={<Heart className="h-5 w-5" />}
          variant="emerald"
        />
        <StatCard
          title="Educators"
          value={stats.totalTeachers}
          description="Classroom managers"
          icon={<GraduationCap className="h-5 w-5" />}
          variant="amber"
        />
        <StatCard
          title="Audit Trail"
          value={stats.totalAuditLogs}
          description="Security events logged"
          icon={<ScrollText className="h-5 w-5" />}
          variant="default"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Operations */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Administrative Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/admin/users"
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-night-200 hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700"
            >
              <span>User Directory & Status Moderation</span>
              <span className="text-night-600 font-bold">Manage &rarr;</span>
            </Link>

            <Link
              href="/admin/teachers"
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all text-xs font-semibold text-slate-700"
            >
              <span>Verify Teacher Credentials</span>
              <span className="text-emerald-600 font-bold">Review &rarr;</span>
            </Link>

            <Link
              href="/admin/content"
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all text-xs font-semibold text-slate-700"
            >
              <span>Manage Story Prompts & Writing Challenges</span>
              <span className="text-purple-600 font-bold">Edit &rarr;</span>
            </Link>

            <Link
              href="/admin/audit-logs"
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700"
            >
              <span>Inspect Security & Event Audit Logs</span>
              <span className="text-slate-700 font-bold">View Trail &rarr;</span>
            </Link>
          </CardContent>
        </Card>

        {/* Content Moderation Status */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Child Safety & Moderation Queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800">
              <span className="font-semibold">Automated Profanity & PII Filter</span>
              <Badge variant="success">ACTIVE</Badge>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Stories and creature descriptions written by children are automatically screened for
              safe language. Stories flagged for review will appear in the safety queue.
            </p>

            <div className="pt-2">
              <Link href="/admin/reports">
                <Button variant="outline" size="sm" className="w-full">
                  Open Safety & Flagged Reports
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
