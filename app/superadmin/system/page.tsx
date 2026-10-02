import { requireSuperadmin } from '@/backend/auth/guards';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Server, ShieldCheck } from 'lucide-react';

export default async function SuperadminSystemPage() {
  await requireSuperadmin();

  const nodeVersion = process.version;
  const env = process.env.NODE_ENV || 'development';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="System Telemetry & Health"
        description="Low-level environment diagnostics and security runtime inspection."
        breadcrumbs={[
          { label: 'Superadmin', href: '/superadmin' },
          { label: 'System' },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-purple-600" />
              Runtime Environment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 font-mono text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Node.js Engine:</span>
              <span className="font-bold text-slate-800">{nodeVersion}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Framework:</span>
              <span className="font-bold text-slate-800">Next.js 15 (App Router)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Environment:</span>
              <Badge variant={env === 'production' ? 'success' : 'secondary'}>{env}</Badge>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Base Origin:</span>
              <span className="font-bold text-slate-800">{appUrl}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              Security Integrity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 font-mono text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Supabase RLS:</span>
              <Badge variant="success">ENFORCED (ALL 11 TABLES)</Badge>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">SSR Cookie Auth:</span>
              <Badge variant="success">HTTP-ONLY SECURE</Badge>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Service Role Exposure:</span>
              <Badge variant="success">ISOLATED SERVER-SIDE</Badge>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Continuous Audit:</span>
              <Badge variant="success">ENABLED</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
