"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
  Search,
  Filter,
  Calendar,
  Zap,
  Droplets,
  Shield,
  Coffee,
  FileText,
  User,
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
  status: "available" | "occupied" // Remove "maintenance"
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
    contractEndDate: "2025-01-14",
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
    status: "available",
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
]

const availableAmenities = [
  { id: "wifi", name: "WiFi", icon: Wifi },
  { id: "ac", name: "Điều hòa", icon: Snowflake },
  { id: "parking", name: "Chỗ đậu xe", icon: Car },
  { id: "tv", name: "TV", icon: Tv },
  { id: "electricity", name: "Điện", icon: Zap },
  { id: "water", name: "Nước", icon: Droplets },
  { id: "security", name: "An ninh", icon: Shield },
  { id: "kitchen", name: "Bếp chung", icon: Coffee },
]

const amenityIcons = {
  wifi: Wifi,
  ac: Snowflake,
  parking: Car,
  tv: Tv,
  electricity: Zap,
  water: Droplets,
  security: Shield,
  kitchen: Coffee,
}

// Remove maintenance from these objects
const statusColors = {
  available: "bg-green-500",
  occupied: "bg-blue-500",
}

const statusLabels = {
  available: "Trống",
  occupied: "Đã thuê",
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
  if (daysUntilExpiry <= 30) return "expiring"
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
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [isContractDetailsOpen, setIsContractDetailsOpen] = useState(false)
  const [isEditRoomOpen, setIsEditRoomOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [editSelectedAmenities, setEditSelectedAmenities] = useState<string[]>([])
  const [isAddContractOpen, setIsAddContractOpen] = useState(false)
  const [contractRoom, setContractRoom] = useState<Room | null>(null)
  const [extensionMonths, setExtensionMonths] = useState<number>(12)

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
      .filter((notification) => notification.status !== "active")
  }

  const filteredRooms = rooms.filter((room) => {
    const matchesStatus = filterStatus === "all" || room.status === filterStatus
    const matchesBuilding = filterBuilding === "all" || room.building === filterBuilding
    const matchesSearch =
      room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.tenant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.description?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesStatus && matchesBuilding && matchesSearch
  })

  const handleAddRoom = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const newRoom: Room = {
      id: Date.now().toString(),
      number: formData.get("number") as string,
      building: formData.get("building") as string,
      floor: Number.parseInt(formData.get("floor") as string),
      area: Number.parseInt(formData.get("area") as string),
      price: Number.parseInt(formData.get("price") as string),
      status: formData.get("status") as Room["status"],
      amenities: selectedAmenities,
      description: formData.get("description") as string,
    }

    setRooms([...rooms, newRoom])
    setIsAddDialogOpen(false)
    setSelectedAmenities([])
  }

  const handleEditRoom = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!editingRoom) return

    const formData = new FormData(event.currentTarget)

    const updatedRoom: Room = {
      ...editingRoom,
      number: formData.get("number") as string,
      building: formData.get("building") as string,
      floor: Number.parseInt(formData.get("floor") as string),
      area: Number.parseInt(formData.get("area") as string),
      price: Number.parseInt(formData.get("price") as string),
      status: formData.get("status") as Room["status"],
      amenities: editSelectedAmenities,
      description: formData.get("description") as string,
    }

    setRooms(rooms.map((room) => (room.id === editingRoom.id ? updatedRoom : room)))
    setIsEditRoomOpen(false)
    setEditingRoom(null)
    setEditSelectedAmenities([])
  }

  const handleAddContract = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!contractRoom) return

    const formData = new FormData(event.currentTarget)

    const updatedRoom: Room = {
      ...contractRoom,
      status: "occupied",
      tenant: formData.get("tenantName") as string,
      tenantPhone: formData.get("tenantPhone") as string,
      tenantEmail: formData.get("tenantEmail") as string,
      contractStartDate: formData.get("contractStartDate") as string,
      contractEndDate: formData.get("contractEndDate") as string,
    }

    setRooms(rooms.map((room) => (room.id === contractRoom.id ? updatedRoom : room)))
    setIsAddContractOpen(false)
    setContractRoom(null)
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
  }

  const handleExtendContract = (contractId: string, months = 12) => {
    const room = rooms.find((r) => r.id === contractId)
    if (room) {
      const currentEndDate = new Date(room.contractEndDate!)
      const newEndDate = new Date(currentEndDate.setMonth(currentEndDate.getMonth() + months))

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
      alert(
        `Đã gia hạn hợp đồng phòng ${room.building}${room.number} thêm ${months} tháng đến ${newEndDate.toLocaleDateString("vi-VN")}`,
      )
      setIsContractDetailsOpen(false)
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

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    if (checked) {
      setSelectedAmenities([...selectedAmenities, amenityId])
    } else {
      setSelectedAmenities(selectedAmenities.filter((id) => id !== amenityId))
    }
  }

  const handleEditAmenityChange = (amenityId: string, checked: boolean) => {
    if (checked) {
      setEditSelectedAmenities([...editSelectedAmenities, amenityId])
    } else {
      setEditSelectedAmenities(editSelectedAmenities.filter((id) => id !== amenityId))
    }
  }

  const handleViewContractDetails = (room: Room) => {
    setSelectedRoom(room)
    setIsContractDetailsOpen(true)
  }

  const handleEditRoomClick = (room: Room) => {
    setEditingRoom(room)
    setEditSelectedAmenities(room.amenities)
    setIsEditRoomOpen(true)
  }

  const handleAddContractClick = (room: Room) => {
    setContractRoom(room)
    setIsAddContractOpen(true)
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
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-4 lg:hidden">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Quản lý Phòng</h1>
              <p className="text-sm text-gray-500 mt-1">{filteredRooms.length} phòng</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)} className="p-2">
                <Filter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(true)} className="p-2">
                <Menu className="h-6 w-6" />
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
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm phòng mới
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] mx-4 max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleAddRoom}>
                  <DialogHeader className="pb-4">
                    <DialogTitle className="text-xl font-semibold">Thêm phòng mới</DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Nhập thông tin chi tiết cho phòng trọ mới
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6 py-4">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Thông tin cơ bản</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="number" className="text-sm font-medium">
                            Số phòng *
                          </Label>
                          <Input
                            id="number"
                            name="number"
                            placeholder="VD: A101, B202"
                            required
                            className="focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="building" className="text-sm font-medium">
                            Dãy nhà *
                          </Label>
                          <Select name="building" defaultValue="A">
                            <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
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
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="floor" className="text-sm font-medium">
                            Tầng *
                          </Label>
                          <Input
                            id="floor"
                            name="floor"
                            type="number"
                            placeholder="1"
                            min="1"
                            required
                            className="focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="area" className="text-sm font-medium">
                            Diện tích (m²) *
                          </Label>
                          <Input
                            id="area"
                            name="area"
                            type="number"
                            placeholder="20"
                            min="1"
                            required
                            className="focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="price" className="text-sm font-medium">
                            Giá thuê (VND) *
                          </Label>
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            placeholder="3000000"
                            min="0"
                            required
                            className="focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status" className="text-sm font-medium">
                          Trạng thái *
                        </Label>
                        <Select name="status" defaultValue="available">
                          <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">Trống</SelectItem>
                            <SelectItem value="occupied">Đã thuê</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Services & Amenities */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Dịch vụ & Tiện ích</h3>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {availableAmenities.map((amenity) => {
                          const Icon = amenity.icon
                          return (
                            <div
                              key={amenity.id}
                              className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <Checkbox
                                id={amenity.id}
                                checked={selectedAmenities.includes(amenity.id)}
                                onCheckedChange={(checked) => handleAmenityChange(amenity.id, checked as boolean)}
                                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                              />
                              <Label
                                htmlFor={amenity.id}
                                className="flex items-center space-x-2 cursor-pointer text-sm font-medium"
                              >
                                <Icon className="h-4 w-4 text-gray-600" />
                                <span>{amenity.name}</span>
                              </Label>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Mô tả</h3>

                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium">
                          Mô tả chi tiết
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Mô tả về phòng, vị trí, đặc điểm nổi bật..."
                          rows={4}
                          className="focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="pt-4 border-t">
                    <div className="flex gap-3 w-full">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddDialogOpen(false)}
                        className="flex-1"
                      >
                        Hủy
                      </Button>
                      <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm phòng
                      </Button>
                    </div>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-6 space-y-6">
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
              className="pl-10 h-12 text-base"
            />
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden space-y-4 p-4 bg-white rounded-xl border shadow-sm">
              <div className="grid grid-cols-1 gap-4">
                <Select value={filterBuilding} onValueChange={setFilterBuilding}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Chọn dãy nhà" />
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
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="available">Trống</SelectItem>
                    <SelectItem value="occupied">Đã thuê</SelectItem>
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
                className="w-full h-12"
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
                <Button className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-base font-medium rounded-xl">
                  <Plus className="h-5 w-5 mr-2" />
                  Thêm phòng mới
                </Button>
              </DialogTrigger>
              <DialogContent className="mx-4 max-w-[95vw] max-h-[90vh] overflow-y-auto rounded-xl">
                <form onSubmit={handleAddRoom}>
                  <DialogHeader className="pb-4">
                    <DialogTitle className="text-lg">Thêm phòng mới</DialogTitle>
                    <DialogDescription>Nhập thông tin phòng trọ mới</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-5 py-4">
                    <div className="space-y-3">
                      <Label htmlFor="number" className="text-base font-medium">
                        Số phòng *
                      </Label>
                      <Input id="number" name="number" placeholder="A101" required className="h-12 text-base" />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="building" className="text-base font-medium">
                        Dãy *
                      </Label>
                      <Select name="building" defaultValue="A">
                        <SelectTrigger className="h-12">
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
                      <div className="space-y-3">
                        <Label htmlFor="floor" className="text-base font-medium">
                          Tầng *
                        </Label>
                        <Input id="floor" name="floor" type="number" placeholder="1" required className="h-12" />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="area" className="text-base font-medium">
                          Diện tích (m²) *
                        </Label>
                        <Input id="area" name="area" type="number" placeholder="20" required className="h-12" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="price" className="text-base font-medium">
                        Giá thuê (VND) *
                      </Label>
                      <Input id="price" name="price" type="number" placeholder="3000000" required className="h-12" />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="status" className="text-base font-medium">
                        Trạng thái *
                      </Label>
                      <Select name="status" defaultValue="available">
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Trống</SelectItem>
                          <SelectItem value="occupied">Đã thuê</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Mobile Services */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Dịch vụ & Tiện ích</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {availableAmenities.map((amenity) => {
                          const Icon = amenity.icon
                          return (
                            <div key={amenity.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                              <Checkbox
                                id={`mobile-${amenity.id}`}
                                checked={selectedAmenities.includes(amenity.id)}
                                onCheckedChange={(checked) => handleAmenityChange(amenity.id, checked as boolean)}
                              />
                              <Label
                                htmlFor={`mobile-${amenity.id}`}
                                className="flex items-center space-x-2 text-sm font-medium"
                              >
                                <Icon className="h-4 w-4" />
                                <span>{amenity.name}</span>
                              </Label>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="description" className="text-base font-medium">
                        Mô tả
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Mô tả phòng..."
                        rows={4}
                        className="text-base"
                      />
                    </div>
                  </div>

                  <DialogFooter className="pt-4">
                    <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-base">
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm phòng
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {filteredRooms.map((room) => {
              const contractStatus = room.contractEndDate ? getContractStatus(room.contractEndDate) : null
              const daysUntilExpiry = room.contractEndDate ? getDaysUntilExpiry(room.contractEndDate) : null

              return (
                <Card
                  key={room.id}
                  className="border-0 shadow-sm hover:shadow-lg transition-all duration-200 rounded-xl"
                >
                  <CardContent className="p-4 lg:p-5">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{room.number}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {room.building} - Tầng {room.floor}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={`${statusColors[room.status]} text-xs px-3 py-1 rounded-full`}>
                            {statusLabels[room.status]}
                          </Badge>
                          {contractStatus === "expired" && (
                            <Badge variant="destructive" className="text-xs px-3 py-1 rounded-full">
                              Hết hạn HĐ
                            </Badge>
                          )}
                          {contractStatus === "expiring" && (
                            <Badge
                              variant="secondary"
                              className="bg-orange-100 text-orange-800 text-xs px-3 py-1 rounded-full"
                            >
                              Sắp hết hạn
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Diện tích:</span>
                          <span className="font-semibold">{room.area}m²</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Giá thuê:</span>
                          <span className="font-semibold text-green-600">{room.price.toLocaleString()}₫</span>
                        </div>
                        {room.tenant && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Khách thuê:</span>
                            <span className="font-semibold truncate ml-2">{room.tenant}</span>
                          </div>
                        )}
                        {room.contractEndDate && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Hết hạn HĐ:</span>
                              <span
                                className={`font-semibold ${
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
                                className="text-xs text-center p-2 rounded-lg font-medium"
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
                              className="flex items-center gap-1 text-xs bg-gray-100 px-3 py-2 rounded-full"
                            >
                              <Icon className="h-3 w-3" />
                            </div>
                          ) : null
                        })}
                      </div>

                      {room.description && <p className="text-sm text-gray-600 line-clamp-2">{room.description}</p>}

                      {/* Actions */}
                      <div className="flex gap-2 pt-3">
                        {/* Only show Edit button if room is not occupied */}
                        {room.status !== "occupied" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs h-9 bg-transparent"
                            onClick={() => handleEditRoomClick(room)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Sửa
                          </Button>
                        )}

                        {room.status === "available" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200 text-xs h-9"
                            onClick={() => handleAddContractClick(room)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Thêm Hợp Đồng
                          </Button>
                        ) : room.tenant ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-green-50 text-green-600 hover:bg-green-100 border-green-200 text-xs h-9"
                            onClick={() => handleViewContractDetails(room)}
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Chi 
                          </Button>
                        ) : null}

                        {/* Delete button - only show if room is not occupied */}
                        {room.status !== "occupied" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 bg-transparent h-9 px-3"
                            onClick={() => handleDeleteRoom(room.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredRooms.length === 0 && (
            <div className="text-center py-16">
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-medium text-gray-900 mb-3">Không có phòng nào</h3>
              <p className="text-gray-600 text-lg">Thêm phòng mới để bắt đầu quản lý</p>
            </div>
          )}
        </div>

        {/* Contract Details Dialog */}
        <Dialog open={isContractDetailsOpen} onOpenChange={setIsContractDetailsOpen}>
          <DialogContent className="sm:max-w-[600px] mx-2 max-h-[90vh] overflow-y-auto rounded-xl p-4 sm:p-6">
            {selectedRoom && (
              <>
                <DialogHeader className="pb-3">
                  <DialogTitle className="text-base lg:text-xl font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 lg:h-5 lg:w-5" />
                    Chi tiết hợp đồng - Phòng {selectedRoom.number}
                  </DialogTitle>
                  <DialogDescription className="text-xs lg:text-sm text-gray-600">
                    Thông tin chi tiết về hợp đồng thuê phòng
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 lg:space-y-6 py-2">
                  {/* Contract Status */}
                  <div className="flex items-center justify-between p-2 lg:p-4 bg-blue-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 text-xs lg:text-base">Trạng thái hợp đồng</h3>
                      <p className="text-xs text-gray-600">Tình trạng hiện tại</p>
                    </div>
                    {(() => {
                      const contractStatus = selectedRoom.contractEndDate
                        ? getContractStatus(selectedRoom.contractEndDate)
                        : null
                      return (
                        <Badge
                          className={`px-2 py-0.5 text-xs ${
                            contractStatus === "expired"
                              ? "bg-red-500"
                              : contractStatus === "expiring"
                                ? "bg-orange-500"
                                : "bg-green-500"
                          }`}
                        >
                          {contractStatus === "expired"
                            ? "Đã hết hạn"
                            : contractStatus === "expiring"
                              ? "Sắp hết hạn"
                              : "Còn hiệu lực"}
                        </Badge>
                      )
                    })()}
                  </div>

                  {/* Tenant Information */}
                  {selectedRoom.tenant && (
                    <div className="space-y-2">
                      <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-1">
                        Thông tin khách thuê
                      </h3>
                      <div className="bg-gray-50 p-2 lg:p-4 rounded-lg space-y-2">
                        <div className="grid grid-cols-3 gap-1">
                          <span className="text-gray-600 text-xs lg:text-sm col-span-1">Tên khách thuê:</span>
                          <span className="font-medium text-xs lg:text-sm col-span-2 text-right">
                            {selectedRoom.tenant}
                          </span>
                        </div>
                        {selectedRoom.tenantPhone && (
                          <div className="grid grid-cols-3 gap-1">
                            <span className="text-gray-600 text-xs lg:text-sm col-span-1">Số điện thoại:</span>
                            <a
                              href={`tel:${selectedRoom.tenantPhone}`}
                              className="font-medium text-blue-600 hover:text-blue-800 text-xs lg:text-sm col-span-2 text-right"
                            >
                              {selectedRoom.tenantPhone}
                            </a>
                          </div>
                        )}
                        {selectedRoom.tenantEmail && (
                          <div className="grid grid-cols-3 gap-1">
                            <span className="text-gray-600 text-xs lg:text-sm col-span-1">Email:</span>
                            <a
                              href={`mailto:${selectedRoom.tenantEmail}`}
                              className="font-medium text-blue-600 hover:text-blue-800 text-xs lg:text-sm col-span-2 text-right break-all"
                            >
                              {selectedRoom.tenantEmail}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Contract Information */}
                  {selectedRoom.contractStartDate && selectedRoom.contractEndDate && (
                    <div className="space-y-2">
                      <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-1">
                        Thông tin hợp đồng
                      </h3>
                      <div className="bg-yellow-50 p-2 lg:p-4 rounded-lg space-y-2">
                        <div className="grid grid-cols-3 gap-1">
                          <span className="text-gray-600 text-xs lg:text-sm col-span-1">Ngày bắt đầu:</span>
                          <span className="font-medium text-xs lg:text-sm col-span-2 text-right">
                            {formatDate(selectedRoom.contractStartDate)}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="text-gray-600 text-xs lg:text-sm col-span-1">Ngày kết thúc:</span>
                          <span className="font-medium text-xs lg:text-sm col-span-2 text-right">
                            {formatDate(selectedRoom.contractEndDate)}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="text-gray-600 text-xs lg:text-sm col-span-1">Giá thuê:</span>
                          <span className="font-medium text-green-600 text-xs lg:text-sm col-span-2 text-right">
                            {selectedRoom.price.toLocaleString()} ₫/tháng
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="text-gray-600 text-xs lg:text-sm col-span-1">Thời hạn:</span>
                          <span className="font-medium text-xs lg:text-sm col-span-2 text-right">
                            {Math.ceil(
                              (new Date(selectedRoom.contractEndDate).getTime() -
                                new Date(selectedRoom.contractStartDate).getTime()) /
                                (1000 * 60 * 60 * 24 * 30),
                            )}{" "}
                            tháng
                          </span>
                        </div>
                        {(() => {
                          const contractStatus = getContractStatus(selectedRoom.contractEndDate)
                          const daysUntilExpiry = getDaysUntilExpiry(selectedRoom.contractEndDate)
                          return (
                            <div className="grid grid-cols-3 gap-1">
                              <span className="text-gray-600 text-xs lg:text-sm col-span-1">Tình trạng:</span>
                              <span
                                className={`font-medium text-xs lg:text-sm col-span-2 text-right ${
                                  contractStatus === "expired"
                                    ? "text-red-600"
                                    : contractStatus === "expiring"
                                      ? "text-orange-600"
                                      : "text-green-600"
                                }`}
                              >
                                {contractStatus === "expired"
                                  ? `Đã hết hạn ${Math.abs(daysUntilExpiry)} ngày`
                                  : contractStatus === "expiring"
                                    ? `Còn ${daysUntilExpiry} ngày`
                                    : "Còn hiệu lực"}
                              </span>
                            </div>
                          )
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Extension Section - Show if contract is expired or expiring */}
                  {selectedRoom.contractEndDate &&
                    (() => {
                      const contractStatus = getContractStatus(selectedRoom.contractEndDate)
                      return (
                        (contractStatus === "expired" || contractStatus === "expiring") && (
                          <div className="space-y-2">
                            <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-1">
                              Gia hạn hợp đồng
                            </h3>
                            <div className="bg-orange-50 p-2 lg:p-4 rounded-lg space-y-3">
                              <div className="space-y-2">
                                <Label htmlFor="extensionMonths" className="text-xs lg:text-sm font-medium">
                                  Thời gian gia hạn:
                                </Label>
                                <Select
                                  value={extensionMonths.toString()}
                                  onValueChange={(value) => setExtensionMonths(Number(value))}
                                >
                                  <SelectTrigger className="h-8 lg:h-10 text-xs lg:text-sm">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="3">3 tháng</SelectItem>
                                    <SelectItem value="6">6 tháng</SelectItem>
                                    <SelectItem value="12">12 tháng</SelectItem>
                                    <SelectItem value="24">24 tháng</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="text-xs bg-orange-100 p-2 rounded">
                                <strong>Ngày kết thúc mới:</strong> {(() => {
                                  const currentEndDate = new Date(selectedRoom.contractEndDate!)
                                  const newEndDate = new Date(
                                    currentEndDate.setMonth(currentEndDate.getMonth() + extensionMonths),
                                  )
                                  return newEndDate.toLocaleDateString("vi-VN")
                                })()}
                              </div>
                              <Button
                                onClick={() => handleExtendContract(selectedRoom.id, extensionMonths)}
                                className="w-full h-9 lg:h-10 bg-orange-600 hover:bg-orange-700 text-xs lg:text-sm"
                              >
                                <Calendar className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                                Gia hạn hợp đồng {extensionMonths} tháng
                              </Button>
                            </div>
                          </div>
                        )
                      )
                    })()}

                  {/* Action Buttons */}
                  {selectedRoom.tenant && (
                    <div className="space-y-2">
                      <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-1">
                        Liên hệ khách thuê
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedRoom.tenantPhone && (
                          <Button
                            variant="outline"
                            onClick={() => window.open(`tel:${selectedRoom.tenantPhone}`)}
                            className="h-9 lg:h-10 text-xs lg:text-sm"
                          >
                            📞 Gọi điện
                          </Button>
                        )}
                        {selectedRoom.tenantEmail && (
                          <Button
                            variant="outline"
                            onClick={() => {
                              const subject = `Liên hệ về phòng ${selectedRoom.building}${selectedRoom.number}`
                              const body = `Xin chào ${selectedRoom.tenant},\n\nTôi cần liên hệ với bạn về phòng ${selectedRoom.building}${selectedRoom.number}.\n\nTrân trọng,\nBan quản lý`
                              window.open(
                                `mailto:${selectedRoom.tenantEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
                              )
                            }}
                            className="h-9 lg:h-10 text-xs lg:text-sm"
                          >
                            ✉️ Gửi email
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <DialogFooter className="pt-3 border-t mt-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsContractDetailsOpen(false)}
                    className="w-full h-9 lg:h-10 text-xs lg:text-sm"
                  >
                    Đóng
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Room Dialog */}
        <Dialog open={isEditRoomOpen} onOpenChange={setIsEditRoomOpen}>
          <DialogContent className="sm:max-w-[600px] mx-2 max-h-[90vh] overflow-y-auto rounded-xl p-4 sm:p-6">
            {editingRoom && (
              <form onSubmit={handleEditRoom}>
                <DialogHeader className="pb-3">
                  <DialogTitle className="text-base lg:text-xl font-semibold">
                    Chỉnh sửa phòng {editingRoom.number}
                  </DialogTitle>
                  <DialogDescription className="text-xs lg:text-sm text-gray-600">
                    Cập nhật thông tin chi tiết cho phòng trọ
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                  {/* Basic Information */}
                  <div className="space-y-3">
                    <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-1">Thông tin cơ bản</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="edit-number" className="text-xs lg:text-sm font-medium">
                          Số phòng *
                        </Label>
                        <Input
                          id="edit-number"
                          name="number"
                          defaultValue={editingRoom.number}
                          required
                          className="h-8 lg:h-10 text-xs lg:text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="edit-building" className="text-xs lg:text-sm font-medium">
                          Dãy nhà *
                        </Label>
                        <Select name="building" defaultValue={editingRoom.building}>
                          <SelectTrigger className="h-8 lg:h-10 text-xs lg:text-sm">
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
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="edit-floor" className="text-xs lg:text-sm font-medium">
                          Tầng *
                        </Label>
                        <Input
                          id="edit-floor"
                          name="floor"
                          type="number"
                          defaultValue={editingRoom.floor}
                          min="1"
                          required
                          className="h-8 lg:h-10 text-xs lg:text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="edit-area" className="text-xs lg:text-sm font-medium">
                          Diện tích (m²) *
                        </Label>
                        <Input
                          id="edit-area"
                          name="area"
                          type="number"
                          defaultValue={editingRoom.area}
                          min="1"
                          required
                          className="h-8 lg:h-10 text-xs lg:text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="edit-price" className="text-xs lg:text-sm font-medium">
                          Giá thuê (VND) *
                        </Label>
                        <Input
                          id="edit-price"
                          name="price"
                          type="number"
                          defaultValue={editingRoom.price}
                          min="0"
                          required
                          className="h-8 lg:h-10 text-xs lg:text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="edit-status" className="text-xs lg:text-sm font-medium">
                        Trạng thái *
                      </Label>
                      <Select name="status" defaultValue={editingRoom.status}>
                        <SelectTrigger className="h-8 lg:h-10 text-xs lg:text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Trống</SelectItem>
                          <SelectItem value="occupied">Đã thuê</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Services & Amenities */}
                  <div className="space-y-3">
                    <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-1">Dịch vụ & Tiện ích</h3>

                    <div className="grid grid-cols-2 gap-2">
                      {availableAmenities.map((amenity) => {
                        const Icon = amenity.icon
                        return (
                          <div
                            key={amenity.id}
                            className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <Checkbox
                              id={`edit-${amenity.id}`}
                              checked={editSelectedAmenities.includes(amenity.id)}
                              onCheckedChange={(checked) => handleEditAmenityChange(amenity.id, checked as boolean)}
                              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 h-3 w-3 lg:h-4 lg:w-4"
                            />
                            <Label
                              htmlFor={`edit-${amenity.id}`}
                              className="flex items-center space-x-1 cursor-pointer text-xs lg:text-sm"
                            >
                              <Icon className="h-3 w-3 lg:h-4 lg:w-4 text-gray-600" />
                              <span>{amenity.name}</span>
                            </Label>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-1">Mô tả</h3>

                    <div className="space-y-1">
                      <Label htmlFor="edit-description" className="text-xs lg:text-sm font-medium">
                        Mô tả chi tiết
                      </Label>
                      <Textarea
                        id="edit-description"
                        name="description"
                        defaultValue={editingRoom.description}
                        placeholder="Mô tả về phòng, vị trí, đặc điểm nổi bật..."
                        rows={3}
                        className="text-xs lg:text-sm resize-none"
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter className="pt-3 border-t mt-3">
                  <div className="flex gap-2 w-full">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditRoomOpen(false)}
                      className="flex-1 h-9 lg:h-10 text-xs lg:text-sm"
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 h-9 lg:h-10 text-xs lg:text-sm"
                    >
                      <Edit className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                      Cập nhật
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Contract Dialog */}
        <Dialog open={isAddContractOpen} onOpenChange={setIsAddContractOpen}>
          <DialogContent className="sm:max-w-[600px] mx-2 max-h-[90vh] overflow-y-auto rounded-xl p-4 sm:p-6">
            {contractRoom && (
              <form onSubmit={handleAddContract}>
                <DialogHeader className="pb-3">
                  <DialogTitle className="text-base lg:text-xl font-semibold flex items-center gap-2">
                    <User className="h-4 w-4 lg:h-5 lg:w-5" />
                    Thêm hợp đồng - Phòng {contractRoom.number}
                  </DialogTitle>
                  <DialogDescription className="text-xs lg:text-sm text-gray-600">
                    Nhập thông tin khách thuê và hợp đồng
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                  {/* Room Information */}
                  <div className="space-y-3">
                    <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-1">Thông tin phòng</h3>
                    <div className="bg-blue-50 p-2 lg:p-4 rounded-lg space-y-2">
                      <div className="grid grid-cols-3 gap-1">
                        <span className="text-gray-600 text-xs lg:text-sm col-span-1">Phòng:</span>
                        <span className="font-medium text-xs lg:text-sm col-span-2 text-right">
                          {contractRoom.building}
                          {contractRoom.number}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <span className="text-gray-600 text-xs lg:text-sm col-span-1">Diện tích:</span>
                        <span className="font-medium text-xs lg:text-sm col-span-2 text-right">
                          {contractRoom.area}m²
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <span className="text-gray-600 text-xs lg:text-sm col-span-1">Giá thuê:</span>
                        <span className="font-medium text-green-600 text-xs lg:text-sm col-span-2 text-right">
                          {contractRoom.price.toLocaleString()}₫/tháng
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tenant Information */}
                  <div className="space-y-3">
                    <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-1">
                      Thông tin khách thuê
                    </h3>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor="tenantName" className="text-xs lg:text-sm font-medium">
                          Họ và tên *
                        </Label>
                        <Input
                          id="tenantName"
                          name="tenantName"
                          placeholder="Nguyễn Văn A"
                          required
                          className="h-8 lg:h-10 text-xs lg:text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="tenantPhone" className="text-xs lg:text-sm font-medium">
                            Số điện thoại *
                          </Label>
                          <Input
                            id="tenantPhone"
                            name="tenantPhone"
                            type="tel"
                            placeholder="0901234567"
                            required
                            className="h-8 lg:h-10 text-xs lg:text-sm"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="tenantEmail" className="text-xs lg:text-sm font-medium">
                            Email
                          </Label>
                          <Input
                            id="tenantEmail"
                            name="tenantEmail"
                            type="email"
                            placeholder="email@example.com"
                            className="h-8 lg:h-10 text-xs lg:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contract Information */}
                  <div className="space-y-3">
                    <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-1">Thông tin hợp đồng</h3>

                    <div className="grid grid-cols-1 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="contractStartDate" className="text-xs lg:text-sm font-medium">
                          Ngày bắt đầu *
                        </Label>
                        <Input
                          id="contractStartDate"
                          name="contractStartDate"
                          type="date"
                          required
                          className="h-8 lg:h-10 text-xs lg:text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="contractEndDate" className="text-xs lg:text-sm font-medium">
                          Ngày kết thúc *
                        </Label>
                        <Input
                          id="contractEndDate"
                          name="contractEndDate"
                          type="date"
                          required
                          className="h-8 lg:h-10 text-xs lg:text-sm"
                        />
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-2 rounded-lg">
                      <p className="text-xs text-yellow-800">
                        <strong>Lưu ý:</strong> Hệ thống sẽ tự động thông báo khi hợp đồng sắp hết hạn (trước 30 ngày).
                      </p>
                    </div>
                  </div>
                </div>

                <DialogFooter className="pt-3 border-t mt-3">
                  <div className="flex gap-2 w-full">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddContractOpen(false)}
                      className="flex-1 h-9 lg:h-10 text-xs lg:text-sm"
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700 h-9 lg:h-10 text-xs lg:text-sm"
                    >
                      <Plus className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                      Tạo hợp đồng
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
