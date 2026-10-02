import { requireSuperadmin } from '@/backend/auth/guards';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ALL_ROLES } from '@/backend/constants/roles';
import { ROLE_DEFAULT_PERMISSIONS } from '@/backend/constants/permissions';

export default async function SuperadminRolesPage() {
  await requireSuperadmin();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Role Hierarchy & Permission Matrices"
        description="Inspect RBAC role capabilities and system-level privileges."
        breadcrumbs={[
          { label: 'Superadmin', href: '/superadmin' },
          { label: 'Roles' },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ALL_ROLES.map((roleName) => {
          const perms = ROLE_DEFAULT_PERMISSIONS[roleName] || [];
          return (
            <Card key={roleName} className="border-slate-200/80 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <span>{roleName}</span>
                </CardTitle>
                <Badge variant={roleName === 'SUPERADMIN' ? 'superadmin' : roleName === 'ADMIN' ? 'admin' : 'secondary'}>
                  {perms.length} Permissions
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {perms.map((p) => (
                    <span
                      key={p}
                      className="inline-block rounded-md bg-slate-100 px-2 py-1 text-[11px] font-mono text-slate-700"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
