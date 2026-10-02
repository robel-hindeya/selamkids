'use server';

import { redirect } from 'next/navigation';
import { getServerDb } from '@/backend/db/server';
import { getAdminDb } from '@/backend/db/admin';
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from '@/backend/validation/auth.schema';
import { ROLE_REDIRECTS, ROLES, UserRole } from '@/backend/constants/roles';
import { UserRepository } from '@/backend/db/repositories/user.repository';
import { RoleRepository } from '@/backend/db/repositories/role.repository';
import { AuditLogRepository } from '@/backend/db/repositories/audit-log.repository';
import { AUDIT_ACTION } from '@/backend/constants/status';

const userRepo = new UserRepository();
const roleRepo = new RoleRepository();
const auditRepo = new AuditLogRepository();

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const validation = loginSchema.safeParse({ email, password });
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0]?.message || 'Invalid login details',
    };
  }

  const supabase = await getServerDb();
  const finalEmail = validation.data.email || `${validation.data.username || 'user'}@selamkids.com`;
  const { data, error } = await supabase.auth.signInWithPassword({
    email: finalEmail,
    password: validation.data.password,
  });

  if (error || !data.user) {
    return {
      success: false,
      error: error?.message || 'Invalid email or password',
    };
  }

  // Audit log
  await auditRepo.createLog({
    user_id: data.user.id,
    user_email: data.user.email,
    action: AUDIT_ACTION.LOGIN,
    resource: 'auth',
  });

  // Resolve role for redirect
  const roleInfo = await userRepo.getUserRoleAndPermissions(data.user.id);
  const userRole = roleInfo?.role || (data.user.user_metadata?.role as UserRole) || ROLES.KID;
  const destination = ROLE_REDIRECTS[userRole] || '/users';

  redirect(destination);
}

export async function registerAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;
  const role = (formData.get('role') as string) || ROLES.KID;

  // Protect against normal users signing up directly as ADMIN or SUPERADMIN
  if (role === ROLES.ADMIN || role === ROLES.SUPERADMIN) {
    return {
      success: false,
      error: 'Administrative accounts must be provisioned by a Superadmin.',
    };
  }

  const validation = registerSchema.safeParse({
    email,
    password,
    fullName,
    role,
  });

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0]?.message || 'Invalid registration details',
    };
  }

  const supabase = await getServerDb();
  const adminDb = getAdminDb();
  const regEmail = validation.data.email || `${validation.data.username || 'user'}@selamkids.com`;
  const regFullName = validation.data.fullName || validation.data.username || 'Young Author';
  const regRole: UserRole = (validation.data.role || ROLES.KID) as UserRole;

  const { data, error } = await supabase.auth.signUp({
    email: regEmail,
    password: validation.data.password,
    options: {
      data: {
        full_name: regFullName,
        role: regRole,
      },
    },
  });

  if (error || !data.user) {
    return {
      success: false,
      error: error?.message || 'Could not register user',
    };
  }

  const userId = data.user.id;

  // Create profile row using adminDb
  await adminDb.from('profiles').upsert({
    id: userId,
    email: regEmail,
    full_name: regFullName,
    status: 'ACTIVE',
  });

  // Assign user role
  await roleRepo.assignRoleToUser(userId, regRole);

  // Initialize role-specific table row
  if (regRole === ROLES.KID) {
    await adminDb.from('kids').upsert({
      user_id: userId,
      nickname: regFullName.split(' ')[0] || 'Explorer',
      age: 8,
      grade_level: 'Grade 3',
      orbs: 50,
      reading_level: 'Emerging',
    });
  } else if (regRole === ROLES.FAMILY) {
    await adminDb.from('families').upsert({
      user_id: userId,
      family_name: `${regFullName}'s Family`,
      subscription_tier: 'FREE',
    });
  } else if (regRole === ROLES.TEACHER) {
    await adminDb.from('teachers').upsert({
      user_id: userId,
      school_name: 'Primary Academy',
      grade_level: 'Grade 3-5',
      verified: false,
    });
  }

  await auditRepo.createLog({
    user_id: userId,
    user_email: regEmail,
    action: AUDIT_ACTION.CREATE,
    resource: 'users',
    details: { role: regRole },
  });

  const destination = ROLE_REDIRECTS[regRole] || '/users';
  redirect(destination);
}

export async function logoutAction() {
  const supabase = await getServerDb();
  await supabase.auth.signOut();
  redirect('/auth/login');
}

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get('email') as string;
  const validation = forgotPasswordSchema.safeParse({ email });
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0]?.message || 'Invalid email address',
    };
  }

  const supabase = await getServerDb();
  const emailToReset = validation.data.email || 'user@selamkids.com';
  const { error } = await supabase.auth.resetPasswordForEmail(emailToReset, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password`,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    message: 'Check your email for password reset instructions.',
  };
}

export async function resetPasswordAction(formData: FormData) {
  const password = formData.get('password') as string;
  const validation = resetPasswordSchema.safeParse({ password });
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0]?.message || 'Invalid password format',
    };
  }

  const supabase = await getServerDb();
  const { error } = await supabase.auth.updateUser({
    password: validation.data.password,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  redirect('/auth/login');
}
