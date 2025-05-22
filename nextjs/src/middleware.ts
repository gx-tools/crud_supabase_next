import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AuthRouteConstants } from '@/helpers/string_const';

const AUTH_ROUTES = Object.values(AuthRouteConstants) as string[];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow auth routes and static files
  if (
    AUTH_ROUTES.includes(pathname) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/api/auth') // allow auth API endpoints
  ) {
    return NextResponse.next();
  }

  // We'll let the client-side handle authentication
  // This allows browser cookies to be sent with the requests
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|static|favicon.ico|api/auth).*)'],
};
