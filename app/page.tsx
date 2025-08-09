"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, FileText, DollarSign, MessageSquare, Menu, TrendingUp, Bell } from "lucide-react"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { Sidebar } from "@/components/sidebar"
import axiosClient from "@/lib/axiosClient"

interface DashboardStatsResponse {
  totalRooms: number
  rentedRooms: number
  emptyRooms: number
  tenants: number
  activeContracts: number
  expiringContracts: number
  monthlyRevenue: string
}

const formatCurrency = (value: number) => {
  if (!Number.isFinite(value)) return "-"
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M₫`
  return `${value.toLocaleString("vi-VN")}₫`
}

export default function Dashboard() {
  const [userRole, setUserRole] = useState<"admin" | "tenant">("admin")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [dashboardStats, setDashboardStats] = useState<DashboardStatsResponse | null>(null)

  useEffect(() => {
    const BASE_URL = "https://all-oqry.onrender.com"
    ;(async () => {
      try {
        const { data } = await axiosClient.get<DashboardStatsResponse>(`${BASE_URL}/api/doanhthu/DashboardStats`)
        setDashboardStats(data)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load dashboard stats", error)
      }
    })()
  }, [])

  const stats = [
    {
      title: "Tổng số phòng",
      value: dashboardStats ? String(dashboardStats.totalRooms) : "-",
      description: dashboardStats
        ? `${dashboardStats.rentedRooms} đã thuê, ${dashboardStats.emptyRooms} trống`
        : "",
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Khách thuê",
      value: dashboardStats ? String(dashboardStats.tenants) : "-",
      description: "Đang hoạt động",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Hợp đồng",
      value: dashboardStats ? String(dashboardStats.activeContracts) : "-",
      description: dashboardStats ? `${dashboardStats.expiringContracts} sắp hết hạn` : "",
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Doanh thu tháng",
      value: dashboardStats ? formatCurrency(parseFloat(dashboardStats.monthlyRevenue)) : "-",
      description: "",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  // const recentActivities = [
  //   { id: 1, type: "payment", message: "Nguyễn Văn A đã thanh toán hóa đơn phòng P101", time: "2 giờ trước" },
  //   { id: 2, type: "request", message: "Yêu cầu sửa máy lạnh từ phòng P205", time: "4 giờ trước" },
  //   { id: 3, type: "contract", message: "Hợp đồng phòng P103 sắp hết hạn", time: "1 ngày trước" },
  //   { id: 4, type: "new_tenant", message: "Khách thuê mới đăng ký phòng P108", time: "2 ngày trước" },
  // ]

  const quickActions = [
    { title: "Thêm phòng", icon: Building2, href: "/rooms", color: "bg-blue-500" },
    { title: "Thêm khách", icon: Users, href: "/tenants", color: "bg-green-500" },
    { title: "Tạo hợp đồng", icon: FileText, href: "/contracts", color: "bg-orange-500" },
    { title: "Tạo hóa đơn", icon: DollarSign, href: "/finance", color: "bg-purple-500" },
  ]

  if (userRole === "admin") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Desktop Sidebar - Hidden on mobile */}
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
              <div>
                <h1 className="text-lg font-semibold text-gray-900"> </h1>
                <p className="text-sm text-gray-500">Quản lý nhà trọ</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </Button>
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
                <h1 className="text-2xl font-bold text-gray-900">Quản lý nhà trọ</h1>
                <p className="text-gray-600">Tổng quan về tình hình nhà trọ</p>
              </div>
              <Button onClick={() => setUserRole("tenant")} variant="outline">
                Xem giao diện Khách thuê
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 lg:p-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`h-4 w-4 lg:h-5 lg:w-5 ${stat.color}`} />
                      </div>
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs lg:text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-lg lg:text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-500">{stat.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions - Mobile Only */}
            {/* <div className="lg:hidden">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Thao tác nhanh</h2>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <Card key={index} className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className={`p-3 rounded-full ${action.color}`}>
                          <action.icon className="h-5 w-5 text-white" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">{action.title}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div> */}

            {/* Recent Activities & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities - commented out sample data */}
              {/* <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base lg:text-lg">Hoạt động gần đây</CardTitle>
                  <CardDescription className="text-sm">Các sự kiện mới nhất trong hệ thống</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card> */}

              {/* Quick Actions - Desktop */}
              <Card className="border-0 shadow-sm hidden lg:block">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Thao tác nhanh</CardTitle>
                  <CardDescription className="text-sm">Các chức năng thường dùng</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-20 flex flex-col items-center justify-center text-sm bg-transparent hover:bg-gray-50"
                      >
                        <action.icon className="h-6 w-6 mb-2" />
                        {action.title}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Role Switch for Demo - Mobile */}
            {/* <div className="lg:hidden p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">Demo: Chuyển đổi vai trò</p>
              <Button onClick={() => setUserRole("tenant")} variant="outline" size="sm" className="w-full">
                Xem giao diện Khách thuê
              </Button>
            </div> */}
          </div>
        </div>
      </div>
    )
  }

  // Tenant Dashboard - Mobile Optimized
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 bg-white shadow-sm border-b px-4 py-3">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Xin chào, Nguyễn Văn A</h1>
            <p className="text-sm text-gray-600">Phòng P101 - Tầng 1</p>
          </div>
          <Button onClick={() => setUserRole("admin")} variant="outline" size="sm">
            Quản lý
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Info Cards */}
        <div className="grid grid-cols-1 gap-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Thông tin phòng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Phòng:</p>
                  <p className="text-sm text-gray-900">P101</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Diện tích:</p>
                  <p className="text-sm text-gray-900">20m²</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Giá thuê:</p>
                <p className="text-lg font-bold text-gray-900">3.000.000₫/tháng</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">
                  Máy lạnh
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  WiFi
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Hóa đơn tháng này</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tiền thuê:</span>
                  <span className="font-medium">3.000.000₫</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Điện:</span>
                  <span className="font-medium">200.000₫</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Nước:</span>
                  <span className="font-medium">100.000₫</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Tổng:</span>
                  <span className="text-lg">3.300.000₫</span>
                </div>
              </div>
              <Badge className="bg-orange-500 text-xs">Chưa thanh toán</Badge>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Hợp đồng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Từ:</p>
                  <p className="text-sm text-gray-900">01/05/2025</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Đến:</p>
                  <p className="text-sm text-gray-900">30/04/2026</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Tiền cọc:</p>
                <p className="text-sm text-gray-900">3.000.000₫</p>
              </div>
              <Badge className="bg-green-500 text-xs">Đang hiệu lực</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Payment Section */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Thanh toán hóa đơn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="font-medium text-sm">Hóa đơn tháng 12/2024</p>
              <p className="text-2xl font-bold text-orange-600">3.300.000₫</p>
              <p className="text-sm text-gray-600">Hạn thanh toán: 05/01/2025</p>
            </div>
            <Button className="w-full">
              <DollarSign className="h-4 w-4 mr-2" />
              Thanh toán qua MoMo
            </Button>
          </CardContent>
        </Card>

        {/* Request Section */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Gửi yêu cầu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <MessageSquare className="h-4 w-4 mr-2" />
              Yêu cầu sửa chữa
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <MessageSquare className="h-4 w-4 mr-2" />
              Khiếu nại
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <MessageSquare className="h-4 w-4 mr-2" />
              Liên hệ quản lý
            </Button>
          </CardContent>
        </Card>

        {/* Recent Requests */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Yêu cầu gần đây</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium text-sm">Yêu cầu sửa máy lạnh</p>
                <Badge className="bg-yellow-500 text-xs">Đang xử lý</Badge>
              </div>
              <p className="text-xs text-gray-600">Gửi ngày 15/12/2024</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium text-sm">Yêu cầu thay bóng đèn</p>
                <Badge className="bg-green-500 text-xs">Đã hoàn thành</Badge>
              </div>
              <p className="text-xs text-gray-600">Gửi ngày 10/12/2024</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
