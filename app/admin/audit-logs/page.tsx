import { requireAdmin } from '@/backend/auth/guards';
import { AdminService } from '@/backend/services/admin.service';
import { PageHeader } from '@/components/dashboard/page-header';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/utils';

export default async function AdminAuditLogsPage() {
  const user = await requireAdmin();
  const adminService = new AdminService();
  const { items: logs, total } = await adminService.listAuditLogs(user, {
    page: 1,
    pageSize: 25,
    offset: 0,
    limit: 25,
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Administrative Audit Logs"
        description={`Record of operational and moderation activities (${total} entries).`}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Audit Logs' },
        ]}
      />

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Actor Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                  No audit logs recorded yet.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs text-slate-500 font-mono">
                    {formatDateTime(log.created_at)}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-800 text-xs">
                    {log.user_email || 'System'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px]">
                      {log.user_role || 'ANON'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        log.action.includes('DELETE')
                          ? 'destructive'
                          : log.action.includes('CREATE')
                          ? 'success'
                          : 'default'
                      }
                      className="text-[10px]"
                    >
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-600">
                    {log.resource}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 max-w-xs truncate font-mono">
                    {log.details ? JSON.stringify(log.details) : '—'}
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
