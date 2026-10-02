import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { Database } from '@/types/database';
import { LOCAL_SESSION_COOKIE, decodeSession } from '@/backend/auth/session/local-session';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // 1. Check for local session cookie first
  const localCookie = request.cookies.get(LOCAL_SESSION_COOKIE)?.value;
  if (localCookie) {
    const localSession = decodeSession(localCookie);
    if (localSession) {
      return {
        supabaseResponse,
        user: {
          id: localSession.id,
          email: localSession.email,
          user_metadata: {
            role: localSession.role,
            full_name: localSession.fullName,
          },
        },
      };
    }
  }

  // 2. Check for Supabase session if configured and reachable
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('dummy-project')) {
    return { supabaseResponse, user: null };
  }

  try {
    const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    return { supabaseResponse, user, supabase };
  } catch {
    return { supabaseResponse, user: null };
  }
}
