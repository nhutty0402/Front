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
      const response = await axios.post('https://all-oqry.onrender.com/api/quanli/dang-nhap', {
        SoDienThoaiDN: data.phone,
        MatKhauDN: data.password,
      });

      const result = response.data;

      addNotification('Đăng nhập thành công!', 'success');

      if (result.token) {
        localStorage.setItem('token', result.token);
        router.push('/');
      }

      // TODO: chuyển trang nếu cần
      // router.push('/dashboard');

    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Lỗi khi đăng nhập!';
      addNotification(errorMessage, 'error');
    }
  };

  return (
    <div className="min-h-screen">
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
}


