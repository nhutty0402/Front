import { NextRequest, NextResponse } from 'next/server'

// Các path không cần kiểm tra token
const publicPaths = ['/login', '/_next', '/favicon.ico']

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value || ''

  // Nếu là đường dẫn công khai thì cho qua
  if (publicPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Nếu không có token và không ở trang login thì chuyển hướng về /login
  if (!token) {
    const loginUrl = new URL('/login', req.url)
    return NextResponse.redirect(loginUrl)
  }

  // Có token thì cho qua
  return NextResponse.next()
}

// Apply middleware cho toàn bộ app
export const config = {
  matcher: [
    /*
     * Match tất cả URL trừ:
     * - /login
     * - /_next/static (Next.js assets)
     * - /_next/image (ảnh xử lý bởi Next)
     * - /favicon.ico
     */
    '/((?!_next/static|_next/image|favicon.ico|login).*)',
  ],
}
