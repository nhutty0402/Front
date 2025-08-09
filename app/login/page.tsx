import { Suspense } from "react";
'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/LoginForm';
import { useNotification } from '@/hooks/use-notification';
import Cookies from 'js-cookie';


function LoginPage() {
  const router = useRouter();
  const { addNotification } = useNotification();

  const handleLogin = async (data: { phone: string; password: string }) => {
    try {
      const response = await axios.post('https://all-oqry.onrender.com/api/quanli/dang-nhap', {
        SoDienThoaiDN: data.phone,
        MatKhauDN: data.password,
      });

      const { message, token } = response.data;

      if (message === "Đăng nhập thành công" && token) {
        // ✅ Lưu vào cookie thay vì localStorage
        Cookies.set('token', token, { expires: 7 }); // expires = số ngày

        addNotification('Đăng nhập thành công!', 'success');
        // 👉 Chuyển hướng
        router.push('/rooms');
      } else {
        throw new Error('Đăng nhập không thành công');
      }
    } catch (error) {
      console.error(error);
      addNotification('Sai thông tin đăng nhập!', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
}


export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
}
