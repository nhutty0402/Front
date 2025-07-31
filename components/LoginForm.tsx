'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useNotification } from '@/hooks/use-notification';
import '@/styles/login-form.css';

interface LoginFormProps {
  onSubmit?: (data: { phone: string; password: string }) => void;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  update: () => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const particlesRef = useRef<Particle[]>([]);
  const { notifications, addNotification } = useNotification();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class ParticleClass {
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;

      constructor(x: number, y: number, size: number, color: string, speedX: number, speedY: number) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.size = Math.max(0.2, this.size - 0.02);
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create particles on mouse move
    const createParticles = (event: MouseEvent) => {
      for (let i = 0; i < 5; i++) {
        particlesRef.current.push(
          new ParticleClass(
            event.x,
            event.y,
            Math.random() * 5 + 2,
            ["#f8c291", "#95afc0", "#74b9ff"][Math.floor(Math.random() * 3)],
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
          )
        );
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = particlesRef.current.filter((p) => p.size > 0.2);
      particlesRef.current.forEach((p) => {
        p.update();
        p.draw(ctx);
      });
      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', createParticles);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', createParticles);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone || !formData.password) {
      addNotification('Vui lòng nhập đầy đủ thông tin!', 'error');
      return;
    }
    onSubmit?.(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full z-[-1]"
        style={{
          background: 'linear-gradient(120deg, #f8c291, #95afc0, #74b9ff)'
        }}
      />

      {/* Notifications */}
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification notification-enter ${
            notification.type === 'error' ? 'notification-error' : 'notification-success'
          }`}
        >
          {notification.message}
        </div>
      ))}

      {/* Login Form */}
      <div className="login-form-card">
        <div className="text-center mb-8">
          <h1 className="login-form-title text-3xl font-semibold text-foreground">Đăng Nhập</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="login-input-container">
            <div className="login-form-icon">
              <i className="fas fa-user"></i>
            </div>
            <Input
              type="text"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder=""
              required
              className="login-form-input"
            />
            <Label className="login-form-label">
              Email or Phone
            </Label>
          </div>

          <div className="login-input-container">
            <div className="login-form-icon">
              <i className="fas fa-lock"></i>
            </div>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder=""
              required
              className="login-form-input"
            />
            <Label className="login-form-label">
              Password
            </Label>
          </div>

          <Button
            type="submit"
            className="login-form-button"
          >
            Log in
          </Button>

          <div className="login-form-link">
            <span>
              Quên mật khẩu?{' '}
              <a href="/contact">
                Liên hệ
              </a>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
} 