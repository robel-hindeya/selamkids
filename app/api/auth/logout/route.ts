import { getServerDb } from '@/backend/db/server';
import { apiSuccess } from '@/backend/utils/response';
import { handleApiError } from '@/backend/errors/api-error';
import { LOCAL_SESSION_COOKIE } from '@/backend/auth/session/local-session';

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('dummy-project')) {
      try {
        const supabase = await getServerDb();
        await supabase.auth.signOut();
      } catch {
        // Ignore Supabase signout error if offline
      }
    }

    const response = apiSuccess({ message: 'Successfully signed out' });
    response.cookies.delete(LOCAL_SESSION_COOKIE);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
