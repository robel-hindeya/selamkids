import { requireSuperadmin } from '@/backend/auth/guards';
import { SuperadminService } from '@/backend/services/superadmin.service';
import { PageHeader } from '@/components/dashboard/page-header';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/utils';

export default async function SuperadminAuditLogsPage() {
  const user = await requireSuperadmin();
  const superadminService = new SuperadminService();
  const { items: logs, total } = await superadminService.listAllAuditLogs(user, {
    page: 1,
    pageSize: 30,
    offset: 0,
    limit: 30,
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Root Audit Trail & Security Ledger"
        description={`Complete immutable forensic ledger of all platform actions (${total} records).`}
        breadcrumbs={[
          { label: 'Superadmin', href: '/superadmin' },
          { label: 'Audit Logs' },
        ]}
      />

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp (UTC)</TableHead>
              <TableHead>Actor User / ID</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Target Resource</TableHead>
              <TableHead>Payload Details</TableHead>
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
                  <TableCell className="font-mono text-xs text-slate-500">
                    {formatDateTime(log.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-xs text-slate-800">{log.user_email || 'System'}</div>
                    <div className="font-mono text-[10px] text-slate-400">{log.user_id || 'N/A'}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={log.user_role === 'SUPERADMIN' ? 'superadmin' : 'secondary'} className="text-[10px]">
                      {log.user_role || 'ANON'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        log.action.includes('DELETE')
                          ? 'destructive'
                          : log.action.includes('ROLE')
                          ? 'superadmin'
                          : 'default'
                      }
                      className="text-[10px]"
                    >
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-700">
                    {log.resource}
                  </TableCell>
                  <TableCell className="font-mono text-[11px] text-slate-500 max-w-sm truncate">
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
