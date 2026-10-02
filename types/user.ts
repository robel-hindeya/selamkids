import { UserRole } from '@/backend/constants/roles';
import { UserStatus } from '@/backend/constants/status';

export interface UserProfile {
  id: string; // references auth.users(id)
  email: string;
  fullName: string;
  avatarUrl?: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface KidProfile {
  id: string;
  userId: string;
  nickname: string;
  age: number;
  gradeLevel: string;
  creatureName?: string;
  creatureType?: string;
  creatureImageUrl?: string;
  orbs: number; // gamified points/currency
  wordsWritten: number;
  readingLevel: string;
  familyId?: string;
  classroomId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyProfile {
  id: string;
  userId: string;
  familyName: string;
  primaryContactPhone?: string;
  subscriptionTier: 'FREE' | 'STARTER' | 'PREMIUM';
  subscriptionStatus: 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'TRIAL';
  kidsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyMember {
  id: string;
  familyId: string;
  userId: string;
  relationship: 'PARENT' | 'GUARDIAN' | 'CHILD';
  createdAt: string;
}

export interface TeacherProfile {
  id: string;
  userId: string;
  schoolName: string;
  department?: string;
  gradeLevel: string;
  verified: boolean;
  classroomsCount: number;
  studentsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProfile {
  id: string;
  userId: string;
  department: string;
  accessTier: 'STANDARD' | 'SENIOR';
  lastActive?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogItem {
  id: string;
  userId?: string;
  userEmail?: string;
  userRole?: UserRole;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}
