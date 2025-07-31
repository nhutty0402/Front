"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { useHostel } from "@/contexts/hostel-context"
import { useToast } from "@/hooks/use-toast"
import {
  Menu,
  Building2,
  Bell,
  Shield,
  Database,
  Palette,
  Download,
  Upload,
  Save,
  FileText,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  User,
} from "lucide-react"

interface NotificationSettings {
  newTenant: boolean
  paymentReminder: boolean
  maintenanceRequest: boolean
  contractExpiry: boolean
}

interface DisplaySettings {
  language: string
  dateFormat: string
  currency: string
}

interface PrivacySettings {
  dataRetention: number
  autoBackup: boolean
  shareAnalytics: boolean
}

const defaultNotifications: NotificationSettings = {
  newTenant: true,
  paymentReminder: true,
  maintenanceRequest: true,
  contractExpiry: true,
}

const defaultDisplay: DisplaySettings = {
  language: "vi",
  dateFormat: "dd/MM/yyyy",
  currency: "VND",
}

const defaultPrivacy: PrivacySettings = {
  dataRetention: 12,
  autoBackup: true,
  shareAnalytics: false,
}

export default function SettingsPage() {
  const { hostelSettings, updateHostelSettings } = useHostel()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [settings, setSettings] = useState(hostelSettings)
  const [notifications, setNotifications] = useState<NotificationSettings>(defaultNotifications)
  const [display, setDisplay] = useState<DisplaySettings>(defaultDisplay)
  const [privacy, setPrivacy] = useState<PrivacySettings>(defaultPrivacy)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    if (!settings) return

    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      updateHostelSettings(settings)

      toast({
        title: "Đã lưu cài đặt",
        description: "Thông tin nhà trọ đã được cập nhật và sẽ được sử dụng cho các hợp đồng mới",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể lưu cài đặt",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: keyof typeof settings, value: string) => {
    if (!settings) return
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            [field]: value,
          }
        : null,
    )
  }

  const updateNotifications = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const updateDisplay = (key: keyof DisplaySettings, value: string) => {
    setDisplay((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const updatePrivacy = (key: keyof PrivacySettings, value: any) => {
    setPrivacy((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleExportData = () => {
    const dataStr = JSON.stringify({ hostelSettings: settings, notifications, display, privacy }, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "nha-tro-settings.json"
    link.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Xuất dữ liệu thành công",
      description: "File cài đặt đã được tải xuống",
    })
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string)
        if (importedData.hostelSettings) setSettings(importedData.hostelSettings)
        if (importedData.notifications) setNotifications(importedData.notifications)
        if (importedData.display) setDisplay(importedData.display)
        if (importedData.privacy) setPrivacy(importedData.privacy)

        toast({
          title: "Nhập dữ liệu thành công",
          description: "Cài đặt đã được khôi phục",
        })
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "File không hợp lệ",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  if (!settings) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Cài đặt</h1>
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Cài đặt hệ thống</h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">
                  Quản lý cài đặt ứng dụng và thông tin nhà trọ
                </p>
              </div>
              <Button onClick={handleSave} disabled={isSaving} className="w-full lg:w-auto">
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>

            {/* Hostel Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Thông tin nhà trọ
                </CardTitle>
                <CardDescription>
                  Thông tin này sẽ được sử dụng trong hợp đồng thuê phòng (không thể chỉnh sửa thông tin quản lý ở đây)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Thông tin cơ bản</h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hostel-name" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Tên nhà trọ *
                      </Label>
                      <Input
                        id="hostel-name"
                        value={settings.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Nhà trọ ABC"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hostel-phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Số điện thoại *
                      </Label>
                      <Input
                        id="hostel-phone"
                        value={settings.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="0901234567"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hostel-address" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Địa chỉ nhà trọ *
                    </Label>
                    <Input
                      id="hostel-address"
                      value={settings.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="123 Đường XYZ, Phường ABC, Quận DEF, TP.GHI"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hostel-email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email liên hệ
                    </Label>
                    <Input
                      id="hostel-email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="contact@nhatroabc.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Mô tả nhà trọ
                    </Label>
                    <Textarea
                      id="description"
                      value={settings.description || ""}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Mô tả về nhà trọ, dịch vụ, tiện ích..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Business Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Thông tin kinh doanh</h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="business-license" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Số giấy phép kinh doanh
                      </Label>
                      <Input
                        id="business-license"
                        value={settings.businessLicense || ""}
                        onChange={(e) => handleInputChange("businessLicense", e.target.value)}
                        placeholder="GP-CT-2023-001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business-license-date" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Ngày cấp giấy phép
                      </Label>
                      <Input
                        id="business-license-date"
                        type="date"
                        value={settings.businessLicenseDate || ""}
                        onChange={(e) => handleInputChange("businessLicenseDate", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tax-code" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Mã số thuế
                      </Label>
                      <Input
                        id="tax-code"
                        value={settings.taxCode || ""}
                        onChange={(e) => handleInputChange("taxCode", e.target.value)}
                        placeholder="1234567890"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="established-date" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Ngày thành lập
                      </Label>
                      <Input
                        id="established-date"
                        type="date"
                        value={settings.establishedDate || ""}
                        onChange={(e) => handleInputChange("establishedDate", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="representative" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Người đại diện pháp luật
                    </Label>
                    <Input
                      id="representative"
                      value={settings.representative || ""}
                      onChange={(e) => handleInputChange("representative", e.target.value)}
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                </div>

                {/* Banking Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Thông tin ngân hàng</h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bank-account">Số tài khoản</Label>
                      <Input
                        id="bank-account"
                        value={settings.bankAccount || ""}
                        onChange={(e) => handleInputChange("bankAccount", e.target.value)}
                        placeholder="1234567890"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bank-name">Tên ngân hàng</Label>
                      <Input
                        id="bank-name"
                        value={settings.bankName || ""}
                        onChange={(e) => handleInputChange("bankName", e.target.value)}
                        placeholder="Ngân hàng ABC"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Lưu ý:</strong> Thông tin quản lý nhà trọ (Bên A trong hợp đồng) chỉ có thể chỉnh sửa trong
                    trang "Thông tin cá nhân". Thông tin ở đây sẽ được sử dụng làm thông tin nhà trọ trong hợp đồng.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Thông báo
                </CardTitle>
                <CardDescription>Quản lý các loại thông báo bạn muốn nhận</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Khách thuê mới</Label>
                    <p className="text-sm text-muted-foreground">Thông báo khi có khách thuê mới</p>
                  </div>
                  <Switch
                    checked={notifications.newTenant}
                    onCheckedChange={(checked) => updateNotifications("newTenant", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Nhắc nhở thanh toán</Label>
                    <p className="text-sm text-muted-foreground">Nhắc nhở khi hóa đơn sắp đến hạn</p>
                  </div>
                  <Switch
                    checked={notifications.paymentReminder}
                    onCheckedChange={(checked) => updateNotifications("paymentReminder", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Yêu cầu bảo trì</Label>
                    <p className="text-sm text-muted-foreground">Thông báo khi có yêu cầu bảo trì mới</p>
                  </div>
                  <Switch
                    checked={notifications.maintenanceRequest}
                    onCheckedChange={(checked) => updateNotifications("maintenanceRequest", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Hợp đồng sắp hết hạn</Label>
                    <p className="text-sm text-muted-foreground">Nhắc nhở khi hợp đồng sắp hết hạn</p>
                  </div>
                  <Switch
                    checked={notifications.contractExpiry}
                    onCheckedChange={(checked) => updateNotifications("contractExpiry", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Display Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Hiển thị
                </CardTitle>
                <CardDescription>Tùy chỉnh giao diện và định dạng hiển thị</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Ngôn ngữ</Label>
                    <Select value={display.language} onValueChange={(value) => updateDisplay("language", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vi">Tiếng Việt</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Định dạng ngày</Label>
                    <Select value={display.dateFormat} onValueChange={(value) => updateDisplay("dateFormat", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tiền tệ</Label>
                    <Select value={display.currency} onValueChange={(value) => updateDisplay("currency", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VND">VND (₫)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Chế độ tối</Label>
                    <p className="text-sm text-muted-foreground">Chuyển đổi giữa chế độ sáng và tối</p>
                  </div>
                  <ThemeToggle />
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Bảo mật & Quyền riêng tư
                </CardTitle>
                <CardDescription>Quản lý dữ liệu và quyền riêng tư</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sao lưu tự động</Label>
                    <p className="text-sm text-muted-foreground">Tự động sao lưu dữ liệu hàng ngày</p>
                  </div>
                  <Switch
                    checked={privacy.autoBackup}
                    onCheckedChange={(checked) => updatePrivacy("autoBackup", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Chia sẻ dữ liệu phân tích</Label>
                    <p className="text-sm text-muted-foreground">Giúp cải thiện ứng dụng</p>
                  </div>
                  <Switch
                    checked={privacy.shareAnalytics}
                    onCheckedChange={(checked) => updatePrivacy("shareAnalytics", checked)}
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Thời gian lưu trữ dữ liệu (tháng)</Label>
                  <Select
                    value={privacy.dataRetention.toString()}
                    onValueChange={(value) => updatePrivacy("dataRetention", Number.parseInt(value))}
                  >
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 tháng</SelectItem>
                      <SelectItem value="12">12 tháng</SelectItem>
                      <SelectItem value="24">24 tháng</SelectItem>
                      <SelectItem value="36">36 tháng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Quản lý dữ liệu
                </CardTitle>
                <CardDescription>Sao lưu, khôi phục và quản lý dữ liệu ứng dụng</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <Button onClick={handleExportData} variant="outline" className="flex-1 bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Xuất dữ liệu
                  </Button>
                  <div className="flex-1">
                    <input type="file" accept=".json" onChange={handleImportData} className="hidden" id="import-file" />
                    <Button asChild variant="outline" className="w-full bg-transparent">
                      <label htmlFor="import-file" className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Nhập dữ liệu
                      </label>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
