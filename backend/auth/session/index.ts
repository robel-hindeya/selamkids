import { cookies } from 'next/headers';
import { getServerDb } from '@/backend/db/server';
import { UserRepository } from '@/backend/db/repositories/user.repository';
import { AuthUser } from '@/types/auth';
import { ROLES, UserRole } from '@/backend/constants/roles';
import { ROLE_DEFAULT_PERMISSIONS } from '@/backend/constants/permissions';
import { LOCAL_SESSION_COOKIE, decodeSession } from './local-session';

const userRepo = new UserRepository();

/**
 * Resolves current authenticated user from local session cookies or Supabase SSR,
 * and hydrates user profile, role, and permissions.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  // 1. Check local session cookie first
  try {
    const cookieStore = await cookies();
    const localCookie = cookieStore.get(LOCAL_SESSION_COOKIE)?.value;
    if (localCookie) {
      const session = decodeSession(localCookie);
      if (session) {
        return {
          id: session.id,
          email: session.email,
          role: session.role,
          permissions: session.permissions || ROLE_DEFAULT_PERMISSIONS[session.role] || [],
          fullName: session.fullName,
          status: 'ACTIVE',
          metadata: { role: session.role, full_name: session.fullName },
        };
      }
    }
  } catch {
    // Cookie reading error, continue to Supabase
  }

  // 2. Check Supabase Auth
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes('dummy-project')) {
      return null;
    }

    const supabase = await getServerDb();
    const {
      data: { user: authUser },
      error,
    } = await supabase.auth.getUser();

    if (error || !authUser) {
      return null;
    }

    // Fetch user profile
    const profile = await userRepo.findById(authUser.id);
    const roleAndPerms = await userRepo.getUserRoleAndPermissions(authUser.id);

    const userRole: UserRole = roleAndPerms?.role || (authUser.user_metadata?.role as UserRole) || ROLES.KID;
    const permissions = roleAndPerms?.permissions || ROLE_DEFAULT_PERMISSIONS[userRole] || [];

    return {
      id: authUser.id,
      email: authUser.email || profile?.email || '',
      role: userRole,
      permissions,
      fullName: profile?.full_name || authUser.user_metadata?.full_name || authUser.email || 'User',
      avatarUrl: profile?.avatar_url || undefined,
      status: profile?.status || 'ACTIVE',
      metadata: authUser.user_metadata,
    };
  } catch (err: unknown) {
    if (
      err &&
      typeof err === 'object' &&
      'digest' in err &&
      typeof (err as { digest: string }).digest === 'string' &&
      (err as { digest: string }).digest.startsWith('DYNAMIC_SERVER_USAGE')
    ) {
      throw err;
    }

    return null;
  }
}
