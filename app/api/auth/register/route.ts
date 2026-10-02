import { NextRequest } from 'next/server';
import { getServerDb } from '@/backend/db/server';
import { getAdminDb } from '@/backend/db/admin';
import { RoleRepository } from '@/backend/db/repositories/role.repository';
import { AuditLogRepository } from '@/backend/db/repositories/audit-log.repository';
import { registerSchema } from '@/backend/validation/auth.schema';
import { apiCreated } from '@/backend/utils/response';
import { handleApiError } from '@/backend/errors/api-error';
import { ForbiddenError } from '@/backend/errors/auth-error';
import { ROLE_REDIRECTS, ROLES, UserRole } from '@/backend/constants/roles';
import { AUDIT_ACTION } from '@/backend/constants/status';
import {
  LOCAL_SESSION_COOKIE,
  createLocalSession,
  encodeSession,
} from '@/backend/auth/session/local-session';
import { getPhoneAuthStore } from '@/backend/auth/phone-auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = registerSchema.parse(body);

    const role = (validated.role || ROLES.KID) as UserRole;

    // Prevent direct sign up as ADMIN or SUPERADMIN
    if (role === ROLES.ADMIN || role === ROLES.SUPERADMIN) {
      throw new ForbiddenError('Administrative accounts cannot be self-registered.');
    }

    const username = validated.username || `kid_${Date.now().toString().slice(-4)}`;
    const countryCode = validated.countryCode || '+251';
    const phoneNumber = validated.phoneNumber || `${Date.now().toString().slice(-9)}`;
    const fullName = validated.fullName || username;
    const email = (validated.email || `${username.toLowerCase()}@selamkids.com`).toLowerCase().trim();

    // Register user in phoneAuthStore
    const phoneAuth = getPhoneAuthStore();
    const phoneUser = phoneAuth.register({
      username,
      countryCode,
      phoneNumber,
      password: validated.password,
      role,
      fullName,
    });

    let userId = phoneUser.id;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isDummy = !supabaseUrl || supabaseUrl.includes('dummy-project');

    if (!isDummy) {
      try {
        const supabase = await getServerDb();
        const adminDb = getAdminDb();

        const { data, error } = await supabase.auth.signUp({
          email,
          password: validated.password,
          options: {
            data: {
              full_name: fullName,
              role,
              username,
              phone_number: phoneUser.fullPhoneNumber,
            },
          },
        });

        if (!error && data?.user) {
          userId = data.user.id;

          // Create profile row using adminDb
          await adminDb.from('profiles').upsert({
            id: userId,
            email,
            full_name: fullName,
            status: 'ACTIVE',
          });

          const roleRepo = new RoleRepository();
          await roleRepo.assignRoleToUser(userId, role);

          // Role-specific records
          if (role === ROLES.KID) {
            await adminDb.from('kids').upsert({
              user_id: userId,
              nickname: username,
              age: 8,
              grade_level: 'Grade 3',
              orbs: 50,
            });
          }

          const auditRepo = new AuditLogRepository();
          await auditRepo.createLog({
            user_id: userId,
            user_email: email,
            action: AUDIT_ACTION.CREATE,
            resource: 'users',
            details: { role, username, phone: phoneUser.fullPhoneNumber },
          });
        }
      } catch {
        // Fallback to local session
      }
    }

    // Provision local session cookie for instant registration & seamless login
    const localSession = createLocalSession({
      id: userId,
      email,
      fullName,
      role,
    });
    const token = encodeSession(localSession);

    const response = apiCreated({
      user: {
        id: localSession.id,
        email: localSession.email,
        role: localSession.role,
        fullName: localSession.fullName,
      },
      redirectTo: ROLE_REDIRECTS[role] || '/users/kids',
    });

    response.cookies.set(LOCAL_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
