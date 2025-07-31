"use client"

import { useState } from "react"
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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, DollarSign, Users, Building2, Menu, Download, Filter } from "lucide-react"

// Format currency in VND
const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(0)}M VNĐ`
  }
  return `${value.toLocaleString("vi-VN")} VNĐ`
}

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-medium">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.dataKey}: ${formatCurrency(entry.value)}`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function ReportsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  // Sample data
  const monthlyRevenue = [
    { month: "T1", revenue: 78000000, expenses: 25000000 },
    { month: "T2", revenue: 82000000, expenses: 28000000 },
    { month: "T3", revenue: 75000000, expenses: 22000000 },
    { month: "T4", revenue: 88000000, expenses: 30000000 },
    { month: "T5", revenue: 92000000, expenses: 32000000 },
    { month: "T6", revenue: 85000000, expenses: 28000000 },
  ]

  const occupancyData = [
    { month: "T1", occupied: 85, vacant: 15 },
    { month: "T2", occupied: 88, vacant: 12 },
    { month: "T3", occupied: 82, vacant: 18 },
    { month: "T4", occupied: 90, vacant: 10 },
    { month: "T5", occupied: 95, vacant: 5 },
    { month: "T6", occupied: 87, vacant: 13 },
  ]

  const serviceRevenue = [
    { name: "Tiền phòng", value: 62000000, color: "#3b82f6" },
    { name: "Điện", value: 12000000, color: "#ef4444" },
    { name: "Nước", value: 8000000, color: "#06b6d4" },
    { name: "Internet", value: 3000000, color: "#8b5cf6" },
    { name: "Khác", value: 3000000, color: "#f59e0b" },
  ]

  const summaryStats = [
    {
      title: "Tổng doanh thu",
      value: "78M VNĐ",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Tỷ lệ lấp đầy",
      value: "87%",
      change: "+2.3%",
      trend: "up",
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Khách thuê",
      value: "124",
      change: "+5",
      trend: "up",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Chi phí vận hành",
      value: "28M VNĐ",
      change: "-3.2%",
      trend: "down",
      icon: TrendingDown,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

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
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Báo cáo</h1>
              <p className="text-sm text-gray-500">Tháng 6/2024</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Báo cáo & Thống kê</h1>
              <p className="text-gray-600">Tổng quan tình hình kinh doanh nhà trọ</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Lọc
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Xuất báo cáo
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-6 space-y-6">
          {/* Summary Cards */}
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

          {/* Charts Section */}
          <Tabs defaultValue="revenue" className="space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <TabsList className="grid w-full lg:w-auto grid-cols-3">
                <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
                <TabsTrigger value="occupancy">Lấp đầy</TabsTrigger>
                <TabsTrigger value="services">Dịch vụ</TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <Button
                  variant={selectedPeriod === "month" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPeriod("month")}
                >
                  Tháng
                </Button>
                <Button
                  variant={selectedPeriod === "quarter" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPeriod("quarter")}
                >
                  Quý
                </Button>
                <Button
                  variant={selectedPeriod === "year" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPeriod("year")}
                >
                  Năm
                </Button>
              </div>
            </div>

            <TabsContent value="revenue" className="space-y-4">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Doanh thu & Chi phí</CardTitle>
                  <CardDescription>Biểu đồ so sánh doanh thu và chi phí theo tháng</CardDescription>
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

            <TabsContent value="occupancy" className="space-y-4">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Tỷ lệ lấp đầy phòng</CardTitle>
                  <CardDescription>Biểu đồ theo dõi tỷ lệ phòng được thuê</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={occupancyData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" height={40} tick={{ fontSize: 12 }} />
                        <YAxis width={60} tick={{ fontSize: 12 }} domain={[0, 100]} />
                        <Tooltip
                          formatter={(value: number, name: string) => [
                            `${value}%`,
                            name === "occupied" ? "Đã thuê" : "Trống",
                          ]}
                        />
                        <Line type="monotone" dataKey="occupied" stroke="#10b981" strokeWidth={3} name="Đã thuê" />
                        <Line type="monotone" dataKey="vacant" stroke="#f59e0b" strokeWidth={3} name="Trống" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="space-y-4">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Doanh thu theo dịch vụ</CardTitle>
                  <CardDescription>Phân bổ doanh thu từ các dịch vụ khác nhau</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pie Chart */}
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                          <Pie
                            data={serviceRevenue}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {serviceRevenue.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Service List */}
                    <div className="space-y-3">
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

          {/* Recent Activities */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Hoạt động gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    action: "Thanh toán tiền phòng",
                    room: "A101",
                    amount: "2.500.000 VNĐ",
                    time: "2 giờ trước",
                    status: "success",
                  },
                  {
                    action: "Cập nhật chỉ số điện",
                    room: "B203",
                    amount: "150 kWh",
                    time: "4 giờ trước",
                    status: "info",
                  },
                  {
                    action: "Khách thuê mới",
                    room: "A105",
                    amount: "Nguyễn Văn D",
                    time: "1 ngày trước",
                    status: "success",
                  },
                  {
                    action: "Yêu cầu sửa chữa",
                    room: "B101",
                    amount: "Điều hòa hỏng",
                    time: "2 ngày trước",
                    status: "warning",
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
          </Card>
        </div>
      </div>
    </div>
  )
}
