import { ROLES, UserRole } from '@/backend/constants/roles';
import { mockStore } from '@/backend/db/mock-store';

export interface PhoneUserRecord {
  id: string;
  username: string;
  countryCode: string;
  phoneNumber: string;
  fullPhoneNumber: string;
  password: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface OtpSession {
  fullPhoneNumber: string;
  code: string;
  expiresAt: number;
}

// Global singleton across hot-reloads
declare global {
  // eslint-disable-next-line no-var
  var __phoneAuthStore: PhoneAuthStore | undefined;
}

export function normalizePhone(countryCode: string, phoneNumber: string): { digits: string; full: string } {
  const cleanCode = countryCode.startsWith('+') ? countryCode : `+${countryCode}`;
  let cleanNumber = phoneNumber.replace(/\D/g, '');
  if (cleanNumber.startsWith('0')) {
    cleanNumber = cleanNumber.substring(1);
  }
  return {
    digits: cleanNumber,
    full: `${cleanCode}${cleanNumber}`,
  };
}

export class PhoneAuthStore {
  private users: Map<string, PhoneUserRecord> = new Map();
  private otps: Map<string, OtpSession> = new Map();

  constructor() {
    this.seed();
  }

  private seed() {
    // Seed initial accounts so existing users & test accounts work
    const initialUsers: PhoneUserRecord[] = [
      {
        id: '11111111-aaaa-bbbb-cccc-111111111111',
        username: 'leo',
        countryCode: '+251',
        phoneNumber: '911111111',
        fullPhoneNumber: '+251911111111',
        password: 'Password123',
        fullName: 'Leo Starlight',
        email: 'kid@selamkids.com',
        role: ROLES.KID,
        createdAt: new Date().toISOString(),
      },
      {
        id: '22222222-aaaa-bbbb-cccc-222222222222',
        username: 'vance_family',
        countryCode: '+251',
        phoneNumber: '922222222',
        fullPhoneNumber: '+251922222222',
        password: 'Password123',
        fullName: 'The Vance Family',
        email: 'family@selamkids.com',
        role: ROLES.FAMILY,
        createdAt: new Date().toISOString(),
      },
      {
        id: '33333333-aaaa-bbbb-cccc-333333333333',
        username: 'clara',
        countryCode: '+251',
        phoneNumber: '933333333',
        fullPhoneNumber: '+251933333333',
        password: 'Password123',
        fullName: 'Ms. Clara Woods',
        email: 'teacher@selamkids.com',
        role: ROLES.TEACHER,
        createdAt: new Date().toISOString(),
      },
      {
        id: '44444444-aaaa-bbbb-cccc-444444444444',
        username: 'admin',
        countryCode: '+251',
        phoneNumber: '944444444',
        fullPhoneNumber: '+251944444444',
        password: 'Password123',
        fullName: 'Marcus Stone (Admin)',
        email: 'admin@selamkids.com',
        role: ROLES.ADMIN,
        createdAt: new Date().toISOString(),
      },
      {
        id: '55555555-aaaa-bbbb-cccc-555555555555',
        username: 'superadmin',
        countryCode: '+251',
        phoneNumber: '955555555',
        fullPhoneNumber: '+251955555555',
        password: 'Password123',
        fullName: 'Grand Archon (Superadmin)',
        email: 'superadmin@selamkids.com',
        role: ROLES.SUPERADMIN,
        createdAt: new Date().toISOString(),
      },
    ];

    for (const u of initialUsers) {
      this.users.set(u.id, u);
    }
  }

  public register(params: {
    username: string;
    countryCode: string;
    phoneNumber: string;
    password: string;
    role?: UserRole;
    fullName?: string;
  }): PhoneUserRecord {
    const { digits, full } = normalizePhone(params.countryCode, params.phoneNumber);
    const cleanUsername = params.username.toLowerCase().trim();

    // Check if username taken
    for (const u of this.users.values()) {
      if (u.username.toLowerCase() === cleanUsername) {
        throw new Error(`Username "${params.username}" is already taken. Please choose another.`);
      }
      if (u.fullPhoneNumber === full) {
        throw new Error(`Phone number ${full} is already registered. Please sign in instead.`);
      }
    }

    const id = `user-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const role = params.role || ROLES.KID;
    const fullName = params.fullName || params.username;
    const email = `${cleanUsername}@selamkids.com`;

    const record: PhoneUserRecord = {
      id,
      username: cleanUsername,
      countryCode: params.countryCode,
      phoneNumber: digits,
      fullPhoneNumber: full,
      password: params.password,
      fullName,
      email,
      role,
      createdAt: new Date().toISOString(),
    };

    this.users.set(id, record);

    // Sync into mockStore profiles so they appear across admin console
    try {
      mockStore.profiles.unshift({
        id,
        email,
        full_name: fullName,
        avatar_url: null,
        status: 'ACTIVE',
        created_at: record.createdAt,
        updated_at: record.createdAt,
        deleted_at: null,
      });

      // Role assignment in mock store
      const roleObj = mockStore.roles.find((r: { name: string }) => r.name === role);
      if (roleObj) {
        mockStore.userRoles.unshift({
          id: `ur-${id}`,
          user_id: id,
          role_id: roleObj.id,
          assigned_by: 'self_register',
          created_at: record.createdAt,
        });
      }

      if (role === ROLES.KID) {
        mockStore.kids.unshift({
          id: `kid-${Date.now()}`,
          user_id: id,
          nickname: cleanUsername,
          age: 9,
          grade_level: 'Grade 3',
          creature_name: 'Simba',
          creature_type: 'Mythic Lion',
          creature_image_url: null,
          orbs: 50,
          words_written: 0,
          reading_level: 'Adventurer',
          family_id: null,
          classroom_id: null,
          created_at: record.createdAt,
          updated_at: record.createdAt,
          deleted_at: null,
        });
      }
    } catch {
      // Mock store sync optional
    }

    return record;
  }

  public findByIdentifier(identifier: string): PhoneUserRecord | undefined {
    this.seed();
    const raw = identifier.trim().toLowerCase();
    const digitsOnly = raw.replace(/\D/g, '');
    const withoutZero = digitsOnly.startsWith('0') ? digitsOnly.substring(1) : digitsOnly;
    const without251 = digitsOnly.startsWith('251') ? digitsOnly.substring(3) : withoutZero;

    for (const u of this.users.values()) {
      if (u.fullPhoneNumber === raw) return u;
      if (digitsOnly && u.phoneNumber === digitsOnly) return u;
      if (withoutZero && u.phoneNumber === withoutZero) return u;
      if (without251 && u.phoneNumber === without251) return u;
      if (digitsOnly && u.fullPhoneNumber.replace(/\D/g, '') === digitsOnly) return u;
      if (digitsOnly && u.fullPhoneNumber.replace(/\D/g, '').endsWith(digitsOnly)) return u;
      if (withoutZero && u.fullPhoneNumber.replace(/\D/g, '').endsWith(withoutZero)) return u;
      if (u.username.toLowerCase() === raw) return u;
    }

    return undefined;
  }

  public sendOtp(countryCode: string, phoneNumber: string): { otpCode: string; fullPhone: string } {
    const { full } = normalizePhone(countryCode, phoneNumber);
    
    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.otps.set(full, {
      fullPhoneNumber: full,
      code,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    return { otpCode: code, fullPhone: full };
  }

  public verifyOtp(countryCode: string, phoneNumber: string, code: string): boolean {
    const { full } = normalizePhone(countryCode, phoneNumber);
    const session = this.otps.get(full);
    
    if (!session) return false;
    if (Date.now() > session.expiresAt) {
      this.otps.delete(full);
      return false;
    }
    // Accept matching code or master debug code '123456'
    return session.code === code.trim() || code.trim() === '123456';
  }

  public resetPasswordByPhone(
    countryCode: string,
    phoneNumber: string,
    code: string,
    newPassword: string
  ): PhoneUserRecord {
    const isValid = this.verifyOtp(countryCode, phoneNumber, code);
    if (!isValid) {
      throw new Error('Invalid or expired verification code (OTP). Please check and try again.');
    }

    const { full } = normalizePhone(countryCode, phoneNumber);
    const user = this.findByIdentifier(full);

    if (!user) {
      // If user wasn't registered yet, create them on the fly
      const newRecord = this.register({
        username: `kid_${phoneNumber.slice(-4)}`,
        countryCode,
        phoneNumber,
        password: newPassword,
      });
      this.otps.delete(full);
      return newRecord;
    }

    user.password = newPassword;
    this.users.set(user.id, user);
    this.otps.delete(full);
    return user;
  }
}

export function getPhoneAuthStore(): PhoneAuthStore {
  if (!global.__phoneAuthStore) {
    global.__phoneAuthStore = new PhoneAuthStore();
  }
  return global.__phoneAuthStore;
}
