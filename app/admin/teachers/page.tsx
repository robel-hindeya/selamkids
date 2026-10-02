import { requireAdmin } from '@/backend/auth/guards';
import { TeacherRepository } from '@/backend/db/repositories/teacher.repository';
import { TeacherService } from '@/backend/services/teacher.service';
import { PageHeader } from '@/components/dashboard/page-header';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { revalidatePath } from 'next/cache';

export default async function AdminTeachersPage() {
  await requireAdmin();
  const teacherRepo = new TeacherRepository();
  const { items: teachers, total } = await teacherRepo.listAll({
    page: 1,
    pageSize: 20,
    offset: 0,
    limit: 20,
  });

  async function toggleVerificationAction(formData: FormData) {
    'use server';
    const currentUser = await requireAdmin();
    const service = new TeacherService();
    const teacherId = formData.get('teacherId') as string;
    const currentStatus = formData.get('verified') === 'true';

    await service.verifyTeacher(currentUser, teacherId, !currentStatus);
    revalidatePath('/admin/teachers');
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Educator Verification & School Cohorts"
        description={`Manage verified teacher accounts and classroom permissions (${total} educators).`}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Teachers' },
        ]}
      />

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>School Name</TableHead>
              <TableHead>Department / Subject</TableHead>
              <TableHead>Grade Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  No teachers registered yet.
                </TableCell>
              </TableRow>
            ) : (
              teachers.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-bold text-slate-900">{t.school_name}</TableCell>
                  <TableCell className="text-xs text-slate-600">
                    {t.department || 'General Literacy'}
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">{t.grade_level}</TableCell>
                  <TableCell>
                    <Badge variant={t.verified ? 'success' : 'warning'}>
                      {t.verified ? 'Verified' : 'Pending Review'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <form action={toggleVerificationAction} className="inline-block">
                      <input type="hidden" name="teacherId" value={t.id} />
                      <input type="hidden" name="verified" value={t.verified ? 'true' : 'false'} />
                      <Button
                        type="submit"
                        variant={t.verified ? 'outline' : 'default'}
                        size="sm"
                        className="text-xs h-8"
                      >
                        {t.verified ? 'Revoke Verification' : 'Verify Educator'}
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
