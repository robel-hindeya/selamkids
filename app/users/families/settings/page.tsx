import { requireAuth } from '@/backend/auth/guards';
import { FamilyService } from '@/backend/services/family.service';
import { KidRepository } from '@/backend/db/repositories/kid.repository';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { redirect } from 'next/navigation';

export default async function FamilySettingsPage() {
  const user = await requireAuth();
  const familyService = new FamilyService();
  const family = await familyService.getMyFamily(user);

  async function updateFamilyAction(formData: FormData) {
    'use server';
    const currentUser = await requireAuth();
    const service = new FamilyService();
    const myFamily = await service.getMyFamily(currentUser);

    const familyName = formData.get('familyName') as string;
    const phone = formData.get('phone') as string;

    await service.updateFamily(currentUser, myFamily.id, {
      familyName,
      primaryContactPhone: phone,
    });

    redirect('/users/families');
  }

  async function addChildAction(formData: FormData) {
    'use server';
    const currentUser = await requireAuth();
    const service = new FamilyService();
    const myFamily = await service.getMyFamily(currentUser);
    const kidRepo = new KidRepository();

    const nickname = formData.get('nickname') as string;
    const age = parseInt(formData.get('age') as string, 10) || 8;
    const gradeLevel = formData.get('gradeLevel') as string;

    // Create child profile linked to this family
    await kidRepo.createKid({
      user_id: currentUser.id,
      nickname,
      age,
      grade_level: gradeLevel || 'Grade 3',
      family_id: myFamily.id,
      orbs: 50,
      words_written: 0,
      reading_level: 'Adventurer',
    });

    redirect('/users/families');
  }

  async function updatePinAction(formData: FormData) {
    'use server';
    const currentUser = await requireAuth();
    const service = new FamilyService();
    const pin = ((formData.get('pin') as string) || '').trim();

    if (/^\d{4}$/.test(pin)) {
      await service.setParentPin(currentUser, pin);
    }

    redirect('/users/families/settings?pinUpdated=true');
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <PageHeader
        title="Family Account & Security"
        description="Update household profile, enroll child explorers, and configure parental 4-digit PIN lock."
        breadcrumbs={[
          { label: 'Family Hub', href: '/users/families' },
          { label: 'Family Settings' },
        ]}
      />

      {/* Parental Lock PIN Card */}
      <Card className="shadow-sm border-2 border-purple-200 bg-gradient-to-r from-purple-50/50 to-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-purple-950 font-display font-black">
              <span>Parental 4-Digit Security PIN</span>
            </CardTitle>
            <span className="rounded-full bg-purple-100 text-purple-800 text-[10px] font-black uppercase px-2.5 py-1 border border-purple-200">
              {family.parent_pin ? 'PIN Active' : 'Setup Required'}
            </span>
          </div>
          <CardDescription>
            This 4-digit password protects the Parent Dashboard and family settings. When kids are logged in, they remain safely at{' '}
            <strong className="text-purple-700">/users/kids</strong> and cannot view the parent hub without this PIN.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updatePinAction} className="space-y-4">
            <div className="max-w-xs">
              <Input
                label="New 4-Digit Passcode"
                name="pin"
                type="password"
                maxLength={4}
                pattern="\d{4}"
                placeholder="4 numbers, e.g. 1234"
                defaultValue={family.parent_pin || ''}
                required
              />
              <p className="text-[11px] text-slate-500 mt-1">Must be exactly 4 numeric digits (0-9).</p>
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="yellow" className="font-black text-xs">
                Save 4-Digit Parent PIN
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Profile Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Family Details</CardTitle>
          <CardDescription>Household name and primary contact</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateFamilyAction} className="space-y-4">
            <Input
              label="Family Name"
              name="familyName"
              defaultValue={family.family_name}
              required
            />
            <Input
              label="Parent Contact Phone"
              name="phone"
              defaultValue={family.primary_contact_phone || ''}
              placeholder="+1 (555) 000-0000"
            />
            <div className="flex justify-end">
              <Button type="submit">Save Family Details</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Add Child Section */}
      <Card id="add-child" className="shadow-sm border-cyan-200">
        <CardHeader>
          <CardTitle>Enroll a Child Explorer</CardTitle>
          <CardDescription>
            Create an independent reading profile for your child
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={addChildAction} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <Input
                  label="Child Nickname"
                  name="nickname"
                  placeholder="e.g. Leo"
                  required
                />
              </div>
              <div>
                <Input
                  label="Age"
                  name="age"
                  type="number"
                  defaultValue="8"
                  min="4"
                  max="18"
                  required
                />
              </div>
              <div>
                <Input
                  label="Grade / Year"
                  name="gradeLevel"
                  placeholder="Grade 3"
                  defaultValue="Grade 3"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="default" className="bg-cyan-600 hover:bg-cyan-700">
                Enroll Child
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
