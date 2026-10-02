import { requireAuth } from '@/backend/auth/guards';
import { KidService } from '@/backend/services/kid.service';
import { MagazineShowcase } from '@/components/users/magazine-showcase';
import { PageHeader } from '@/components/dashboard/page-header';
import { Trophy, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function KidMagazinePage() {
  const user = await requireAuth();
  const kidService = new KidService();
  const kid = await kidService.getMyProfile(user);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <PageHeader
        title="The Official Night Zoo Magazine"
        description="Browse the 3 featured issues, read kid stories from around the world, and claim 50 Glowing Orbs!"
        breadcrumbs={[
          { label: 'Portal', href: '/users/kids' },
          { label: 'Magazine' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 px-5 py-2 text-slate-950 shadow-md font-display font-black text-sm border-2 border-yellow-200">
              <Trophy className="h-4 w-4 fill-slate-950" />
              <span>{kid.orbs} Glowing Orbs</span>
            </div>
            <Link
              href="/users/kids"
              className="inline-flex items-center gap-2 text-xs font-bold text-purple-700 dark:text-purple-200 bg-purple-100 dark:bg-purple-900/60 hover:bg-purple-200 dark:hover:bg-purple-800/80 px-4 py-2.5 rounded-full transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Explorer HQ
            </Link>
          </div>
        }
      />

      <MagazineShowcase currentOrbs={kid.orbs} />
    </div>
  );
}
