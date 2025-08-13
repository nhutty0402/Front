"use client"
import { Suspense } from "react";
import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Cookies from "js-cookie"
import axiosClient from "@/lib/axiosClient"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function EditAccountPage() {
  const router = useRouter()
  const params = useSearchParams()

  const initialId = useMemo(() => params.get("id") || "", [params])
  const initialUsername = useMemo(() => params.get("username") || "", [params])
  const initialEmail = useMemo(() => params.get("email") || "", [params])
  const initialStatus = useMemo(() => params.get("status") || "HoatDong", [params])

  const [accountId, setAccountId] = useState<string>(initialId)
  const [username, setUsername] = useState<string>(initialUsername)
  const [email, setEmail] = useState<string>(initialEmail)
  const [password, setPassword] = useState<string>("")
  const [status, setStatus] = useState<string>(initialStatus)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  useEffect(() => {
    setAccountId(initialId)
    setUsername(initialUsername)
    setEmail(initialEmail)
    setStatus(initialStatus)
  }, [initialId, initialUsername, initialEmail, initialStatus])

  // Tự động GET danh sách tài khoản để tìm ID khi có username/email nhưng thiếu accountId
 // ...
    useEffect(() => {
    const fetchAccountDetail = async () => {
      if (!accountId) return;
  
      try {
        const token = Cookies.get("token");
        if (!token || token === "null" || token === "undefined") {
          router.replace("/login");
          return;
        }
  
        const res = await axiosClient.get(
          `https://all-oqry.onrender.com/api/taikhoan/${accountId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        if (res.data) {
          setUsername(res.data.TenDangNhap || "");
          setEmail(res.data.EmailTaiKhoan || res.data.Email || "");
          setStatus(res.data.TrangThai || "HoatDong");
        }
      } catch (error) {
        console.error("Lỗi lấy chi tiết tài khoản:", error);
      }
    };
  
    fetchAccountDetail();
  }, [accountId, router]);
  
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!username) {
      alert("Thiếu Tên đăng nhập (TenDangNhap)")
      return
    }

    const token = Cookies.get("token")
    if (!token || token === "null" || token === "undefined") {
      router.replace("/login")
      return
    }

    const payload = {
      TenDangNhap: username,
      Email: email || "",
      MatKhau: password || "",
      TrangThai: status || "HoatDong",
    }

    try {
      setIsSubmitting(true)
      if (!accountId) {
        alert("Thiếu ID tài khoản (path param) để cập nhật. Vui lòng nhập ID hoặc quay lại chọn từ danh sách.")
        setIsSubmitting(false)
        return
      }
      const res = await axiosClient.put(`https://all-oqry.onrender.com/api/taikhoan/${accountId}`, payload)

      if (res.status >= 200 && res.status < 300) {
        alert("Cập nhật tài khoản thành công!")
        router.back()
      } else {
        alert("Không thể cập nhật tài khoản. Mã lỗi: " + res.status)
      }
    } catch (err: any) {
      console.error("Lỗi cập nhật tài khoản:", err)
      alert("Lỗi: " + (err.response?.data?.message || err.message))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Chỉnh sửa tài khoản</CardTitle>
            <CardDescription>Cập nhật Email, mật khẩu và trạng thái hoạt động</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* ID tài khoản được tự lấy, không hiển thị ra giao diện */}

              <div className="space-y-2">
                <Label htmlFor="username">Tên đăng nhập</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu </Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HoatDong">Hoạt động</SelectItem>
                    {/* <SelectItem value="Khoa">Khóa</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
                  Hủy
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}




export default function EditAccountPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditAccountPage />
    </Suspense>
  );
}
