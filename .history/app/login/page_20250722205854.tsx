'use client';

import axios from 'axios';
import LoginForm from '@/components/LoginForm';
import { useNotification } from '@/hooks/use-notification';
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { addNotification } = useNotification();
  const router = useRouter();

  const handleLogin = async (data: { phone: string; password: string }) => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // ✨ QUAN TRỌNG: Cho phép nhận cookie từ response
      body: JSON.stringify({
        SoDienThoaiDN: data.phone,
        MatKhauDN: data.password,
      }),
    });

    if (!response.ok) throw new Error('Đăng nhập thất bại');

    addNotification('Đăng nhập thành công!', 'success');
    router.push('/'); // Chuyển trang
  } catch (error) {
    addNotification('Sai thông tin đăng nhập!', 'error');
  }
};


  return (
    <div className="min-h-screen">
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
}


