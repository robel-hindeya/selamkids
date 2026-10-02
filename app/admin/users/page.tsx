import { requireAdmin } from '@/backend/auth/guards';
import { UserRepository } from '@/backend/db/repositories/user.repository';
import { PageHeader } from '@/components/dashboard/page-header';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/lib/utils';
import { AdminService } from '@/backend/services/admin.service';
import { revalidatePath } from 'next/cache';
import { UserStatus } from '@/backend/constants/status';
import { Search, UserCheck, UserX } from 'lucide-react';
import Link from 'next/link';

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const search = params.search || '';

  const userRepo = new UserRepository();
  const { items: users, total } = await userRepo.listUsers(
    {
      page,
      pageSize: 15,
      offset: (page - 1) * 15,
      limit: 15,
    },
    search
  );

  async function toggleStatusAction(formData: FormData) {
    'use server';
    const currentUser = await requireAdmin();
    const service = new AdminService();
    const targetUserId = formData.get('userId') as string;
    const currentStatus = formData.get('currentStatus') as string;
    const nextStatus: UserStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';

    await service.moderateUser(currentUser, targetUserId, {
      status: nextStatus,
      reason: `Admin toggle status to ${nextStatus}`,
    });

    revalidatePath('/admin/users');
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="User Management"
        description={`Manage registered accounts and moderation statuses (${total} total records).`}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Users' },
        ]}
      />

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <form method="GET" action="/admin/users" className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            name="search"
            defaultValue={search}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </form>

        {search && (
          <Link href="/admin/users" className="text-xs text-indigo-600 hover:underline font-semibold">
            Clear Search Filter
          </Link>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User / Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-slate-500 text-xs">
                  {search ? `No accounts found matching "${search}".` : 'No users found in directory.'}
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="font-bold text-slate-900 text-sm">{u.full_name}</div>
                    <div className="text-xs text-slate-500 font-mono">{u.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.status === 'ACTIVE' ? 'success' : 'destructive'} className="text-[10px]">
                      {u.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 font-mono">
                    {formatDateTime(u.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <form action={toggleStatusAction} className="inline-block">
                      <input type="hidden" name="userId" value={u.id} />
                      <input type="hidden" name="currentStatus" value={u.status} />
                      <Button
                        type="submit"
                        variant={u.status === 'ACTIVE' ? 'destructive' : 'outline'}
                        size="sm"
                        className="text-xs h-8 gap-1.5"
                      >
                        {u.status === 'ACTIVE' ? (
                          <>
                            <UserX className="h-3.5 w-3.5" />
                            Suspend
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                            Activate
                          </>
                        )}
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
