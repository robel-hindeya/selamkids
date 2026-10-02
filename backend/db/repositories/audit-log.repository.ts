import { getAdminDb, isDummyDb } from '../admin';
import { mockStore } from '../mock-store';
import { AuditLogRow, AuditLogInsert } from '../types';
import { PaginationParams } from '@/backend/utils/pagination';

export class AuditLogRepository {
  async createLog(entry: AuditLogInsert): Promise<AuditLogRow> {
    if (isDummyDb()) {
      return mockStore.createAuditLog(entry);
    }

    try {
      const supabase = getAdminDb();
      const { data, error } = await supabase
        .from('audit_logs')
        .insert(entry)
        .select('*')
        .single();

      if (error || !data) {
        return mockStore.createAuditLog(entry);
      }
      return data;
    } catch {
      return mockStore.createAuditLog(entry);
    }
  }

  async listLogs(
    params: PaginationParams,
    filters?: { action?: string; resource?: string; userId?: string }
  ): Promise<{ items: AuditLogRow[]; total: number }> {
    if (isDummyDb()) {
      return mockStore.listAuditLogs(params, filters);
    }

    try {
      const supabase = getAdminDb();
      let query = supabase.from('audit_logs').select('*', { count: 'exact' });

      if (filters?.action) {
        query = query.eq('action', filters.action);
      }
      if (filters?.resource) {
        query = query.eq('resource', filters.resource);
      }
      if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
      }

      query = query
        .order('created_at', { ascending: false })
        .range(params.offset, params.offset + params.limit - 1);

      const { data, count, error } = await query;
      if (error || !data) {
        return mockStore.listAuditLogs(params, filters);
      }

      return {
        items: data || [],
        total: count || 0,
      };
    } catch {
      return mockStore.listAuditLogs(params, filters);
    }
  }
}
