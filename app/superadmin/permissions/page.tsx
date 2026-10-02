import { requireSuperadmin } from '@/backend/auth/guards';
import { PageHeader } from '@/components/dashboard/page-header';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ALL_PERMISSIONS } from '@/backend/constants/permissions';

export default async function SuperadminPermissionsPage() {
  await requireSuperadmin();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Permission Catalog"
        description={`Complete register of granular system permissions (${ALL_PERMISSIONS.length} defined).`}
        breadcrumbs={[
          { label: 'Superadmin', href: '/superadmin' },
          { label: 'Permissions' },
        ]}
      />

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Permission Key</TableHead>
              <TableHead>Scope</TableHead>
              <TableHead>Protection Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ALL_PERMISSIONS.map((perm) => {
              const scope = perm.split('.')[0];
              const isSystem = perm.startsWith('system') || perm.startsWith('audit_logs') || perm.startsWith('admins');
              return (
                <TableRow key={perm}>
                  <TableCell className="font-mono text-xs font-bold text-slate-800">
                    {perm}
                  </TableCell>
                  <TableCell className="uppercase text-xs font-semibold text-slate-500">
                    {scope}
                  </TableCell>
                  <TableCell>
                    <Badge variant={isSystem ? 'superadmin' : 'secondary'} className="text-[10px]">
                      {isSystem ? 'ROOT CLEARANCE' : 'STANDARD RBAC'}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
