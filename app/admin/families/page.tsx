import { requireAdmin } from '@/backend/auth/guards';
import { FamilyRepository } from '@/backend/db/repositories/family.repository';
import { PageHeader } from '@/components/dashboard/page-header';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/utils';

export default async function AdminFamiliesPage() {
  await requireAdmin();
  const familyRepo = new FamilyRepository();
  const { items: families, total } = await familyRepo.listAll({
    page: 1,
    pageSize: 20,
    offset: 0,
    limit: 20,
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Family Units"
        description={`Registered family accounts and subscription plans (${total} households).`}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Families' },
        ]}
      />

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Family Name</TableHead>
              <TableHead>Contact Phone</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {families.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  No families registered yet.
                </TableCell>
              </TableRow>
            ) : (
              families.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-bold text-slate-900">{f.family_name}</TableCell>
                  <TableCell className="text-xs text-slate-500 font-mono">
                    {f.primary_contact_phone || 'None'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="cyan">{f.subscription_tier}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="success">{f.subscription_status}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {formatDateTime(f.created_at)}
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
