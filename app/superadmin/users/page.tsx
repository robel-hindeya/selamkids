import { requireSuperadmin } from '@/backend/auth/guards';
import { UserRepository } from '@/backend/db/repositories/user.repository';
import { SuperadminService } from '@/backend/services/superadmin.service';
import { PageHeader } from '@/components/dashboard/page-header';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ALL_ROLES, UserRole } from '@/backend/constants/roles';
import { revalidatePath } from 'next/cache';

export default async function SuperadminUsersPage() {
  await requireSuperadmin();
  const userRepo = new UserRepository();
  const { items: users, total } = await userRepo.listUsers({
    page: 1,
    pageSize: 25,
    offset: 0,
    limit: 25,
  });

  async function reassignRoleAction(formData: FormData) {
    'use server';
    const currentUser = await requireSuperadmin();
    const service = new SuperadminService();
    const targetUserId = formData.get('userId') as string;
    const role = formData.get('role') as UserRole;

    await service.assignUserRole(currentUser, targetUserId, role);
    revalidatePath('/superadmin/users');
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Global User Registry"
        description={`Root directory of all platform entities (${total} registered profiles).`}
        breadcrumbs={[
          { label: 'Superadmin', href: '/superadmin' },
          { label: 'Users' },
        ]}
      />

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID (UUID)</TableHead>
              <TableHead>Full Name / Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reassign Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                  No users found in database.
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-mono text-[11px] text-slate-400">
                    {u.id}
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-slate-900">{u.full_name}</div>
                    <div className="text-xs font-mono text-slate-500">{u.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.status === 'ACTIVE' ? 'success' : 'destructive'}>
                      {u.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <form action={reassignRoleAction} className="flex items-center gap-2">
                      <input type="hidden" name="userId" value={u.id} />
                      <select
                        name="role"
                        defaultValue="KID"
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs focus:outline-none"
                      >
                        {ALL_ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                      <Button type="submit" variant="outline" size="sm" className="h-7 text-xs">
                        Update Role
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
