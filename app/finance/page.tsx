"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import axiosClient from "@/lib/axiosClient"
import { Card } from "@/components/ui/card"
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
import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { DollarSign, TrendingUp, TrendingDown, Receipt, Plus, Search, Filter, Download, Eye, Edit, Trash2, Menu, AlertCircle, X, Calendar, User, Home } from "lucide-react"

interface Transaction {
  id: string
  type: "income" | "expense"
  category: string
  description: string
  amount: number
  date: string
  roomNumber?: string
  tenant?: string
  status: "completed" | "pending" | "overdue"
  dueDate?: string
}

interface RoomOption {
  id: number | string
  day: string
  room: string
  label: string
  price: number | null
}

// Xóa dữ liệu mẫu – hiển thị 100% dữ liệu từ API

const categories = {
  income: ["Tiền thuê phòng", "Tiền điện nước", "Tiền dịch vụ", "Tiền cọc", "Khác"],
  expense: ["Bảo trì", "Tiện ích", "Vật tư", "Nhân công", "Thuế", "Khác"],
}

const statusColors = {
  completed: "bg-green-100 text-green-800 border-green-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  overdue: "bg-red-100 text-red-800 border-red-200",
}

const statusLabels = {
  completed: "Đã thanh toán",
  pending: "Chờ thanh toán",
  overdue: "Quá hạn",
}

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isTariffDialogOpen, setIsTariffDialogOpen] = useState(false)
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState("all")
  const router = useRouter()

  // State for creating invoice
  const [rooms, setRooms] = useState<RoomOption[]>([])
  const [form, setForm] = useState({
    PhongID_id: "",
    ThangNam: "",
    ChiSoDienCu: "",
    ChiSoDienMoi: "",
    ChiSoNuocCu: "",
    ChiSoNuocMoi: "",
    TienPhong: "",
    GiaDienMoi: "",
    GiaNuocMoi: "",
    PhiSuaChua: "0",
    PhiTru: "0",
    TienTra: "0",
    TrangThaiThanhToan: "N",
    DayPhong: "",
  })
  const [tariffs, setTariffs] = useState<{ dien: number | null; nuoc: number | null }>({ dien: null, nuoc: null })
  const [tariffForm, setTariffForm] = useState({
    id: "",
    LoaiDichVu: "Dien",
    GiaCu: "",
    GiaMoi: "",
    NgayCapNhat: new Date().toISOString().slice(0, 19),
  })

  const handleChange = (name: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const formatMonthForApi = (value: string) => {
    // input: YYYY-MM from <input type="month"> → output: MM/YYYY
    if (!value) return ""
    const [y, m] = value.split("-")
    return `${m}/${y}`
  }

  const toMonthInput = (thangNam: string | null | undefined): string => {
    if (!thangNam) return ""
    if (/^\d{4}-\d{2}$/.test(thangNam)) return thangNam
    if (/^\d{2}\/\d{4}$/.test(thangNam)) {
      const [mm, yyyy] = thangNam.split("/")
      return `${yyyy}-${String(mm).padStart(2, "0")}`
    }
    return ""
  }

  const addOneMonth = (ym: string): string => {
    if (!ym || !/^\d{4}-\d{2}$/.test(ym)) return ym
    const [y, m] = ym.split("-").map(Number)
    const d = new Date(y, m - 1, 1)
    d.setMonth(d.getMonth() + 1)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
  }

  const refreshInvoices = useCallback(async () => {
    const token = Cookies.get("token")
    console.log("Token từ cookie:", token)
    if (!token || token === "null" || token === "undefined") {
      console.warn("Không có token → chuyển về /login")
      router.replace("/login")
      return
    }

    const normalizeMonth = (thangNam: string | null | undefined): string => {
      if (!thangNam) return new Date().toISOString().slice(0, 7)
      if (/^\d{4}-\d{2}$/.test(thangNam)) return thangNam
      if (/^\d{2}\/\d{4}$/.test(thangNam)) {
        const [mm, yyyy] = thangNam.split("/")
        return `${yyyy}-${String(mm).padStart(2, "0")}`
      }
      return new Date().toISOString().slice(0, 7)
    }

    try {
      const res = await axiosClient.get("https://all-oqry.onrender.com/api/hoadon/hoadon", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const list: any[] = Array.isArray(res.data) ? res.data : res.data?.data || []

      const mapped: Transaction[] = list.map((item: any, idx: number) => {
        const monthStr = normalizeMonth(item.ThangNam)
        const firstDay = `${monthStr}-01`
        const amount = Number.parseFloat(item.TongTien ?? item.TienPhong ?? 0)
        const itemMonthDate = new Date(firstDay)
        const startOfCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)

        let status: Transaction["status"]
        if (String(item.TrangThaiThanhToan) === "0") {
          status = "completed"
        } else {
          status = itemMonthDate < startOfCurrentMonth ? "overdue" : "pending"
        }

        return {
          id: `${item.ChiSoID ?? idx}-${idx}`,
          type: "income",
          category: "Hóa đơn",
          description: `Hóa đơn phòng ${String(item.DayPhong ?? "")}${String(item.SoPhong ?? "")} - Tháng ${new Date(firstDay).toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" })}`,
          amount: Number.isFinite(amount) ? amount : 0,
          date: firstDay,
          roomNumber: `${String(item.DayPhong ?? "")}${String(item.SoPhong ?? "")}` || undefined,
          tenant: item.HoTenKhachHang || undefined,
          status,
          dueDate: undefined,
        }
      })

      setTransactions(mapped)
    } catch (error) {
      console.error("Lỗi khi gọi API hoadon:", error)
    }
  }, [router])

  // Fetch invoices on load
  useEffect(() => {
    refreshInvoices()
  }, [refreshInvoices])

  // Fetch rooms for the add-invoice form
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axiosClient.get("https://all-oqry.onrender.com/api/phong")
        const list: any[] = Array.isArray(res.data) ? res.data : res.data?.data || []
        const mapped: RoomOption[] = list.map((r: any) => ({
          id: r.PhongID ?? r.id ?? r._id ?? String(Math.random()),
          day: String(r.DayPhong ?? r.DayPhongThucTe ?? r.ToaNha ?? ""),
          room: String(r.SoPhong ?? r.Phong ?? ""),
          label: `${String(r.DayPhong ?? r.DayPhongThucTe ?? r.ToaNha ?? "")} ${String(r.SoPhong ?? r.Phong ?? "")}`.trim(),
          price: r.GiaPhong != null ? Number(r.GiaPhong) : null,
        }))
        setRooms(mapped)
      } catch (e) {
        console.error("Lỗi lấy danh sách phòng:", e)
        setRooms([])
      }
    }
    fetchRooms()
  }, [])

  // When selecting a room, auto-fill DayPhong and TienPhong
  useEffect(() => {
    if (!form.PhongID_id) return
    const selected = rooms.find((r) => String(r.id) === String(form.PhongID_id))
    if (!selected) return
    setForm((prev) => ({
      ...prev,
      DayPhong: selected.day,
      TienPhong: selected.price != null ? String(selected.price) : prev.TienPhong,
    }))
  }, [form.PhongID_id, rooms])

  // Fetch latest meter reading of the selected room to prefill form
  useEffect(() => {
    const fetchLatestReading = async () => {
      if (!form.PhongID_id) return
      try {
        const res = await axiosClient.get(`https://all-oqry.onrender.com/api/chisodiennuoc/${form.PhongID_id}`)
        const raw = res.data
        const data = Array.isArray(raw) ? raw[0] : (raw?.data ?? raw)
        if (!data) {
          // Không có dữ liệu → chỉ số cũ mặc định = 0
          setForm((prev) => ({
            ...prev,
            ThangNam: prev.ThangNam || addOneMonth(new Date().toISOString().slice(0, 7)),
            ChiSoDienCu: prev.ChiSoDienCu || "0",
            ChiSoNuocCu: prev.ChiSoNuocCu || "0",
          }))
          return
        }
        setForm((prev) => ({
          ...prev,
          ThangNam: prev.ThangNam || addOneMonth(toMonthInput(data.ThangNam)),
          ChiSoDienCu: String(
            data.ChiSoDienCu ?? (raw?.message === "Không có dữ liệu." ? 0 : prev.ChiSoDienCu),
          ),
          ChiSoNuocCu: String(
            data.ChiSoNuocCu ?? (raw?.message === "Không có dữ liệu." ? 0 : prev.ChiSoNuocCu),
          ),
          // Giữ chỉ số mới để người dùng nhập nếu muốn cập nhật
          TienPhong: String(data.TienPhong ?? prev.TienPhong),
          GiaDienMoi: String(data.GiaDienMoi ?? prev.GiaDienMoi),
          GiaNuocMoi: String(data.GiaNuocMoi ?? prev.GiaNuocMoi),
          DayPhong: String(data.DayPhong ?? prev.DayPhong),
          TrangThaiThanhToan: String(data.TrangThaiThanhToan ?? prev.TrangThaiThanhToan),
        }))
      } catch (e) {
        console.error("Lỗi lấy chỉ số điện nước phòng:", e)
      }
    }
    fetchLatestReading()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.PhongID_id])

  // Fetch latest electricity/water tariffs and prefill form
  const fetchTariffs = useCallback(async () => {
      try {
        const res = await axiosClient.get("https://all-oqry.onrender.com/api/giadiennuoc")
        const arr: any[] = Array.isArray(res.data) ? res.data : res.data?.data || []
        const byType = (type: string) =>
          arr.filter((x: any) => String(x.LoaiDichVu).toLowerCase() === type).sort(
            (a: any, b: any) => new Date(b.NgayCapNhat).getTime() - new Date(a.NgayCapNhat).getTime(),
          )[0]
        const latestDien = byType("dien")
        const latestNuoc = byType("nuoc")
        const dien = latestDien ? Number(latestDien.GiaMoi) : null
        const nuoc = latestNuoc ? Number(latestNuoc.GiaMoi) : null
        setTariffs({ dien, nuoc })
        setForm((prev) => ({
          ...prev,
          GiaDienMoi: prev.GiaDienMoi || (dien != null ? String(dien) : ""),
          GiaNuocMoi: prev.GiaNuocMoi || (nuoc != null ? String(nuoc) : ""),
        }))
      } catch (e) {
        console.error("Lỗi lấy giá điện/nước:", e)
      }
  }, [])

  useEffect(() => {
    fetchTariffs()
  }, [fetchTariffs])

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesType = filterType === "all" || transaction.type === filterType
    const matchesStatus = filterStatus === "all" || transaction.status === filterStatus
    const matchesCategory = filterCategory === "all" || transaction.category === filterCategory
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.tenant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMonth = selectedMonth === "all" || transaction.date.startsWith(selectedMonth)

    return matchesType && matchesStatus && matchesCategory && matchesSearch && matchesMonth
  })

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = filteredTransactions
    .filter((t) => t.type === "expense" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)

  const pendingIncome = filteredTransactions
    .filter((t) => t.type === "income" && t.status === "pending")
    .reduce((sum, t) => sum + t.amount, 0)

  const overdueIncome = filteredTransactions
    .filter((t) => t.type === "income" && t.status === "overdue")
    .reduce((sum, t) => sum + t.amount, 0)

  const netIncome = totalIncome - totalExpense

  const submitInvoice = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      // Validation: new indexes must be >= old indexes
      const dienCu = Number(form.ChiSoDienCu || 0)
      const dienMoi = Number(form.ChiSoDienMoi || 0)
      const nuocCu = Number(form.ChiSoNuocCu || 0)
      const nuocMoi = Number(form.ChiSoNuocMoi || 0)
      if (dienMoi < dienCu) {
        alert("Chỉ số điện mới không được nhỏ hơn chỉ số điện cũ")
        return
      }
      if (nuocMoi < nuocCu) {
        alert("Chỉ số nước mới không được nhỏ hơn chỉ số nước cũ")
        return
      }

      const selected = rooms.find((r) => String(r.id) === String(form.PhongID_id))
      const soDienDaTieuThu = Math.max(0, dienMoi - dienCu)
      const soNuocDaTieuThu = Math.max(0, nuocMoi - nuocCu)
      const giaDien = Number(form.GiaDienMoi || 0)
      const giaNuoc = Number(form.GiaNuocMoi || 0)
      const tienPhong = Number(form.TienPhong || 0)
      const phiSuaChua = Number(form.PhiSuaChua || 0)
      const phiTru = Number(form.PhiTru || 0)
      const tongDichVu = soDienDaTieuThu * giaDien + soNuocDaTieuThu * giaNuoc + phiSuaChua - phiTru
      const tongTien = tienPhong + tongDichVu
      const payload = {
        PhongID_id: Number(form.PhongID_id),
        ThangNam: formatMonthForApi(form.ThangNam),
        ChiSoDienCu: dienCu,
        ChiSoDienMoi: dienMoi,
        ChiSoNuocCu: nuocCu,
        ChiSoNuocMoi: nuocMoi,
        TienPhong: Number(form.TienPhong),
        GiaDienMoi: Number(form.GiaDienMoi),
        GiaNuocMoi: Number(form.GiaNuocMoi),
        PhiSuaChua: Number(form.PhiSuaChua || 0),
        PhiTru: Number(form.PhiTru || 0),
        TienTra: Number(form.TienTra || 0),
        TrangThaiThanhToan: form.TrangThaiThanhToan || "N",
        DayPhong: form.DayPhong || selected?.day || "",
        SoDienDaTieuThu: soDienDaTieuThu,
        SoNuocDaTieuThu: soNuocDaTieuThu,
        TongTien: tongTien,
      }

      await axiosClient.post("https://all-oqry.onrender.com/api/hoadon", payload)
    setIsAddDialogOpen(false)
      await refreshInvoices()
    } catch (error: any) {
      console.error("Lỗi tạo hoá đơn:", error)
      alert("Không thể tạo hoá đơn: " + (error.response?.data?.message || error.message))
    }
  }

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id))
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

  const allCategories = [...categories.income, ...categories.expense]

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
                <h1 className="text-xl font-bold text-gray-900">Tài chính</h1>
                <p className="text-sm text-gray-500">{filteredTransactions.length} giao dịch</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            {/* Quick Actions Row */}
            <div className="flex gap-2">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="flex-1">
                    <Plus className="h-4 w-4 mr-1" />
                    Thêm
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg mx-4">
                  <form onSubmit={submitInvoice} className="space-y-3">
                    <DialogHeader>
                      <DialogTitle>Thêm hoá đơn</DialogTitle>
                      <DialogDescription>Gửi dữ liệu theo API hoá đơn</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2">
                      <Label>Phòng</Label>
                      <Select value={String(form.PhongID_id)} onValueChange={(v) => handleChange("PhongID_id", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn phòng" />
                        </SelectTrigger>
                        <SelectContent>
                          {rooms.map((r) => (
                            <SelectItem key={r.id} value={String(r.id)}>{r.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Tháng</Label>
                      <Input type="month" value={form.ThangNam} onChange={(e) => handleChange("ThangNam", e.target.value)} required />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Điện cũ</Label>
                        <Input type="number" value={form.ChiSoDienCu} onChange={(e) => handleChange("ChiSoDienCu", e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Điện mới</Label>
                        <Input type="number" min={Number(form.ChiSoDienCu || 0)} value={form.ChiSoDienMoi} onChange={(e) => handleChange("ChiSoDienMoi", e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Nước cũ</Label>
                        <Input type="number" value={form.ChiSoNuocCu} onChange={(e) => handleChange("ChiSoNuocCu", e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Nước mới</Label>
                        <Input type="number" min={Number(form.ChiSoNuocCu || 0)} value={form.ChiSoNuocMoi} onChange={(e) => handleChange("ChiSoNuocMoi", e.target.value)} required />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Tiền phòng</Label>
                        <Input type="number" value={form.TienPhong} onChange={(e) => handleChange("TienPhong", e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Giá điện</Label>
                        <Input type="number" value={form.GiaDienMoi} onChange={(e) => handleChange("GiaDienMoi", e.target.value)} required />
                        {tariffs.dien != null && (
                          <span className="text-xs text-gray-500">Giá mới nhất: {tariffs.dien.toLocaleString("vi-VN")} đ/kWh</span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Giá nước</Label>
                        <Input type="number" value={form.GiaNuocMoi} onChange={(e) => handleChange("GiaNuocMoi", e.target.value)} required />
                        {tariffs.nuoc != null && (
                          <span className="text-xs text-gray-500">Giá mới nhất: {tariffs.nuoc.toLocaleString("vi-VN")} đ/m³</span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Phí sửa chữa</Label>
                        <Input type="number" value={form.PhiSuaChua} onChange={(e) => handleChange("PhiSuaChua", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Phí trừ</Label>
                        <Input type="number" value={form.PhiTru} onChange={(e) => handleChange("PhiTru", e.target.value)} />
                      </div>
                      
                    </div>

                    <div className="space-y-2">
                      <Label>Trạng thái thanh toán</Label>
                      <Select value={form.TrangThaiThanhToan} onValueChange={(v) => handleChange("TrangThaiThanhToan", v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="N">Chưa thanh toán</SelectItem>
                          <SelectItem value="0">Đã thanh toán</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <DialogFooter>
                      <Button type="submit" className="w-full">Gửi hoá đơn</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4 mr-1" />
                Lọc
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý Tài chính</h1>
              <p className="text-gray-600">Theo dõi thu chi và báo cáo tài chính</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsTariffDialogOpen(true)}>
                Cập nhật giá điện/nước
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Xuất báo cáo
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm giao dịch
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 lg:p-6 space-y-4 lg:space-y-6">
          {/* Summary Cards - Mobile Optimized */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            <Card className="p-3 lg:p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 lg:p-2 rounded-full bg-green-100">
                  <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-green-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs lg:text-sm font-medium text-gray-600">Thu nhập</p>
                <p className="text-sm lg:text-2xl font-bold text-green-600">
                  <span className="lg:hidden">{formatCurrencyShort(totalIncome)}</span>
                  <span className="hidden lg:inline">{formatCurrency(totalIncome)}</span>
                </p>
              </div>
            </Card>

            <Card className="p-3 lg:p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 lg:p-2 rounded-full bg-red-100">
                  <TrendingDown className="h-3 w-3 lg:h-4 lg:w-4 text-red-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs lg:text-sm font-medium text-gray-600">Chi phí</p>
                <p className="text-sm lg:text-2xl font-bold text-red-600">
                  <span className="lg:hidden">{formatCurrencyShort(totalExpense)}</span>
                  <span className="hidden lg:inline">{formatCurrency(totalExpense)}</span>
                </p>
              </div>
            </Card>

            <Card className="p-3 lg:p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 lg:p-2 rounded-full bg-blue-100">
                  <DollarSign className="h-3 w-3 lg:h-4 lg:w-4 text-blue-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs lg:text-sm font-medium text-gray-600">Lợi nhuận</p>
                <p className={`text-sm lg:text-2xl font-bold ${netIncome >= 0 ? "text-green-600" : "text-red-600"}`}>
                  <span className="lg:hidden">{formatCurrencyShort(netIncome)}</span>
                  <span className="hidden lg:inline">{formatCurrency(netIncome)}</span>
                </p>
              </div>
            </Card>

            <Card className="p-3 lg:p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 lg:p-2 rounded-full bg-orange-100">
                  <AlertCircle className="h-3 w-3 lg:h-4 lg:w-4 text-orange-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs lg:text-sm font-medium text-gray-600">Chờ thu</p>
                <p className="text-sm lg:text-2xl font-bold text-orange-600">
                  <span className="lg:hidden">{formatCurrencyShort(pendingIncome + overdueIncome)}</span>
                  <span className="hidden lg:inline">{formatCurrency(pendingIncome + overdueIncome)}</span>
                </p>
              </div>
            </Card>
          </div>

          {/* Month Selector - Mobile Optimized */}
          <Card className="p-3 lg:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Tháng</span>
              </div>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-auto min-w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="2024-12">12/2024</SelectItem>
                  <SelectItem value="2024-11">11/2024</SelectItem>
                  <SelectItem value="2024-10">10/2024</SelectItem>
                  <SelectItem value="2024-09">09/2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm giao dịch..."
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
                  <div>
                    <Label className="text-xs text-gray-600 mb-1 block">Loại</Label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Tất cả" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="income">Thu nhập</SelectItem>
                        <SelectItem value="expense">Chi phí</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-600 mb-1 block">Trạng thái</Label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Tất cả" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="completed">Đã thanh toán</SelectItem>
                        <SelectItem value="pending">Chờ thanh toán</SelectItem>
                        <SelectItem value="overdue">Quá hạn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-600 mb-1 block">Danh mục</Label>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Tất cả danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả danh mục</SelectItem>
                      {allCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    setFilterType("all")
                    setFilterStatus("all")
                    setFilterCategory("all")
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
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="income">Thu nhập</SelectItem>
                <SelectItem value="expense">Chi phí</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="completed">Đã thanh toán</SelectItem>
                <SelectItem value="pending">Chờ thanh toán</SelectItem>
                <SelectItem value="overdue">Quá hạn</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {allCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setFilterType("all")
                setFilterStatus("all")
                setFilterCategory("all")
                setSearchTerm("")
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>

          {/* Transactions List - Mobile Optimized */}
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <Card key={transaction.id} className="p-3 lg:p-4">
                <div className="space-y-3">
                  {/* Header Row */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div
                        className={`p-2 rounded-full flex-shrink-0 ${
                          transaction.type === "income" ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm lg:text-base truncate">
                          {transaction.description}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={`text-xs ${statusColors[transaction.status]}`}>
                            {statusLabels[transaction.status]}
                          </Badge>
                          <span className="text-xs text-gray-500">{transaction.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div
                        className={`text-base lg:text-lg font-bold ${
                          transaction.type === "income" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        <span className="lg:hidden">{formatCurrencyShort(transaction.amount)}</span>
                        <span className="hidden lg:inline">{formatCurrency(transaction.amount)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Details Row */}
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(transaction.date)}</span>
                      </div>
                      {transaction.roomNumber && (
                        <div className="flex items-center gap-1">
                          <Home className="h-3 w-3" />
                          <span>{transaction.roomNumber}</span>
                        </div>
                      )}
                      {transaction.tenant && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span className="truncate max-w-20">{transaction.tenant}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteTransaction(transaction.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Due Date Warning */}
                  {transaction.dueDate && transaction.status !== "completed" && (
                    <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                      Hạn thanh toán: {formatDate(transaction.dueDate)}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredTransactions.length === 0 && (
            <Card className="p-8 text-center">
              <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có giao dịch nào</h3>
              <p className="text-gray-600 mb-4">Thêm giao dịch mới để bắt đầu theo dõi tài chính</p>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm giao dịch đầu tiên
                  </Button>
                </DialogTrigger>
              </Dialog>
            </Card>
          )}
        </div>
      </div>

      {/* Add Invoice Dialog (API) */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="mx-4 max-w-md max-h-[90vh] overflow-y-auto">
          <form onSubmit={submitInvoice}>
            <DialogHeader>
              <DialogTitle>Thêm hoá đơn</DialogTitle>
              <DialogDescription>Gửi dữ liệu hoá đơn đến API</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Phòng</Label>
                <Select value={String(form.PhongID_id)} onValueChange={(v) => handleChange("PhongID_id", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phòng" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((r) => (
                      <SelectItem key={r.id} value={String(r.id)}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tháng</Label>
                <Input type="month" value={form.ThangNam} onChange={(e) => handleChange("ThangNam", e.target.value)} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Điện cũ</Label>
                  <Input type="number" value={form.ChiSoDienCu} onChange={(e) => handleChange("ChiSoDienCu", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Điện mới</Label>
                  <Input type="number" value={form.ChiSoDienMoi} onChange={(e) => handleChange("ChiSoDienMoi", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Nước cũ</Label>
                  <Input type="number" value={form.ChiSoNuocCu} onChange={(e) => handleChange("ChiSoNuocCu", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Nước mới</Label>
                  <Input type="number" value={form.ChiSoNuocMoi} onChange={(e) => handleChange("ChiSoNuocMoi", e.target.value)} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tiền phòng</Label>
                  <Input type="number" value={form.TienPhong} onChange={(e) => handleChange("TienPhong", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Giá điện</Label>
                  <Input type="number" value={form.GiaDienMoi} onChange={(e) => handleChange("GiaDienMoi", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Giá nước</Label>
                  <Input type="number" value={form.GiaNuocMoi} onChange={(e) => handleChange("GiaNuocMoi", e.target.value)} required />
              </div>
              <div className="space-y-2">
                  <Label>Phí sửa chữa</Label>
                  <Input type="number" value={form.PhiSuaChua} onChange={(e) => handleChange("PhiSuaChua", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Phí trừ</Label>
                  <Input type="number" value={form.PhiTru} onChange={(e) => handleChange("PhiTru", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Tiền trả</Label>
                  <Input type="number" value={form.TienTra} onChange={(e) => handleChange("TienTra", e.target.value)} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Tổng tiền </Label>
                  <Input
                    readOnly
                    value={(() => {
                      const dienCuNum = Number(form.ChiSoDienCu || 0)
                      const dienMoiNum = Number(form.ChiSoDienMoi || 0)
                      const nuocCuNum = Number(form.ChiSoNuocCu || 0)
                      const nuocMoiNum = Number(form.ChiSoNuocMoi || 0)
                      const soDien = Math.max(0, dienMoiNum - dienCuNum)
                      const soNuoc = Math.max(0, nuocMoiNum - nuocCuNum)
                      const total =
                        Number(form.TienPhong || 0) +
                        soDien * Number(form.GiaDienMoi || 0) +
                        soNuoc * Number(form.GiaNuocMoi || 0) +
                        Number(form.PhiSuaChua || 0) -
                        Number(form.PhiTru || 0)
                      return isNaN(total) ? "0" : String(total)
                    })()}
                  />
                </div>
                {/* Preview breakdown from API tariffs and input indexes */}
                <div className="col-span-2 mt-2 rounded-md border p-3 bg-gray-50">
                  <div className="text-sm font-medium mb-2">Chi tiết tạm tính</div>
                  {(() => {
                    const dienCu = Number(form.ChiSoDienCu || 0)
                    const dienMoi = Number(form.ChiSoDienMoi || 0)
                    const nuocCu = Number(form.ChiSoNuocCu || 0)
                    const nuocMoi = Number(form.ChiSoNuocMoi || 0)
                    const tieuThuDien = Math.max(0, dienMoi - dienCu)
                    const tieuThuNuoc = Math.max(0, nuocMoi - nuocCu)
                    const giaDien = Number(form.GiaDienMoi || 0)
                    const giaNuoc = Number(form.GiaNuocMoi || 0)
                    const thanhTienDien = tieuThuDien * giaDien
                    const thanhTienNuoc = tieuThuNuoc * giaNuoc
                    const fmt = (n: number) => n.toLocaleString('vi-VN')
                    return (
                      <div className="space-y-2 text-xs">
                        <div>
                          <div className="font-semibold">Điện</div>
                          <div>Chỉ số: {fmt(dienCu)} → {fmt(dienMoi)}</div>
                          <div>Tiêu thụ: {fmt(tieuThuDien)} kWh</div>
                          <div>Giá: {fmt(giaDien)} VNĐ/kWh</div>
                          <div>Thành tiền: {fmt(thanhTienDien)} VNĐ</div>
                        </div>
                        <div className="pt-2 border-t">
                          <div className="font-semibold">Nước</div>
                          <div>Chỉ số: {fmt(nuocCu)} → {fmt(nuocMoi)}</div>
                          <div>Tiêu thụ: {fmt(tieuThuNuoc)} m³</div>
                          <div>Giá: {fmt(giaNuoc)} VNĐ/m³</div>
                          <div>Thành tiền: {fmt(thanhTienNuoc)} VNĐ</div>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Trạng thái thanh toán</Label>
                <Select value={form.TrangThaiThanhToan} onValueChange={(v) => handleChange("TrangThaiThanhToan", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="N">Chưa thanh toán</SelectItem>
                    <SelectItem value="0">Đã thanh toán</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                Gửi hoá đơn
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Update Tariff Dialog */}
      <Dialog open={isTariffDialogOpen} onOpenChange={setIsTariffDialogOpen}>
        <DialogContent className="mx-4 max-w-md">
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              try {
                const id = tariffForm.id || "1"
                const payload = {
                  LoaiDichVu: tariffForm.LoaiDichVu,
                  GiaCu: Number(tariffForm.GiaCu || 0),
                  GiaMoi: Number(tariffForm.GiaMoi || 0),
                  NgayCapNhat: tariffForm.NgayCapNhat,
                }
                await axiosClient.put(`https://all-oqry.onrender.com/api/giadiennuoc/${id}`, payload)
                setIsTariffDialogOpen(false)
                await fetchTariffs()
              } catch (err: any) {
                console.error("Lỗi cập nhật giá:", err)
                alert("Không thể cập nhật giá: " + (err.response?.data?.message || err.message))
              }
            }}
          >
            <DialogHeader>
              <DialogTitle>Cập nhật giá điện/nước</DialogTitle>
              <DialogDescription>Gửi PUT tới /api/giadiennuoc/[id]</DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 py-2">
              <div className="space-y-1">
                <Label>ID (ví dụ 1)</Label>
                <Input value={tariffForm.id} onChange={(e) => setTariffForm((p) => ({ ...p, id: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Loại dịch vụ</Label>
                <Select value={tariffForm.LoaiDichVu} onValueChange={(v) => setTariffForm((p) => ({ ...p, LoaiDichVu: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dien">Điện</SelectItem>
                    <SelectItem value="Nuoc">Nước</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Giá cũ</Label>
                  <Input type="number" value={tariffForm.GiaCu} onChange={(e) => setTariffForm((p) => ({ ...p, GiaCu: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <Label>Giá mới</Label>
                  <Input type="number" value={tariffForm.GiaMoi} onChange={(e) => setTariffForm((p) => ({ ...p, GiaMoi: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Ngày cập nhật</Label>
                <Input type="datetime-local" value={tariffForm.NgayCapNhat} onChange={(e) => setTariffForm((p) => ({ ...p, NgayCapNhat: e.target.value }))} />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" className="w-full">Lưu</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
