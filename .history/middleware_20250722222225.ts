import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const pathname = request.nextUrl.pathname

  // Chặn truy cập các trang cần token
  const protectedRoutes = ['/rooms', '/dashboard', '/contracts', '/tenants']

  if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Nếu đã có token mà vẫn vào trang login thì chuyển về rooms
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/rooms', request.url))
  }

  return NextResponse.next()
}

// Chỉ định các đường dẫn middleware sẽ xử lý (KHÔNG dùng regex lookahead)
export const config = {
  matcher: [
    '/rooms/:path*',
    '/dashboard/:path*',
    '/contracts/:path*',
    '/tenants/:path*',
    '/login',
  ],
}
