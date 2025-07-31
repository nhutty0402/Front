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

    const token = response.data.token;

    if (!token) throw new Error('Không nhận được token');

    // 👉 Lưu token vào localStorage
    localStorage.setItem('token', token);

    addNotification('Đăng nhập thành công!', 'success');
    router.push('/rooms');
  } catch (error) {
    console.error(error);
    addNotification('Sai thông tin đăng nhập!', 'error');
  }
};


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
