'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Send, PenTool, Sparkles, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type WritingMode = 'creative' | 'god';

export function StoryEditor({
  initialPrompt,
  currentOrbs: _currentOrbs,
}: {
  initialPrompt?: string;
  currentOrbs: number;
}) {
  const router = useRouter();
  const [mode, setMode] = React.useState<WritingMode>('creative');
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [reward, setReward] = React.useState<{ orbsEarned: number; words: number; category: string } | null>(null);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || wordCount < 5) return;

    setSubmitting(true);
    const categoryLabel = mode === 'creative' ? 'Daily Creative Writing' : 'Message to God';
    const promptText = mode === 'creative'
      ? (initialPrompt || 'Wild Adventure')
      : 'Prayer & Gratitude to God';

    try {
      const res = await fetch('/api/kids/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          prompt: promptText,
          category: categoryLabel,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReward({
          orbsEarned: data.data.orbsEarned,
          words: data.data.wordCount,
          category: categoryLabel,
        });
        setTitle('');
        setContent('');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-4 border-purple-200/80 dark:border-purple-800/80 bg-white dark:bg-[#12092e] shadow-xl rounded-4xl overflow-hidden">
      <CardContent className="p-6 sm:p-8 space-y-6">
        {/* CENTER 2 RECTANGULAR BUTTONS TO CHOOSE WRITING TYPE */}
        <div className="flex flex-col items-center justify-center space-y-3 pb-2 pt-1 border-b-2 border-purple-100 dark:border-purple-900/60">
          <span className="text-[11px] font-display font-black uppercase tracking-wider text-purple-500 dark:text-purple-300">
            Select Writing Mode:
          </span>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-xl pb-2">
            {/* Rectangle Button 1: Daily Creative Writing */}
            <button
              type="button"
              onClick={() => {
                setMode('creative');
                setReward(null);
              }}
              className={cn(
                'flex-1 w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl border-2 font-display text-sm font-black transition-all cursor-pointer shadow-sm',
                mode === 'creative'
                  ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/30 scale-[1.02] ring-2 ring-purple-400/40'
                  : 'bg-purple-50/60 dark:bg-[#1a0e3f] text-slate-700 dark:text-purple-200 border-purple-200/80 dark:border-purple-800/80 hover:bg-purple-100/60 dark:hover:bg-purple-900/50 hover:border-purple-400'
              )}
            >
              <PenTool className={cn('h-4 w-4', mode === 'creative' ? 'text-yellow-300' : 'text-purple-500 dark:text-purple-400')} />
              <span>Daily Creative Writing</span>
            </button>

            {/* Rectangle Button 2: Message to God */}
            <button
              type="button"
              onClick={() => {
                setMode('god');
                setReward(null);
              }}
              className={cn(
                'flex-1 w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl border-2 font-display text-sm font-black transition-all cursor-pointer shadow-sm',
                mode === 'god'
                  ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-400/30 scale-[1.02] ring-2 ring-amber-300/60'
                  : 'bg-purple-50/60 dark:bg-[#1a0e3f] text-slate-700 dark:text-purple-200 border-purple-200/80 dark:border-purple-800/80 hover:bg-purple-100/60 dark:hover:bg-purple-900/50 hover:border-amber-400'
              )}
            >
              <Sparkles className={cn('h-4 w-4', mode === 'god' ? 'text-slate-950' : 'text-amber-500 dark:text-amber-400')} />
              <span>Message to God</span>
            </button>
          </div>
        </div>

        {/* Section Heading & Word Count Badge */}
        <div className="flex flex-wrap items-center justify-between pb-1 gap-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              "h-12 w-12 rounded-2xl flex items-center justify-center shadow-md",
              mode === 'creative'
                ? "bg-amber-400 text-amber-950 shadow-amber-400/30"
                : "bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 shadow-amber-400/30"
            )}>
              {mode === 'creative' ? <PenTool className="h-6 w-6" /> : <Heart className="h-6 w-6 fill-rose-500 text-rose-500" />}
            </div>
            <div>
              <h3 className="font-display font-black text-slate-900 dark:text-white text-xl">
                {mode === 'creative' ? 'Daily Creative Writing Arena' : 'Message to God'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-purple-300/70 font-medium">
                {mode === 'creative'
                  ? 'Power up your beast with your own words for the magazine'
                  : 'Share your heartfelt prayers, thankfulness, and blessings'}
              </p>
            </div>
          </div>
          <Badge variant="amber" className="text-xs font-black px-3.5 py-1">
            Words: {wordCount}
          </Badge>
        </div>

        {/* Dynamic Prompt / Guidance Card */}
        {mode === 'creative' ? (
          initialPrompt && (
            <div className="rounded-2xl bg-purple-50/70 dark:bg-purple-950/70 p-4 border-2 border-purple-200/80 dark:border-purple-800/80 text-xs sm:text-sm text-purple-950 dark:text-purple-200 font-medium shadow-inner">
              <strong className="text-purple-700 dark:text-purple-300 font-display font-black block mb-1">
                Today&apos;s Quest Prompt:
              </strong>
              &ldquo;{initialPrompt}&rdquo;
            </div>
          )
        ) : (
          <div className="rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 p-4 border-2 border-amber-200 dark:border-amber-800/70 text-xs sm:text-sm text-amber-950 dark:text-amber-200 font-medium shadow-inner">
            <strong className="text-amber-700 dark:text-amber-300 font-display font-black flex items-center gap-1.5 mb-1">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Prayer & Reflection Prompt:
            </strong>
            &ldquo;Talk to God: Write what is in your heart today — what you are grateful for, a special prayer for someone you love, your biggest dream, or anything you want to share.&rdquo;
          </div>
        )}

        {/* Success Celebration Reward Box */}
        {reward && (
          <div className={cn(
            "rounded-2xl border-2 p-5 text-center shadow-md animate-bounce",
            reward.category === 'Message to God'
              ? "bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700"
              : "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700"
          )}>
            <div className={cn(
              "mx-auto flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg mb-2",
              reward.category === 'Message to God'
                ? "bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 shadow-amber-500/30"
                : "bg-emerald-500 text-white shadow-emerald-500/30"
            )}>
              {reward.category === 'Message to God' ? (
                <Sparkles className="h-7 w-7 text-slate-950" />
              ) : (
                <Trophy className="h-7 w-7 text-white" />
              )}
            </div>
            <h4 className={cn(
              "font-display font-black text-xl",
              reward.category === 'Message to God'
                ? "text-amber-950 dark:text-amber-100"
                : "text-emerald-950 dark:text-emerald-100"
            )}>
              {reward.category === 'Message to God'
                ? 'Amen! Message to God Sent!'
                : 'Hooray! Story Published!'}
            </h4>
            <p className={cn(
              "text-xs sm:text-sm mt-1 font-bold",
              reward.category === 'Message to God'
                ? "text-amber-800 dark:text-amber-300"
                : "text-emerald-800 dark:text-emerald-300"
            )}>
              You wrote <strong className="font-black">{reward.words} words</strong> and earned{' '}
              <strong className="text-amber-600 dark:text-amber-400 font-black">+{reward.orbsEarned} Glowing Orbs!</strong>
            </p>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-display font-black uppercase tracking-wider text-slate-700 dark:text-purple-200">
              {mode === 'creative' ? 'Story Title' : 'Message Subject / Prayer Title'}
            </label>
            <input
              type="text"
              placeholder={
                mode === 'creative'
                  ? 'e.g. The Day Professor Maji Learned to Fly'
                  : 'e.g. Thank You for My Family & Peace in the World'
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl border-2 border-slate-200 dark:border-purple-900/80 dark:bg-[#190b3b] dark:text-white dark:placeholder:text-purple-400/50 px-4 py-2.5 text-sm font-medium focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-display font-black uppercase tracking-wider text-slate-700 dark:text-purple-200">
              {mode === 'creative' ? 'Your Story Adventure' : 'Your Message to God'}
            </label>
            <textarea
              rows={6}
              placeholder={
                mode === 'creative'
                  ? 'Write your adventure here... Describe sights, smells, sounds, and what your creature did!'
                  : 'Dear God, today I want to share with You... (Write your personal prayer, thankfulness, or blessings here)'
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-2xl border-2 border-slate-200 dark:border-purple-900/80 dark:bg-[#190b3b] dark:text-white dark:placeholder:text-purple-400/50 p-4 text-sm font-medium focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <span className="text-xs font-medium text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 dark:border dark:border-purple-800/60 px-3 py-1.5 rounded-full inline-block">
              Every 5 words gives you magical Orbs!
            </span>
            <Button
              type="submit"
              variant="yellow"
              size="lg"
              disabled={submitting || wordCount < 5 || !title}
              className="font-black text-sm tracking-wide gap-2 h-12"
            >
              {submitting
                ? (mode === 'creative' ? 'Publishing Story...' : 'Sending Message...')
                : (mode === 'creative' ? 'Publish Story & Claim Orbs!' : 'Send Message to God & Claim Orbs!')}
              <Send className="h-4 w-4 text-purple-900" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
