import { requireAuth } from '@/backend/auth/guards';
import { TeacherService } from '@/backend/services/teacher.service';
import { PageHeader } from '@/components/dashboard/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GraduationCap, Users, BookOpen, CheckCircle2, Plus, FolderOpen } from 'lucide-react';
import Link from 'next/link';

export default async function TeachersDashboardPage() {
  const user = await requireAuth();
  const teacherService = new TeacherService();
  const teacher = await teacherService.getMyProfile(user);

  const mockAssignments = [
    {
      id: 'a1',
      title: 'Night Forest Description',
      genre: 'Descriptive Writing',
      submissions: 24,
      total: 28,
      dueDate: 'Oct 15, 2026',
    },
    {
      id: 'a2',
      title: 'Dialogue with an Alien Zookeeper',
      genre: 'Narrative Adventure',
      submissions: 18,
      total: 28,
      dueDate: 'Oct 22, 2026',
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <PageHeader
        title="Classroom Command Center"
        description={`Educator Portal for ${teacher.school_name} • Grade ${teacher.grade_level}`}
        actions={
          <div className="flex items-center gap-3">
            {teacher.verified ? (
              <Badge variant="teacher" className="gap-1.5 px-3 py-1 font-black">
                <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                Verified Educator
              </Badge>
            ) : (
              <Badge variant="warning" className="font-bold">Verification Pending</Badge>
            )}
            <Link href="/users/teachers/profile">
              <Button variant="outline" size="default" className="font-black text-xs">
                Edit School Profile
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Active Students"
          value="28"
          description="Enrolled in your cohort"
          icon={<Users className="h-6 w-6" />}
          variant="default"
        />
        <StatCard
          title="Assignments Active"
          value={mockAssignments.length}
          description="Curriculum writing prompts"
          icon={<FolderOpen className="h-6 w-6" />}
          variant="emerald"
        />
        <StatCard
          title="Stories Submitted"
          value="42"
          description="Awaiting educator review"
          icon={<BookOpen className="h-6 w-6" />}
          variant="magic"
        />
        <StatCard
          title="Classroom Mastery"
          value="88%"
          description="Vocabulary comprehension rate"
          icon={<GraduationCap className="h-6 w-6" />}
          variant="amber"
        />
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-black text-slate-900 text-2xl">Active Class Assignments</h3>
            <p className="text-xs text-slate-500 font-medium">Writing quests assigned to your class</p>
          </div>
          <Button size="default" variant="emerald" className="gap-2 font-black text-xs">
            <Plus className="h-4 w-4" />
            Create Writing Prompt
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockAssignments.map((assignment) => (
            <Card
              key={assignment.id}
              className="border-2 border-emerald-100 hover:border-emerald-300 transition-all shadow-md rounded-3xl hover:-translate-y-1 bg-white"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="teacher" className="text-[11px] font-black">
                    {assignment.genre}
                  </Badge>
                  <span className="text-xs font-bold text-slate-400">Due {assignment.dueDate}</span>
                </div>
                <h4 className="font-display font-black text-slate-900 text-lg">
                  {assignment.title}
                </h4>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <span className="text-slate-600 font-medium">
                    Turned in:{' '}
                    <strong className="text-emerald-700 font-black">
                      {assignment.submissions}/{assignment.total} students
                    </strong>
                  </span>
                  <Button variant="magic" size="sm" className="font-black text-xs gap-1.5 h-9">
                    <BookOpen className="h-3.5 w-3.5" />
                    Review & Feedback
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
