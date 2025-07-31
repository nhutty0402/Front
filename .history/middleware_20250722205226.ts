// middleware.ts

import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // Nếu chưa có token và không phải đang ở /login thì redirect
  if (!token && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Nếu đã có token hoặc đang ở /login thì cho đi tiếp
  return NextResponse.next();
}

// Chỉ áp dụng middleware cho các route trừ /api/*
export const config = {
  matcher: [
    // Áp dụng cho tất cả ngoại trừ API và static files
    '/((?!api|_next|static|favicon.ico).*)',
  ],
};
