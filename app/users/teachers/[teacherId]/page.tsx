import { requireAuth } from '@/backend/auth/guards';
import { TeacherService } from '@/backend/services/teacher.service';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { notFound } from 'next/navigation';

export default async function ViewTeacherDetailPage({
  params,
}: {
  params: Promise<{ teacherId: string }>;
}) {
  const user = await requireAuth();
  const { teacherId } = await params;
  const teacherService = new TeacherService();

  let teacher;
  try {
    teacher = await teacherService.getTeacherById(user, teacherId);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title={teacher.school_name}
        description="Educator verified cohort information."
        breadcrumbs={[
          { label: 'Portal', href: '/users' },
          { label: 'Teachers', href: '/users/teachers' },
          { label: teacher.school_name },
        ]}
      />

      <Card className="p-6">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <div>
            <h4 className="font-bold text-slate-900 text-lg">{teacher.school_name}</h4>
            <p className="text-xs text-slate-500">
              {teacher.department || 'General Education'} • {teacher.grade_level}
            </p>
          </div>
          <Badge variant={teacher.verified ? 'success' : 'warning'}>
            {teacher.verified ? 'Verified Educator' : 'Pending Verification'}
          </Badge>
        </div>
      </Card>
    </div>
  );
}
