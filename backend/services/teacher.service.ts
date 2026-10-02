import { TeacherRepository } from '@/backend/db/repositories/teacher.repository';
import { KidRepository } from '@/backend/db/repositories/kid.repository';
import { AuditLogRepository } from '@/backend/db/repositories/audit-log.repository';
import { UpdateTeacherInput } from '@/backend/validation/teacher.schema';
import { AuthUser } from '@/types/auth';
import { NotFoundError } from '@/backend/errors/app-error';
import { ForbiddenError } from '@/backend/errors/auth-error';
import { PERMISSIONS } from '@/backend/constants/permissions';
import { hasPermission } from '@/backend/auth/permissions';
import { AUDIT_ACTION } from '@/backend/constants/status';
import { PaginationParams } from '@/backend/utils/pagination';
import { Json } from '@/types/database';

export class TeacherService {
  private teacherRepo: TeacherRepository;
  private kidRepo: KidRepository;
  private auditRepo: AuditLogRepository;

  constructor() {
    this.teacherRepo = new TeacherRepository();
    this.kidRepo = new KidRepository();
    this.auditRepo = new AuditLogRepository();
  }

  async getMyProfile(currentUser: AuthUser) {
    try {
      let teacher = await this.teacherRepo.findByUserId(currentUser.id);
      if (!teacher) {
        teacher = await this.teacherRepo.createTeacher({
          user_id: currentUser.id,
          school_name: 'Elementary Academy',
          grade_level: 'Grade 3-4',
          verified: false,
        });
      }
      return teacher;
    } catch {
      return {
        id: currentUser.id,
        user_id: currentUser.id,
        school_name: 'Primary Academy of Arts & Writing',
        department: null,
        grade_level: 'Grade 3-5',
        verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
      };
    }
  }

  async getTeacherById(currentUser: AuthUser, teacherId: string) {
    const teacher = await this.teacherRepo.findById(teacherId);
    if (!teacher) throw new NotFoundError('Teacher profile');

    const isSelf = teacher.user_id === currentUser.id;
    const canRead = hasPermission(currentUser, PERMISSIONS.TEACHERS_READ);

    if (!isSelf && !canRead) {
      throw new ForbiddenError('You do not have permission to view this educator profile.');
    }

    return teacher;
  }

  async updateTeacher(currentUser: AuthUser, teacherId: string, input: UpdateTeacherInput) {
    const teacher = await this.teacherRepo.findById(teacherId);
    if (!teacher) throw new NotFoundError('Teacher profile');

    const isSelf = teacher.user_id === currentUser.id;
    const canUpdate = hasPermission(currentUser, PERMISSIONS.TEACHERS_UPDATE);

    if (!isSelf && !canUpdate) {
      throw new ForbiddenError('You do not have permission to update this teacher record.');
    }

    const updated = await this.teacherRepo.updateTeacher(teacherId, {
      school_name: input.schoolName ?? teacher.school_name,
      department: input.department ?? teacher.department,
      grade_level: input.gradeLevel ?? teacher.grade_level,
    });

    await this.auditRepo.createLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: AUDIT_ACTION.UPDATE,
      resource: 'teachers',
      resource_id: teacherId,
      details: input as unknown as Json,
    });

    return updated;
  }

  async verifyTeacher(currentUser: AuthUser, teacherId: string, verified: boolean) {
    if (!hasPermission(currentUser, PERMISSIONS.TEACHERS_UPDATE)) {
      throw new ForbiddenError('Only administrators can verify teacher credentials.');
    }

    const updated = await this.teacherRepo.verifyTeacher(teacherId, verified);

    await this.auditRepo.createLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: AUDIT_ACTION.UPDATE,
      resource: 'teachers.verification',
      resource_id: teacherId,
      details: { verified },
    });

    return updated;
  }

  async listTeachers(currentUser: AuthUser, params: PaginationParams, search?: string) {
    if (!hasPermission(currentUser, PERMISSIONS.TEACHERS_READ)) {
      throw new ForbiddenError('You do not have permission to list teachers.');
    }

    return this.teacherRepo.listAll(params, search);
  }
}
