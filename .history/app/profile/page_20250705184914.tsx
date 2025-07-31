"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  User,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Building2,
  Save,
  Edit,
  Camera,
  Menu,
  Shield,
  Key,
  FileText,
  ArrowLeft,
} from "lucide-react"

interface ManagerProfile {
  QuanLiID: number
  SoDienThoaiDN: string
  MatKhauDN: string
  HoTenQuanLi: string
  DiaChiChiTiet: string
  GioiTinh: string
  NgaySinh: string
  Phuong: string
  Quan: string
  SoCCCD: string
  ThanhPho: string
  Email?: string
  ChucVu?: string
  NgayVaoLam?: string
  MoTa?: string
  Avatar?: string
  TenNhaTro?: string
  DiaChiNhaTro?: string
  SoGiayPhep?: string
  NgayCapGiayPhep?: string
}

const mockManagerProfile: ManagerProfile = {
  QuanLiID: 6,
  SoDienThoaiDN: "0857870065",
  MatKhauDN: "$2b$10$Gu4wdRJtvsc0a4OjwneZ4.gn6.g68WNAVU9Epo3OdK8K6/pF1Uvky",
  HoTenQuanLi: "Phạm Ty",
  DiaChiChiTiet: "456 đường Nguyễn Văn Cừ",
  GioiTinh: "Nữ",
  NgaySinh: "2004-10-31T17:00:00.000Z",
  Phuong: "Bùi Hữu Nghĩa",
  Quan: "Bình Thủy",
  SoCCCD: "123456789012",
  ThanhPho: "Cần Thơ",
  Email: "phamty@email.com",
  ChucVu: "Quản lý nhà trọ",
  NgayVaoLam: "2023-01-15",
  MoTa: "Quản lý nhà trọ với 2 năm kinh nghiệm, chuyên về quản lý tài chính và chăm sóc khách hàng.",
  Avatar: "/placeholder.svg?height=120&width=120",
  TenNhaTro: "Nhà trọ Phạm Ty",
  DiaChiNhaTro: "456 đường Nguyễn Văn Cừ, Phường Bùi Hữu Nghĩa, Quận Bình Thủy, TP. Cần Thơ",
  SoGiayPhep: "GP-CT-2023-001",
  NgayCapGiayPhep: "2023-01-10",
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ManagerProfile>(mockManagerProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      localStorage.setItem("managerProfile", JSON.stringify(profile))
      setIsEditing(false)
      toast({
        title: "Đã lưu thông tin",
        description: "Thông tin cá nhân đã được cập nhật thành công",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể lưu thông tin",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: keyof ManagerProfile, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-50">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Mobile Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 lg:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Thông tin cá nhân</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <Button onClick={handleSave} disabled={isSaving} size="sm">
                  <Save className="h-4 w-4 mr-1" />
                  {isSaving ? "Lưu..." : "Lưu"}
                </Button>
              ) : (
                <Button onClick={() => setIsEditing(true)} size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Sửa
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h1>
              <p className="text-gray-600">Quản lý thông tin cá nhân và nhà trọ</p>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Hủy
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Đang lưu..." : "Lưu"}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-6 space-y-6">
          {/* Profile Overview */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 lg:p-6">
              <div className="flex flex-col items-center text-center lg:flex-row lg:text-left lg:items-start gap-6">
                <div className="relative">
                  <Avatar className="h-20 w-20 lg:h-24 lg:w-24">
                    <AvatarImage src={profile.Avatar || "/placeholder.svg"} alt={profile.HoTenQuanLi} />
                    <AvatarFallback className="text-lg">{getInitials(profile.HoTenQuanLi)}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button size="sm" className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full p-0">
                      <Camera className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900">{profile.HoTenQuanLi}</h2>
                    <p className="text-gray-600">{profile.ChucVu}</p>
                    <Badge className="mt-2 bg-green-500">Đang hoạt động</Badge>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{profile.SoDienThoaiDN}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{profile.Email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{formatDate(profile.NgaySinh)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-gray-500" />
                      <span>{profile.SoCCCD}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                <User className="h-5 w-5" />
                Thông tin cá nhân
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="HoTenQuanLi" className="text-sm">
                    Họ và tên *
                  </Label>
                  {isEditing ? (
                    <Input
                      id="HoTenQuanLi"
                      value={profile.HoTenQuanLi}
                      onChange={(e) => handleInputChange("HoTenQuanLi", e.target.value)}
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg text-sm">{profile.HoTenQuanLi}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="Email" className="text-sm">
                    Email
                  </Label>
                  {isEditing ? (
                    <Input
                      id="Email"
                      type="email"
                      value={profile.Email || ""}
                      onChange={(e) => handleInputChange("Email", e.target.value)}
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg text-sm">{profile.Email || "Chưa cập nhật"}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="SoDienThoaiDN" className="text-sm">
                    Số điện thoại *
                  </Label>
                  {isEditing ? (
                    <Input
                      id="SoDienThoaiDN"
                      value={profile.SoDienThoaiDN}
                      onChange={(e) => handleInputChange("SoDienThoaiDN", e.target.value)}
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg text-sm">{profile.SoDienThoaiDN}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="NgaySinh" className="text-sm">
                    Ngày sinh *
                  </Label>
                  {isEditing ? (
                    <Input
                      id="NgaySinh"
                      type="date"
                      value={profile.NgaySinh.split("T")[0]}
                      onChange={(e) => handleInputChange("NgaySinh", e.target.value)}
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg text-sm">{formatDate(profile.NgaySinh)}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="GioiTinh" className="text-sm">
                    Giới tính *
                  </Label>
                  {isEditing ? (
                    <Select value={profile.GioiTinh} onValueChange={(value) => handleInputChange("GioiTinh", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Nam">Nam</SelectItem>
                        <SelectItem value="Nữ">Nữ</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg text-sm">{profile.GioiTinh}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="SoCCCD" className="text-sm">
                    Số CCCD *
                  </Label>
                  {isEditing ? (
                    <Input
                      id="SoCCCD"
                      value={profile.SoCCCD}
                      onChange={(e) => handleInputChange("SoCCCD", e.target.value)}
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg text-sm">{profile.SoCCCD}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ChucVu" className="text-sm">
                    Chức vụ
                  </Label>
                  {isEditing ? (
                    <Input
                      id="ChucVu"
                      value={profile.ChucVu || ""}
                      onChange={(e) => handleInputChange("ChucVu", e.target.value)}
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg text-sm">{profile.ChucVu || "Chưa cập nhật"}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="DiaChiChiTiet" className="text-sm">
                  Địa chỉ chi tiết *
                </Label>
                {isEditing ? (
                  <Input
                    id="DiaChiChiTiet"
                    value={profile.DiaChiChiTiet}
                    onChange={(e) => handleInputChange("DiaChiChiTiet", e.target.value)}
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg text-sm">{profile.DiaChiChiTiet}</p>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="Phuong" className="text-sm">
                    Phường/Xã *
                  </Label>
                  {isEditing ? (
                    <Input
                      id="Phuong"
                      value={profile.Phuong}
                      onChange={(e) => handleInputChange("Phuong", e.target.value)}
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg text-sm">{profile.Phuong}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="Quan" className="text-sm">
                    Quận/Huyện *
                  </Label>
                  {isEditing ? (
                    <Input id="Quan" value={profile.Quan} onChange={(e) => handleInputChange("Quan", e.target.value)} />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg text-sm">{profile.Quan}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ThanhPho" className="text-sm">
                    Tỉnh/Thành phố *
                  </Label>
                  {isEditing ? (
                    <Input
                      id="ThanhPho"
                      value={profile.ThanhPho}
                      onChange={(e) => handleInputChange("ThanhPho", e.target.value)}
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg text-sm">{profile.ThanhPho}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="MoTa" className="text-sm">
                  Mô tả
                </Label>
                {isEditing ? (
                  <Textarea
                    id="MoTa"
                    value={profile.MoTa || ""}
                    onChange={(e) => handleInputChange("MoTa", e.target.value)}
                    rows={3}
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg text-sm min-h-[80px]">{profile.MoTa || "Chưa có mô tả"}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Hostel Information */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                <Building2 className="h-5 w-5" />
                Thông tin nhà trọ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="TenNhaTro" className="text-sm">
                    Tên nhà trọ
                  </Label>
                  {isEditing ? (
                    <Input
                      id="TenNhaTro"
                      value={profile.TenNhaTro || ""}
                      onChange={(e) => handleInputChange("TenNhaTro", e.target.value)}
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg text-sm">{profile.TenNhaTro || "Chưa cập nhật"}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="SoGiayPhep" className="text-sm">
                    Số giấy phép kinh doanh
                  </Label>
                  {isEditing ? (
                    <Input
                      id="SoGiayPhep"
                      value={profile.SoGiayPhep || ""}
                      onChange={(e) => handleInputChange("SoGiayPhep", e.target.value)}
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg text-sm">{profile.SoGiayPhep || "Chưa cập nhật"}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="DiaChiNhaTro" className="text-sm">
                  Địa chỉ nhà trọ
                </Label>
                {isEditing ? (
                  <Input
                    id="DiaChiNhaTro"
                    value={profile.DiaChiNhaTro || ""}
                    onChange={(e) => handleInputChange("DiaChiNhaTro", e.target.value)}
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg text-sm">{profile.DiaChiNhaTro || "Chưa cập nhật"}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="NgayCapGiayPhep" className="text-sm">
                  Ngày cấp giấy phép
                </Label>
                {isEditing ? (
                  <Input
                    id="NgayCapGiayPhep"
                    type="date"
                    value={profile.NgayCapGiayPhep || ""}
                    onChange={(e) => handleInputChange("NgayCapGiayPhep", e.target.value)}
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg text-sm">
                    {profile.NgayCapGiayPhep ? formatDate(profile.NgayCapGiayPhep) : "Chưa cập nhật"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                <Shield className="h-5 w-5" />
                Bảo mật tài khoản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Key className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-sm">Mật khẩu đăng nhập</p>
                    <p className="text-xs text-gray-600">Cập nhật lần cuối: 30 ngày trước</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Đổi mật khẩu
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-sm">Xác thực 2 bước</p>
                    <p className="text-xs text-gray-600">Tăng cường bảo mật tài khoản</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  Chưa kích hoạt
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* API Information - Hidden on mobile */}
          <Card className="border-0 shadow-sm hidden lg:block">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" />
                Thông tin API
              </CardTitle>
              <CardDescription>Dữ liệu API của quản lý (dùng cho hợp đồng)</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto">
                {JSON.stringify(
                  {
                    QuanLiID: profile.QuanLiID,
                    SoDienThoaiDN: profile.SoDienThoaiDN,
                    HoTenQuanLi: profile.HoTenQuanLi,
                    DiaChiChiTiet: profile.DiaChiChiTiet,
                    GioiTinh: profile.GioiTinh,
                    NgaySinh: profile.NgaySinh,
                    Phuong: profile.Phuong,
                    Quan: profile.Quan,
                    SoCCCD: profile.SoCCCD,
                    ThanhPho: profile.ThanhPho,
                  },
                  null,
                  2,
                )}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
