"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Receipt,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Menu,
  AlertCircle,
} from "lucide-react"

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

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "income",
    category: "Tiền thuê phòng",
    description: "Tiền thuê phòng A101 - Tháng 12/2024",
    amount: 3000000,
    date: "2024-12-01",
    roomNumber: "A101",
    tenant: "Nguyễn Văn A",
    status: "completed",
  },
  {
    id: "2",
    type: "income",
    category: "Tiền điện nước",
    description: "Tiền điện nước A101 - Tháng 12/2024",
    amount: 235000,
    date: "2024-12-01",
    roomNumber: "A101",
    tenant: "Nguyễn Văn A",
    status: "completed",
  },
  {
    id: "3",
    type: "income",
    category: "Tiền thuê phòng",
    description: "Tiền thuê phòng B201 - Tháng 12/2024",
    amount: 3200000,
    date: "2024-12-05",
    roomNumber: "B201",
    tenant: "Trần Thị B",
    status: "pending",
    dueDate: "2024-12-05",
  },
  {
    id: "4",
    type: "expense",
    category: "Bảo trì",
    description: "Sửa chữa điều hòa phòng C202",
    amount: 500000,
    date: "2024-12-03",
    roomNumber: "C202",
    status: "completed",
  },
  {
    id: "5",
    type: "expense",
    category: "Tiện ích",
    description: "Tiền điện chung khu vực",
    amount: 800000,
    date: "2024-12-02",
    status: "completed",
  },
  {
    id: "6",
    type: "income",
    category: "Tiền thuê phòng",
    description: "Tiền thuê phòng A103 - Tháng 12/2024",
    amount: 2900000,
    date: "2024-11-25",
    roomNumber: "A103",
    tenant: "Lê Văn C",
    status: "overdue",
    dueDate: "2024-12-01",
  },
]

const categories = {
  income: ["Tiền thuê phòng", "Tiền điện nước", "Tiền dịch vụ", "Tiền cọc", "Khác"],
  expense: ["Bảo trì", "Tiện ích", "Vật tư", "Nhân công", "Thuế", "Khác"],
}

const statusColors = {
  completed: "bg-green-500",
  pending: "bg-yellow-500",
  overdue: "bg-red-500",
}

const statusLabels = {
  completed: "Đã thanh toán",
  pending: "Chờ thanh toán",
  overdue: "Quá hạn",
}

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState("2024-12")

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesType = filterType === "all" || transaction.type === filterType
    const matchesStatus = filterStatus === "all" || transaction.status === filterStatus
    const matchesCategory = filterCategory === "all" || transaction.category === filterCategory
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.tenant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMonth = transaction.date.startsWith(selectedMonth)

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
        {/* Mobile Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 lg:hidden">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Tài chính</h1>
              <p className="text-sm text-gray-500">{filteredTransactions.length} giao dịch</p>
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
                <DialogContent className="sm:max-w-[425px] mx-4">
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
                          <Label htmlFor="roomNumber">Số phòng (tùy chọn)</Label>
                          <Input id="roomNumber" name="roomNumber" placeholder="A101" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tenant">Khách thuê (tùy chọn)</Label>
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
                        <Label htmlFor="dueDate">Hạn thanh toán (tùy chọn)</Label>
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
          </div>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng thu nhập</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</div>
                <p className="text-xs text-muted-foreground">Đã thu trong tháng</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng chi phí</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</div>
                <p className="text-xs text-muted-foreground">Đã chi trong tháng</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lợi nhuận ròng</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${netIncome >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(netIncome)}
                </div>
                <p className="text-xs text-muted-foreground">Thu nhập - Chi phí</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chờ thu</CardTitle>
                <AlertCircle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {formatCurrency(pendingIncome + overdueIncome)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Pending: {formatCurrency(pendingIncome)} • Overdue: {formatCurrency(overdueIncome)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Month Selector */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Chọn tháng</CardTitle>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-12">Tháng 12/2024</SelectItem>
                    <SelectItem value="2024-11">Tháng 11/2024</SelectItem>
                    <SelectItem value="2024-10">Tháng 10/2024</SelectItem>
                    <SelectItem value="2024-09">Tháng 9/2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
          </Card>

          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm giao dịch, khách thuê, phòng..."
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
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="income">Thu nhập</SelectItem>
                      <SelectItem value="expense">Chi phí</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="completed">Đã thanh toán</SelectItem>
                      <SelectItem value="pending">Chờ thanh toán</SelectItem>
                      <SelectItem value="overdue">Quá hạn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Danh mục" />
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
          </div>

          {/* Add Transaction Button - Mobile */}
          <div className="lg:hidden">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm giao dịch mới
                </Button>
              </DialogTrigger>
              <DialogContent className="mx-4 max-w-sm">
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
                    <div className="space-y-2">
                      <Label htmlFor="amount">Số tiền (VNĐ)</Label>
                      <Input id="amount" name="amount" type="number" placeholder="1000000" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Ngày giao dịch</Label>
                      <Input id="date" name="date" type="date" required />
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

          {/* Transactions List */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Danh sách giao dịch</CardTitle>
              <CardDescription>
                Hiển thị {filteredTransactions.length} giao dịch trong tháng {selectedMonth}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-full ${transaction.type === "income" ? "bg-green-100" : "bg-red-100"}`}
                      >
                        {transaction.type === "income" ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                          <Badge className={statusColors[transaction.status]} size="sm">
                            {statusLabels[transaction.status]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{transaction.category}</span>
                          <span>•</span>
                          <span>{formatDate(transaction.date)}</span>
                          {transaction.roomNumber && (
                            <>
                              <span>•</span>
                              <span>Phòng {transaction.roomNumber}</span>
                            </>
                          )}
                          {transaction.tenant && (
                            <>
                              <span>•</span>
                              <span>{transaction.tenant}</span>
                            </>
                          )}
                        </div>
                        {transaction.dueDate && transaction.status !== "completed" && (
                          <div className="text-xs text-orange-600 mt-1">
                            Hạn thanh toán: {formatDate(transaction.dueDate)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div
                          className={`text-lg font-bold ${
                            transaction.type === "income" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteTransaction(transaction.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredTransactions.length === 0 && (
                <div className="text-center py-12">
                  <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Không có giao dịch nào</h3>
                  <p className="text-gray-600">Thêm giao dịch mới để bắt đầu theo dõi tài chính</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
