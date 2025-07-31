import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  const isLoginPage = req.nextUrl.pathname === '/login';

  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/', req.url)); // 👈 chuyển đến /rooms sau khi đăng nhập
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|manifest.json|icon|.*\\.png$).*)'],
};
