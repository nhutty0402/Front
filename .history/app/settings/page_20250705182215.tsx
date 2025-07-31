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
import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { DataSync } from "@/components/data-sync"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useToast } from "@/hooks/use-toast"
import { Menu, User, Bell, Shield, Database, Palette, Download, Upload, Trash2, Save } from "lucide-react"

interface Settings {
  notifications: {
    newTenant: boolean
    paymentReminder: boolean
    maintenanceRequest: boolean
    contractExpiry: boolean
  }
  display: {
    language: string
    dateFormat: string
    currency: string
  }
  privacy: {
    dataRetention: number
    autoBackup: boolean
    shareAnalytics: boolean
  }
  hostel: {
    name: string
    address: string
    phone: string
    email: string
  }
}

const defaultSettings: Settings = {
  notifications: {
    newTenant: true,
    paymentReminder: true,
    maintenanceRequest: true,
    contractExpiry: true,
  },
  display: {
    language: "vi",
    dateFormat: "dd/MM/yyyy",
    currency: "VND",
  },
  privacy: {
    dataRetention: 12,
    autoBackup: true,
    shareAnalytics: false,
  },
  hostel: {
    name: "Nhà trọ ABC",
    address: "123 Đường XYZ, Quận 1, TP.HCM",
    phone: "0901234567",
    email: "contact@nhatroabc.com",
  },
}

export default function SettingsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [settings, setSettings] = useLocalStorage<Settings>("app-settings", defaultSettings)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const updateSettings = (section: keyof Settings, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Đã lưu cài đặt",
        description: "Các thay đổi đã được áp dụng thành công",
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

  const handleExportData = () => {
    const dataStr = JSON.stringify(settings, null, 2)
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
        const importedSettings = JSON.parse(e.target?.result as string)
        setSettings(importedSettings)
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

  const handleResetSettings = () => {
    if (confirm("Bạn có chắc muốn khôi phục cài đặt mặc định?")) {
      setSettings(defaultSettings)
      toast({
        title: "Đã khôi phục",
        description: "Cài đặt đã được khôi phục về mặc định",
      })
    }
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
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Cài đặt</h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">
                  Quản lý cài đặt ứng dụng và tài khoản
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
                  <User className="h-5 w-5" />
                  Thông tin nhà trọ
                </CardTitle>
                <CardDescription>Cập nhật thông tin cơ bản về nhà trọ</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hostel-name">Tên nhà trọ</Label>
                    <Input
                      id="hostel-name"
                      value={settings.hostel.name}
                      onChange={(e) => updateSettings("hostel", "name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hostel-phone">Số điện thoại</Label>
                    <Input
                      id="hostel-phone"
                      value={settings.hostel.phone}
                      onChange={(e) => updateSettings("hostel", "phone", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hostel-address">Địa chỉ</Label>
                  <Input
                    id="hostel-address"
                    value={settings.hostel.address}
                    onChange={(e) => updateSettings("hostel", "address", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hostel-email">Email</Label>
                  <Input
                    id="hostel-email"
                    type="email"
                    value={settings.hostel.email}
                    onChange={(e) => updateSettings("hostel", "email", e.target.value)}
                  />
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
                    checked={settings.notifications.newTenant}
                    onCheckedChange={(checked) => updateSettings("notifications", "newTenant", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Nhắc nhở thanh toán</Label>
                    <p className="text-sm text-muted-foreground">Nhắc nhở khi hóa đơn sắp đến hạn</p>
                  </div>
                  <Switch
                    checked={settings.notifications.paymentReminder}
                    onCheckedChange={(checked) => updateSettings("notifications", "paymentReminder", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Yêu cầu bảo trì</Label>
                    <p className="text-sm text-muted-foreground">Thông báo khi có yêu cầu bảo trì mới</p>
                  </div>
                  <Switch
                    checked={settings.notifications.maintenanceRequest}
                    onCheckedChange={(checked) => updateSettings("notifications", "maintenanceRequest", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Hợp đồng sắp hết hạn</Label>
                    <p className="text-sm text-muted-foreground">Nhắc nhở khi hợp đồng sắp hết hạn</p>
                  </div>
                  <Switch
                    checked={settings.notifications.contractExpiry}
                    onCheckedChange={(checked) => updateSettings("notifications", "contractExpiry", checked)}
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
                    <Select
                      value={settings.display.language}
                      onValueChange={(value) => updateSettings("display", "language", value)}
                    >
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
                    <Select
                      value={settings.display.dateFormat}
                      onValueChange={(value) => updateSettings("display", "dateFormat", value)}
                    >
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
                    <Select
                      value={settings.display.currency}
                      onValueChange={(value) => updateSettings("display", "currency", value)}
                    >
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
                    checked={settings.privacy.autoBackup}
                    onCheckedChange={(checked) => updateSettings("privacy", "autoBackup", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Chia sẻ dữ liệu phân tích</Label>
                    <p className="text-sm text-muted-foreground">Giúp cải thiện ứng dụng</p>
                  </div>
                  <Switch
                    checked={settings.privacy.shareAnalytics}
                    onCheckedChange={(checked) => updateSettings("privacy", "shareAnalytics", checked)}
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Thời gian lưu trữ dữ liệu (tháng)</Label>
                  <Select
                    value={settings.privacy.dataRetention.toString()}
                    onValueChange={(value) => updateSettings("privacy", "dataRetention", Number.parseInt(value))}
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
                  <Button
                    onClick={handleResetSettings}
                    variant="outline"
                    className="flex-1 text-red-600 hover:text-red-700 bg-transparent"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Khôi phục mặc định
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Đồng bộ dữ liệu</Label>
                    <p className="text-sm text-muted-foreground">Đồng bộ với cloud storage</p>
                  </div>
                  <DataSync />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
