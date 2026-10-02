import { requireSuperadmin } from '@/backend/auth/guards';
import { PageHeader } from '@/components/dashboard/page-header';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck } from 'lucide-react';

export default async function SuperadminDatabasePage() {
  await requireSuperadmin();

  const tables = [
    { name: 'profiles', rls: true, foreignKeys: 'auth.users(id)', purpose: 'Global user identity & statuses' },
    { name: 'roles', rls: true, foreignKeys: 'None', purpose: 'Platform role definitions' },
    { name: 'permissions', rls: true, foreignKeys: 'None', purpose: 'Granular permissions catalog' },
    { name: 'role_permissions', rls: true, foreignKeys: 'roles(id), permissions(id)', purpose: 'Role mapping matrix' },
    { name: 'user_roles', rls: true, foreignKeys: 'auth.users(id), roles(id)', purpose: 'Direct user role assignment' },
    { name: 'kids', rls: true, foreignKeys: 'auth.users(id), families(id)', purpose: 'Young author progress & creatures' },
    { name: 'families', rls: true, foreignKeys: 'auth.users(id)', purpose: 'Parent household accounts & tiers' },
    { name: 'family_members', rls: true, foreignKeys: 'families(id), auth.users(id)', purpose: 'Parent-child linkages' },
    { name: 'teachers', rls: true, foreignKeys: 'auth.users(id)', purpose: 'Educator and school cohort profiles' },
    { name: 'admin_profiles', rls: true, foreignKeys: 'auth.users(id)', purpose: 'Operations staff access credentials' },
    { name: 'audit_logs', rls: true, foreignKeys: 'auth.users(id)', purpose: 'Immutable security action trail' },
    { name: 'system_settings', rls: true, foreignKeys: 'auth.users(id)', purpose: 'Key-value system configuration' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="PostgreSQL Database & Row Level Security"
        description="Inspect schema architecture, table constraints, and active RLS protections."
        breadcrumbs={[
          { label: 'Superadmin', href: '/superadmin' },
          { label: 'Database' },
        ]}
      />

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Table Name</TableHead>
              <TableHead>Row Level Security</TableHead>
              <TableHead>Foreign Keys</TableHead>
              <TableHead>Architecture Purpose</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tables.map((t) => (
              <TableRow key={t.name}>
                <TableCell className="font-mono text-xs font-bold text-slate-900">
                  public.{t.name}
                </TableCell>
                <TableCell>
                  <Badge variant="success" className="text-[10px] gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    RLS ENABLED
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs text-slate-500">
                  {t.foreignKeys}
                </TableCell>
                <TableCell className="text-xs text-slate-600">
                  {t.purpose}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
