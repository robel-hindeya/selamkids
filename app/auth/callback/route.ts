import { NextResponse, type NextRequest } from 'next/server';
import { getServerDb } from '@/backend/db/server';
import { UserRepository } from '@/backend/db/repositories/user.repository';
import { ROLE_REDIRECTS, ROLES, UserRole } from '@/backend/constants/roles';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next');

  if (code) {
    const supabase = await getServerDb();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      if (next) {
        return NextResponse.redirect(new URL(next, request.url));
      }

      const userRepo = new UserRepository();
      const roleInfo = await userRepo.getUserRoleAndPermissions(data.user.id);
      const userRole = roleInfo?.role || (data.user.user_metadata?.role as UserRole) || ROLES.KID;
      const redirectPath = ROLE_REDIRECTS[userRole] || '/users';

      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
  }

  // URL to redirect to after sign-in process completes if code exchange failed
  return NextResponse.redirect(new URL('/auth/login?error=auth_callback_failed', request.url));
}
