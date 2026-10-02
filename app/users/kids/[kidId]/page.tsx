import { requireAuth } from '@/backend/auth/guards';
import { KidService } from '@/backend/services/kid.service';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, PenTool, BookOpen, User } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export default async function ViewKidDetailPage({
  params,
}: {
  params: Promise<{ kidId: string }>;
}) {
  const user = await requireAuth();
  const { kidId } = await params;
  const kidService = new KidService();

  let kid;
  try {
    kid = await kidService.getKidById(user, kidId);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title={`Student Profile: ${kid.nickname}`}
        description="Individual literacy analytics and creature companion details."
        breadcrumbs={[
          { label: 'Portal', href: '/users' },
          { label: 'Kids', href: '/users/kids' },
          { label: kid.nickname },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 p-6 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-amber-100 mb-4 overflow-hidden p-2 border-2 border-amber-200">
            <Image
              src="/images/characters/simba.png"
              alt={kid.nickname}
              width={80}
              height={80}
              className="w-20 h-20 object-contain drop-shadow-md"
            />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">{kid.nickname}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{kid.grade_level}</p>
          <Badge variant="magic" className="mt-3">
            {kid.creature_name || 'Companion Beast'}
          </Badge>
        </Card>

        <Card className="md:col-span-2 p-6 space-y-4">
          <h4 className="font-bold text-slate-900 text-base">Progress & Literacy Stats</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-500">Orbs Earned</span>
              <div className="text-2xl font-black text-amber-500 mt-1 flex items-center gap-1.5">
                <Trophy className="h-5 w-5" />
                {kid.orbs}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-500">Words Written</span>
              <div className="text-2xl font-black text-indigo-600 mt-1 flex items-center gap-1.5">
                <PenTool className="h-5 w-5" />
                {kid.words_written}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-500">Reading Level</span>
              <div className="text-lg font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-emerald-600" />
                {kid.reading_level}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-500">Age</span>
              <div className="text-lg font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                <User className="h-4 w-4 text-slate-600" />
                {kid.age} years old
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
