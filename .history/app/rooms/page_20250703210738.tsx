"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
import { Textarea } from "@/components/ui/textarea"
import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { ContractNotifications } from "@/components/contract-notifications"
import {
  Plus,
  Edit,
  Trash2,
  Wifi,
  Snowflake,
  Car,
  Tv,
  Building2,
  Menu,
  Eye,
  Wrench,
  Search,
  Filter,
  Calendar,
} from "lucide-react"

interface Building {
  id: string
  name: string
  description?: string
}

interface Room {
  id: string
  number: string
  building: string
  floor: number
  area: number
  price: number
  status: "available" | "occupied" | "maintenance"
  amenities: string[]
  tenant?: string
  tenantPhone?: string
  tenantEmail?: string
  description?: string
  contractStartDate?: string
  contractEndDate?: string
}

interface ContractNotification {
  id: string
  roomNumber: string
  building: string
  tenantName: string
  tenantPhone?: string
  tenantEmail?: string
  contractEndDate: string
  daysUntilExpiry: number
  status: "expired" | "expiring" | "active"
  notificationSent: boolean
  lastNotificationDate?: string
}

const mockBuildings: Building[] = [
  { id: "A", name: "Dãy A", description: "Dãy phòng chính" },
  { id: "B", name: "Dãy B", description: "Dãy phòng phụ" },
  { id: "C", name: "Dãy C", description: "Dãy phòng VIP" },
  { id: "D", name: "Dãy D", description: "Dãy phòng mới" },
]
const contractStatus = getContractStatus(room.contractEndDate);
const mockRooms: Room[] = [
  {
    id: "1",
    number: "A101",
    building: "A",
    floor: 1,
    area: 20,
    price: 3000000,
    status: "occupied",
    amenities: ["wifi", "ac", "parking"],
    tenant: "Nguyễn Văn A",
    tenantPhone: "0901234567",
    tenantEmail: "nguyenvana@email.com",
    description: "Phòng đầy đủ tiện nghi",
    contractStartDate: "2024-01-15",
    contractEndDate: "2025-01-14", // Sắp hết hạn trong 15 ngày
  },
  {
    id: "2",
    number: "A102",
    building: "A",
    floor: 1,
    area: 18,
    price: 2800000,
    status: "available",
    amenities: ["wifi", "ac"],
    description: "Phòng thoáng mát",
  },
  {
    id: "3",
    number: "B201",
    building: "B",
    floor: 2,
    area: 22,
    price: 3200000,
    status: "occupied",
    amenities: ["wifi", "ac", "tv"],
    tenant: "Trần Thị B",
    tenantPhone: "0907654321",
    tenantEmail: "tranthib@email.com",
    contractStartDate: "2024-06-01",
    contractEndDate: "2025-05-31",
  },
  {
    id: "4",
    number: "C202",
    building: "C",
    floor: 2,
    area: 25,
    price: 3500000,
    status: "maintenance",
    amenities: ["wifi", "ac", "tv"],
  },
  {
    id: "5",
    number: "D301",
    building: "D",
    floor: 3,
    area: 20,
    price: 3100000,
    status: "available",
    amenities: ["wifi", "ac"],
  },
  {
    id: "6",
    number: "A103",
    building: "A",
    floor: 1,
    area: 19,
    price: 2900000,
    status: "occupied",
    amenities: ["wifi", "ac"],
    tenant: "Lê Văn C",
    tenantPhone: "0903456789",
    tenantEmail: "levanc@email.com",
    contractStartDate: "2023-12-01",
    contractEndDate: "2024-11-30", // Đã hết hạn 30 ngày
    notificationSent: false,
  },
  {
    id: "7",
    number: "B202",
    building: "B",
    floor: 2,
    area: 21,
    price: 3100000,
    status: "occupied",
    amenities: ["wifi", "ac", "parking"],
    tenant: "Phạm Thị D",
    tenantPhone: "0909876543",
    tenantEmail: "phamthid@email.com",
    contractStartDate: "2024-10-01",
    contractEndDate: "2024-12-31", // Sắp hết hạn trong 3 ngày
    notificationSent: false,
  },
  {
    id: "8",
    number: "C301",
    building: "C",
    floor: 3,
    area: 23,
    price: 3400000,
    status: "occupied",
    amenities: ["wifi", "ac", "tv"],
    tenant: "Hoàng Văn E",
    tenantPhone: "0905432167",
    tenantEmail: "hoangvane@email.com",
    contractStartDate: "2024-02-01",
    contractEndDate: "2025-01-31", // Sắp hết hạn trong 33 ngày
    notificationSent: true,
    lastNotificationDate: "2024-12-01",
  },
]

const amenityIcons = {
  wifi: Wifi,
  ac: Snowflake,
  parking: Car,
  tv: Tv,
}

const statusColors = {
  available: "bg-green-500",
  occupied: "bg-blue-500",
  maintenance: "bg-orange-500",
}

const statusLabels = {
  available: "Trống",
  occupied: "Đã thuê",
  maintenance: "Bảo trì",
}

// Helper function to calculate days until contract expiry
const getDaysUntilExpiry = (endDate: string): number => {
  const today = new Date()
  const expiry = new Date(endDate)
  const diffTime = expiry.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// Helper function to get contract status
const getContractStatus = (endDate: string): "expired" | "expiring" | "active" => {
  const daysUntilExpiry = getDaysUntilExpiry(endDate)
  if (daysUntilExpiry < 0) return "expired"
  if (daysUntilExpiry <= 30) return "expiring" // Thông báo trước 1 tháng
  return "active"
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>(mockRooms)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [filterBuilding, setFilterBuilding] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [contractNotifications, setContractNotifications] = useState<ContractNotification[]>([])

  // Generate contract notifications from rooms data
  const generateContractNotifications = (): ContractNotification[] => {
    return rooms
      .filter((room) => room.status === "occupied" && room.contractEndDate)
      .map((room) => {
        const daysUntilExpiry = getDaysUntilExpiry(room.contractEndDate!)
        const status = getContractStatus(room.contractEndDate!)

        return {
          id: room.id,
          roomNumber: room.number,
          building: room.building,
          tenantName: room.tenant!,
          tenantPhone: room.tenantPhone,
          tenantEmail: room.tenantEmail,
          contractEndDate: room.contractEndDate!,
          daysUntilExpiry,
          status,
          notificationSent: (room as any).notificationSent || false,
          lastNotificationDate: (room as any).lastNotificationDate,
        }
      })
      .filter((notification) => notification.status !== "active") // Only show expired or expiring
  }

  // Update notifications when rooms change
  useState(() => {
    setContractNotifications(generateContractNotifications())
  })

  const filteredRooms = rooms.filter((room) => {
    const matchesStatus = filterStatus === "all" || room.status === filterStatus
    const matchesBuilding = filterBuilding === "all" || room.building === filterBuilding
    const matchesSearch =
      room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.tenant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.description?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesStatus && matchesBuilding && matchesSearch
  })

  const handleAddRoom = (formData: FormData) => {
    const newRoom: Room = {
      id: Date.now().toString(),
      number: formData.get("number") as string,
      building: formData.get("building") as string,
      floor: Number.parseInt(formData.get("floor") as string),
      area: Number.parseInt(formData.get("area") as string),
      price: Number.parseInt(formData.get("price") as string),
      status: formData.get("status") as Room["status"],
      amenities: [],
      description: formData.get("description") as string,
    }
    setRooms([...rooms, newRoom])
    setIsAddDialogOpen(false)
  }

  const handleDeleteRoom = (id: string) => {
    setRooms(rooms.filter((room) => room.id !== id))
  }

  const handleMarkNotified = (contractId: string) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === contractId
          ? {
              ...room,
              notificationSent: true,
              lastNotificationDate: new Date().toISOString().split("T")[0],
            }
          : room,
      ),
    )
    setContractNotifications(generateContractNotifications())
  }

  const handleExtendContract = (contractId: string) => {
    const room = rooms.find((r) => r.id === contractId)
    if (room) {
      // Simulate contract extension - extend by 1 year
      const currentEndDate = new Date(room.contractEndDate!)
      const newEndDate = new Date(currentEndDate.setFullYear(currentEndDate.getFullYear() + 1))

      setRooms((prevRooms) =>
        prevRooms.map((r) =>
          r.id === contractId
            ? {
                ...r,
                contractEndDate: newEndDate.toISOString().split("T")[0],
                notificationSent: false,
              }
            : r,
        ),
      )
      setContractNotifications(generateContractNotifications())
      alert(`Đã gia hạn hợp đồng phòng ${room.building}${room.number} đến ${newEndDate.toLocaleDateString("vi-VN")}`)
    }
  }

  const handleContactTenant = (contractId: string, method: "phone" | "email") => {
    const room = rooms.find((r) => r.id === contractId)
    if (room) {
      if (method === "phone" && room.tenantPhone) {
        window.open(`tel:${room.tenantPhone}`)
      } else if (method === "email" && room.tenantEmail) {
        const subject = `Thông báo gia hạn hợp đồng phòng ${room.building}${room.number}`
        const body = `Xin chào ${room.tenant},\n\nHợp đồng thuê phòng ${room.building}${room.number} của bạn sẽ hết hạn vào ngày ${new Date(room.contractEndDate!).toLocaleDateString("vi-VN")}.\n\nVui lòng liên hệ để thảo luận về việc gia hạn hợp đồng.\n\nTrân trọng,\nBan quản lý`
        window.open(
          `mailto:${room.tenantEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
        )
      }
    }
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
              <h1 className="text-lg font-semibold text-gray-900">Quản lý Phòng</h1>
              <p className="text-sm text-gray-500">{filteredRooms.length} phòng</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Quản lý Phòng trọ</h1>
              <p className="text-gray-600">Quản lý thông tin các phòng trọ</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm phòng mới
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] mx-4">
                <form action={handleAddRoom}>
                  <DialogHeader>
                    <DialogTitle>Thêm phòng mới</DialogTitle>
                    <DialogDescription>Nhập thông tin phòng trọ mới</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="number">Số phòng</Label>
                      <Input id="number" name="number" placeholder="P103" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="building">Dãy</Label>
                      <Select name="building" defaultValue="A">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {mockBuildings.map((building) => (
                            <SelectItem key={building.id} value={building.id}>
                              {building.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="floor">Tầng</Label>
                        <Input id="floor" name="floor" type="number" placeholder="1" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="area">Diện tích (m²)</Label>
                        <Input id="area" name="area" type="number" placeholder="20" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Giá thuê (VND)</Label>
                      <Input id="price" name="price" type="number" placeholder="3000000" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Trạng thái</Label>
                      <Select name="status" defaultValue="available">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Trống</SelectItem>
                          <SelectItem value="occupied">Đã thuê</SelectItem>
                          <SelectItem value="maintenance">Bảo trì</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Mô tả</Label>
                      <Textarea id="description" name="description" placeholder="Mô tả phòng..." />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full">
                      Thêm phòng
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-6 space-y-4">
          {/* Contract Notifications */}
          <ContractNotifications
            contracts={contractNotifications}
            onMarkNotified={handleMarkNotified}
            onExtendContract={handleExtendContract}
            onContactTenant={handleContactTenant}
          />

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm phòng, khách thuê..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden space-y-3 p-4 bg-white rounded-lg border">
              <div className="grid grid-cols-2 gap-3">
                <Select value={filterBuilding} onValueChange={setFilterBuilding}>
                  <SelectTrigger>
                    <SelectValue placeholder="Dãy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả dãy</SelectItem>
                    {mockBuildings.map((building) => (
                      <SelectItem key={building.id} value={building.id}>
                        {building.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="available">Trống</SelectItem>
                    <SelectItem value="occupied">Đã thuê</SelectItem>
                    <SelectItem value="maintenance">Bảo trì</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setFilterBuilding("all")
                  setFilterStatus("all")
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
            <Select value={filterBuilding} onValueChange={setFilterBuilding}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo dãy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả dãy</SelectItem>
                {mockBuildings.map((building) => (
                  <SelectItem key={building.id} value={building.id}>
                    {building.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="available">Trống</SelectItem>
                <SelectItem value="occupied">Đã thuê</SelectItem>
                <SelectItem value="maintenance">Bảo trì</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setFilterBuilding("all")
                setFilterStatus("all")
                setSearchTerm("")
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>

          {/* Add Room Button - Mobile */}
          <div className="lg:hidden">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm phòng mới
                </Button>
              </DialogTrigger>
              <DialogContent className="mx-4 max-w-sm">
                <form action={handleAddRoom}>
                  <DialogHeader>
                    <DialogTitle>Thêm phòng mới</DialogTitle>
                    <DialogDescription>Nhập thông tin phòng trọ mới</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="number">Số phòng</Label>
                      <Input id="number" name="number" placeholder="P103" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="building">Dãy</Label>
                      <Select name="building" defaultValue="A">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {mockBuildings.map((building) => (
                            <SelectItem key={building.id} value={building.id}>
                              {building.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="floor">Tầng</Label>
                        <Input id="floor" name="floor" type="number" placeholder="1" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="area">Diện tích (m²)</Label>
                        <Input id="area" name="area" type="number" placeholder="20" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Giá thuê (VND)</Label>
                      <Input id="price" name="price" type="number" placeholder="3000000" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Trạng thái</Label>
                      <Select name="status" defaultValue="available">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Trống</SelectItem>
                          <SelectItem value="occupied">Đã thuê</SelectItem>
                          <SelectItem value="maintenance">Bảo trì</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Mô tả</Label>
                      <Textarea id="description" name="description" placeholder="Mô tả phòng..." />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full">
                      Thêm phòng
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredRooms.map((room) => {
              const contractStatus = room.contractEndDate ? getContractStatus(room.contractEndDate) : null
              const daysUntilExpiry = room.contractEndDate ? getDaysUntilExpiry(room.contractEndDate) : null

              return (
                <Card key={room.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{room.number}</h3>
                          <p className="text-sm text-gray-500">
                            {room.building} - Tầng {room.floor}
                          </p>
                        </div>
                     <div className="flex flex-col items-end gap-1">
                      {/* ĐÃ ĐỔI CODE */}
  <Badge className={`${statusColors[room.status]} text-xs px-2 py-1`}>
    {statusLabels[room.status]}
  </Badge>
  {/* Contract Status Badge */}
  {contractStatus === "expired" && (
    <Badge variant="destructive" className="text-xs px-2 py-1">
      Hết hạn HĐ
    </Badge>
  )}
  {contractStatus === "expiring" && (
    <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs px-2 py-1">
      Sắp hết hạn
    </Badge>
  )}
</div>
                      </div>

                      {/* Details */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Diện tích:</span>
                          <span className="font-medium">{room.area}m²</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Giá thuê:</span>
                          <span className="font-medium text-green-600">{room.price.toLocaleString()}₫</span>
                        </div>
                        {room.tenant && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Khách thuê:</span>
                            <span className="font-medium truncate ml-2">{room.tenant}</span>
                          </div>
                        )}
                        {/* Contract Info */}
                        {room.contractEndDate && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Hết hạn HĐ:</span>
                              <span
                                className={`font-medium ${
                                  contractStatus === "expired"
                                    ? "text-red-600"
                                    : contractStatus === "expiring"
                                      ? "text-orange-600"
                                      : "text-gray-900"
                                }`}
                              >
                                {formatDate(room.contractEndDate)}
                              </span>
                            </div>
                            {daysUntilExpiry !== null && (
                              <div
                                className="text-xs text-center p-1 rounded"
                                style={{
                                  backgroundColor:
                                    contractStatus === "expired"
                                      ? "#fef2f2"
                                      : contractStatus === "expiring"
                                        ? "#fff7ed"
                                        : "#f9fafb",
                                  color:
                                    contractStatus === "expired"
                                      ? "#dc2626"
                                      : contractStatus === "expiring"
                                        ? "#ea580c"
                                        : "#6b7280",
                                }}
                              >
                                {daysUntilExpiry < 0
                                  ? `Đã hết hạn ${Math.abs(daysUntilExpiry)} ngày`
                                  : `Còn ${daysUntilExpiry} ngày`}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Amenities */}
                      <div className="flex gap-2 flex-wrap">
                        {room.amenities.map((amenity) => {
                          const Icon = amenityIcons[amenity as keyof typeof amenityIcons]
                          return Icon ? (
                            <div
                              key={amenity}
                              className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded"
                            >
                              <Icon className="h-3 w-3" />
                            </div>
                          ) : null
                        })}
                      </div>

                      {room.description && <p className="text-xs text-gray-600 line-clamp-2">{room.description}</p>}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1 text-xs bg-transparent">
                          <Edit className="h-3 w-3 mr-1" />
                          Sửa
                        </Button>

                        {room.status === "available" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200 text-xs"
                            onClick={() => {
                              window.location.href = `/contracts?room=${room.number}&building=${room.building}`
                            }}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Thêm HĐ
                          </Button>
                        ) : room.tenant ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className={`flex-1 text-xs ${
                              contractStatus === "expired" || contractStatus === "expiring"
                                ? "bg-orange-50 text-orange-600 hover:bg-orange-100 border-orange-200"
                                : "bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                            }`}
                            onClick={() => {
                              if (contractStatus === "expired" || contractStatus === "expiring") {
                                handleExtendContract(room.id)
                              } else {
                                alert(`Xem chi tiết khách thuê: ${room.tenant}`)
                              }
                            }}
                          >
                            {contractStatus === "expired" || contractStatus === "expiring" ? (
                              <>
                                <Calendar className="h-3 w-3 mr-1" />
                                Gia hạn
                              </>
                            ) : (
                              <>
                                <Eye className="h-3 w-3 mr-1" />
                                Chi tiết
                              </>
                            )}
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" className="flex-1 text-xs bg-transparent">
                            <Wrench className="h-3 w-3 mr-1" />
                            Bảo trì
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 bg-transparent"
                          onClick={() => handleDeleteRoom(room.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredRooms.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có phòng nào</h3>
              <p className="text-gray-600">Thêm phòng mới để bắt đầu quản lý</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
