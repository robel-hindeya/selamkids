import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/backend/auth/session';
import { ROLE_REDIRECTS } from '@/backend/constants/roles';

export default async function UsersRootPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  const destination = ROLE_REDIRECTS[user.role] || '/users/kids';
  redirect(destination);
}
