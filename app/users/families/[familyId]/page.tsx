import { requireAuth } from '@/backend/auth/guards';
import { FamilyService } from '@/backend/services/family.service';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { notFound } from 'next/navigation';

export default async function ViewFamilyDetailPage({
  params,
}: {
  params: Promise<{ familyId: string }>;
}) {
  const user = await requireAuth();
  const { familyId } = await params;
  const familyService = new FamilyService();

  let family;
  try {
    family = await familyService.getFamilyById(user, familyId);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title={family.family_name}
        description="Household unit details and enrolled children."
        breadcrumbs={[
          { label: 'Portal', href: '/users' },
          { label: 'Families', href: '/users/families' },
          { label: family.family_name },
        ]}
      />

      <Card className="p-6">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <div>
            <h4 className="font-bold text-slate-900 text-lg">{family.family_name}</h4>
            <p className="text-xs text-slate-500">Tier: {family.subscription_tier}</p>
          </div>
          <Badge variant="cyan">{family.subscription_status}</Badge>
        </div>

        <h5 className="font-bold text-slate-800 text-sm mb-3">Enrolled Children ({family.children.length})</h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {family.children.map((kid) => (
            <div key={kid.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50">
              <div className="font-bold text-slate-800 text-sm">{kid.nickname}</div>
              <div className="text-xs text-slate-500 mt-1">
                {kid.grade_level} • {kid.words_written} words written • {kid.orbs} orbs
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
