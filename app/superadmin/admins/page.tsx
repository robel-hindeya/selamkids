import { requireSuperadmin } from '@/backend/auth/guards';
import { SuperadminService } from '@/backend/services/superadmin.service';
import { PageHeader } from '@/components/dashboard/page-header';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/lib/utils';
import { ROLES, UserRole } from '@/backend/constants/roles';
import { revalidatePath } from 'next/cache';
import { ShieldCheck, UserMinus } from 'lucide-react';

export default async function SuperadminAdminsPage() {
  const user = await requireSuperadmin();
  const superadminService = new SuperadminService();
  const { items: admins, total } = await superadminService.listAdmins(user, {
    page: 1,
    pageSize: 20,
    offset: 0,
    limit: 20,
  });

  async function assignAdminAction(formData: FormData) {
    'use server';
    const currentUser = await requireSuperadmin();
    const service = new SuperadminService();
    const targetUserId = formData.get('userId') as string;
    const role = (formData.get('role') as UserRole) || ROLES.ADMIN;

    await service.assignUserRole(currentUser, targetUserId, role);
    revalidatePath('/superadmin/admins');
  }

  async function revokeAdminAction(formData: FormData) {
    'use server';
    const currentUser = await requireSuperadmin();
    const service = new SuperadminService();
    const targetUserId = formData.get('userId') as string;

    // Demote to KID or FAMILY
    await service.assignUserRole(currentUser, targetUserId, ROLES.FAMILY);
    revalidatePath('/superadmin/admins');
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <PageHeader
        title="Admin Staff Commissioning"
        description={`Manage commissioned administrative accounts (${total} admins currently active).`}
        breadcrumbs={[
          { label: 'Superadmin', href: '/superadmin' },
          { label: 'Admins' },
        ]}
      />

      {/* Commission Form */}
      <div className="p-6 rounded-2xl border border-purple-200/80 bg-white shadow-sm">
        <h4 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-purple-600" />
          Commission User to Administrator
        </h4>
        <p className="text-xs text-slate-500 mb-4">
          Enter a registered User UUID to grant Administrative operations clearance.
        </p>

        <form action={assignAdminAction} className="flex flex-col sm:flex-row gap-3">
          <input
            name="userId"
            placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
            required
            className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-mono focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
          <Button type="submit" variant="magic" size="sm" className="shrink-0 text-xs">
            Grant Admin Role
          </Button>
        </form>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Admin Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Clearance</TableHead>
              <TableHead>Commissioned Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  No dedicated admin accounts found.
                </TableCell>
              </TableRow>
            ) : (
              admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-bold text-slate-900">{admin.full_name}</TableCell>
                  <TableCell className="font-mono text-xs text-slate-600">{admin.email}</TableCell>
                  <TableCell>
                    <Badge variant="admin">ADMIN</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {formatDateTime(admin.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <form action={revokeAdminAction} className="inline-block">
                      <input type="hidden" name="userId" value={admin.id} />
                      <Button
                        type="submit"
                        variant="destructive"
                        size="sm"
                        className="text-xs h-8 gap-1"
                      >
                        <UserMinus className="h-3 w-3" />
                        Revoke Clearance
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
