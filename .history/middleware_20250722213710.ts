// app/login/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      router.push('/rooms'); // 👈 tự redirect nếu thành công
    } else {
      setError('Đăng nhập thất bại');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* form input ở đây */}
    </form>
  );
}
