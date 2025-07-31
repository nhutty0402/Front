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
      const response = await axios.post('https://all-oqry.onrender.com/api/quanli/dang-nhap', {
        SoDienThoaiDN: data.phone,
        MatKhauDN: data.password,
      });

      const { message, token } = response.data;

      if (message === 'Đăng nhập thành công' && token) {
        localStorage.setItem('token', token);
        addNotification('Đăng nhập thành công!', 'success');
        console.log('Đã đăng nhập, token:', token);
        router.replace('/rooms');
      } else {
        throw new Error('Thông tin đăng nhập sai hoặc thiếu token');
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      addNotification('Sai thông tin đăng nhập!', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
}
