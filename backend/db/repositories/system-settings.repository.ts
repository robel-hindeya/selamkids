import { getAdminDb, isDummyDb } from '../admin';
import { mockStore } from '../mock-store';
import { Json } from '@/types/database';

export class SystemSettingsRepository {
  async getAll(): Promise<Record<string, unknown>> {
    if (isDummyDb()) {
      return mockStore.getAllSettings();
    }

    try {
      const supabase = getAdminDb();
      const { data, error } = await supabase.from('system_settings').select('*');
      if (error || !data) return mockStore.getAllSettings();

      const settings: Record<string, unknown> = {};
      for (const item of data) {
        settings[item.key] = item.value;
      }
      return settings;
    } catch {
      return mockStore.getAllSettings();
    }
  }

  async getByKey(key: string): Promise<Json | null> {
    if (isDummyDb()) {
      return mockStore.getSetting(key);
    }

    try {
      const supabase = getAdminDb();
      const { data, error } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', key)
        .single();

      if (error || !data) return mockStore.getSetting(key);
      return data.value;
    } catch {
      return mockStore.getSetting(key);
    }
  }

  async set(key: string, value: Json, updatedBy?: string): Promise<void> {
    if (isDummyDb()) {
      mockStore.setSetting(key, value, updatedBy);
      return;
    }

    try {
      const supabase = getAdminDb();
      const { error } = await supabase.from('system_settings').upsert({
        key,
        value,
        updated_by: updatedBy || null,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        mockStore.setSetting(key, value, updatedBy);
      }
    } catch {
      mockStore.setSetting(key, value, updatedBy);
    }
  }
}
