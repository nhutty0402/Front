"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Edit, Trash2, Phone, Mail, MapPin, Calendar, Menu, User, UserPlus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Tenant {
  id: string
  name: string
  phone: string
  email: string
  idCard: string
  address: string
  room: string
  building: string // Thêm building
  startDate: string
  status: "active" | "inactive"
  deposit: number
  hasAccount: boolean // Thêm trạng thái tài khoản
  username?: string
  password?: string
}

const mockTenants: Tenant[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    phone: "0901234567",
    email: "nguyenvana@email.com",
    idCard: "123456789",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    room: "A101",
    building: "A",
    startDate: "2025-05-01",
    status: "active",
    deposit: 3000000,
    hasAccount: true,
    username: "nguyenvana",
  },
  {
    id: "2",
    name: "Trần Thị B",
    phone: "0912345678",
    email: "tranthib@email.com",
    idCard: "987654321",
    address: "456 Đường XYZ, Quận 2, TP.HCM",
    room: "B201",
    building: "B",
    startDate: "2025-03-15",
    status: "active",
    deposit: 3200000,
    hasAccount: false,
  },
  {
    id: "3",
    name: "Lê Văn C",
    phone: "0923456789",
    email: "levanc@email.com",
    idCard: "456789123",
    address: "789 Đường DEF, Quận 3, TP.HCM",
    room: "C103",
    building: "C",
    startDate: "2024-12-01",
    status: "inactive",
    deposit: 2800000,
    hasAccount: false,
  },
]

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [filterBuilding, setFilterBuilding] = useState<string>("all")
  const [filterRoom, setFilterRoom] = useState<string>("all")
  const [isCreateAccountDialogOpen, setIsCreateAccountDialogOpen] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.phone.includes(searchTerm) ||
      tenant.room.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesBuilding = filterBuilding === "all" || tenant.building === filterBuilding
    const matchesRoom = filterRoom === "all" || tenant.room === filterRoom

    return matchesSearch && matchesBuilding && matchesRoom
  })

  // Get unique rooms for filter
  const availableRooms = [...new Set(tenants.map((tenant) => tenant.room))].sort()

  const handleAddTenant = (formData: FormData) => {
    const createAccount = formData.get("createAccount") === "on"

    const newTenant: Tenant = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      idCard: formData.get("idCard") as string,
      address: formData.get("address") as string,
      room: formData.get("room") as string,
      building: formData.get("building") as string,
      startDate: formData.get("startDate") as string,
      status: "active",
      deposit: Number.parseInt(formData.get("deposit") as string),
      hasAccount: createAccount,
      username: createAccount ? (formData.get("name") as string).toLowerCase().replace(/\s+/g, "") : undefined,
      password: createAccount ? "123456" : undefined,
    }

    setTenants([...tenants, newTenant])
    setIsAddDialogOpen(false)

    if (createAccount) {
      alert(`Khách thuê và tài khoản đã được tạo!\nTên đăng nhập: ${newTenant.username}\nMật khẩu: 123456`)
    }
  }

  const handleDeleteTenant = (id: string) => {
    setTenants(tenants.filter((tenant) => tenant.id !== id))
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Khách thuê</h1>
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="mb-4 lg:mb-6 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              {/* <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Quản lý Khách thuê</h1>
              <p className="text-gray-600 text-sm lg:text-base">Quản lý thông tin khách thuê</p> */}
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full lg:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm khách thuê
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] mx-4 max-h-[90vh] overflow-y-auto">
                <form action={handleAddTenant}>
                  <DialogHeader>
                    <DialogTitle>Thêm khách thuê mới</DialogTitle>
                    <DialogDescription>Nhập thông tin khách thuê mới</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm">
                        Họ tên
                      </Label>
                      <Input id="name" name="name" placeholder="Nguyễn Văn A" required />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm">
                          Số điện thoại
                        </Label>
                        <Input id="phone" name="phone" placeholder="0901234567" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm">
                          Email
                        </Label>
                        <Input id="email" name="email" type="email" placeholder="email@example.com" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="idCard" className="text-sm">
                          CMND/CCCD
                        </Label>
                        <Input id="idCard" name="idCard" placeholder="123456789" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="building" className="text-sm">
                          Dãy
                        </Label>
                        <Select name="building" defaultValue="A">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">Dãy A</SelectItem>
                            <SelectItem value="B">Dãy B</SelectItem>
                            <SelectItem value="C">Dãy C</SelectItem>
                            <SelectItem value="D">Dãy D</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm">
                        Địa chỉ
                      </Label>
                      <Input id="address" name="address" placeholder="123 Đường ABC, Quận 1" required />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate" className="text-sm">
                          Ngày bắt đầu
                        </Label>
                        <Input id="startDate" name="startDate" type="date" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="deposit" className="text-sm">
                          Tiền cọc (VND)
                        </Label>
                        <Input id="deposit" name="deposit" type="number" placeholder="3000000" required />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="createAccount" name="createAccount" className="rounded" />
                    <Label htmlFor="createAccount" className="text-sm">
                      Tạo tài khoản đăng nhập cho khách thuê
                    </Label>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full lg:w-auto">
                      Thêm khách thuê
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search and Filters */}
          <div className="mb-4 lg:mb-6 space-y-4">
            <div className="flex-1">
              <Input
                placeholder="Tìm kiếm theo tên, số điện thoại hoặc phòng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Select value={filterBuilding} onValueChange={setFilterBuilding}>
                <SelectTrigger>
                  <SelectValue placeholder="Lọc theo dãy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả dãy</SelectItem>
                  <SelectItem value="A">Dãy A</SelectItem>
                  <SelectItem value="B">Dãy B</SelectItem>
                  <SelectItem value="C">Dãy C</SelectItem>
                  <SelectItem value="D">Dãy D</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterRoom} onValueChange={setFilterRoom}>
                <SelectTrigger>
                  <SelectValue placeholder="Lọc theo phòng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả phòng</SelectItem>
                  {availableRooms.map((room) => (
                    <SelectItem key={room} value={room}>
                      Phòng {room}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setFilterBuilding("all")
                  setFilterRoom("all")
                  setSearchTerm("")
                }}
                className="bg-transparent"
              >
                Xóa bộ lọc
              </Button>
            </div>
          </div>

          {/* Tenants Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {filteredTenants.map((tenant) => (
              <Card key={tenant.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{tenant.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {tenant.building} - Phòng {tenant.room}
                      </CardDescription>
                    </div>
                    {/* <Badge className={tenant.status === "active" ? "bg-green-500" : "bg-gray-500"} size="sm">
                      {tenant.status === "active" ? "Đang thuê" : "Đã nghỉ"}
                    </Badge> */}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="truncate">{tenant.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="truncate">{tenant.email}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{tenant.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span>Từ {new Date(tenant.startDate).toLocaleDateString("vi-VN")}</span>
                    </div>

                    <div className="pt-2 border-t space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Dãy:</span>
                        <span className="font-medium">{tenant.building}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tài khoản:</span>
                        <div className="flex items-center gap-2">
                          {tenant.hasAccount ? (
                            <Badge className="bg-green-500 text-xs">Đã tạo</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Chưa tạo
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent text-xs">
                        <Edit className="h-3 w-3 mr-1" />
                        Sửa
                      </Button>

                      {/* Create Account Button - only show if no account */}
                      {!tenant.hasAccount && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200 text-xs"
                          onClick={() => {
                            setSelectedTenant(tenant)
                            setIsCreateAccountDialogOpen(true)
                          }}
                        >
                          <UserPlus className="h-3 w-3 mr-1" />
                          Tạo TK
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 bg-transparent"
                        onClick={() => handleDeleteTenant(tenant.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTenants.length === 0 && (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy khách thuê</h3>
              <p className="text-gray-600">Thử thay đổi từ khóa tìm kiếm</p>
            </div>
          )}
        </div>
      </main>

      {/* Create Account Dialog */}
      <Dialog open={isCreateAccountDialogOpen} onOpenChange={setIsCreateAccountDialogOpen}>
        <DialogContent className="sm:max-w-[400px] mx-4">
          <form
            action={(formData) => {
              if (selectedTenant) {
                const username = formData.get("username") as string
                const password = formData.get("password") as string

                setTenants(
                  tenants.map((tenant) =>
                    tenant.id === selectedTenant.id ? { ...tenant, hasAccount: true, username, password } : tenant,
                  ),
                )

                setIsCreateAccountDialogOpen(false)
                setSelectedTenant(null)

                // Show success message
                alert(`Tài khoản đã được tạo!\nTên đăng nhập: ${username}\nMật khẩu: ${password}`)
              }
            }}
          >
            <DialogHeader>
              <DialogTitle>Tạo tài khoản cho khách thuê</DialogTitle>
              <DialogDescription>Tạo tài khoản đăng nhập cho {selectedTenant?.name}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="username">Tên đăng nhập</Label>
                <Input
                  id="username"
                  name="username"
                  defaultValue={selectedTenant?.name.toLowerCase().replace(/\s+/g, "")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input id="password" name="password" type="password" defaultValue="123456" required />
              </div>
              <div className="text-sm text-gray-600">
                <p>Thông tin tài khoản sẽ được gửi qua email: {selectedTenant?.email}</p>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                Tạo tài khoản
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
