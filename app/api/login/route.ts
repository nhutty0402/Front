import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { SoDienThoaiDN, MatKhauDN } = await req.json();

  // Gọi API backend thật của bạn
  const res = await fetch('https://all-oqry.onrender.com/api/quanli/dang-nhap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ SoDienThoaiDN, MatKhauDN }),
  });

  if (!res.ok) return NextResponse.json({ message: 'Đăng nhập thất bại' }, { status: 401 });

  const result = await res.json();

  const response = NextResponse.json({ message: 'Đăng nhập thành công' });

  // ✨ Set cookie
  response.cookies.set('token', result.token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    path: '/',
    secure: true, // nếu dùng HTTPS
  });

  return response;
}
