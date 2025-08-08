"use client"

import { useEffect, useState } from "react"
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
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState("all")
  const router = useRouter()

  // Fetch invoices from API and map to Transaction[]
  useEffect(() => {
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

    const fetchInvoices = async () => {
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
    }

    fetchInvoices()
  }, [router])

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

  const handleAddTransaction = (formData: FormData) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: formData.get("type") as "income" | "expense",
      category: formData.get("category") as string,
      description: formData.get("description") as string,
      amount: Number.parseInt(formData.get("amount") as string),
      date: formData.get("date") as string,
      roomNumber: (formData.get("roomNumber") as string) || undefined,
      tenant: (formData.get("tenant") as string) || undefined,
      status: formData.get("status") as Transaction["status"],
      dueDate: (formData.get("dueDate") as string) || undefined,
    }
    setTransactions([newTransaction, ...transactions])
    setIsAddDialogOpen(false)
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

      {/* Add Transaction Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="mx-4 max-w-md max-h-[90vh] overflow-y-auto">
          <form action={handleAddTransaction}>
            <DialogHeader>
              <DialogTitle>Thêm giao dịch mới</DialogTitle>
              <DialogDescription>Nhập thông tin giao dịch thu chi</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="type">Loại giao dịch</Label>
                <Select name="type" defaultValue="income">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Thu nhập</SelectItem>
                    <SelectItem value="expense">Chi phí</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Danh mục</Label>
                <Select name="category">
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Input id="description" name="description" placeholder="Mô tả giao dịch" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Số tiền (VNĐ)</Label>
                  <Input id="amount" name="amount" type="number" placeholder="1000000" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Ngày giao dịch</Label>
                  <Input id="date" name="date" type="date" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roomNumber">Số phòng</Label>
                  <Input id="roomNumber" name="roomNumber" placeholder="A101" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tenant">Khách thuê</Label>
                  <Input id="tenant" name="tenant" placeholder="Nguyễn Văn A" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select name="status" defaultValue="completed">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Đã thanh toán</SelectItem>
                    <SelectItem value="pending">Chờ thanh toán</SelectItem>
                    <SelectItem value="overdue">Quá hạn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Hạn thanh toán</Label>
                <Input id="dueDate" name="dueDate" type="date" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                Thêm giao dịch
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
