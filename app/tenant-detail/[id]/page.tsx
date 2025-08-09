import { Suspense } from "react";
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { ArrowLeft, Phone, Mail, MapPin, Calendar, CreditCard, FileText, Menu, Edit, UserCheck } from "lucide-react"
import { useRouter } from "next/navigation"

interface TenantDetail {
  id: string
  name: string
  phone: string
  email: string
  idCard: string
  address: string
  room: string
  building: string
  startDate: string
  status: "active" | "inactive"
  deposit: number
  hasAccount: boolean
  username?: string
  rentAmount: number
  contractNumber: string
  contractEndDate: string
  paymentHistory: PaymentRecord[]
  requests: ServiceRequest[]
}

interface PaymentRecord {
  id: string
  month: string
  amount: number
  status: "paid" | "unpaid" | "overdue"
  paidDate?: string
  dueDate: string
}

interface ServiceRequest {
  id: string
  title: string
  description: string
  status: "pending" | "in_progress" | "completed"
  createdDate: string
  completedDate?: string
}

const mockTenantDetail: TenantDetail = {
  id: "1",
  name: "Nguyễn Văn A",
  phone: "0901234567",
  email: "nguyenvana@email.com",
  idCard: "123456789",
  address: "123 Đường ABC, Quận 1, TP.HCM",
  room: "A101",
  building: "A",
  startDate: "2025-01-01",
  status: "active",
  deposit: 3000000,
  hasAccount: true,
  username: "nguyenvana",
  rentAmount: 3000000,
  contractNumber: "HD001",
  contractEndDate: "2025-12-31",
  paymentHistory: [
    {
      id: "1",
      month: "2025-01",
      amount: 3300000,
      status: "paid",
      paidDate: "2025-01-03",
      dueDate: "2025-01-05",
    },
    {
      id: "2",
      month: "2024-12",
      amount: 3300000,
      status: "paid",
      paidDate: "2024-12-04",
      dueDate: "2024-12-05",
    },
    {
      id: "3",
      month: "2024-11",
      amount: 3300000,
      status: "overdue",
      dueDate: "2024-11-05",
    },
  ],
  requests: [
    {
      id: "1",
      title: "Yêu cầu sửa máy lạnh",
      description: "Máy lạnh không hoạt động, có thể do hết gas",
      status: "in_progress",
      createdDate: "2024-12-15",
    },
    {
      id: "2",
      title: "Thay bóng đèn",
      description: "Bóng đèn phòng ngủ bị cháy",
      status: "completed",
      createdDate: "2024-12-10",
      completedDate: "2024-12-11",
    },
  ],
}

function TenantDetailPage({ params }: { params: { id: string } }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const tenant = mockTenantDetail // In real app, fetch by params.id

  const statusColors = {
    paid: "bg-green-500",
    unpaid: "bg-yellow-500",
    overdue: "bg-red-500",
    pending: "bg-yellow-500",
    in_progress: "bg-blue-500",
    completed: "bg-green-500",
  }

  const statusLabels = {
    paid: "Đã thanh toán",
    unpaid: "Chưa thanh toán",
    overdue: "Quá hạn",
    pending: "Chờ xử lý",
    in_progress: "Đang xử lý",
    completed: "Hoàn thành",
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
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Chi tiết khách thuê</h1>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="hidden lg:flex">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Quay lại
                </Button>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{tenant.name}</h1>
                  <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">
                    {tenant.building} - Phòng {tenant.room}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="bg-transparent">
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </Button>
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Xem hợp đồng
                </Button>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Thông tin cá nhân
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Số điện thoại</p>
                        <p className="font-medium">{tenant.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                        <p className="font-medium">{tenant.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Địa chỉ</p>
                      <p className="font-medium">{tenant.address}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">CMND/CCCD</p>
                      <p className="font-medium">{tenant.idCard}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Tài khoản</p>
                      <div className="flex items-center gap-2">
                        {tenant.hasAccount ? (
                          <>
                            <Badge className="bg-green-500">Đã tạo</Badge>
                            <span className="text-sm">({tenant.username})</span>
                          </>
                        ) : (
                          <Badge variant="outline">Chưa tạo</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Thông tin thuê
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Trạng thái</p>
                    <Badge className={tenant.status === "active" ? "bg-green-500" : "bg-gray-500"}>
                      {tenant.status === "active" ? "Đang thuê" : "Đã nghỉ"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Ngày bắt đầu</p>
                    <p className="font-medium">{new Date(tenant.startDate).toLocaleDateString("vi-VN")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Hợp đồng</p>
                    <p className="font-medium">{tenant.contractNumber}</p>
                    <p className="text-xs text-gray-500">
                      Đến {new Date(tenant.contractEndDate).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tiền thuê</p>
                    <p className="font-bold text-lg">{tenant.rentAmount.toLocaleString()}₫</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tiền cọc</p>
                    <p className="font-medium">{tenant.deposit.toLocaleString()}₫</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Lịch sử thanh toán
                </CardTitle>
                <CardDescription>Theo dõi các khoản thanh toán hàng tháng</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tenant.paymentHistory.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 border rounded-lg gap-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">Tháng {payment.month}</h4>
                          <Badge className={statusColors[payment.status]} size="sm">
                            {statusLabels[payment.status]}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Hạn thanh toán: {new Date(payment.dueDate).toLocaleDateString("vi-VN")}
                        </p>
                        {payment.paidDate && (
                          <p className="text-sm text-green-600">
                            Đã thanh toán: {new Date(payment.paidDate).toLocaleDateString("vi-VN")}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{payment.amount.toLocaleString()}₫</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Service Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Yêu cầu dịch vụ
                </CardTitle>
                <CardDescription>Lịch sử các yêu cầu bảo trì và dịch vụ</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tenant.requests.map((request) => (
                    <div key={request.id} className="p-4 border rounded-lg">
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-medium">{request.title}</h4>
                            <Badge className={statusColors[request.status]} size="sm">
                              {statusLabels[request.status]}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{request.description}</p>
                          <p className="text-xs text-gray-500">
                            Tạo: {new Date(request.createdDate).toLocaleDateString("vi-VN")}
                          </p>
                          {request.completedDate && (
                            <p className="text-xs text-green-600">
                              Hoàn thành: {new Date(request.completedDate).toLocaleDateString("vi-VN")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}


export default function TenantDetailPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TenantDetailPage />
    </Suspense>
  );
}
