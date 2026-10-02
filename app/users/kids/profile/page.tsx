import { requireAuth } from '@/backend/auth/guards';
import { KidService } from '@/backend/services/kid.service';
import { UserService } from '@/backend/services/user.service';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { CreatureCustomizerForm } from '@/components/users/creature-customizer-form';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Check, Settings, Palette, Shield } from 'lucide-react';

export default async function KidProfilePage({
  searchParams,
}: {
  searchParams?: Promise<{ saved?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const user = await requireAuth();
  const kidService = new KidService();
  const kid = await kidService.getMyProfile(user);

  async function updateCreatureAction(formData: FormData) {
    'use server';
    const currentUser = await requireAuth();
    const service = new KidService();
    const myKid = await service.getMyProfile(currentUser);

    const nickname = (formData.get('nickname') as string) || myKid.nickname;
    const creatureName = formData.get('creatureName') as string;
    const creatureType = formData.get('creatureType') as string;
    const creatureImageUrl = formData.get('creatureImageUrl') as string;
    const gradeLevel = (formData.get('gradeLevel') as string) || myKid.grade_level;

    await service.updateKidProfile(currentUser, myKid.id, {
      nickname,
      creatureName,
      creatureType,
      creatureImageUrl,
      gradeLevel,
    });

    redirect('/users/kids/profile?saved=creature#creature-customizer');
  }

  async function updateProfileNameAction(formData: FormData) {
    'use server';
    const currentUser = await requireAuth();
    const service = new UserService();
    const fullName = formData.get('fullName') as string;

    await service.updateProfile(currentUser, currentUser.id, {
      fullName,
    });

    redirect('/users/kids/profile?saved=account#settings');
  }

  const accountIdentifier =
    (user.metadata?.phoneNumber as string) || user.email || 'Registered Explorer Account';

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <PageHeader
        title="Creature Studio & Explorer Profile"
        description="Personalize your magical beast, adjust your account settings, and customize appearance."
        breadcrumbs={[
          { label: 'Zoo HQ', href: '/users/kids' },
          { label: 'Profile & Settings' },
        ]}
      />

      {/* Quick Jump Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <a
          href="#creature-customizer"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-purple-100 text-purple-900 dark:bg-purple-900/60 dark:text-purple-200 border border-purple-200 dark:border-purple-800 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
        >
          🦁 Companion Beast
        </a>
        <a
          href="#appearance-settings"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-purple-100 text-purple-900 dark:bg-purple-900/60 dark:text-purple-200 border border-purple-200 dark:border-purple-800 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
        >
          🎨 Theme & Appearance
        </a>
        <a
          href="#settings"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-purple-100 text-purple-900 dark:bg-purple-900/60 dark:text-purple-200 border border-purple-200 dark:border-purple-800 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
        >
          ⚙️ Account Settings
        </a>
        <a
          href="#security-settings"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-purple-100 text-purple-900 dark:bg-purple-900/60 dark:text-purple-200 border border-purple-200 dark:border-purple-800 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
        >
          🔒 Security
        </a>
      </div>

      {resolvedParams.saved === 'creature' && (
        <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-300 dark:border-emerald-700 p-4 text-center text-sm font-bold text-emerald-800 dark:text-emerald-200 shadow-sm animate-fade-in">
          ✨ Companion Creature updated successfully!
        </div>
      )}

      {resolvedParams.saved === 'account' && (
        <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-300 dark:border-emerald-700 p-4 text-center text-sm font-bold text-emerald-800 dark:text-emerald-200 shadow-sm animate-fade-in">
          ✨ Explorer display name updated successfully!
        </div>
      )}

      {/* 1. COMPANION CREATURE CUSTOMIZER WITH CUSTOM DROPDOWN UI & LIVE CHARACTER SWITCHING */}
      <CreatureCustomizerForm initialKid={kid} updateAction={updateCreatureAction} />

      {/* 2. APPEARANCE & THEME SETTINGS */}
      <Card
        id="appearance-settings"
        className="shadow-xl border-4 border-purple-200/80 dark:border-purple-800/80 bg-white dark:bg-[#12092e] rounded-4xl overflow-hidden transition-colors"
      >
        <CardHeader className="bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 dark:from-[#1b0b42] dark:via-[#261358] dark:to-[#170838] border-b-2 border-purple-100 dark:border-purple-800/60 p-6 sm:p-8 transition-colors">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500 text-white shadow-md shadow-purple-500/30">
              <Palette className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="font-display font-black text-xl sm:text-2xl text-slate-900 dark:text-white">
                Appearance & Theme
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-purple-200/80 font-medium text-xs sm:text-sm mt-0.5">
                Customize your visual adventure between Day Realm and Night Realm
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-display font-black text-slate-900 dark:text-white">Realm Theme Mode</p>
            <p className="text-xs text-slate-500 dark:text-purple-300/70 font-medium mt-0.5">
              Choose between bright daytime sunshine or a deep starry night galaxy
            </p>
          </div>
          <ThemeToggle variant="segmented" />
        </CardContent>
      </Card>

      {/* 3. ACCOUNT SETTINGS */}
      <Card
        id="settings"
        className="shadow-xl border-4 border-purple-200/80 dark:border-purple-800/80 bg-white dark:bg-[#12092e] rounded-4xl overflow-hidden transition-colors"
      >
        <CardHeader className="bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 dark:from-[#1b0b42] dark:via-[#261358] dark:to-[#170838] border-b-2 border-purple-100 dark:border-purple-800/60 p-6 sm:p-8 transition-colors">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500 text-white shadow-md shadow-cyan-500/30">
              <Settings className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="font-display font-black text-xl sm:text-2xl text-slate-900 dark:text-white">
                Account Details & Settings
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-purple-200/80 font-medium text-xs sm:text-sm mt-0.5">
                Update your display name and view account information
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8">
          <form action={updateProfileNameAction} className="space-y-5">
            <Input
              label="Explorer Full Name / Display Name"
              name="fullName"
              defaultValue={user.fullName || kid.nickname}
              required
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-purple-200 mb-1.5">
                Registered Account Identifier (Phone / Login)
              </label>
              <input
                type="text"
                defaultValue={accountIdentifier}
                disabled
                className="w-full rounded-2xl border-2 border-slate-200 dark:border-purple-800/80 bg-slate-50 dark:bg-[#160a36] px-4 py-2.5 text-sm text-slate-500 dark:text-purple-300/60 cursor-not-allowed"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between pt-3 border-t-2 border-slate-100 dark:border-purple-900/60 gap-3">
              <div>
                <span className="text-xs text-slate-400 dark:text-purple-300/70 block mb-1">Active Role:</span>
                <Badge variant="kid">{user.role} EXPLORER</Badge>
              </div>

              <Button type="submit" variant="yellow" className="font-black text-sm gap-2">
                <Check className="h-4 w-4 text-purple-900" />
                Update Display Name
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 4. SECURITY & PASSWORD */}
      <Card
        id="security-settings"
        className="shadow-xl border-4 border-purple-200/80 dark:border-purple-800/80 bg-white dark:bg-[#12092e] rounded-4xl overflow-hidden transition-colors"
      >
        <CardHeader className="bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 dark:from-[#1b0b42] dark:via-[#261358] dark:to-[#170838] border-b-2 border-purple-100 dark:border-purple-800/60 p-6 sm:p-8 transition-colors">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500 text-white shadow-md shadow-indigo-500/30">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="font-display font-black text-xl sm:text-2xl text-slate-900 dark:text-white">
                Security & Password
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-purple-200/80 font-medium text-xs sm:text-sm mt-0.5">
                Manage your password and explorer security
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-display font-black text-slate-900 dark:text-white">Account Password</p>
            <p className="text-xs text-slate-500 dark:text-purple-300/70 font-medium mt-0.5">
              Reset your password securely whenever you need
            </p>
          </div>
          <Link href="/auth/forgot-password">
            <Button
              variant="outline"
              size="sm"
              className="font-black text-xs border-2 border-slate-200 dark:border-purple-800 dark:text-purple-200 dark:hover:bg-purple-900/40"
            >
              Reset Password
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
