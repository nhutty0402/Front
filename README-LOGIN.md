# Login Form Component

Đây là component React được chuyển đổi từ HTML/CSS gốc với các tính năng:

## Tính năng chính

1. **Animation Canvas**: Hiệu ứng particle animation khi di chuyển chuột
2. **Form Validation**: Kiểm tra dữ liệu đầu vào
3. **Notifications**: Thông báo lỗi/thành công với animation
4. **Responsive Design**: Tương thích với nhiều kích thước màn hình (Mobile-first)
5. **Modern UI**: Sử dụng shadcn/ui components và theme colors
6. **Dark Mode Support**: Hỗ trợ chế độ tối
7. **Accessibility**: Tương thích với screen readers và keyboard navigation

## Cách sử dụng

### 1. Import component

```tsx
import LoginForm from '@/components/LoginForm';
```

### 2. Sử dụng trong component

```tsx
import { useNotification } from '@/hooks/use-notification';

export default function MyPage() {
  const { addNotification } = useNotification();

  const handleLogin = (data: { phone: string; password: string }) => {
    // Xử lý logic đăng nhập
    console.log('Login data:', data);
    
    // Demo validation
    if (data.phone === 'demo' && data.password === 'password') {
      addNotification('Đăng nhập thành công!', 'success');
    } else {
      addNotification('Thông tin đăng nhập không chính xác!', 'error');
    }
  };

  return (
    <LoginForm onSubmit={handleLogin} />
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onSubmit` | `(data: { phone: string; password: string }) => void` | No | Callback khi form được submit |

## Styling

Component sử dụng Tailwind CSS với các custom styles:

- **Background**: Gradient animation với canvas particles
- **Form Container**: Neumorphism design với shadow effects
- **Input Fields**: Floating labels với focus effects
- **Button**: Hover và focus states

## Dependencies

- `@/components/ui/*` - shadcn/ui components
- `@/hooks/use-notification` - Custom hook cho notifications
- `@/styles/login-form.css` - Custom CSS styles

## Demo

Truy cập các đường dẫn sau để xem demo:

- `/login` - Demo cơ bản
- `/login-demo` - Demo với responsive preview

**Demo credentials:**
- Phone/Email: `demo`
- Password: `password`

## Responsive Breakpoints

| Device | Width | Features |
|--------|-------|----------|
| Mobile | < 640px | Compact layout, smaller fonts, touch-friendly |
| Tablet | 641px - 1024px | Medium layout, optimized spacing |
| Desktop | > 1024px | Full layout, enhanced animations |

## Cấu trúc file

```
components/
├── LoginForm.tsx          # Main component
hooks/
├── use-notification.ts    # Notification hook
styles/
├── login-form.css         # Custom styles
app/
└── login/
    └── page.tsx          # Demo page
```

## Tùy chỉnh

### Thay đổi màu sắc

Component sử dụng CSS variables từ theme của dự án. Để thay đổi màu sắc, chỉnh sửa trong `app/globals.css`:

```css
:root {
  --primary: hsl(0 0% 9%);
  --primary-foreground: hsl(0 0% 98%);
  --background: hsl(0 0% 100%);
  --foreground: hsl(0 0% 3.9%);
  /* ... other variables */
}
```

### Responsive Design

Để tùy chỉnh responsive breakpoints, chỉnh sửa trong `styles/login-form.css`:

```css
/* Mobile styles */
@media (max-width: 640px) {
  .login-form-card {
    /* Mobile specific styles */
  }
}

/* Tablet styles */
@media (min-width: 641px) and (max-width: 1024px) {
  .login-form-card {
    /* Tablet specific styles */
  }
}
```

### Thay đổi animation

Chỉnh sửa particle colors trong `LoginForm.tsx`:

```tsx
["#f8c291", "#95afc0", "#74b9ff"][Math.floor(Math.random() * 3)]
```

## Browser Support

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Mobile browsers: ✅ 