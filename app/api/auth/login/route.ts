import { NextRequest } from 'next/server';
import { getServerDb } from '@/backend/db/server';
import { UserRepository } from '@/backend/db/repositories/user.repository';
import { AuditLogRepository } from '@/backend/db/repositories/audit-log.repository';
import { loginSchema } from '@/backend/validation/auth.schema';
import { apiSuccess } from '@/backend/utils/response';
import { handleApiError } from '@/backend/errors/api-error';
import { UnauthorizedError } from '@/backend/errors/auth-error';
import { ROLE_REDIRECTS, ROLES, UserRole } from '@/backend/constants/roles';
import { AUDIT_ACTION } from '@/backend/constants/status';
import {
  LOCAL_SESSION_COOKIE,
  DEMO_ACCOUNTS,
  createLocalSession,
  encodeSession,
} from '@/backend/auth/session/local-session';
import { getPhoneAuthStore } from '@/backend/auth/phone-auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = loginSchema.parse(body);

    const identifier = (validated.phoneNumber || validated.username || validated.email || '').trim();
    if (!identifier) {
      throw new UnauthorizedError('Please enter your phone number.');
    }

    // STRICT: Anyone cannot log in with email, only login with phone
    if (identifier.includes('@')) {
      throw new UnauthorizedError('Email login is disabled. Please sign in with your phone number.');
    }

    const phoneAuth = getPhoneAuthStore();
    const digits = identifier.replace(/\D/g, '');
    const cleanPhoneLookup = digits.startsWith('0') && digits.length === 10 ? `+251${digits.substring(1)}` : identifier;
    const phoneUser = phoneAuth.findByIdentifier(cleanPhoneLookup) || phoneAuth.findByIdentifier(identifier);

    if (!phoneUser) {
      throw new UnauthorizedError('No account found with this phone number. Please check your number or register.');
    }

    // Validate password
    if (phoneUser.password && phoneUser.password !== validated.password) {
      throw new UnauthorizedError('Incorrect password. Please try again or use Forgot Password.');
    }

    const userId = phoneUser.id;
    const email = phoneUser.email;
    const fullName = phoneUser.fullName;
    const userRole = phoneUser.role;

    const localSession = createLocalSession({
      id: userId,
      email,
      fullName,
      role: userRole,
    });
    const token = encodeSession(localSession);

    const auditRepo = new AuditLogRepository();
    await auditRepo.createLog({
      user_id: userId,
      user_email: email,
      user_role: userRole,
      action: AUDIT_ACTION.LOGIN,
      resource: 'auth',
      details: { identifier },
    });

    const response = apiSuccess({
      user: {
        id: localSession.id,
        email: localSession.email,
        role: localSession.role,
        fullName: localSession.fullName,
      },
      redirectTo: ROLE_REDIRECTS[userRole] || '/users/kids',
    });

    response.cookies.set(LOCAL_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
