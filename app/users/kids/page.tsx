import { requireAuth } from '@/backend/auth/guards';
import { KidService } from '@/backend/services/kid.service';
import { PageHeader } from '@/components/dashboard/page-header';
import { Trophy, PenTool } from 'lucide-react';
import { StoryEditor } from '@/components/users/story-editor';
import { MagazineShowcase } from '@/components/users/magazine-showcase';

export default async function KidsDashboardPage() {
  const user = await requireAuth();
  const kidService = new KidService();
  const kid = await kidService.getMyProfile(user);

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-12">
      {/* Top Greeting & Orbs Bar */}
      <PageHeader
        title={`Welcome to the Night Zoo, ${kid.nickname || 'Explorer'}!`}
        actions={
          <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 px-5 py-2.5 text-slate-950 shadow-lg shadow-amber-400/30 font-display font-black text-sm border-2 border-yellow-200">
            <Trophy className="h-4 w-4 fill-slate-950" />
            <span>{kid.orbs} Glowing Orbs</span>
          </div>
        }
      />

      {/* =========================================================================
          FIRST THING ON PAGE: THE MAIN MAGAZINE EXPERIENCE (3 Not Ordered Magazines)
          ========================================================================= */}
      <div id="magazine-main-section">
        <MagazineShowcase currentOrbs={kid.orbs} />
      </div>

      {/* =========================================================================
          STORY WRITING & PUBLISHING ARENA
          ========================================================================= */}
      <div id="story-editor-section" className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-black text-slate-900 dark:text-white text-2xl flex items-center gap-2">
            <PenTool className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            Write for the Next Magazine Issue
          </h3>
          <span className="text-xs font-bold text-purple-700 dark:text-purple-200 bg-purple-100 dark:bg-purple-900/60 px-3 py-1 rounded-full">
            ★ Monthly Kid Contest
          </span>
        </div>

        <StoryEditor
          initialPrompt="A glowing green dragon has sneaked into the Night Zoo kitchens. Describe how you and your creature convince him not to eat all the starfruit pies!"
          currentOrbs={kid.orbs}
        />
      </div>
    </div>
  );
}
