import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const pathname = request.nextUrl.pathname

  const isAuth = !!token
  const isLoginPage = pathname === '/login'
  const isProtectedPage = pathname === '/' || pathname.startsWith('/rooms')

  // Nếu chưa đăng nhập và cố vào trang cần bảo vệ
  if (!isAuth && isProtectedPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}
  // Lưu khi login
  Cookies.set('token', token, { expires: 7 })

  // Đọc khi check
  const token = Cookies.get("token")


export const config = {
  matcher: [
    '/',           // Trang chính
    '/login',      // Trang login
    '/rooms/:path*', // Trang quản lý phòng
  ],
}
