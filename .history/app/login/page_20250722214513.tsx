'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/LoginForm';
import { useNotification } from '@/hooks/use-notification';

export default function LoginPage() {
  const router = useRouter();
  const { addNotification } = useNotification();

  const handleLogin = async (data: { phone: string; password: string }) => {
    try {
      const response = await axios.post(
        'http://localhost:3000/api/quanli/dang-nhap', // ✅ sửa URL nếu cần dùng server Render
        {
          SoDienThoaiDN: data.phone,
          MatKhauDN: data.password,
        },
        {
          withCredentials: true, // ✅ để gửi và nhận cookie
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Nếu thành công
      addNotification('Đăng nhập thành công!', 'success');
      router.push('/rooms');
    } catch (error) {
      console.error('Login error:', error);
      addNotification('Sai thông tin đăng nhập!', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
}
