'use client';

import { useRouter } from 'next/navigation';
import LoginForm from '@/components/LoginForm';
import { useNotification } from '@/hooks/use-notification';

export default function LoginPage() {
  const router = useRouter();
  const { addNotification } = useNotification();

  const handleLogin = async (data: { phone: string; password: string }) => {
    try {
      const response = await fetch('https://all-oqry.onrender.com/api/quanli/dang-nhap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Cho phép nhận cookie từ server
        body: JSON.stringify({
          SoDienThoaiDN: data.phone,
          MatKhauDN: data.password,
        }),
      });

      if (!response.ok) throw new Error('Đăng nhập thất bại');

      addNotification('Đăng nhập thành công!', 'success');
      router.push('/rooms'); // 👈 Điều hướng đến /rooms sau khi đăng nhập
    } catch (error) {
      addNotification('Sai thông tin đăng nhập!', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
}
