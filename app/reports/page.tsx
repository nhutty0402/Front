"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Users, Building2, Menu, Download, Filter } from "lucide-react"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { Sidebar } from "@/components/sidebar"
import axiosClient from "@/lib/axiosClient"

// Định nghĩa interface cho dữ liệu pie chart
interface PieDataEntry {
  name: string
  value: number
  color: string
}

// Định nghĩa interface cho label của pie chart
interface PieLabelProps {
  name: string
  percent: number
  value: number
}

// Định nghĩa interface cho tooltip
interface TooltipProps {
  active?: boolean
  payload?: Array<{
    dataKey: string
    value: number
    color: string
  }>
  label?: string
}

// API types
interface SummaryResponse {
  tongDoanhThu: string
  chiPhiVanHanh: string
  tyLeLapDay: number
  soKhachThue: number
}

interface ChartItemResponse {
  thang: number
  doanhThu: string
  chiPhi: string
}

// Định dạng tiền tệ VNĐ
const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(0)}M VNĐ`
  }
  return `${value.toLocaleString("vi-VN")} VNĐ`
}

// Tooltip tùy chỉnh cho biểu đồ
const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-medium">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.dataKey}: ${formatCurrency(entry.value)}`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

// Hàm render label cho pie chart - an toàn kiểu dữ liệu
const renderPieLabel = (entry: any) => {
  const name: string = entry?.name ?? ""
  const percent: number = entry?.percent ?? 0
  return `${name} ${(percent * 100).toFixed(0)}%`
}

export default function ReportsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  // Bỏ bộ lọc theo tháng/quý/năm

  // State: API data
  const [summary, setSummary] = useState<SummaryResponse | null>(null)
  const [monthlyRevenue, setMonthlyRevenue] = useState<Array<{ month: string; revenue: number; expenses: number }>>([])

  // Fetch data from API (năm 2025)
  useEffect(() => {
    const year = 2025
    const baseUrl = "https://all-oqry.onrender.com"
    ;(async () => {
      try {
        const [summaryRes, chartRes, detailRes] = await Promise.all([
          axiosClient.get<SummaryResponse>(`${baseUrl}/api/doanhthu/tongquan`, { params: { nam: year } }),
          axiosClient.get<ChartItemResponse[]>(`${baseUrl}/api/doanhthu/bieudo`, { params: { nam: year } }),
          axiosClient.get(`${baseUrl}/api/doanhthu/chitietdoanhthu`, { params: { nam: year } }),
        ])

        setSummary(summaryRes.data)

        const mapped = (chartRes.data || []).map((item) => ({
          month: `T${item.thang}`,
          revenue: parseFloat(item.doanhThu || "0"),
          expenses: parseFloat(item.chiPhi || "0"),
        }))
        setMonthlyRevenue(mapped)

        const d = detailRes.data as {
          tienPhong: string
          tienDien: string
          tienNuoc: string
          internet: string
          dichVuKhac: string
          tienTru?: string
        }
        setServiceRevenue([
          { name: "Tiền phòng", value: parseFloat(d?.tienPhong || "0"), color: "#3b82f6" },
          { name: "Tiền điện", value: parseFloat(d?.tienDien || "0"), color: "#ef4444" },
          { name: "Tiền nước", value: parseFloat(d?.tienNuoc || "0"), color: "#06b6d4" },
          { name: "Internet", value: parseFloat(d?.internet || "0"), color: "#8b5cf6" },
          { name: "Dịch vụ khác", value: parseFloat(d?.dichVuKhac || "0"), color: "#f59e0b" },
        ])
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load reports data", error)
      }
    })()
  }, [])

  // Bỏ dữ liệu tỷ lệ lấp đầy

  // Dữ liệu doanh thu dịch vụ từ API
  const [serviceRevenue, setServiceRevenue] = useState<PieDataEntry[]>([])

  // Thống kê tổng quan (từ API)
  const summaryStats = [
    {
      title: "Tổng doanh thu",
      value: summary ? formatCurrency(parseFloat(summary.tongDoanhThu)) : "-",
      change: undefined as string | undefined,
      trend: "up" as const,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Tỷ lệ lấp đầy",
      value: summary ? `${summary.tyLeLapDay}%` : "-",
      change: undefined as string | undefined,
      trend: "up" as const,
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Số khách thuê",
      value: summary ? `${summary.soKhachThue}` : "-",
      change: undefined as string | undefined,
      trend: "up" as const,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Chi phí vận hành",
      value: summary ? formatCurrency(parseFloat(summary.chiPhiVanHanh)) : "-",
      change: undefined as string | undefined,
      trend: "down" as const,
      icon: TrendingDown,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Thanh bên Desktop */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-50">
        <Sidebar />
      </div>

      {/* Thanh bên Mobile */}
      <MobileSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Nội dung chính */}
      <div className="lg:pl-64">
        {/* Tiêu đề Mobile */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 lg:hidden">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Báo cáo</h1>
              <p className="text-sm text-gray-500">Năm 2025</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Tiêu đề Desktop */}
        <div className="hidden lg:block bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Báo cáo & Thống kê</h1>
              <p className="text-gray-600">Tổng quan tình hình kinh doanh nhà trọ</p>
            </div>
            {/* <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Bộ lọc
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Xuất báo cáo
              </Button>
            </div> */}
          </div>
        </div>

        {/* Nội dung */}
        <div className="p-4 lg:p-6 space-y-6">
          {/* Thẻ thống kê tổng quan */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {summaryStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <div className="flex items-center mt-1">
                          {stat.trend === "up" ? (
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                          )}
                          <span
                            className={`text-xs font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                          >
                            {stat.change}
                          </span>
                        </div>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        <Icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Phần biểu đồ */}
          <Tabs defaultValue="revenue" className="space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <TabsList className="grid w-full lg:w-auto grid-cols-2">
                <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
                <TabsTrigger value="services">Dịch vụ</TabsTrigger>
              </TabsList>

              {/* Bỏ bộ lọc theo tháng/quý/năm - chỉ lọc theo năm 2025 */}
            </div>

            <TabsContent value="revenue" className="space-y-4">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Biểu đồ Doanh thu & Chi phí</CardTitle>
                  <CardDescription>So sánh doanh thu và chi phí vận hành theo từng tháng</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyRevenue} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" height={40} tick={{ fontSize: 12 }} />
                        <YAxis width={60} tick={{ fontSize: 12 }} tickFormatter={formatCurrency} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="revenue" fill="#3b82f6" name="Doanh thu" />
                        <Bar dataKey="expenses" fill="#ef4444" name="Chi phí" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Đã xóa tab Tỷ lệ lấp đầy */}

            <TabsContent value="services" className="space-y-4">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Biểu đồ Doanh thu theo dịch vụ</CardTitle>
                  <CardDescription>Phân tích cơ cấu doanh thu từ các loại dịch vụ khác nhau</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Biểu đồ tròn */}
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                          <Pie
                            data={serviceRevenue}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            label={renderPieLabel}
                          >
                            {serviceRevenue.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Danh sách dịch vụ */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 mb-3">Chi tiết doanh thu dịch vụ</h4>
                      {serviceRevenue.map((service, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: service.color }} />
                            <span className="font-medium">{service.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{formatCurrency(service.value)}</div>
                            <div className="text-sm text-gray-500">
                              {((service.value / serviceRevenue.reduce((sum, s) => sum + s.value, 0)) * 100).toFixed(1)}
                              %
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Hoạt động gần đây */}
          {/* <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Hoạt động gần đây</CardTitle>
              <CardDescription>Các giao dịch và sự kiện mới nhất trong hệ thống</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    action: "Thanh toán tiền phòng",
                    room: "A101",
                    amount: "2.500.000 VNĐ",
                    time: "2 giờ trước",
                    status: "success" as const,
                  },
                  {
                    action: "Cập nhật chỉ số điện",
                    room: "B203",
                    amount: "150 kWh",
                    time: "4 giờ trước",
                    status: "info" as const,
                  },
                  {
                    action: "Khách thuê mới",
                    room: "A105",
                    amount: "Nguyễn Văn D",
                    time: "1 ngày trước",
                    status: "success" as const,
                  },
                  {
                    action: "Yêu cầu sửa chữa",
                    room: "B101",
                    amount: "Điều hòa hỏng",
                    time: "2 ngày trước",
                    status: "warning" as const,
                  },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          activity.status === "success"
                            ? "default"
                            : activity.status === "warning"
                              ? "destructive"
                              : "secondary"
                        }
                        className="w-2 h-2 p-0 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-sm">{activity.action}</p>
                        <p className="text-xs text-gray-500">Phòng {activity.room}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{activity.amount}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  )
}
