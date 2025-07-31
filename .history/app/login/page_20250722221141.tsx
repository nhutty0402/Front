'use client';

import { useState } from 'react';

type LoginFormProps = {
  onSubmit: (data: { phone: string; password: string }) => void;
};

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // ⚠️ Quan trọng: ngăn reload
    if (!phone || !password) {
      setError('Vui lòng nhập đầy đủ số điện thoại và mật khẩu.');
      return;
    }
    setError('');
    onSubmit({ phone, password }); // 👉 Gửi dữ liệu cho LoginPage
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
      <h2 className="text-2xl font-bold mb-4 text-center">Đăng nhập</h2>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <div className="mb-4">
        <label className="block text-gray-700 mb-1" htmlFor="phone">Số điện thoại</label>
        <input
          type="text"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Nhập số điện thoại"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1" htmlFor="password">Mật khẩu</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Nhập mật khẩu"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Đăng nhập
      </button>
    </form>
  );
}
