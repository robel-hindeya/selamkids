import { requireAuth } from '@/backend/auth/guards';
import { TeacherService } from '@/backend/services/teacher.service';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { redirect } from 'next/navigation';

export default async function TeacherProfilePage() {
  const user = await requireAuth();
  const teacherService = new TeacherService();
  const teacher = await teacherService.getMyProfile(user);

  async function updateTeacherAction(formData: FormData) {
    'use server';
    const currentUser = await requireAuth();
    const service = new TeacherService();
    const myTeacher = await service.getMyProfile(currentUser);

    const schoolName = formData.get('schoolName') as string;
    const department = formData.get('department') as string;
    const gradeLevel = formData.get('gradeLevel') as string;

    await service.updateTeacher(currentUser, myTeacher.id, {
      schoolName,
      department,
      gradeLevel,
    });

    redirect('/users/teachers');
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="Educator Profile & School Affiliation"
        description="Manage your institutional verification details and teaching scope."
        breadcrumbs={[
          { label: 'Classroom HQ', href: '/users/teachers' },
          { label: 'Educator Profile' },
        ]}
      />

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>School Credentials</CardTitle>
          <CardDescription>
            Help us verify your school domain for free educational grants.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateTeacherAction} className="space-y-4">
            <Input
              label="School Name"
              name="schoolName"
              defaultValue={teacher.school_name}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Department / Subject"
                name="department"
                defaultValue={teacher.department || 'English & Literacy'}
                placeholder="e.g. Literacy Dept"
              />

              <Input
                label="Primary Grade Level"
                name="gradeLevel"
                defaultValue={teacher.grade_level}
                placeholder="Grade 3-5"
                required
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                Update Educator Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
