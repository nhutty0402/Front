import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Các route yêu cầu đăng nhập
const protectedPaths = ['/rooms', '/dashboard', '/contracts', '/tenants'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Nếu đang vào 1 đường dẫn cần bảo vệ mà không có token → chuyển về /login
  if (protectedPaths.some(path => pathname.startsWith(path)) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Nếu đã đăng nhập mà vào /login → chuyển về /rooms
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/rooms', request.url));
  }

  return NextResponse.next();
}

// Cấu hình matcher để middleware chỉ áp dụng cho các đường dẫn cần thiết
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|icon|.*\\.(png|jpg|jpeg|svg|webp)$).*)',
  ],
};
