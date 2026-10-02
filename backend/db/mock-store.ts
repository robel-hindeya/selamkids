import {
  ProfileRow,
  ProfileInsert,
  ProfileUpdate,
  KidRow,
  KidInsert,
  KidUpdate,
  FamilyRow,
  FamilyInsert,
  FamilyUpdate,
  TeacherRow,
  TeacherInsert,
  TeacherUpdate,
  AuditLogRow,
  AuditLogInsert,
  RoleRow,
  PermissionRow,
  UserRoleRow,
} from './types';
import { ROLES, UserRole, ALL_ROLES } from '@/backend/constants/roles';
import { ALL_PERMISSIONS, ROLE_DEFAULT_PERMISSIONS, Permission } from '@/backend/constants/permissions';
import { DEMO_ACCOUNTS } from '@/backend/auth/session/local-session';
import { PaginationParams } from '@/backend/utils/pagination';
import { Json } from '@/types/database';

class MockDataStore {
  profiles: ProfileRow[] = [];
  roles: RoleRow[] = [];
  permissions: PermissionRow[] = [];
  userRoles: UserRoleRow[] = [];
  kids: KidRow[] = [];
  families: FamilyRow[] = [];
  familyMembers: { id: string; family_id: string; user_id: string; relationship: string; created_at: string }[] = [];
  teachers: TeacherRow[] = [];
  auditLogs: AuditLogRow[] = [];
  systemSettings: Map<string, { key: string; value: Json; description: string | null; updated_by: string | null; updated_at: string }> = new Map();

  constructor() {
    this.seed();
  }

  private seed() {
    const now = new Date().toISOString();

    // 1. Roles
    this.roles = ALL_ROLES.map((r, idx) => ({
      id: `role-${idx + 1}`,
      name: r,
      description: `${r} system role`,
      created_at: now,
    }));

    // 2. Permissions
    this.permissions = ALL_PERMISSIONS.map((p, idx) => ({
      id: `perm-${idx + 1}`,
      name: p,
      description: `Permission ${p}`,
      created_at: now,
    }));

    // 3. Profiles & Demo accounts
    const initialProfiles: { id: string; email: string; full_name: string; role: UserRole }[] = [
      ...Object.values(DEMO_ACCOUNTS).map((acc) => ({
        id: acc.id,
        email: acc.email,
        full_name: acc.fullName,
        role: acc.role,
      })),
      {
        id: 'user-kid-2',
        email: 'aria.moon@selamkids.com',
        full_name: 'Aria Moonweaver',
        role: ROLES.KID,
      },
      {
        id: 'user-kid-3',
        email: 'zane.cloud@selamkids.com',
        full_name: 'Zane Cloudchaser',
        role: ROLES.KID,
      },
      {
        id: 'user-kid-4',
        email: 'maya.spark@selamkids.com',
        full_name: 'Maya Spark',
        role: ROLES.KID,
      },
      {
        id: 'user-kid-5',
        email: 'oliver.quill@selamkids.com',
        full_name: 'Oliver Quill',
        role: ROLES.KID,
      },
      {
        id: 'user-fam-2',
        email: 'bramble.family@selamkids.com',
        full_name: 'The Bramble Family',
        role: ROLES.FAMILY,
      },
      {
        id: 'user-fam-3',
        email: 'silver.family@selamkids.com',
        full_name: 'Dr. Anthony Silver',
        role: ROLES.FAMILY,
      },
      {
        id: 'user-teach-2',
        email: 'elena.rostova@selamkids.com',
        full_name: 'Elena Rostova',
        role: ROLES.TEACHER,
      },
      {
        id: 'user-teach-3',
        email: 'david.kim@selamkids.com',
        full_name: 'David Kim',
        role: ROLES.TEACHER,
      },
      {
        id: 'user-admin-2',
        email: 'sarah.ops@selamkids.com',
        full_name: 'Sarah Jenkins (Moderator)',
        role: ROLES.ADMIN,
      },
    ];

    this.profiles = initialProfiles.map((p) => ({
      id: p.id,
      email: p.email,
      full_name: p.full_name,
      avatar_url: null,
      status: 'ACTIVE',
      created_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString(),
      updated_at: now,
      deleted_at: null,
    }));

    // Map user roles
    for (const p of initialProfiles) {
      const roleObj = this.roles.find((r) => r.name === p.role);
      if (roleObj) {
        this.userRoles.push({
          id: `ur-${p.id}`,
          user_id: p.id,
          role_id: roleObj.id,
          assigned_by: 'system',
          created_at: now,
        });
      }
    }

    // 4. Families
    this.families = [
      {
        id: 'fam-1',
        user_id: DEMO_ACCOUNTS['family@selamkids.com'].id,
        family_name: 'The Vance Family',
        primary_contact_phone: '+1 (555) 234-5678',
        subscription_tier: 'STORY_CHAMPION',
        subscription_status: 'ACTIVE',
        parent_pin: null, // First time: prompt to add 4-digit password
        created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
        updated_at: now,
        deleted_at: null,
      },
      {
        id: 'fam-2',
        user_id: 'user-fam-2',
        family_name: 'The Bramble Family',
        primary_contact_phone: '+1 (555) 876-5432',
        subscription_tier: 'EXPLORER_PLUS',
        subscription_status: 'ACTIVE',
        parent_pin: '1234',
        created_at: new Date(Date.now() - 18 * 86400000).toISOString(),
        updated_at: now,
        deleted_at: null,
      },
      {
        id: 'fam-3',
        user_id: 'user-fam-3',
        family_name: 'Dr. Anthony Silver',
        primary_contact_phone: '+1 (555) 432-1098',
        subscription_tier: 'FAMILY_PASS',
        subscription_status: 'ACTIVE',
        parent_pin: '1234',
        created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
        updated_at: now,
        deleted_at: null,
      },
    ];

    // 5. Kids
    this.kids = [
      {
        id: 'kid-1',
        user_id: DEMO_ACCOUNTS['kid@selamkids.com'].id,
        nickname: 'Leo Starlight',
        age: 8,
        grade_level: 'Grade 3',
        creature_name: 'Simba',
        creature_type: 'Mythic Lion',
        creature_image_url: null,
        orbs: 175,
        words_written: 1420,
        reading_level: 'Adventurer',
        family_id: 'fam-1',
        classroom_id: 'class-1',
        created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
        updated_at: now,
        deleted_at: null,
      },
      {
        id: 'kid-2',
        user_id: 'user-kid-2',
        nickname: 'Aria Moonweaver',
        age: 9,
        grade_level: 'Grade 4',
        creature_name: 'Starlight Owl',
        creature_type: 'Aerial Sage',
        creature_image_url: null,
        orbs: 340,
        words_written: 3890,
        reading_level: 'Lorekeeper',
        family_id: 'fam-1',
        classroom_id: 'class-1',
        created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
        updated_at: now,
        deleted_at: null,
      },
      {
        id: 'kid-3',
        user_id: 'user-kid-3',
        nickname: 'Zane Cloudchaser',
        age: 7,
        grade_level: 'Grade 2',
        creature_name: 'Cloud Fox',
        creature_type: 'Swift Prowler',
        creature_image_url: null,
        orbs: 95,
        words_written: 980,
        reading_level: 'Explorer',
        family_id: 'fam-2',
        classroom_id: null,
        created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
        updated_at: now,
        deleted_at: null,
      },
      {
        id: 'kid-4',
        user_id: 'user-kid-4',
        nickname: 'Maya Spark',
        age: 10,
        grade_level: 'Grade 5',
        creature_name: 'Ember Phoenix',
        creature_type: 'Flame Crafter',
        creature_image_url: null,
        orbs: 490,
        words_written: 5420,
        reading_level: 'Master Author',
        family_id: 'fam-2',
        classroom_id: 'class-2',
        created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
        updated_at: now,
        deleted_at: null,
      },
      {
        id: 'kid-5',
        user_id: 'user-kid-5',
        nickname: 'Oliver Quill',
        age: 8,
        grade_level: 'Grade 3',
        creature_name: 'Chrono Beetle',
        creature_type: 'Gear Spinner',
        creature_image_url: null,
        orbs: 210,
        words_written: 2150,
        reading_level: 'Adventurer',
        family_id: 'fam-3',
        classroom_id: 'class-1',
        created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
        updated_at: now,
        deleted_at: null,
      },
    ];

    // 6. Teachers
    this.teachers = [
      {
        id: 'teach-1',
        user_id: DEMO_ACCOUNTS['teacher@selamkids.com'].id,
        school_name: 'Oakridge Elementary School',
        department: 'Creative Writing & Literacy',
        grade_level: 'Grade 3-4',
        verified: true,
        created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
        updated_at: now,
        deleted_at: null,
      },
      {
        id: 'teach-2',
        user_id: 'user-teach-2',
        school_name: 'Starlight Academy of Arts',
        department: 'Literacy & Story Arts',
        grade_level: 'Grade 4-5',
        verified: true,
        created_at: new Date(Date.now() - 22 * 86400000).toISOString(),
        updated_at: now,
        deleted_at: null,
      },
      {
        id: 'teach-3',
        user_id: 'user-teach-3',
        school_name: 'Horizon International School',
        department: 'English Language Arts',
        grade_level: 'Grade 5',
        verified: false,
        created_at: new Date(Date.now() - 9 * 86400000).toISOString(),
        updated_at: now,
        deleted_at: null,
      },
      {
        id: 'teach-4',
        user_id: 'user-teach-4',
        school_name: 'Creativity Lab Charter',
        department: 'Early Literacy',
        grade_level: 'Grade 2-3',
        verified: false,
        created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
        updated_at: now,
        deleted_at: null,
      },
    ];

    // 7. Audit Logs
    this.auditLogs = [
      {
        id: 'log-1',
        user_id: DEMO_ACCOUNTS['admin@selamkids.com'].id,
        user_email: 'admin@selamkids.com',
        user_role: ROLES.ADMIN,
        action: 'UPDATE',
        resource: 'teachers.verification',
        resource_id: 'teach-1',
        details: { verified: true, reason: 'Educator credentials verified via school registry' },
        ip_address: '127.0.0.1',
        user_agent: 'Next.js Admin Console',
        created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      },
      {
        id: 'log-2',
        user_id: DEMO_ACCOUNTS['admin@selamkids.com'].id,
        user_email: 'admin@selamkids.com',
        user_role: ROLES.ADMIN,
        action: 'UPDATE',
        resource: 'kids.orbs',
        resource_id: 'kid-1',
        details: { amount: 50, reason: 'Admin quest reward bonus' },
        ip_address: '127.0.0.1',
        user_agent: 'Next.js Admin Console',
        created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      },
      {
        id: 'log-3',
        user_id: DEMO_ACCOUNTS['superadmin@selamkids.com'].id,
        user_email: 'superadmin@selamkids.com',
        user_role: ROLES.SUPERADMIN,
        action: 'SETTINGS_CHANGED',
        resource: 'system_settings',
        resource_id: 'moderation.coppa_strict_filter',
        details: { value: true, description: 'COPPA automated safety screening active' },
        ip_address: '127.0.0.1',
        user_agent: 'Next.js Superadmin Console',
        created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      },
      {
        id: 'log-4',
        user_id: DEMO_ACCOUNTS['admin@selamkids.com'].id,
        user_email: 'admin@selamkids.com',
        user_role: ROLES.ADMIN,
        action: 'LOGIN',
        resource: 'auth',
        resource_id: DEMO_ACCOUNTS['admin@selamkids.com'].id,
        details: { method: 'password', status: 'SUCCESS' },
        ip_address: '127.0.0.1',
        user_agent: 'Mozilla/5.0 Chrome/120',
        created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      },
      {
        id: 'log-5',
        user_id: DEMO_ACCOUNTS['kid@selamkids.com'].id,
        user_email: 'kid@selamkids.com',
        user_role: ROLES.KID,
        action: 'CREATE',
        resource: 'stories',
        resource_id: 'story-101',
        details: { title: 'The Dragon in the Night Sky', wordCount: 350, orbsEarned: 52 },
        ip_address: '127.0.0.1',
        user_agent: 'Mozilla/5.0 iPad Safari',
        created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
      },
    ];

    // 8. System settings
    const defaultSettings: [string, Json, string][] = [
      ['platform.registration_open', true, 'Allow public student and family trial signups'],
      ['economy.daily_orb_cap', 500, 'Maximum orbs a student can earn per 24 hours'],
      ['moderation.coppa_strict_filter', true, 'Strict COPPA word masking filter on stories'],
      ['moderation.teacher_direct_publish', true, 'Allow verified educators to approve stories'],
      ['theme.active_realm', 'Night Zoo Explorers & Story Crafters', 'Current creative seasonal realm'],
      ['ai.story_assistant_enabled', true, 'Enable creative writing prompts helper'],
    ];

    for (const [key, value, description] of defaultSettings) {
      this.systemSettings.set(key, {
        key,
        value,
        description,
        updated_by: 'system',
        updated_at: now,
      });
    }
  }

  // --- Users ---
  listUsers(params: PaginationParams, search?: string, roleFilter?: UserRole) {
    let list = this.profiles.filter((p) => p.deleted_at === null);

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) => p.full_name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q)
      );
    }

    if (roleFilter) {
      const roleObj = this.roles.find((r) => r.name === roleFilter);
      if (roleObj) {
        const userIds = new Set(
          this.userRoles.filter((ur) => ur.role_id === roleObj.id).map((ur) => ur.user_id)
        );
        list = list.filter((p) => userIds.has(p.id));
      } else {
        list = [];
      }
    }

    const total = list.length;
    const items = list.slice(params.offset, params.offset + params.limit);
    return { items, total };
  }

  findProfileById(id: string): ProfileRow | null {
    return this.profiles.find((p) => p.id === id && p.deleted_at === null) || null;
  }

  findProfileByEmail(email: string): ProfileRow | null {
    const q = email.toLowerCase().trim();
    return this.profiles.find((p) => p.email.toLowerCase() === q && p.deleted_at === null) || null;
  }

  getUserRoleAndPermissions(userId: string): { role: UserRole; permissions: Permission[] } | null {
    const ur = this.userRoles.find((r) => r.user_id === userId);
    let roleName: UserRole = ROLES.KID;
    if (ur) {
      const roleObj = this.roles.find((r) => r.id === ur.role_id);
      if (roleObj) {
        roleName = roleObj.name as UserRole;
      }
    } else {
      // Check if profile exists
      const p = this.profiles.find((x) => x.id === userId);
      if (p) {
        const demo = Object.values(DEMO_ACCOUNTS).find((d) => d.id === p.id || d.email === p.email);
        if (demo) roleName = demo.role;
      }
    }

    const permissions = ROLE_DEFAULT_PERMISSIONS[roleName] || [];
    return { role: roleName, permissions };
  }

  updateProfile(id: string, updates: ProfileUpdate): ProfileRow {
    const idx = this.profiles.findIndex((p) => p.id === id);
    if (idx === -1) {
      // Auto-provision if not found
      const newP: ProfileRow = {
        id,
        email: updates.email || 'user@selamkids.com',
        full_name: updates.full_name || 'Selam User',
        avatar_url: updates.avatar_url || null,
        status: updates.status || 'ACTIVE',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
      };
      this.profiles.push(newP);
      return newP;
    }

    const current = this.profiles[idx];
    const updated: ProfileRow = {
      ...current,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.profiles[idx] = updated;
    return updated;
  }

  softDeleteUser(id: string): void {
    const p = this.profiles.find((x) => x.id === id);
    if (p) {
      p.deleted_at = new Date().toISOString();
      p.status = 'INACTIVE';
    }
  }

  // --- Kids ---
  listKids(params: PaginationParams, search?: string) {
    let list = this.kids.filter((k) => k.deleted_at === null);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (k) =>
          k.nickname.toLowerCase().includes(q) ||
          (k.creature_name && k.creature_name.toLowerCase().includes(q))
      );
    }
    const total = list.length;
    const items = list.slice(params.offset, params.offset + params.limit);
    return { items, total };
  }

  findKidById(id: string): KidRow | null {
    return this.kids.find((k) => k.id === id && k.deleted_at === null) || null;
  }

  findKidByUserId(userId: string): KidRow | null {
    return this.kids.find((k) => k.user_id === userId && k.deleted_at === null) || null;
  }

  findKidsByFamilyId(familyId: string): KidRow[] {
    return this.kids.filter((k) => k.family_id === familyId && k.deleted_at === null);
  }

  createKid(kid: KidInsert): KidRow {
    const newKid: KidRow = {
      id: kid.id || `kid-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      user_id: kid.user_id,
      nickname: kid.nickname,
      age: kid.age,
      grade_level: kid.grade_level,
      creature_name: kid.creature_name || 'Companion Creature',
      creature_type: kid.creature_type || 'Mythic Beast',
      creature_image_url: kid.creature_image_url || null,
      orbs: kid.orbs ?? 50,
      words_written: kid.words_written ?? 0,
      reading_level: kid.reading_level || 'Adventurer',
      family_id: kid.family_id || null,
      classroom_id: kid.classroom_id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    };
    this.kids.unshift(newKid);
    return newKid;
  }

  updateKid(id: string, updates: KidUpdate): KidRow {
    const idx = this.kids.findIndex((k) => k.id === id);
    if (idx === -1) {
      throw new Error(`Kid ${id} not found`);
    }
    const current = this.kids[idx];
    const updated: KidRow = {
      ...current,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.kids[idx] = updated;
    return updated;
  }

  addOrbs(id: string, amount: number): KidRow {
    const kid = this.findKidById(id);
    if (!kid) throw new Error(`Kid ${id} not found`);
    const newOrbs = Math.max(0, kid.orbs + amount);
    return this.updateKid(id, { orbs: newOrbs });
  }

  softDeleteKid(id: string): void {
    const k = this.kids.find((x) => x.id === id);
    if (k) k.deleted_at = new Date().toISOString();
  }

  // --- Families ---
  listFamilies(params: PaginationParams, search?: string) {
    let list = this.families.filter((f) => f.deleted_at === null);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((f) => f.family_name.toLowerCase().includes(q));
    }
    const total = list.length;
    const items = list.slice(params.offset, params.offset + params.limit);
    return { items, total };
  }

  findFamilyById(id: string): FamilyRow | null {
    return this.families.find((f) => f.id === id && f.deleted_at === null) || null;
  }

  findFamilyByUserId(userId: string): FamilyRow | null {
    return this.families.find((f) => f.user_id === userId && f.deleted_at === null) || null;
  }

  createFamily(family: FamilyInsert): FamilyRow {
    const newFam: FamilyRow = {
      id: family.id || `fam-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      user_id: family.user_id,
      family_name: family.family_name,
      primary_contact_phone: family.primary_contact_phone || null,
      subscription_tier: family.subscription_tier || 'FREE',
      subscription_status: family.subscription_status || 'ACTIVE',
      parent_pin: family.parent_pin || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    };
    this.families.unshift(newFam);
    return newFam;
  }

  updateFamily(id: string, updates: FamilyUpdate): FamilyRow {
    const idx = this.families.findIndex((f) => f.id === id);
    if (idx === -1) throw new Error(`Family ${id} not found`);
    const current = this.families[idx];
    const updated: FamilyRow = {
      ...current,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.families[idx] = updated;
    return updated;
  }

  softDeleteFamily(id: string): void {
    const f = this.families.find((x) => x.id === id);
    if (f) f.deleted_at = new Date().toISOString();
  }

  // --- Teachers ---
  listTeachers(params: PaginationParams, search?: string) {
    let list = this.teachers.filter((t) => t.deleted_at === null);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.school_name.toLowerCase().includes(q) ||
          (t.department && t.department.toLowerCase().includes(q))
      );
    }
    const total = list.length;
    const items = list.slice(params.offset, params.offset + params.limit);
    return { items, total };
  }

  findTeacherById(id: string): TeacherRow | null {
    return this.teachers.find((t) => t.id === id && t.deleted_at === null) || null;
  }

  findTeacherByUserId(userId: string): TeacherRow | null {
    return this.teachers.find((t) => t.user_id === userId && t.deleted_at === null) || null;
  }

  createTeacher(teacher: TeacherInsert): TeacherRow {
    const newTeach: TeacherRow = {
      id: teacher.id || `teach-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      user_id: teacher.user_id,
      school_name: teacher.school_name,
      department: teacher.department || null,
      grade_level: teacher.grade_level,
      verified: teacher.verified ?? false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    };
    this.teachers.unshift(newTeach);
    return newTeach;
  }

  updateTeacher(id: string, updates: TeacherUpdate): TeacherRow {
    const idx = this.teachers.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error(`Teacher ${id} not found`);
    const current = this.teachers[idx];
    const updated: TeacherRow = {
      ...current,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.teachers[idx] = updated;
    return updated;
  }

  verifyTeacher(id: string, verified: boolean): TeacherRow {
    return this.updateTeacher(id, { verified });
  }

  softDeleteTeacher(id: string): void {
    const t = this.teachers.find((x) => x.id === id);
    if (t) t.deleted_at = new Date().toISOString();
  }

  // --- Audit Logs ---
  createAuditLog(entry: AuditLogInsert): AuditLogRow {
    const log: AuditLogRow = {
      id: entry.id || `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      user_id: entry.user_id || null,
      user_email: entry.user_email || null,
      user_role: entry.user_role || null,
      action: entry.action,
      resource: entry.resource,
      resource_id: entry.resource_id || null,
      details: entry.details || null,
      ip_address: entry.ip_address || '127.0.0.1',
      user_agent: entry.user_agent || null,
      created_at: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    return log;
  }

  listAuditLogs(
    params: PaginationParams,
    filters?: { action?: string; resource?: string; userId?: string }
  ) {
    let list = [...this.auditLogs];
    if (filters?.action) list = list.filter((l) => l.action === filters.action);
    if (filters?.resource) list = list.filter((l) => l.resource === filters.resource);
    if (filters?.userId) list = list.filter((l) => l.user_id === filters.userId);

    const total = list.length;
    const items = list.slice(params.offset, params.offset + params.limit);
    return { items, total };
  }

  // --- Roles & Permissions ---
  listRoles(): RoleRow[] {
    return [...this.roles];
  }

  findRoleByName(name: string): RoleRow | null {
    return this.roles.find((r) => r.name === name) || null;
  }

  assignRoleToUser(userId: string, roleName: UserRole, assignedBy?: string): void {
    const roleObj = this.findRoleByName(roleName);
    if (!roleObj) throw new Error(`Role ${roleName} not found`);

    // Remove existing role
    this.userRoles = this.userRoles.filter((ur) => ur.user_id !== userId);
    this.userRoles.push({
      id: `ur-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: userId,
      role_id: roleObj.id,
      assigned_by: assignedBy || null,
      created_at: new Date().toISOString(),
    });
  }

  listAllPermissions(): PermissionRow[] {
    return [...this.permissions];
  }

  // --- System Settings ---
  getAllSettings(): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, item] of this.systemSettings.entries()) {
      result[key] = item.value;
    }
    return result;
  }

  getSetting(key: string): Json | null {
    return this.systemSettings.get(key)?.value ?? null;
  }

  setSetting(key: string, value: Json, updatedBy?: string): void {
    const current = this.systemSettings.get(key);
    this.systemSettings.set(key, {
      key,
      value,
      description: current?.description || null,
      updated_by: updatedBy || null,
      updated_at: new Date().toISOString(),
    });
  }
}

// Global singleton instance for memory persistence across server requests
const globalForMock = global as unknown as { mockStoreInstance?: MockDataStore };
export const mockStore = globalForMock.mockStoreInstance || new MockDataStore();
if (process.env.NODE_ENV !== 'production') {
  globalForMock.mockStoreInstance = mockStore;
}
