'use client';

import LoginForm from '@/components/LoginForm';
import { useNotification } from '@/hooks/use-notification';
import { useState } from 'react';

export default function LoginDemoPage() {
  const { addNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: { phone: string; password: string }) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      if (data.phone === 'demo' && data.password === 'password') {
        addNotification('Đăng nhập thành công!', 'success');
      } else {
        addNotification('Thông tin đăng nhập không chính xác!', 'error');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Login Form Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Responsive design test - Try resizing your browser window
        </p>
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          <p>Demo credentials: demo / password</p>
        </div>
      </div>

      {/* Login Form */}
      <LoginForm onSubmit={handleLogin} />

      {/* Device Preview Info */}
      <div className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg">
        <div className="text-xs text-gray-600 dark:text-gray-300">
          <div>Screen: <span className="font-mono">{typeof window !== 'undefined' ? window.innerWidth : 0}px</span></div>
          <div>Device: <span className="font-mono">
            {typeof window !== 'undefined' ? 
              window.innerWidth < 640 ? 'Mobile' : 
              window.innerWidth < 1024 ? 'Tablet' : 'Desktop' 
              : 'Unknown'}
          </span></div>
        </div>
      </div>
    </div>
  );
} 