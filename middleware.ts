import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { ROLE_REDIRECTS, ROLES, UserRole } from '@/backend/constants/roles';

// Define public routes that do not require authentication
const PUBLIC_PATHS = [
  '/',
  '/about',
  '/contact',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/callback',
  '/api/health',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Session refresh via Supabase SSR
  const { supabaseResponse, user } = await updateSession(request);

  // Allow static files, Next internals, and public assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/fonts') ||
    pathname.includes('.')
  ) {
    return supabaseResponse;
  }

  const isPublicRoute = PUBLIC_PATHS.some(
    (path) => pathname === path || (path !== '/' && pathname.startsWith(path))
  );

  // 2. Redirect logged-in users away from /auth/login and /auth/register
  if (user && (pathname === '/auth/login' || pathname === '/auth/register')) {
    const userRole = (user.user_metadata?.role as UserRole) || ROLES.KID;
    const redirectUrl = ROLE_REDIRECTS[userRole] || '/users';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // If public route, allow immediately
  if (isPublicRoute) {
    return supabaseResponse;
  }

  // 3. Protect private routes: Require authentication
  if (!user) {
    // If it's an API request, return 401 JSON instead of redirecting
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required to access this endpoint.',
          },
        },
        { status: 401 }
      );
    }

    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const userRole = (user.user_metadata?.role as UserRole) || ROLES.KID;

  // 4. Protect /superadmin: Strictly only SUPERADMIN allowed
  if (pathname.startsWith('/superadmin') || pathname.startsWith('/api/superadmin')) {
    if (userRole !== ROLES.SUPERADMIN) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'FORBIDDEN',
              message: 'Superadmin privileges required.',
            },
          },
          { status: 403 }
        );
      }
      // Redirect ADMIN to /admin, others to /users
      const fallback = userRole === ROLES.ADMIN ? '/admin' : '/users';
      return NextResponse.redirect(new URL(fallback, request.url));
    }
  }

  // 5. Protect /admin: Only ADMIN and SUPERADMIN allowed.
  // Prevent KID, FAMILY, TEACHER from accessing /admin
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (userRole !== ROLES.ADMIN && userRole !== ROLES.SUPERADMIN) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'FORBIDDEN',
              message: 'Administrative privileges required.',
            },
          },
          { status: 403 }
        );
      }
      return NextResponse.redirect(new URL(ROLE_REDIRECTS[userRole] || '/users', request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
