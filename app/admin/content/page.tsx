import { requireAdmin } from '@/backend/auth/guards';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';
import { revalidatePath } from 'next/cache';

// In-memory prompts store for dynamic editing
interface QuestPrompt {
  id: string;
  title: string;
  genre: string;
  targetGrade: string;
  reward: string;
  status: 'PUBLISHED' | 'DRAFT';
}

const globalForPrompts = global as unknown as { adminPrompts?: QuestPrompt[] };
const initialPrompts: QuestPrompt[] = [
  {
    id: 'p1',
    title: 'The Slime Dragon of Mount Whispers',
    genre: 'Fantasy Adventure',
    targetGrade: 'Grade 3',
    reward: '35 Orbs',
    status: 'PUBLISHED',
  },
  {
    id: 'p2',
    title: 'The Portal Behind the Bookshelf',
    genre: 'Mystery Quest',
    targetGrade: 'Grade 4',
    reward: '50 Orbs',
    status: 'PUBLISHED',
  },
  {
    id: 'p3',
    title: 'Professor Maji and the Clockwork Butterfly',
    genre: 'Sci-Fi Steampunk',
    targetGrade: 'Grade 5',
    reward: '40 Orbs',
    status: 'DRAFT',
  },
  {
    id: 'p4',
    title: 'Echoes of the Sunken Coral Citadel',
    genre: 'Underwater Odyssey',
    targetGrade: 'Grade 3-4',
    reward: '45 Orbs',
    status: 'PUBLISHED',
  },
];

if (!globalForPrompts.adminPrompts) {
  globalForPrompts.adminPrompts = [...initialPrompts];
}

export default async function AdminContentPage() {
  await requireAdmin();
  const prompts = globalForPrompts.adminPrompts || initialPrompts;

  async function togglePromptStatusAction(formData: FormData) {
    'use server';
    await requireAdmin();
    const promptId = formData.get('promptId') as string;
    const store = globalForPrompts.adminPrompts || [];
    const item = store.find((p) => p.id === promptId);
    if (item) {
      item.status = item.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    }
    revalidatePath('/admin/content');
  }

  async function createPromptAction(formData: FormData) {
    'use server';
    await requireAdmin();
    const title = (formData.get('title') as string) || 'Untitled Quest Prompt';
    const genre = (formData.get('genre') as string) || 'Creative Adventure';
    const targetGrade = (formData.get('targetGrade') as string) || 'Grade 3';
    const reward = `${parseInt(formData.get('reward') as string, 10) || 30} Orbs`;

    const newPrompt: QuestPrompt = {
      id: `p-${Date.now()}`,
      title,
      genre,
      targetGrade,
      reward,
      status: 'PUBLISHED',
    };

    if (!globalForPrompts.adminPrompts) {
      globalForPrompts.adminPrompts = [...initialPrompts];
    }
    globalForPrompts.adminPrompts.unshift(newPrompt);
    revalidatePath('/admin/content');
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <PageHeader
        title="Content & Writing Prompts"
        description="Curate curriculum-approved writing prompts and literacy battle adventures for young authors."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Content' },
        ]}
      />

      {/* Create New Prompt Card */}
      <Card className="border-indigo-100 bg-gradient-to-r from-indigo-50/50 to-purple-50/30 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-indigo-950">
            <Plus className="h-4 w-4 text-indigo-600" />
            Add New Writing Quest Prompt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createPromptAction} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <input
                name="title"
                placeholder="Quest Title (e.g. The Whispering Caverns of Zephyr)"
                required
                className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <select
                name="genre"
                defaultValue="Fantasy Adventure"
                className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
              >
                <option value="Fantasy Adventure">Fantasy Adventure</option>
                <option value="Mystery Quest">Mystery Quest</option>
                <option value="Sci-Fi Steampunk">Sci-Fi Steampunk</option>
                <option value="Historical Fiction">Historical Fiction</option>
                <option value="Animal Expedition">Animal Expedition</option>
              </select>
            </div>
            <div className="flex gap-2">
              <select
                name="targetGrade"
                defaultValue="Grade 3"
                className="w-1/2 h-10 rounded-xl border border-slate-200 bg-white px-2 text-xs text-slate-700 focus:outline-none"
              >
                <option value="Grade 2">Grade 2</option>
                <option value="Grade 3">Grade 3</option>
                <option value="Grade 4">Grade 4</option>
                <option value="Grade 5">Grade 5</option>
              </select>
              <Button type="submit" variant="magic" size="sm" className="h-10 text-xs w-1/2 gap-1">
                <Plus className="h-3.5 w-3.5" />
                Publish
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prompts.map((p) => (
          <Card key={p.id} className="border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant={p.status === 'PUBLISHED' ? 'success' : 'secondary'} className="text-[10px]">
                  {p.status}
                </Badge>
                <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                  +{p.reward}
                </span>
              </div>
              <CardTitle className="text-base font-bold text-slate-900 leading-snug">
                {p.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
                <span className="flex items-center gap-1 font-medium">
                  <FileText className="h-3 w-3 text-slate-400" />
                  {p.genre}
                </span>
                <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                  {p.targetGrade}
                </span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <form action={togglePromptStatusAction} className="w-full">
                  <input type="hidden" name="promptId" value={p.id} />
                  <Button
                    type="submit"
                    variant={p.status === 'PUBLISHED' ? 'outline' : 'default'}
                    size="sm"
                    className="w-full text-xs h-8"
                  >
                    {p.status === 'PUBLISHED' ? 'Move to Draft' : 'Publish to Students'}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
