import { getAdminDb, isDummyDb } from '../admin';
import { mockStore } from '../mock-store';
import { TeacherRow, TeacherInsert, TeacherUpdate } from '../types';
import { PaginationParams } from '@/backend/utils/pagination';

export class TeacherRepository {
  async findByUserId(userId: string): Promise<TeacherRow | null> {
    if (isDummyDb()) {
      return mockStore.findTeacherByUserId(userId);
    }

    try {
      const supabase = getAdminDb();
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('user_id', userId)
        .is('deleted_at', null)
        .single();

      if (error || !data) return mockStore.findTeacherByUserId(userId);
      return data;
    } catch {
      return mockStore.findTeacherByUserId(userId);
    }
  }

  async findById(teacherId: string): Promise<TeacherRow | null> {
    if (isDummyDb()) {
      return mockStore.findTeacherById(teacherId);
    }

    try {
      const supabase = getAdminDb();
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('id', teacherId)
        .is('deleted_at', null)
        .single();

      if (error || !data) return mockStore.findTeacherById(teacherId);
      return data;
    } catch {
      return mockStore.findTeacherById(teacherId);
    }
  }

  async createTeacher(teacher: TeacherInsert): Promise<TeacherRow> {
    if (isDummyDb()) {
      return mockStore.createTeacher(teacher);
    }

    try {
      const supabase = getAdminDb();
      const { data, error } = await supabase
        .from('teachers')
        .insert(teacher)
        .select('*')
        .single();

      if (error || !data) {
        return mockStore.createTeacher(teacher);
      }
      return data;
    } catch {
      return mockStore.createTeacher(teacher);
    }
  }

  async updateTeacher(teacherId: string, updates: TeacherUpdate): Promise<TeacherRow> {
    if (isDummyDb()) {
      return mockStore.updateTeacher(teacherId, updates);
    }

    try {
      const supabase = getAdminDb();
      const { data, error } = await supabase
        .from('teachers')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', teacherId)
        .select('*')
        .single();

      if (error || !data) {
        return mockStore.updateTeacher(teacherId, updates);
      }
      return data;
    } catch {
      return mockStore.updateTeacher(teacherId, updates);
    }
  }

  async verifyTeacher(teacherId: string, verified: boolean): Promise<TeacherRow> {
    return this.updateTeacher(teacherId, { verified });
  }

  async listAll(
    params: PaginationParams,
    search?: string
  ): Promise<{ items: TeacherRow[]; total: number }> {
    if (isDummyDb()) {
      return mockStore.listTeachers(params, search);
    }

    try {
      const supabase = getAdminDb();
      let query = supabase.from('teachers').select('*', { count: 'exact' }).is('deleted_at', null);

      if (search) {
        query = query.or(`school_name.ilike.%${search}%,department.ilike.%${search}%`);
      }

      query = query
        .order('created_at', { ascending: false })
        .range(params.offset, params.offset + params.limit - 1);

      const { data, count, error } = await query;
      if (error || !data) {
        return mockStore.listTeachers(params, search);
      }

      return {
        items: data || [],
        total: count || 0,
      };
    } catch {
      return mockStore.listTeachers(params, search);
    }
  }

  async softDelete(teacherId: string): Promise<void> {
    if (isDummyDb()) {
      mockStore.softDeleteTeacher(teacherId);
      return;
    }

    try {
      const supabase = getAdminDb();
      const { error } = await supabase
        .from('teachers')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', teacherId);

      if (error) mockStore.softDeleteTeacher(teacherId);
    } catch {
      mockStore.softDeleteTeacher(teacherId);
    }
  }
}
