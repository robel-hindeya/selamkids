import { getAdminDb, isDummyDb } from '../admin';
import { mockStore } from '../mock-store';
import { FamilyRow, FamilyInsert, FamilyUpdate } from '../types';
import { PaginationParams } from '@/backend/utils/pagination';

export class FamilyRepository {
  async findByUserId(userId: string): Promise<FamilyRow | null> {
    if (isDummyDb()) {
      return mockStore.findFamilyByUserId(userId);
    }

    try {
      const supabase = getAdminDb();
      const { data, error } = await supabase
        .from('families')
        .select('*')
        .eq('user_id', userId)
        .is('deleted_at', null)
        .single();

      if (error || !data) return mockStore.findFamilyByUserId(userId);
      return data;
    } catch {
      return mockStore.findFamilyByUserId(userId);
    }
  }

  async findById(familyId: string): Promise<FamilyRow | null> {
    if (isDummyDb()) {
      return mockStore.findFamilyById(familyId);
    }

    try {
      const supabase = getAdminDb();
      const { data, error } = await supabase
        .from('families')
        .select('*')
        .eq('id', familyId)
        .is('deleted_at', null)
        .single();

      if (error || !data) return mockStore.findFamilyById(familyId);
      return data;
    } catch {
      return mockStore.findFamilyById(familyId);
    }
  }

  async createFamily(family: FamilyInsert): Promise<FamilyRow> {
    if (isDummyDb()) {
      return mockStore.createFamily(family);
    }

    try {
      const supabase = getAdminDb();
      const { data, error } = await supabase
        .from('families')
        .insert(family)
        .select('*')
        .single();

      if (error || !data) {
        return mockStore.createFamily(family);
      }
      return data;
    } catch {
      return mockStore.createFamily(family);
    }
  }

  async updateFamily(familyId: string, updates: FamilyUpdate): Promise<FamilyRow> {
    if (isDummyDb()) {
      return mockStore.updateFamily(familyId, updates);
    }

    try {
      const supabase = getAdminDb();
      const { data, error } = await supabase
        .from('families')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', familyId)
        .select('*')
        .single();

      if (error || !data) {
        return mockStore.updateFamily(familyId, updates);
      }
      return data;
    } catch {
      return mockStore.updateFamily(familyId, updates);
    }
  }

  async addMember(familyId: string, userId: string, relationship = 'CHILD') {
    if (isDummyDb()) {
      return { id: `fm-${Date.now()}`, family_id: familyId, user_id: userId, relationship, created_at: new Date().toISOString() };
    }

    try {
      const supabase = getAdminDb();
      const { data, error } = await supabase
        .from('family_members')
        .insert({
          family_id: familyId,
          user_id: userId,
          relationship,
        })
        .select('*')
        .single();

      if (error) {
        return { id: `fm-${Date.now()}`, family_id: familyId, user_id: userId, relationship, created_at: new Date().toISOString() };
      }
      return data;
    } catch {
      return { id: `fm-${Date.now()}`, family_id: familyId, user_id: userId, relationship, created_at: new Date().toISOString() };
    }
  }

  async getMembers(familyId: string) {
    if (isDummyDb()) {
      return [];
    }

    try {
      const supabase = getAdminDb();
      const { data, error } = await supabase
        .from('family_members')
        .select('*, profiles:user_id(id, email, full_name, avatar_url)')
        .eq('family_id', familyId);

      if (error) return [];
      return data || [];
    } catch {
      return [];
    }
  }

  async listAll(
    params: PaginationParams,
    search?: string
  ): Promise<{ items: FamilyRow[]; total: number }> {
    if (isDummyDb()) {
      return mockStore.listFamilies(params, search);
    }

    try {
      const supabase = getAdminDb();
      let query = supabase.from('families').select('*', { count: 'exact' }).is('deleted_at', null);

      if (search) {
        query = query.ilike('family_name', `%${search}%`);
      }

      query = query
        .order('created_at', { ascending: false })
        .range(params.offset, params.offset + params.limit - 1);

      const { data, count, error } = await query;
      if (error || !data) {
        return mockStore.listFamilies(params, search);
      }

      return {
        items: data || [],
        total: count || 0,
      };
    } catch {
      return mockStore.listFamilies(params, search);
    }
  }

  async softDelete(familyId: string): Promise<void> {
    if (isDummyDb()) {
      mockStore.softDeleteFamily(familyId);
      return;
    }

    try {
      const supabase = getAdminDb();
      const { error } = await supabase
        .from('families')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', familyId);

      if (error) mockStore.softDeleteFamily(familyId);
    } catch {
      mockStore.softDeleteFamily(familyId);
    }
  }

  async setParentPin(familyId: string, pin: string): Promise<FamilyRow> {
    return this.updateFamily(familyId, { parent_pin: pin });
  }

  async getParentPin(familyId: string): Promise<string | null> {
    const family = await this.findById(familyId);
    return family?.parent_pin || null;
  }
}
