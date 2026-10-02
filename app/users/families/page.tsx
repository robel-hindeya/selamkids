import { requireAuth } from '@/backend/auth/guards';
import { FamilyService } from '@/backend/services/family.service';
import { PageHeader } from '@/components/dashboard/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Users, Award, BookOpen, Plus, ArrowRight, Settings } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ParentLockExitButton } from '@/components/navigation/parent-gate-button';

export default async function FamiliesDashboardPage() {
  const user = await requireAuth();
  const familyService = new FamilyService();
  const family = await familyService.getMyFamily(user);

  const totalWords = family.children.reduce((acc, c) => acc + (c.words_written || 0), 0);
  const totalOrbs = family.children.reduce((acc, c) => acc + (c.orbs || 0), 0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <PageHeader
        title={`${family.family_name} Family Hub`}
        description="Monitor your children's creative writing adventures, reading development, and literacy quests."
        actions={
          <div className="flex items-center gap-3">
            <Link href="/users/families/settings">
              <Button variant="cyan" size="default" className="font-black text-xs gap-1.5">
                <Settings className="h-4 w-4" />
                Manage Subscription ({family.subscription_tier})
              </Button>
            </Link>
            <ParentLockExitButton />
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Children Enrolled"
          value={family.children.length}
          description="Active child explorer accounts"
          icon={<Users className="h-6 w-6" />}
          variant="default"
        />
        <StatCard
          title="Total Words Authored"
          value={totalWords}
          description="Combined family storytelling output"
          icon={<BookOpen className="h-6 w-6" />}
          variant="magic"
        />
        <StatCard
          title="Glowing Orbs Earned"
          value={totalOrbs}
          description="Total gamified achievements"
          icon={<Award className="h-6 w-6" />}
          variant="amber"
        />
        <StatCard
          title="Subscription Status"
          value={family.subscription_status}
          description={`Plan: ${family.subscription_tier}`}
          icon={<Heart className="h-6 w-6" />}
          variant="emerald"
        />
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-black text-slate-900 text-2xl">My Young Authors</h3>
            <p className="text-xs text-slate-500 font-medium">Keep track of individual writing journals</p>
          </div>
          <Link href="/users/families/settings#add-child">
            <Button size="default" variant="yellow" className="gap-2 font-black text-xs">
              <Plus className="h-4 w-4 text-purple-900" />
              Add Child Account
            </Button>
          </Link>
        </div>

        {family.children.length === 0 ? (
          <Card className="p-12 text-center text-slate-500 border-2 border-dashed border-purple-200 rounded-3xl bg-purple-50/30">
            <Heart className="h-12 w-12 mx-auto text-pink-400 mb-3" />
            <h4 className="font-display font-black text-xl text-slate-800">No Children Linked Yet</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Add your young author&apos;s account to monitor their stories and literacy growth.
            </p>
            <Link href="/users/families/settings#add-child" className="inline-block mt-4">
              <Button variant="yellow" size="sm" className="font-black text-xs">
                Add First Child Explorer
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {family.children.map((child) => (
              <Card
                key={child.id}
                className="hover:border-cyan-400 transition-all border-2 border-slate-100 shadow-md rounded-3xl hover:-translate-y-1 bg-white"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-2xl bg-amber-100 flex items-center justify-center p-1 shadow-sm overflow-hidden border-2 border-amber-200">
                      <Image
                        src="/images/characters/simba.png"
                        alt={child.nickname}
                        width={50}
                        height={50}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="font-display font-black text-slate-900 text-lg">
                        {child.nickname}
                      </h4>
                      <p className="text-xs text-slate-500 font-bold">
                        {child.grade_level} • Age {child.age}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100">
                      <span className="text-slate-400 block text-[11px] font-bold">Words Authored</span>
                      <strong className="text-slate-900 text-base font-black font-display">
                        {child.words_written}
                      </strong>
                    </div>
                    <div className="rounded-2xl bg-amber-50/70 p-3 border border-amber-100">
                      <span className="text-amber-700 block text-[11px] font-bold">Orbs Balance</span>
                      <strong className="text-amber-900 text-base font-black font-display">
                        {child.orbs} Orbs
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <Badge variant="cyan" className="text-[11px] font-black">
                      {child.reading_level || 'Adventurer'}
                    </Badge>
                    <Link
                      href={`/users/kids/${child.id}`}
                      className="text-xs font-black text-purple-700 hover:text-purple-900 flex items-center gap-1 transition-colors"
                    >
                      View Stories <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
