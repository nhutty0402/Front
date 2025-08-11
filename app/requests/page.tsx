"use client"

import React from "react"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import axiosClient from "@/lib/axiosClient"
import {
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  Wrench,
  Plus,
  Search,
  Filter,
  Menu,
  Phone,
  Mail,
  X,
  Calendar,
  User,
  Home,
  DollarSign,
  ChevronRight,
  MoreVertical,
} from "lucide-react"

// API types
interface ApiLienHeItem {
  LienHeID: number
  LyDoLienHe: string
  NoiDung: string
  TrangThai: string
  KhachHangID_id: number
  PhongID_id: number
  Time: string
  HoTenKhachHang: string
  SoDienThoai: string
  SoPhong?: string
}

interface ApiKhachHangDetail {
  KhachHangID: number
  HoTenKhachHang: string
  NgaySinh: string
  GioiTinh: string
  CongViec: string
  TinhThanh: string
  QuanHuyen: string
  PhuongXa: string
  DiaChiCuThe: string
  SoCCCD: string
  NgayCapCCCD: string
  NoiCapCCCD: string
  CCCDMT: string
  CCCDMS: string
  SoDienThoai: string
}

interface ApiPhongDetail {
  PhongID: number
  SoPhong: string
  DayPhong: string
  GiaPhong: string
  TrangThaiPhong: string
  MoTaPhong: string
  DienTich: string
  TienIch: string[]
}

interface Request {
  id: string
  type: "maintenance" | "complaint" | "service" | "other"
  title: string
  description: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "in_progress" | "completed" | "rejected"
  roomNumber: string
  tenantName: string
  tenantPhone?: string
  tenantEmail?: string
  createdDate: string
  updatedDate?: string
  assignedTo?: string
  estimatedCost?: number
  actualCost?: number
  notes?: string
  customerDetail?: ApiKhachHangDetail
  roomDetail?: ApiPhongDetail
}

// Xóa dữ liệu mẫu - sẽ lấy từ API

const requestTypes = {
  maintenance: { label: "Bảo trì", icon: Wrench, color: "bg-orange-100 text-orange-800 border-orange-200" },
  complaint: { label: "Khiếu nại", icon: AlertTriangle, color: "bg-red-100 text-red-800 border-red-200" },
  service: { label: "Dịch vụ", icon: MessageSquare, color: "bg-blue-100 text-blue-800 border-blue-200" },
  other: { label: "Khác", icon: MessageSquare, color: "bg-gray-100 text-gray-800 border-gray-200" },
}

const priorityColors = {
  low: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  urgent: "bg-red-100 text-red-800 border-red-200",
}

const priorityLabels = {
  low: "Thấp",
  // medium: "Trung bình",
  high: "Cao",
  urgent: "Khẩn cấp",
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  in_progress: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
}

const statusLabels = {
  pending: "Chờ xử lý",
  in_progress: "Đang xử lý",
  completed: "Hoàn thành",
  rejected: "Từ chối",
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  const BASE_URL = "https://all-oqry.onrender.com"

  useEffect(() => {
    const normalizeType = (reason: string): Request["type"] => {
      const r = reason.toLowerCase()
      if (r.includes("sự cố") || r.includes("hỏng") || r.includes("bảo trì")) return "maintenance"
      if (r.includes("khiếu nại") || r.includes("phàn nàn")) return "complaint"
      if (r.includes("dịch vụ") || r.includes("yêu cầu")) return "service"
      return "other"
    }

    const normalizeStatus = (status: string): Request["status"] => {
      const s = status.toLowerCase()
      if (s.includes("đã xử lý") || s.includes("hoàn thành")) return "completed"
      if (s.includes("đang xử lý")) return "in_progress"
      // if (s.includes("từ chối") || s.includes("reject")) return "rejected"
      return "pending"
    }

    const fetchData = async () => {
      try {
        const { data } = await axiosClient.get<ApiLienHeItem[]>(`${BASE_URL}/api/lienhe`)
        const items = Array.isArray(data) ? data : []

        const mapped: Request[] = await Promise.all(
          items.map(async (it) => {
            const [customerRes, roomRes] = await Promise.all([
              axiosClient.get<ApiKhachHangDetail>(`${BASE_URL}/api/khachhang/${it.KhachHangID_id}`),
              axiosClient.get<ApiPhongDetail>(`${BASE_URL}/api/phong/${it.PhongID_id}`),
            ])

            const customer = customerRes.data
            const room = roomRes.data

            return {
              id: String(it.LienHeID),
              type: normalizeType(it.LyDoLienHe || ""),
              title: it.LyDoLienHe,
              description: it.NoiDung,
              priority: "medium",
              status: normalizeStatus(it.TrangThai || ""),
              roomNumber: room?.SoPhong || it.SoPhong || "",
              tenantName: it.HoTenKhachHang || customer?.HoTenKhachHang || "",
              tenantPhone: it.SoDienThoai || customer?.SoDienThoai,
              createdDate: new Date(it.Time).toISOString().split("T")[0],
              customerDetail: customer,
              roomDetail: room,
            }
          }),
        )

        setRequests(mapped)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load requests from API", error)
      }
    }

    fetchData()
  }, [])

  const filteredRequests = requests.filter((request) => {
    const matchesType = filterType === "all" || request.type === filterType
    const matchesStatus = filterStatus === "all" || request.status === filterStatus
    const matchesPriority = filterPriority === "all" || request.priority === filterPriority
    const matchesSearch =
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesType && matchesStatus && matchesPriority && matchesSearch
  })

  // Calculate stats
  const pendingRequests = requests.filter((r) => r.status === "pending").length
  const urgentRequests = requests.filter((r) => r.priority === "urgent").length
  const inProgressRequests = requests.filter((r) => r.status === "in_progress").length
  const completedToday = requests.filter(
    (r) => r.status === "completed" && r.updatedDate === new Date().toISOString().split("T")[0],
  ).length

  const handleAddRequest = (formData: FormData) => {
    const newRequest: Request = {
      id: Date.now().toString(),
      type: formData.get("type") as Request["type"],
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      priority: formData.get("priority") as Request["priority"],
      status: "pending",
      roomNumber: formData.get("roomNumber") as string,
      tenantName: formData.get("tenantName") as string,
      tenantPhone: (formData.get("tenantPhone") as string) || undefined,
      tenantEmail: (formData.get("tenantEmail") as string) || undefined,
      createdDate: new Date().toISOString().split("T")[0],
      estimatedCost: Number.parseInt(formData.get("estimatedCost") as string) || undefined,
    }
    setRequests([newRequest, ...requests])
    setIsAddDialogOpen(false)
  }

  const handleDeleteRequest = (id: string) => {
    // Optimistic UI delete
    const prev = requests
    setRequests(requests.filter((r) => r.id !== id))
    axiosClient
      .delete(`${BASE_URL}/api/lienhe/${id}`)
      .catch((err) => {
        // rollback
        // eslint-disable-next-line no-console
        console.error("Delete request failed", err)
        setRequests(prev)
      })
  }

  const handleUpdateStatus = async (id: string, status: Request["status"]) => {
    const statusToApi = (s: Request["status"]) => {
      switch (s) {
        case "completed":
          return "Đã xử lý"
        case "in_progress":
          return "Đang xử lý"
        case "rejected":
          return "Từ chối"
        default:
          return "Chờ xử lý"
      }
    }

    const prev = requests
    setRequests(
      requests.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              updatedDate: new Date().toISOString().split("T")[0],
            }
          : r,
      ),
    )

    try {
      await axiosClient.patch(`${BASE_URL}/api/lienhe/${id}/trangthai`, {
        TrangThai: statusToApi(status),
      })
    } catch (err) {
      // rollback
      // eslint-disable-next-line no-console
      console.error("Update status failed", err)
      setRequests(prev)
    }
  }

  const handleViewDetails = (request: Request) => {
    setSelectedRequest(request)
    setIsDetailDialogOpen(true)
  }

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString("vi-VN")} VNĐ`
  }

  const formatCurrencyShort = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M VNĐ`
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K VNĐ`
    }
    return `${amount.toLocaleString("vi-VN")} VNĐ`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
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
        {/* Mobile Header - Improved */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 lg:hidden">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Yêu cầu</h1>
                <p className="text-sm text-gray-500">{filteredRequests.length} yêu cầu</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            {/* Quick Actions Row */}
            <div className="flex gap-2">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  {/* <Button size="sm" className="flex-1">
                    <Plus className="h-4 w-4 mr-1" />
                    Thêm
                  </Button> */}
                </DialogTrigger>
              </Dialog>
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4 mr-1" />
                Lọc
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý Yêu cầu</h1>
              <p className="text-gray-600">Xử lý yêu cầu và khiếu nại từ khách thuê</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                {/* <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm yêu cầu mới
                </Button> */}
              </DialogTrigger>
            </Dialog>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 lg:p-6 space-y-4 lg:space-y-6">
          {/* Stats Cards - Mobile Optimized */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            <Card className="p-3 lg:p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 lg:p-2 rounded-full bg-yellow-100">
                  <Clock className="h-3 w-3 lg:h-4 lg:w-4 text-yellow-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs lg:text-sm font-medium text-gray-600">Chờ xử lý</p>
                <p className="text-lg lg:text-2xl font-bold text-yellow-600">{pendingRequests}</p>
              </div>
            </Card>

            {/* <Card className="p-3 lg:p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 lg:p-2 rounded-full bg-red-100">
                  <AlertTriangle className="h-3 w-3 lg:h-4 lg:w-4 text-red-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs lg:text-sm font-medium text-gray-600">Khẩn cấp</p>
                <p className="text-lg lg:text-2xl font-bold text-red-600">{urgentRequests}</p>
              </div>
            </Card> */}

            <Card className="p-3 lg:p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 lg:p-2 rounded-full bg-blue-100">
                  <Wrench className="h-3 w-3 lg:h-4 lg:w-4 text-blue-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs lg:text-sm font-medium text-gray-600">Đang xử lý</p>
                <p className="text-lg lg:text-2xl font-bold text-blue-600">{inProgressRequests}</p>
              </div>
            </Card>

            <Card className="p-3 lg:p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 lg:p-2 rounded-full bg-green-100">
                  <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4 text-green-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs lg:text-sm font-medium text-gray-600">Hoàn thành</p>
                <p className="text-lg lg:text-2xl font-bold text-green-600">{completedToday}</p>
              </div>
            </Card>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm yêu cầu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <Card className="lg:hidden p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Bộ lọc</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {/* <div>
                    <Label className="text-xs text-gray-600 mb-1 block">Loại</Label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Tất cả" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả loại</SelectItem>
                        <SelectItem value="maintenance">Bảo trì</SelectItem>
                        <SelectItem value="complaint">Khiếu nại</SelectItem>
                        <SelectItem value="service">Dịch vụ</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div> */}

                  <div>
                    <Label className="text-xs text-gray-600 mb-1 block">Trạng thái</Label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Tất cả" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="pending">Chờ xử lý</SelectItem>
                        <SelectItem value="in_progress">Đang xử lý</SelectItem>
                        <SelectItem value="completed">Hoàn thành</SelectItem>
                        {/* <SelectItem value="rejected">Từ chối</SelectItem> */}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* <div>
                  <Label className="text-xs text-gray-600 mb-1 block">Mức độ ưu tiên</Label>
                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Tất cả mức độ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả mức độ</SelectItem>
                      <SelectItem value="urgent">Khẩn cấp</SelectItem>
                      <SelectItem value="high">Cao</SelectItem>
                      <SelectItem value="medium">Trung bình</SelectItem>
                      <SelectItem value="low">Thấp</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}

                <Button
                  variant="outline"
                  onClick={() => {
                    setFilterType("all")
                    setFilterStatus("all")
                    setFilterPriority("all")
                    setSearchTerm("")
                  }}
                  className="w-full h-9"
                  size="sm"
                >
                  Xóa bộ lọc
                </Button>
              </div>
            </Card>
          )}

          {/* Desktop Filters */}
          <div className="hidden lg:flex gap-4">
            {/* <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="maintenance">Bảo trì</SelectItem>
                <SelectItem value="complaint">Khiếu nại</SelectItem>
                <SelectItem value="service">Dịch vụ</SelectItem>
                <SelectItem value="other">Khác</SelectItem>
              </SelectContent>
            </Select> */}

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="in_progress">Đang xử lý</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="rejected">Từ chối</SelectItem>
              </SelectContent>
            </Select>
{/* 
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo mức độ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả mức độ</SelectItem>
                <SelectItem value="urgent">Khẩn cấp</SelectItem>
                <SelectItem value="high">Cao</SelectItem>
                <SelectItem value="medium">Trung bình</SelectItem>
                <SelectItem value="low">Thấp</SelectItem>
              </SelectContent>
            </Select> */}

            <Button
              variant="outline"
              onClick={() => {
                setFilterType("all")
                setFilterStatus("all")
                setFilterPriority("all")
                setSearchTerm("")
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>

          {/* Requests List - Mobile Optimized */}
          <div className="space-y-3">
            {filteredRequests.map((request) => {
              const typeInfo = requestTypes[request.type]
              const TypeIcon = typeInfo.icon

              return (
                <Card key={request.id} className="p-3 lg:p-4">
                  <div className="space-y-3">
                    {/* Header Row */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="p-2 rounded-full bg-gray-100 flex-shrink-0">
                          <TypeIcon className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 text-sm lg:text-base truncate">{request.title}</h3>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {/* <Badge variant="outline" className={`text-xs ${priorityColors[request.priority]}`}>
                              {priorityLabels[request.priority]}
                            </Badge> */}
                            <Badge variant="outline" className={`text-xs ${statusColors[request.status]}`}>
                              {statusLabels[request.status]}
                            </Badge>
                            <Badge variant="outline" className={`text-xs ${typeInfo.color}`}>
                              {typeInfo.label}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(request)}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 line-clamp-2 lg:line-clamp-none">{request.description}</p>

                    {/* Details Row */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Home className="h-3 w-3" />
                          <span>{request.roomNumber}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span className="truncate max-w-20">{request.tenantName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(request.createdDate)}</span>
                        </div>
                        {request.estimatedCost && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            <span className="lg:hidden">{formatCurrencyShort(request.estimatedCost)}</span>
                            <span className="hidden lg:inline">{formatCurrency(request.estimatedCost)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Assigned To */}
                    {request.assignedTo && (
                      <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        Phụ trách: {request.assignedTo}
                      </div>
                    )}

                    {/* Action Buttons Row */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      {/* Contact Buttons */}
                      <div className="flex gap-1">
                        {/* {request.tenantPhone && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => window.open(`tel:${request.tenantPhone}`)}
                          >
                            <Phone className="h-3 w-3" />
                          </Button>
                        )} */}
                        {request.tenantEmail && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => window.open(`mailto:${request.tenantEmail}`)}
                          >
                            <Mail className="h-3 w-3" />
                          </Button>
                        )}
                      </div>

                      {/* Status Action Buttons */}
                      <div className="flex gap-2">
                        {request.status === "pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateStatus(request.id, "in_progress")}
                              className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200 h-8 text-xs"
                            >
                              Bắt đầu
                            </Button>
                            {/* <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateStatus(request.id, "rejected")}
                              className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200 h-8 text-xs"
                            >
                              Từ chối
                            </Button> */}
                          </>
                        )}
                        {request.status === "in_progress" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(request.id, "completed")}
                            className="bg-green-50 text-green-600 hover:bg-green-100 border-green-200 h-8 text-xs"
                          >
                            Hoàn thành
                          </Button>
                        )}

                        {/* More Actions */}
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8 px-2 text-xs"
                          onClick={() => handleDeleteRequest(request.id)}
                        >
                          Xóa
                        </Button>
                        {/* <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-3 w-3" />
                        </Button> */}
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Empty State */}
          {filteredRequests.length === 0 && (
            <Card className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có yêu cầu nào</h3>
              <p className="text-gray-600 mb-4">Thêm yêu cầu mới để bắt đầu quản lý</p>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  {/* <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm yêu cầu đầu tiên
                  </Button> */}
                </DialogTrigger>
              </Dialog>
            </Card>
          )}
        </div>
      </div>

      {/* Add Request Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="mx-4 max-w-md max-h-[90vh] overflow-y-auto">
          <form action={handleAddRequest}>
            {/* <DialogHeader>
              <DialogTitle>Thêm yêu cầu mới</DialogTitle>
              <DialogDescription>Tạo yêu cầu mới từ khách thuê</DialogDescription>
            </DialogHeader> */}
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                {/* <div className="space-y-2">
                  <Label htmlFor="type">Loại yêu cầu</Label>
                  <Select name="type" defaultValue="maintenance">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maintenance">Bảo trì</SelectItem>
                      <SelectItem value="complaint">Khiếu nại</SelectItem>
                      <SelectItem value="service">Dịch vụ</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Mức độ ưu tiên</Label>
                  <Select name="priority" defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Thấp</SelectItem>
                      <SelectItem value="medium">Trung bình</SelectItem>
                      <SelectItem value="high">Cao</SelectItem>
                      <SelectItem value="urgent">Khẩn cấp</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề</Label>
                <Input id="title" name="title" placeholder="Mô tả ngắn gọn vấn đề" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả chi tiết</Label>
                <Textarea id="description" name="description" placeholder="Mô tả chi tiết vấn đề" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roomNumber">Số phòng</Label>
                  <Input id="roomNumber" name="roomNumber" placeholder="A101" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tenantName">Tên khách thuê</Label>
                  <Input id="tenantName" name="tenantName" placeholder="Nguyễn Văn A" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tenantPhone">Số điện thoại</Label>
                  <Input id="tenantPhone" name="tenantPhone" placeholder="0901234567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tenantEmail">Email</Label>
                  <Input id="tenantEmail" name="tenantEmail" type="email" placeholder="email@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedCost">Chi phí ước tính (VNĐ)</Label>
                <Input id="estimatedCost" name="estimatedCost" type="number" placeholder="500000" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                Tạo yêu cầu
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Request Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="mx-4 max-w-md max-h-[90vh] overflow-y-auto">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {React.createElement(requestTypes[selectedRequest.type].icon, {
                    className: "h-5 w-5",
                  })}
                  {selectedRequest.title}
                </DialogTitle>
                <DialogDescription>Chi tiết yêu cầu #{selectedRequest.id}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  {/* <Badge variant="outline" className={priorityColors[selectedRequest.priority]}>
                    {priorityLabels[selectedRequest.priority]}
                  </Badge> */}
                  <Badge variant="outline" className={statusColors[selectedRequest.status]}>
                    {statusLabels[selectedRequest.status]}
                  </Badge>
                  <Badge variant="outline" className={requestTypes[selectedRequest.type].color}>
                    {requestTypes[selectedRequest.type].label}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Mô tả</h4>
                  <p className="text-sm text-gray-600">{selectedRequest.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-1">Thông tin phòng</h4>
                    <p className="text-sm text-gray-600">Phòng {selectedRequest.roomNumber}</p>
                    <p className="text-sm text-gray-600">{selectedRequest.tenantName}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Liên hệ</h4>
                    {selectedRequest.tenantPhone && (
                      <p className="text-sm text-gray-600">{selectedRequest.tenantPhone}</p>
                    )}
                    {selectedRequest.tenantEmail && (
                      <p className="text-sm text-gray-600">{selectedRequest.tenantEmail}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-1">Ngày tạo</h4>
                    <p className="text-sm text-gray-600">{formatDate(selectedRequest.createdDate)}</p>
                  </div>
                  {selectedRequest.updatedDate && (
                    <div>
                      <h4 className="font-medium mb-1">Cập nhật lần cuối</h4>
                      <p className="text-sm text-gray-600">{formatDate(selectedRequest.updatedDate)}</p>
                    </div>
                  )}
                </div>
                {selectedRequest.estimatedCost && (
                  <div>
                    <h4 className="font-medium mb-1">Chi phí ước tính</h4>
                    <p className="text-sm text-gray-600">{formatCurrency(selectedRequest.estimatedCost)}</p>
                  </div>
                )}
                {selectedRequest.actualCost && (
                  <div>
                    <h4 className="font-medium mb-1">Chi phí thực tế</h4>
                    <p className="text-sm text-gray-600">{formatCurrency(selectedRequest.actualCost)}</p>
                  </div>
                )}
                {selectedRequest.assignedTo && (
                  <div>
                    <h4 className="font-medium mb-1">Người phụ trách</h4>
                    <p className="text-sm text-gray-600">{selectedRequest.assignedTo}</p>
                  </div>
                )}
                {selectedRequest.notes && (
                  <div>
                    <h4 className="font-medium mb-1">Ghi chú</h4>
                    <p className="text-sm text-gray-600">{selectedRequest.notes}</p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <div className="flex gap-2 w-full">
                  {selectedRequest.status === "pending" && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleUpdateStatus(selectedRequest.id, "in_progress")
                          setIsDetailDialogOpen(false)
                        }}
                        className="flex-1"
                      >
                        Bắt đầu xử lý
                      </Button>
                      {/* <Button
                        variant="outline"
                        onClick={() => {
                          handleUpdateStatus(selectedRequest.id, "rejected")
                          setIsDetailDialogOpen(false)
                        }}
                        className="flex-1 text-red-600 hover:text-red-700"
                      >
                        Từ chối
                      </Button> */}
                    </>
                  )}
                  {selectedRequest.status === "in_progress" && (
                    <Button
                      onClick={() => {
                        handleUpdateStatus(selectedRequest.id, "completed")
                        setIsDetailDialogOpen(false)
                      }}
                      className="flex-1"
                    >
                      Hoàn thành
                    </Button>
                  )}
                  {selectedRequest.status !== "in_progress" && selectedRequest.status !== "completed" && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleUpdateStatus(selectedRequest.id, "in_progress")
                        setIsDetailDialogOpen(false)
                      }}
                      className="flex-1"
                    >
                      Đánh dấu đang xử lý
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleDeleteRequest(selectedRequest.id)
                      setIsDetailDialogOpen(false)
                    }}
                  >
                    Xóa yêu cầu
                  </Button>
                  <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                    Đóng
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
