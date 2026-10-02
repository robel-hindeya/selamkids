import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

let adminClient: ReturnType<typeof createClient<Database>> | null = null;

export function isDummyDb(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return true;
  if (supabaseUrl.includes('dummy-project') || serviceRoleKey.includes('dummy')) return true;
  return false;
}

export function getAdminDb() {
  if (typeof window !== 'undefined') {
    throw new Error('FATAL: getAdminDb cannot be called from the client/browser.');
  }

  if (adminClient) {
    return adminClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.'
    );
  }

  adminClient = createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient;
}
