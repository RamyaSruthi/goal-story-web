import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const path = request.nextUrl.pathname;

  const isAppRoute = path.startsWith('/app');
  const isAuthRoute = path === '/login' || path === '/forgot-password' || path === '/reset-password';

  if (isAppRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/app/today', request.url));
  }
  // Authenticated users hitting the landing page go straight to the app
  if (path === '/' && user) {
    return NextResponse.redirect(new URL('/app/today', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/', '/app/:path*', '/login', '/forgot-password', '/reset-password'],
};
