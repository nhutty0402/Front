"use client"
import Cookies from "js-cookie"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import axiosClient from "@/lib/axiosClient"
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
  email?: string
  idCard: string
  address: string
  room: string
  building: string
  startDate: string
  status: "active" | "inactive"
  deposit: number
  hasAccount: boolean
  username?: string
  password?: string
  KhachHangID: number,
  TaiKhoanID: number
  TrangThai: string
  MatKhau: string
  Email: string
}

interface TenantDetail extends Tenant {
  email?: string
  rentAmount?: number
  contractNumber?: string
  contractEndDate?: string
  paymentHistory: any[]
  requests: any[]
}

export default function TenantDetailPage({ params }: { params: { id: string } }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [tenant, setTenant] = useState<TenantDetail | null>(null)
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [filteredTenants, setFilteredTenants] = useState<Tenant[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isCreateAccountDialogOpen, setIsCreateAccountDialogOpen] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)
  const [accounts, setAccounts] = useState<any[]>([])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterBuilding, setFilterBuilding] = useState("all")
  const [filterRoom, setFilterRoom] = useState("all")
  const [filterAccount, setFilterAccount] = useState("all")

  const router = useRouter()

  // ✅ Check token + lấy thông tin quản lý
  useEffect(() => {
    const token = Cookies.get("token")
    if (!token || token === "null" || token === "undefined") {
      router.replace("/login")
      return
    }

    const fetchLandlordInfo = async () => {
      try {
          const res = await fetch("https://all-oqry.onrender.com/api/quanli/thong-tin", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

        if (!res.ok) throw new Error("Lỗi xác thực")
        const data = await res.json()
        // setLandlordInfo(data) // Nếu cần
      } catch (err) {
        console.error("Lỗi fetch:", err)
        router.replace("/login")
      }
    }

    fetchLandlordInfo()
  }, [router])

  // ✅ Lấy danh sách khách hàng & tài khoản
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const tenantsRes = await axios.get("https://all-oqry.onrender.com/api/khachhang")
  //       const tenantsData = tenantsRes.data.map((found: any) => ({
  //         id: found._id || found.KhachHangID?.toString() || "",
  //         name: found.HoTenKhachHang,
  //         phone: found.SoDienThoai,
  //         email: found.EmailTaiKhoan || "",
  //         idCard: found.SoCCCD,
  //         address: `${found.DiaChiCuThe || ""}, ${found.PhuongXa || ""}, ${found.QuanHuyen || ""}, ${found.TinhThanh || ""}`,
  //         room: found.SoPhong || "Chưa gán",
  //         building: found.DayPhongThucTe || "Chưa gán",
  //         startDate: found.NgayTao || new Date().toISOString(),
  //         status: found.TrangThaiPhong === "ConTrong" ? "inactive" : "active",
  //         deposit: found.TienCoc || 0,
  //         hasAccount: found.TaiKhoanID !== null,
  //         username: found.TenDangNhap || "",
  //         rentAmount: parseFloat(found.GiaPhong) || 0,
  //         contractNumber: found.SoHopDong || "N/A",
  //         contractEndDate: found.NgayKetThuc || new Date().toISOString(),
  //         paymentHistory: [],
  //         requests: [],
  //       }))

  //       setTenants(tenantsData)

  //       const accountsRes = await axios.get("https://all-oqry.onrender.com/api/taikhoan")
  //       setAccounts(accountsRes.data)
  //     } catch (err) {
  //       console.error("Lỗi khi gọi API:", err)
  //       setTenants([])
  //       setAccounts([])
  //     }
  //   }

  //   fetchData()
  // }, [])

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("token"); // ✅ lấy từ cookie
      console.log("Token từ cookie:", token);
  
      if (!token || token === "null" || token === "undefined") {
        console.warn("Không có token → chuyển về /login");
        router.replace("/login");
        return;
      }
  
      try {
        // ✅ Gọi API khách hàng với token
        const tenantsRes = await axiosClient.get("https://all-oqry.onrender.com/api/khachhang");
  
        const tenantsData = tenantsRes.data.map((found: any) => ({
          id: found._id || found.KhachHangID?.toString() || "",
          KhachHangID: found.KhachHangID, // ✅ thêm dòng này
          name: found.HoTenKhachHang,
          phone: found.SoDienThoai,
          email: found.EmailTaiKhoan || "",
          idCard: found.SoCCCD,
          address: `${found.DiaChiCuThe || ""}, ${found.PhuongXa || ""}, ${found.QuanHuyen || ""}, ${found.TinhThanh || ""}`,
          room: found.SoPhong || "Chưa gán",
          building: found.DayPhongThucTe || "Chưa gán",
          startDate: found.NgayTao || new Date().toISOString(),
          status: found.TrangThaiPhong === "ConTrong" ? "inactive" : "active",
          deposit: found.TienCoc || 0,
          hasAccount: found.TaiKhoanID !== null,
          username: found.TenDangNhap || "",
          rentAmount: parseFloat(found.GiaPhong) || 0,
          contractNumber: found.SoHopDong || "N/A",
          contractEndDate: found.NgayKetThuc || new Date().toISOString(),
          TaiKhoanID: found.TaiKhoanID || 0,
          TrangThai: found.TrangThai || "HoatDong",
          MatKhau: found.MatKhau || "",
          Email: found.Email || "",
          paymentHistory: [],
          requests: [],
        }));
  
        setTenants(tenantsData);
  
        // ✅ Gọi API tài khoản với token
        const accountsRes = await axiosClient.get("https://all-oqry.onrender.com/api/taikhoan");
  
        setAccounts(accountsRes.data);
  
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
        setTenants([]);
        setAccounts([]);
      }
    };
  
    fetchData();
  }, []);
  


  // ✅ Lọc dữ liệu theo bộ lọc
  useEffect(() => {
    const filtered = tenants.filter((tenant) => {
      const matchesSearch =
        (tenant.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (tenant.phone || "").includes(searchTerm) ||
        (tenant.room?.toLowerCase() || "").includes(searchTerm.toLowerCase())

      const matchesBuilding = filterBuilding === "all" || tenant.building === filterBuilding
      const matchesRoom = filterRoom === "all" || tenant.room === filterRoom
      const matchesAccount = filterAccount === "all" || tenant.hasAccount === (filterAccount === "has")

      return matchesSearch && matchesBuilding && matchesRoom && matchesAccount
    })

    setFilteredTenants(filtered)
  }, [searchTerm, filterBuilding, filterRoom, filterAccount, tenants])

  const handleAddTenant = (formData: FormData) => {
    const createAccount = formData.get("createAccount") === "on"
// lỗi chưa biết lỗi newTenant==============================================================================================================================

    // const newTenant: Tenant = {
    //   id: Date.now().toString(),
    //   name: formData.get("name") as string,
    //   phone: formData.get("phone") as string,
    //   idCard: formData.get("idCard") as string,
    //   address: formData.get("address") as string,
    //   room: formData.get("room") as string,
    //   building: formData.get("building") as string,
    //   startDate: formData.get("startDate") as string,
    //   status: "active",
    //   deposit: Number(formData.get("deposit")),
    //   hasAccount: createAccount,
    //   username: createAccount ? formData.get("name")?.toString().toLowerCase().replace(/\s+/g, "") : undefined,
    //   password: createAccount ? "123456" : undefined,
    // }

    // setTenants((prev) => [...prev, newTenant])
    // setIsAddDialogOpen(false)

    // if (createAccount) {
    //   alert(`Khách thuê và tài khoản đã được tạo!\nTên đăng nhập: ${newTenant.username}\nMật khẩu: 123456`)
    // }
  }

  const handleDeleteTenant = (id: string) => {
    setTenants((prev) => prev.filter((t) => t.id !== id))
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
            <h1 className="text-xl font-bold text-gray-900">Quản Lý Khách thuê</h1>
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 lg:p-6">
          {/* Bảng tài khoản khách hàng */}



          <div className="mb-4 lg:mb-6 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              {/* <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Quản lý Khách thuê</h1>
              <p className="text-gray-600 text-sm lg:text-base">Quản lý thông tin khách thuê</p> */}
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                {/* <Button className="w-full lg:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm khách thuê
                </Button> */}
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

              {/* <Select value={filterRoom} onValueChange={setFilterRoom}>
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
              </Select> */}

              <Select value={filterAccount} onValueChange={setFilterAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="Lọc theo tài khoản" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="has">Đã có tài khoản</SelectItem>
                  <SelectItem value="no">Chưa có tài khoản</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setFilterBuilding("all")
                  setFilterRoom("all")
                  setFilterAccount("all")
                  setSearchTerm("")
                }}
                className="bg-transparent"
              >
                Xóa bộ lọc
              </Button>
            </div>
          </div>







          {/* Tài khoản*/}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {filteredTenants.map((tenant) => (
              <Card key={tenant.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{tenant.name}</CardTitle>
                      {/* Xóa dòng CardDescription để tránh lặp thông tin */}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="truncate">{tenant.phone}</span>
                    </div>

                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{tenant.address}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span>Từ {new Date(tenant.startDate).toLocaleDateString("vi-VN")}</span>
                    </div>

                    {/* Dãy, Phòng, Tài khoản */}
                    <div className="pt-2 border-t space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Dãy:</span>
                        <span className="font-medium">{tenant.building || "Chưa gán"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Phòng:</span>
                        <span className="font-medium">{tenant.room || "Chưa gán"}</span>
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

                    {/* Nút thao tác */}
                    <div className="flex gap-2 pt-2">
                      {/* <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-transparent text-xs"
              onClick={() => {
                setEditingTenant(tenant)
                setIsEditDialogOpen(true)
              }}
            >
              <Edit className="h-3 w-3 mr-1" />
              Sửa
            </Button> */}

                      {!tenant.hasAccount ? (
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
                          Tạo tài khoản
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-green-50 text-green-600 hover:bg-green-100 border-green-200 text-xs"
                          onClick={() => {
                            const params = new URLSearchParams({
                              id: String(tenant.TaiKhoanID || ""),
                            })
                            router.push(`/tenants/edit-account?${params.toString()}`)
                          }}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Chỉnh sửa tài khoản
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Phần khách hàng đã có tài khoản - tạm thời ẩn */}
          {false && (
            <>
              <h2 className="text-lg font-bold mt-10 mb-4">Khách hàng đã có tài khoản</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {accounts.map((acc) => (
                  <Card key={acc.TaiKhoanID} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg truncate">{acc.HoTenKhachHang}</CardTitle>
                          <CardDescription className="text-sm">
                            {acc.TenDangNhap ? `Tài khoản: ${acc.TenDangNhap}` : "Chưa có tài khoản"}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <span className="truncate">{acc.SoDienThoai}</span>
                        </div>

                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{acc.EmailTaiKhoan || "Không có email"}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <span>
                            Ngày tạo:{" "}
                            {acc.NgayTao
                              ? new Date(acc.NgayTao).toLocaleDateString("vi-VN")
                              : "Không rõ"}
                          </span>
                        </div>

                        {/* Thêm Dãy và Phòng */}
                        <div className="pt-2 border-t space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Dãy:</span>
                            <span className="font-medium">{acc.ToaNha || "Chưa gán"}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Phòng:</span>
                            <span className="font-medium">{acc.Phong || "Chưa gán"}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Trạng thái:</span>
                            <Badge
                              className={`text-xs ${acc.TrangThai === "Hoạt động" ? "bg-emerald-400 text-white" : "bg-gray-400 text-white"
                                }`}
                            >
                              {acc.TrangThai}
                            </Badge>
                          </div>
                        </div>

                        {/* Nút hành động */}
                        <div className="flex gap-2 pt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent text-xs"
                            onClick={() => {
                              alert(`Sửa tài khoản của ${acc.HoTenKhachHang}`)
                            }}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Sửa
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

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
      onSubmit={async (e) => {
        e.preventDefault()
        const form = e.currentTarget
        const username = form.username.value
        const password = form.password.value
        const confirmPassword = form.confirmPassword.value
        const email = form.email.value

        if (password !== confirmPassword) {
          alert("Mật khẩu nhập lại không khớp!")
          return
        }

        if (!selectedTenant) return

        const token = Cookies.get("token")
        if (!token || token === "null" || token === "undefined") {
          router.replace("/login")
          return
        }

        try {
          const payload = {
            KhachHangID: selectedTenant.KhachHangID,
            TenDangNhap: username,
            Email: email,
            MatKhau: password,
            TrangThai: "HoatDong",
          }       
          const res = await axios.post("https://all-oqry.onrender.com/api/taikhoan/register", payload, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (res.status === 200 || res.status === 201) {
            alert("Tạo tài khoản thành công!")
            setTenants((prev) =>
              prev.map((tenant) =>
                tenant.id === selectedTenant.id
                  ? { ...tenant, hasAccount: true, username, password }
                  : tenant
              )
            )
          } else {
            alert("Không thể tạo tài khoản. Mã lỗi: " + res.status)
          }
        } catch (err: any) {
          console.error("Lỗi tạo tài khoản:", err)
          alert("Lỗi: " + (err.response?.data?.message || err.message))
        }

        setIsCreateAccountDialogOpen(false)
        setSelectedTenant(null)
      }}
    >
      <DialogHeader>
        <DialogTitle>Tạo tài khoản cho khách thuê</DialogTitle>
        <DialogDescription>
          Tạo tài khoản đăng nhập cho {selectedTenant?.name}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <Label>Dãy</Label>
          <Input value={selectedTenant?.building || "Chưa gán"} disabled />
        </div>
        <div className="space-y-2">
          <Label>Số phòng</Label>
          <Input value={selectedTenant?.room || "Chưa gán"} disabled />
        </div>
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
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Số điện thoại</Label>
          <Input id="phone" name="phone" type="tel" required disabled value={selectedTenant?.phone || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Mật khẩu</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Nhập lại mật khẩu</Label>
          <Input id="confirmPassword" name="confirmPassword" type="password" required />
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
