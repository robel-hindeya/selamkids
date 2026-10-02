import { getAdminDb, isDummyDb } from '../admin';
import { mockStore } from '../mock-store';
import { KidRow, KidInsert, KidUpdate } from '../types';
import { PaginationParams } from '@/backend/utils/pagination';

export class KidRepository {
  async findByUserId(userId: string): Promise<KidRow | null> {
    if (isDummyDb()) {
      return mockStore.findKidByUserId(userId);
    }

    try {
      const supabase = getAdminDb();
      const { data, error } = await supabase
        .from('kids')
        .select('*')
        .eq('user_id', userId)
        .is('deleted_at', null)
        .single();

      if (error || !data) return mockStore.findKidByUserId(userId);
      return data;
    } catch {
      return mockStore.findKidByUserId(userId);
    }
  }

  async findById(kidId: string): Promise<KidRow | null> {
    if (isDummyDb()) {
      return mockStore.findKidById(kidId);
    }

    try {
      const supabase = getAdminDb();
      const { data, error } = await supabase
        .from('kids')
        .select('*')
        .eq('id', kidId)
        .is('deleted_at', null)
        .single();

      if (error || !data) return mockStore.findKidById(kidId);
      return data;
    } catch {
      return mockStore.findKidById(kidId);
    }
  }

  async findByFamilyId(familyId: string): Promise<KidRow[]> {
    if (isDummyDb()) {
      return mockStore.findKidsByFamilyId(familyId);
    }

    try {
      const supabase = getAdminDb();
      const { data, error } = await supabase
        .from('kids')
        .select('*')
        .eq('family_id', familyId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true });

      if (error || !data) return mockStore.findKidsByFamilyId(familyId);
      return data;
    } catch {
      return mockStore.findKidsByFamilyId(familyId);
    }
  }

  async createKid(kid: KidInsert): Promise<KidRow> {
    if (isDummyDb()) {
      return mockStore.createKid(kid);
    }

    try {
      const supabase = getAdminDb();
      const { data, error } = await supabase
        .from('kids')
        .insert(kid)
        .select('*')
        .single();

      if (error || !data) {
        return mockStore.createKid(kid);
      }
      return data;
    } catch {
      return mockStore.createKid(kid);
    }
  }

  async updateKid(kidId: string, updates: KidUpdate): Promise<KidRow> {
    if (isDummyDb()) {
      return mockStore.updateKid(kidId, updates);
    }

    try {
      const supabase = getAdminDb();
      const { data, error } = await supabase
        .from('kids')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', kidId)
        .select('*')
        .single();

      if (error || !data) {
        return mockStore.updateKid(kidId, updates);
      }
      return data;
    } catch {
      return mockStore.updateKid(kidId, updates);
    }
  }

  async addOrbs(kidId: string, amount: number): Promise<KidRow> {
    if (isDummyDb()) {
      return mockStore.addOrbs(kidId, amount);
    }

    try {
      const kid = await this.findById(kidId);
      if (!kid) return mockStore.addOrbs(kidId, amount);

      const newOrbTotal = Math.max(0, kid.orbs + amount);
      return this.updateKid(kidId, { orbs: newOrbTotal });
    } catch {
      return mockStore.addOrbs(kidId, amount);
    }
  }

  async listAll(
    params: PaginationParams,
    search?: string
  ): Promise<{ items: KidRow[]; total: number }> {
    if (isDummyDb()) {
      return mockStore.listKids(params, search);
    }

    try {
      const supabase = getAdminDb();
      let query = supabase.from('kids').select('*', { count: 'exact' }).is('deleted_at', null);

      if (search) {
        query = query.or(`nickname.ilike.%${search}%,creature_name.ilike.%${search}%`);
      }

      query = query
        .order('created_at', { ascending: false })
        .range(params.offset, params.offset + params.limit - 1);

      const { data, count, error } = await query;
      if (error || !data) {
        return mockStore.listKids(params, search);
      }

      return {
        items: data || [],
        total: count || 0,
      };
    } catch {
      return mockStore.listKids(params, search);
    }
  }

  async softDelete(kidId: string): Promise<void> {
    if (isDummyDb()) {
      mockStore.softDeleteKid(kidId);
      return;
    }

    try {
      const supabase = getAdminDb();
      const { error } = await supabase
        .from('kids')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', kidId);

      if (error) mockStore.softDeleteKid(kidId);
    } catch {
      mockStore.softDeleteKid(kidId);
    }
  }
}
