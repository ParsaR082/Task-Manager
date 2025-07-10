import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the pathname starts with these paths
  const isPublicPath = pathname === '/login';
  const isApiPath = pathname.startsWith('/api/');
  const isStaticPath = pathname.startsWith('/_next/') || 
                       pathname.includes('.') ||
                       pathname === '/favicon.ico';

  // Get the token
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });

  // Allow public and static paths without authentication
  if (isPublicPath || isApiPath || isStaticPath) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to login
  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 