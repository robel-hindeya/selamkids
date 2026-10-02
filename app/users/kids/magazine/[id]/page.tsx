import { requireAuth } from '@/backend/auth/guards';
import { KidService } from '@/backend/services/kid.service';
import { getMagazineById, MAGAZINES } from '@/components/users/magazine-data';
import { FullscreenMagazineReader } from '@/components/users/fullscreen-magazine-reader';
import { notFound } from 'next/navigation';

export default async function MagazineIssuePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAuth();
  const { id } = await params;

  const magazine = getMagazineById(id) || MAGAZINES[0];
  if (!magazine) {
    notFound();
  }

  const kidService = new KidService();
  const kid = await kidService.getMyProfile(user);

  return (
    <div className="min-h-[85vh] py-4">
      <FullscreenMagazineReader
        magazine={magazine}
        initialOrbs={kid.orbs}
      />
    </div>
  );
}
