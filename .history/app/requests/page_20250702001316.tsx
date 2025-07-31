"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  Wrench,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Menu,
  Phone,
  Mail,
} from "lucide-react"

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
}

const mockRequests: Request[] = [
  {
    id: "1",
    type: "maintenance",
    title: "Điều hòa không hoạt động",
    description: "Điều hòa trong phòng không thể bật được, có thể do hỏng remote hoặc máy lạnh",
    priority: "high",
    status: "pending",
    roomNumber: "A101",
    tenantName: "Nguyễn Văn A",
    tenantPhone: "0901234567",
    tenantEmail: "nguyenvana@email.com",
    createdDate: "2024-12-28",
    estimatedCost: 500000,
  },
  {
    id: "2",
    type: "complaint",
    title: "Tiếng ồn từ phòng bên cạnh",
    description: "Phòng bên cạnh thường xuyên gây tiếng ồn vào ban đêm, ảnh hưởng đến giấc ngủ",
    priority: "medium",
    status: "in_progress",
    roomNumber: "B201",
    tenantName: "Trần Thị B",
    tenantPhone: "0907654321",
    createdDate: "2024-12-27",
    updatedDate: "2024-12-28",
    assignedTo: "Bảo vệ Minh",
    notes: "Đã nhắc nhở phòng B202, theo dõi thêm",
  },
  {
    id: "3",
    type: "service",
    title: "Yêu cầu thêm giường",
    description: "Muốn thuê thêm một chiếc giường đơn cho phòng",
    priority: "low",
    status: "completed",
    roomNumber: "C202",
    tenantName: "Lê Văn C",
    tenantPhone: "0903456789",
    createdDate: "2024-12-25",
    updatedDate: "2024-12-27",
    assignedTo: "Kỹ thuật Hùng",
    estimatedCost: 1500000,
    actualCost: 1400000,
    notes: "Đã lắp đặt giường mới, khách hàng hài lòng",
  },
  {
    id: "4",
    type: "maintenance",
    title: "Rò rỉ nước từ vòi sen",
    description: "Vòi sen trong phòng tắm bị rò rỉ nước liên tục",
    priority: "urgent",
    status: "pending",
    roomNumber: "D301",
    tenantName: "Phạm Thị D",
    tenantPhone: "0909876543",
    createdDate: "2024-12-28",
    estimatedCost: 200000,
  },
  {
    id: "5",
    type: "other",
    title: "Yêu cầu thay đổi khóa phòng",
    description: "Muốn thay đổi khóa phòng vì lý do bảo mật cá nhân",
    priority: "medium",
    status: "rejected",
    roomNumber: "A103",
    tenantName: "Hoàng Văn E",
    tenantPhone: "0905432167",
    createdDate: "2024-12-26",
    updatedDate: "2024-12-27",
    notes: "Không đủ lý do chính đáng để thay khóa",
  },
]

const requestTypes = {
  maintenance: { label: "Bảo trì", icon: Wrench, color: "bg-orange-500" },
  complaint: { label: "Khiếu nại", icon: AlertTriangle, color: "bg-red-500" },
  service: { label: "Dịch vụ", icon: MessageSquare, color: "bg-blue-500" },
  other: { label: "Khác", icon: MessageSquare, color: "bg-gray-500" },
}

const priorityColors = {
  low: "bg-green-500",
  medium: "bg-yellow-500",
  high: "bg-orange-500",
  urgent: "bg-red-500",
}

const priorityLabels = {
  low: "Thấp",
  medium: "Trung bình",
  high: "Cao",
  urgent: "Khẩn cấp",
}

const statusColors = {
  pending: "bg-yellow-500",
  in_progress: "bg-blue-500",
  completed: "bg-green-500",
  rejected: "bg-red-500",
}

const statusLabels = {
  pending: "Chờ xử lý",
  in_progress: "Đang xử lý",
  completed: "Hoàn thành",
  rejected: "Từ chối",
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>(mockRequests)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

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
    setRequests(requests.filter((r) => r.id !== id))
  }

  const handleUpdateStatus = (id: string, status: Request["status"]) => {
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
  }

  const handleViewDetails = (request: Request) => {
    setSelectedRequest(request)
    setIsDetailDialogOpen(true)
  }

  const formatCurrency = (amount: number) => {
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
        {/* Mobile Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 lg:hidden">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Yêu cầu</h1>
              <p className="text-sm text-gray-500">{filteredRequests.length} yêu cầu</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4" />
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
              <h1 className="text-2xl font-bold text-gray-900">Quản lý Yêu cầu</h1>
              <p className="text-gray-600">Xử lý yêu cầu và khiếu nại từ khách thuê</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm yêu cầu mới
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] mx-4">
                <form action={handleAddRequest}>
                  <DialogHeader>
                    <DialogTitle>Thêm yêu cầu mới</DialogTitle>
                    <DialogDescription>Tạo yêu cầu mới từ khách thuê</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
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
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Tiêu đề</Label>
                      <Input id="title" name="title" placeholder="Mô tả ngắn gọn vấn đề" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Mô tả chi tiết</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Mô tả chi tiết vấn đề hoặc yêu cầu"
                        required
                      />
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
          </div>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chờ xử lý</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{pendingRequests}</div>
                <p className="text-xs text-muted-foreground">Yêu cầu mới</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Khẩn cấp</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{urgentRequests}</div>
                <p className="text-xs text-muted-foreground">Cần xử lý ngay</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đang xử lý</CardTitle>
                <Wrench className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{inProgressRequests}</div>
                <p className="text-xs text-muted-foreground">Đang thực hiện</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hoàn thành hôm nay</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{completedToday}</div>
                <p className="text-xs text-muted-foreground">Đã xong</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm yêu cầu, khách thuê, phòng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden space-y-3 p-4 bg-white rounded-lg border">
                <div className="grid grid-cols-2 gap-3">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả loại</SelectItem>
                      <SelectItem value="maintenance">Bảo trì</SelectItem>
                      <SelectItem value="complaint">Khiếu nại</SelectItem>
                      <SelectItem value="service">Dịch vụ</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="pending">Chờ xử lý</SelectItem>
                      <SelectItem value="in_progress">Đang xử lý</SelectItem>
                      <SelectItem value="completed">Hoàn thành</SelectItem>
                      <SelectItem value="rejected">Từ chối</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Mức độ ưu tiên" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả mức độ</SelectItem>
                    <SelectItem value="urgent">Khẩn cấp</SelectItem>
                    <SelectItem value="high">Cao</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="low">Thấp</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilterType("all")
                    setFilterStatus("all")
                    setFilterPriority("all")
                    setSearchTerm("")
                  }}
                  className="w-full"
                >
                  Xóa bộ lọc
                </Button>
              </div>
            )}

            {/* Desktop Filters */}
            <div className="hidden lg:flex gap-4">
              <Select value={filterType} onValueChange={setFilterType}>
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
              </Select>

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
              </Select>

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
          </div>

          {/* Add Request Button - Mobile */}
          <div className="lg:hidden">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm yêu cầu mới
                </Button>
              </DialogTrigger>
              <DialogContent className="mx-4 max-w-sm">
                <form action={handleAddRequest}>
                  <DialogHeader>
                    <DialogTitle>Thêm yêu cầu mới</DialogTitle>
                    <DialogDescription>Tạo yêu cầu mới từ khách thuê</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                    <div className="space-y-2">
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
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Tiêu đề</Label>
                      <Input id="title" name="title" placeholder="Mô tả ngắn gọn vấn đề" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Mô tả chi tiết</Label>
                      <Textarea id="description" name="description" placeholder="Mô tả chi tiết vấn đề" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="roomNumber">Số phòng</Label>
                      <Input id="roomNumber" name="roomNumber" placeholder="A101" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tenantName">Tên khách thuê</Label>
                      <Input id="tenantName" name="tenantName" placeholder="Nguyễn Văn A" required />
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
          </div>

          {/* Requests List */}
          <div className="space-y-4">
            {filteredRequests.map((request) => {
              const typeInfo = requestTypes[request.type]
              const TypeIcon = typeInfo.icon

              return (
                <Card key={request.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`p-2 rounded-full ${typeInfo.color.replace("bg-", "bg-opacity-20 bg-")}`}>
                          <TypeIcon className={`h-5 w-5 ${typeInfo.color.replace("bg-", "text-")}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{request.title}</h3>
                            <Badge className={priorityColors[request.priority]} size="sm">
                              
                              {priorityLabels[request.priority]}
                            </Badge>
                            <Badge className={statusColors[request.status]} size="sm">
                              {statusLabels[request.status]}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{request.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Phòng {request.roomNumber}</span>
                            <span>•</span>
                            <span>{request.tenantName}</span>
                            <span>•</span>
                            <span>{formatDate(request.createdDate)}</span>
                            {request.estimatedCost && (
                              <>
                                <span>•</span>
                                <span>Ước tính: {formatCurrency(request.estimatedCost)}</span>
                              </>
                            )}
                          </div>
                          {request.assignedTo && (
                            <div className="text-sm text-blue-600 mt-1">Phụ trách: {request.assignedTo}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {request.tenantPhone && (
                          <Button variant="ghost" size="sm" onClick={() => window.open(`tel:${request.tenantPhone}`)}>
                            <Phone className="h-4 w-4" />
                          </Button>
                        )}
                        {request.tenantEmail && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`mailto:${request.tenantEmail}`)}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(request)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteRequest(request.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {/* Quick Actions */}
                    {request.status === "pending" && (
                      <div className="flex gap-2 mt-3 pt-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(request.id, "in_progress")}
                          className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
                        >
                          Bắt đầu xử lý
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(request.id, "rejected")}
                          className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                        >
                          Từ chối
                        </Button>
                      </div>
                    )}
                    {request.status === "in_progress" && (
                      <div className="flex gap-2 mt-3 pt-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(request.id, "completed")}
                          className="bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                        >
                          Hoàn thành
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có yêu cầu nào</h3>
              <p className="text-gray-600">Thêm yêu cầu mới để bắt đầu quản lý</p>
            </div>
          )}
        </div>
      </div>

      {/* Request Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px] mx-4">
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
                <div className="flex gap-2">
                  <Badge className={priorityColors[selectedRequest.priority]} size="sm">
                    {priorityLabels[selectedRequest.priority]}
                  </Badge>
                  <Badge className={statusColors[selectedRequest.status]} size="sm">
                    {statusLabels[selectedRequest.status]}
                  </Badge>
                  <Badge variant="outline">{requestTypes[selectedRequest.type].label}</Badge>
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
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleUpdateStatus(selectedRequest.id, "rejected")
                          setIsDetailDialogOpen(false)
                        }}
                        className="flex-1 text-red-600 hover:text-red-700"
                      >
                        Từ chối
                      </Button>
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
