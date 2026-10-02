import { requireAdmin } from '@/backend/auth/guards';
import { KidRepository } from '@/backend/db/repositories/kid.repository';
import { PageHeader } from '@/components/dashboard/page-header';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KidService } from '@/backend/services/kid.service';
import { revalidatePath } from 'next/cache';

export default async function AdminKidsPage() {
  await requireAdmin();
  const kidRepo = new KidRepository();
  const { items: kids, total } = await kidRepo.listAll({
    page: 1,
    pageSize: 20,
    offset: 0,
    limit: 20,
  });

  async function awardBonusOrbsAction(formData: FormData) {
    'use server';
    const currentUser = await requireAdmin();
    const service = new KidService();
    const kidId = formData.get('kidId') as string;

    await service.awardOrbs(currentUser, kidId, 50, 'Admin quest reward bonus');
    revalidatePath('/admin/kids');
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Kid Authors Directory"
        description={`List of young creators registered across the platform (${total} kids).`}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Kids' },
        ]}
      />

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Explorer / Nickname</TableHead>
              <TableHead>Grade / Age</TableHead>
              <TableHead>Creature Companion</TableHead>
              <TableHead>Words Authored</TableHead>
              <TableHead>Orbs Balance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {kids.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                  No kid explorers found.
                </TableCell>
              </TableRow>
            ) : (
              kids.map((kid) => (
                <TableRow key={kid.id}>
                  <TableCell className="font-bold text-slate-900">
                    {kid.nickname}
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">
                    {kid.grade_level} • {kid.age} yrs
                  </TableCell>
                  <TableCell>
                    <Badge variant="magic" className="text-xs">
                      {kid.creature_name || 'Companion'} ({kid.creature_type || 'Beast'})
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-slate-800">
                    {kid.words_written}
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-amber-600">{kid.orbs} Orbs</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <form action={awardBonusOrbsAction} className="inline-block">
                      <input type="hidden" name="kidId" value={kid.id} />
                      <Button type="submit" variant="outline" size="sm" className="text-xs h-8">
                        +50 Orbs Reward
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
