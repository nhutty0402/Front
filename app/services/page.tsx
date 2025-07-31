"use client"
import Cookies from "js-cookie"
import { useState } from "react"
import { useRouter } from "next/navigation" // 👈 THÊM DÒNG NÀY
import { Card, CardContent } from "@/components/ui/card"
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
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Menu,
  Wrench,
  Wifi,
  Car,
  Sparkles,
  Shirt,
  Power,
  PowerOff,
  AlertCircle,
} from "lucide-react"
import axios from "axios"
import { useEffect } from "react"
import "@/styles/dialog-transparent.css"

interface Service {
  DichVuID: number;
  TenDichVu: string;
  GiaDichVu: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter() // 👈 VÀ THÊM DÒNG NÀY

  
// LẤY TẤT CẢ DỊCH VỤ
  useEffect(() => {
    const token = Cookies.get("token"); // ✅ lấy từ cookie
    console.log("Token từ cookie:", token);
  
    if (!token || token === "null" || token === "undefined") {
      console.warn("Không có token → chuyển về /login");
      router.replace("/login");
      return; // ⛔ dừng hàm nếu không có token
    }
  
    axios.get("https://all-oqry.onrender.com/api/dichvu", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (Array.isArray(res.data)) {
          setServices(res.data.map((item: any) => ({
            DichVuID: item.DichVuID,
            TenDichVu: item.TenDichVu,
            GiaDichVu: item.GiaDichVu,
          })));
        }
      })
      .catch(() => setServices([]));
  }, []);
  const filteredServices = services.filter((service) => {
    return service.TenDichVu.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString("vi-VN")} VNĐ`
  }

  // Thêm dịch vụ
  const totalServiceAmount = services.reduce((sum, service) => sum + service.GiaDichVu, 0);


  const handleAddService = async (formData: FormData) => {
    const token = Cookies.get("token"); // ✅ lấy từ cookie
    console.log("Token từ cookie:", token);
  
    if (!token || token === "null" || token === "undefined") {
      console.warn("Không có token → chuyển về /login");
      router.replace("/login");
      return; // ⛔ cần return để dừng hàm lại
    }
  
    const TenDichVu = formData.get("TenDichVu") as string;
    const GiaDichVu = Number(formData.get("GiaDichVu"));
  
    try {
      const response = await axios.post(
        "https://all-oqry.onrender.com/api/dichvu",
        {
          TenDichVu,
          GiaDichVu
        },
        {
          headers: {
            Authorization: `Bearer ${token}` // ✅ thêm token vào headers
          }
        }
      );
  
      const newService: Service = {
        DichVuID: response.data?.DichVuID,
        TenDichVu: response.data?.TenDichVu || TenDichVu,
        GiaDichVu: response.data?.GiaDichVu || GiaDichVu,
      };
  
      setServices([newService, ...services]);
      setIsAddDialogOpen(false);
      setMessage({ type: "success", text: "Thêm dịch vụ thành công!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: "error", text: error?.response?.data?.message || "Lỗi khi thêm dịch vụ!" });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  
  // Chỉnh sửa dịch vụ

  const handleEditService = async (formData: FormData) => {
    const token = Cookies.get("token"); // ✅ lấy từ cookie
    console.log("Token từ cookie:", token);
  
    if (!token || token === "null" || token === "undefined") {
      console.warn("Không có token → chuyển về /login");
      router.replace("/login");
      return;
    }
  
    if (!editingService) return;
  
    const TenDichVu = formData.get("TenDichVu") as string;
    const GiaDichVu = Number(formData.get("GiaDichVu"));
  
    try {
      await axios.put(
        `https://all-oqry.onrender.com/api/dichvu/${editingService.DichVuID}`,
        {
          TenDichVu,
          GiaDichVu
        },
        {
          headers: {
            Authorization: `Bearer ${token}` // ✅ thêm token vào headers
          }
        }
      );
  
      const updatedService: Service = {
        ...editingService,
        TenDichVu,
        GiaDichVu,
      };
  
      setServices(
        services.map((service) =>
          service.DichVuID === editingService.DichVuID ? updatedService : service
        )
      );
  
      setEditingService(null);
      setMessage({ type: "success", text: "Cập nhật dịch vụ thành công!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error?.response?.data?.message || "Lỗi khi cập nhật dịch vụ!",
      });
      setTimeout(() => setMessage(null), 3000);
    }
  };
  
// xóa dịch vụ


  const handleDeleteService = async (DichVuID: number) => {
    const token = Cookies.get("token"); // ✅ lấy từ cookie
    console.log("Token từ cookie:", token);
  
    if (!token || token === "null" || token === "undefined") {
      console.warn("Không có token → chuyển về /login");
      router.replace("/login");
      return;
    }
  
    try {
      await axios.delete(
        `https://all-oqry.onrender.com/api/dichvu/${DichVuID}`,
        {
          headers: {
            Authorization: `Bearer ${token}` // ✅ thêm token vào header
          }
        }
      );
  
      setServices(services.filter((service) => service.DichVuID !== DichVuID));
      setMessage({ type: "success", text: "Xóa dịch vụ thành công!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error?.response?.data?.message || "Lỗi khi xóa dịch vụ!",
      });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  
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
              <h1 className="text-lg font-semibold text-gray-900">Dịch vụ</h1>
              <p className="text-sm text-gray-500">{filteredServices.length} dịch vụ</p>
            </div>
            <div className="flex items-center gap-2">
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
              <h1 className="text-2xl font-bold text-gray-900">Quản lý Dịch vụ</h1>
              <p className="text-gray-600">Quản lý các dịch vụ cho khách thuê</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm dịch vụ mới
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] mx-4">
                <form action={handleAddService}>
                  <DialogHeader>
                    <DialogTitle>Thêm dịch vụ mới</DialogTitle>
                    <DialogDescription>Nhập thông tin dịch vụ mới</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="TenDichVu">Tên dịch vụ</Label>
                      <Input id="TenDichVu" name="TenDichVu" placeholder="Nhập tên dịch vụ" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="GiaDichVu">Giá dịch vụ (VNĐ)</Label>
                      <Input id="GiaDichVu" name="GiaDichVu" type="number" placeholder="100000" required />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full">
                      Thêm dịch vụ
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-6 space-y-4">
          {/* Message */}
          {message && (
            <div
              className={`p-3 rounded-lg ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {message.text}
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm dịch vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Nút Thêm dịch vụ mới */}
          <div className="mb-4 flex justify-end">
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm dịch vụ mới
            </Button>
          </div>

          {/* Tổng số tiền các dịch vụ */}
          <div className="mb-4 text-right font-semibold text-green-700">
            Tổng số tiền các dịch vụ: {formatCurrency(totalServiceAmount)}
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="sm:max-w-[425px] mx-4">
              <form action={handleAddService}>
                <DialogHeader>
                  <DialogTitle>Thêm dịch vụ mới</DialogTitle>
                  <DialogDescription>Nhập thông tin dịch vụ mới</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="TenDichVu">Tên dịch vụ</Label>
                    <Input id="TenDichVu" name="TenDichVu" placeholder="Nhập tên dịch vụ" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="GiaDichVu">Giá dịch vụ (VNĐ)</Label>
                    <Input id="GiaDichVu" name="GiaDichVu" type="number" placeholder="100000" required />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full">
                    Thêm dịch vụ
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map((service) => {
              return (
                <Card key={service.DichVuID} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-blue-500">
                            <Wrench className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{service.TenDichVu}</h3>
                          </div>
                        </div>
                        <span className="inline-block px-3 py-1 text-xs rounded-full bg-green-100 text-green-800 font-medium">Hoạt động</span>
                      </div>
                      {/* Price */}
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(service.GiaDichVu)}
                        </div>
                      </div>
                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs bg-transparent"
                          onClick={() => setEditingService(service)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Sửa
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 bg-transparent"
                          onClick={() => handleDeleteService(service.DichVuID)}
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

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có dịch vụ nào</h3>
              <p className="text-gray-600">Thêm dịch vụ mới để bắt đầu quản lý</p>
            </div>
          )}
        </div>
      </div>

      {/* Chỉnh sửa dịch vụ*/}
      <Dialog open={!!editingService} onOpenChange={() => setEditingService(null)}>
        <DialogContent className="sm:max-w-[425px] mx-4">
          <form action={handleEditService}>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa dịch vụ</DialogTitle>
              <DialogDescription>Cập nhật thông tin dịch vụ</DialogDescription>
            </DialogHeader>
            {editingService && (
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-TenDichVu">Tên dịch vụ</Label>
                  <Input id="edit-TenDichVu" name="TenDichVu" defaultValue={editingService.TenDichVu} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-GiaDichVu">Giá dịch vụ (VNĐ)</Label>
                  <Input id="edit-GiaDichVu" name="GiaDichVu" type="number" defaultValue={editingService.GiaDichVu} required />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="submit" className="w-full">
                Cập nhật dịch vụ
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
