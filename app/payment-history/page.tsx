"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import axiosClient from "@/lib/axiosClient"
import Cookies from "js-cookie"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { Menu } from "lucide-react"

type RawInvoice = Record<string, any>

interface CustomerAggregate {
  customerName: string
  customerId?: string | number
  roomLabel: string
  totalPaid: number
  totalDebt: number
  status: "Đã thanh toán" | "Cần thanh toán" | "Còn nợ"
}

interface SingleMonthRow {
  ChiSoID?: number | string
  ThangNam: string
  TongTien: number
  TienTra: number
  TienNo: number
  TrangThaiThanhToan: string
}

function normalizeMonthToLabel(value: string | null | undefined): string {
  if (!value) return ""
  // Accept MM/YYYY or YYYY-MM
  if (/^\d{2}\/\d{4}$/.test(value)) return value
  if (/^\d{4}-\d{2}$/.test(value)) {
    const [yyyy, mm] = value.split("-")
    return `${mm}/${yyyy}`
  }
  return ""
}

function currency(n: number): string {
  return `${(Number(n) || 0).toLocaleString("vi-VN")} VNĐ`
}

export default function PaymentHistoryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const viewMode = (searchParams.get("view") || "list").toLowerCase() as "list" | "single"
  const selectedCustomer = searchParams.get("customer") || ""
  const selectedCustomerId = searchParams.get("customerId") || ""

  const [loading, setLoading] = useState(false)
  const [invoices, setInvoices] = useState<RawInvoice[]>([])
  const [error, setError] = useState<string | null>(null)
  const [paymentHistory, setPaymentHistory] = useState<RawInvoice[]>([])

  // Filters (single view)
  const [filterMonth, setFilterMonth] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // List view controls
  const [sortBy, setSortBy] = useState<string>("name")
  const [searchText, setSearchText] = useState<string>("")

  const fetchInvoices = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axiosClient.get("https://all-oqry.onrender.com/api/hoadon/hoadon")
      const list: any[] = Array.isArray(res.data) ? res.data : res.data?.data || []
      setInvoices(list)
    } catch (e: any) {
      setError(e?.message || "Không thể tải dữ liệu hoá đơn")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchPaymentHistory = useCallback(async () => {
    try {
      const res = await axiosClient.get("https://all-oqry.onrender.com/api/lichsuthanhtoan/")
      const list: any[] = Array.isArray(res.data) ? res.data : res.data?.data || []
      setPaymentHistory(list)
    } catch (e) {
      // Không chặn UI nếu API phụ lỗi
      console.warn("Không thể tải lịch sử thanh toán:", e)
    }
  }, [])

  useEffect(() => {
    const token = Cookies.get("token")
    console.log("Token từ cookie:", token)
    if (!token || token === "null" || token === "undefined") {
      console.warn("Không có token → chuyển về /login")
      router.replace("/login")
      return
    }
    // Tải song song hóa đơn và lịch sử thanh toán để lấy tên khách hàng
    fetchInvoices()
    fetchPaymentHistory()
  }, [fetchInvoices, fetchPaymentHistory, router])

  // Derive months for filter from data
  const uniqueMonths: string[] = useMemo(() => {
    const s = new Set<string>()
    invoices.forEach((x) => {
      const label = normalizeMonthToLabel(x?.ThangNam)
      if (label) s.add(label)
    })
    return Array.from(s).sort((a, b) => {
      // sort by year desc then month desc
      const [ma, ya] = a.split("/")
      const [mb, yb] = b.split("/")
      if (ya !== yb) return Number(yb) - Number(ya)
      return Number(mb) - Number(ma)
    })
  }, [invoices])

  // Build aggregate for list view by customer
  const customerNameMap = useMemo(() => {
    const m = new Map<string, string>()
    paymentHistory.forEach((ph) => {
      const id = String(
        ph?.KhachHangID ?? ph?.KhachHangId ?? ph?.KhachHang_id ?? "",
      )
      const name = String(
        ph?.HoTenKhachHang ?? ph?.TenKhachHang ?? ph?.KhachHang ?? "",
      ).trim()
      if (id && name) m.set(id, name)
    })
    return m
  }, [paymentHistory])

  const customerAggregates: CustomerAggregate[] = useMemo(() => {
    const map = new Map<string, CustomerAggregate & { paidCount: number; unpaidCount: number }>()
    invoices.forEach((item) => {
      const customerIdRaw = String(item?.KhachHangID ?? item?.KhachHangId ?? item?.KhachHang_id ?? "")
      const nameFromHistory = customerIdRaw ? customerNameMap.get(customerIdRaw) : undefined
      const name = String(nameFromHistory || item?.HoTenKhachHang || item?.KhachHang || "Khách hàng")
      const key = (customerIdRaw || name) + "|" + String(item?.DayPhong ?? "") + String(item?.SoPhong ?? "")
      const roomLabel = `${String(item?.DayPhong ?? "")} ${String(item?.SoPhong ?? "")}`.trim()
      const statusRaw = String(item?.TrangThaiThanhToan ?? "")
      // Interpret: "0" or "Y" => paid
      const isPaid = statusRaw === "0" || statusRaw === "Y"
      const tongTien = Number(item?.TongTien ?? item?.TienPhong ?? 0)
      const tienTra = Number(item?.TienTra ?? (isPaid ? tongTien : 0))
      const tienNo = Math.max(0, tongTien - tienTra)

      if (!map.has(key)) {
        map.set(key, {
          customerName: name,
          customerId: customerIdRaw || (item?.KhachHangID ?? item?.KhachHangId ?? item?.KhachHang_id),
          roomLabel,
          totalPaid: 0,
          totalDebt: 0,
          paidCount: 0,
          unpaidCount: 0,
          status: "Cần thanh toán",
        })
      }
      const agg = map.get(key)!
      agg.totalPaid += isPaid ? tongTien : Math.max(0, Math.min(tongTien, tienTra))
      agg.totalDebt += isPaid ? 0 : tienNo
      if (isPaid) agg.paidCount += 1
      else agg.unpaidCount += 1
      agg.status = agg.unpaidCount === 0 ? "Đã thanh toán" : agg.totalDebt > 0 ? "Còn nợ" : "Cần thanh toán"
    })
    return Array.from(map.values())
  }, [invoices])

  // Rows for single view (for a customer) from invoices filter by name
  const singleRows: SingleMonthRow[] = useMemo(() => {
    if (!selectedCustomer && !selectedCustomerId) return []
    const rows = invoices
      .filter((x) => {
        if (selectedCustomerId) {
          return String(x?.KhachHangID ?? x?.KhachHangId ?? x?.KhachHang_id ?? "") === selectedCustomerId
        }
        return String(x?.HoTenKhachHang || x?.KhachHang || "").toLowerCase() === selectedCustomer.toLowerCase()
      })
      .map((x) => {
        const statusRaw = String(x?.TrangThaiThanhToan ?? "")
        const isPaid = statusRaw === "0" || statusRaw === "Y"
        const TongTien = Number(x?.TongTien ?? x?.TienPhong ?? 0)
        const TienTra = Number(x?.TienTra ?? (isPaid ? TongTien : 0))
        const TienNo = Math.max(0, TongTien - TienTra)
        return {
          ChiSoID: x?.ChiSoID ?? x?.id,
          ThangNam: normalizeMonthToLabel(x?.ThangNam) || "",
          TongTien,
          TienTra,
          TienNo,
          TrangThaiThanhToan: isPaid ? "Y" : statusRaw || "N",
        }
      })
    return rows
  }, [invoices, selectedCustomer])

  const filteredSingleRows = useMemo(() => {
    return singleRows.filter((r) => {
      const monthOk = filterMonth === "all" || r.ThangNam === filterMonth
      const statusOk = filterStatus === "all" || r.TrangThaiThanhToan === filterStatus
      return monthOk && statusOk
    })
  }, [singleRows, filterMonth, filterStatus])

  const statsSingle = useMemo(() => {
    const soLanThanhToan = singleRows.length
    const tongNo = singleRows.reduce((s, r) => s + (Number.isFinite(r.TienNo) ? r.TienNo : 0), 0)
    const tongDaThanhToan = singleRows.reduce((s, r) => s + (Number.isFinite(r.TienTra) ? r.TienTra : 0), 0)
    return { soLanThanhToan, tongNo, tongDaThanhToan }
  }, [singleRows])

  const sortedAndSearchedAggregates = useMemo(() => {
    const lower = searchText.trim().toLowerCase()
    const fil = customerAggregates.filter((c) => {
      if (!lower) return true
      return (
        c.customerName.toLowerCase().includes(lower) ||
        c.roomLabel.toLowerCase().includes(lower)
      )
    })
    const arr = [...fil]
    arr.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.customerName.localeCompare(b.customerName)
        case "room":
          return a.roomLabel.localeCompare(b.roomLabel)
        case "status":
          return a.status.localeCompare(b.status)
        case "debt":
          return b.totalDebt - a.totalDebt
        default:
          return 0
      }
    })
    return arr
  }, [customerAggregates, sortBy, searchText])

  const gotoList = () => {
    const sp = new URLSearchParams(searchParams.toString())
    sp.delete("view")
    sp.delete("customer")
    router.push(`/payment-history?${sp.toString()}`)
  }

  const gotoSingle = (customerId: string | number | undefined, customerName: string) => {
    const sp = new URLSearchParams(searchParams.toString())
    sp.set("view", "single")
    if (customerId != null) sp.set("customerId", String(customerId))
    sp.set("customer", customerName)
    router.push(`/payment-history?${sp.toString()}`)
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
      <div className="lg:pl-64 p-4 max-w-6xl mx-auto space-y-4">
        {/* Mobile Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 lg:hidden -mx-4 px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Lịch sử thanh toán</h1>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {error && (
          <Card className="p-4 bg-red-50 text-red-700 border-red-200">{error}</Card>
        )}

        {viewMode === "single" ? (
          <>
            <div>
              <Button variant="link" onClick={gotoList} className="px-0">← Quay lại danh sách</Button>
            </div>
            <h2 className="text-2xl font-bold flex items-center gap-2">Lịch Sử Thanh Toán: <span className="text-primary-600">{selectedCustomer || (customerAggregates.find(c => String(c.customerId||"")===selectedCustomerId)?.customerName || "")}</span></h2>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <div className="text-sm text-gray-500">Số lần thanh toán</div>
                <div className="text-2xl font-bold mt-1">{statsSingle.soLanThanhToan}</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-sm text-gray-500">Tổng nợ</div>
                <div className="text-2xl font-bold mt-1 text-red-600">{currency(statsSingle.tongNo)}</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-sm text-gray-500">Đã thanh toán</div>
                <div className="text-2xl font-bold mt-1 text-green-600">{currency(statsSingle.tongDaThanhToan)}</div>
              </Card>
            </div>

            <Card className="p-4">
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Tháng:</span>
                  <Select value={filterMonth} onValueChange={setFilterMonth}>
                    <SelectTrigger className="w-40 h-9">
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      {uniqueMonths.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Trạng thái:</span>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-48 h-9">
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="Y">Đã thanh toán</SelectItem>
                      <SelectItem value="N">Chưa thanh toán</SelectItem>
                      <SelectItem value="T">Thanh toán một phần</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="p-2">Tháng</th>
                      <th className="p-2">Tổng tiền</th>
                      <th className="p-2">Đã thanh toán</th>
                      <th className="p-2">Còn nợ</th>
                      <th className="p-2">Trạng thái</th>
                      <th className="p-2">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSingleRows.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center p-6 text-gray-500">Không có dữ liệu thanh toán</td>
                      </tr>
                    )}
                    {filteredSingleRows.map((r) => (
                      <tr key={`${r.ChiSoID}-${r.ThangNam}`} className="border-b">
                        <td className="p-2">{r.ThangNam}</td>
                        <td className="p-2">{currency(r.TongTien)}</td>
                        <td className="p-2">{currency(r.TienTra)}</td>
                        <td className="p-2">{currency(r.TienNo)}</td>
                        <td className="p-2">
                          {r.TrangThaiThanhToan === "Y" ? (
                            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 text-xs">Đã thanh toán</Badge>
                          ) : r.TrangThaiThanhToan === "T" ? (
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">Thanh toán một phần</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 text-xs">Chưa thanh toán</Badge>
                          )}
                        </td>
                        <td className="p-2">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => router.push(`/finance`)}>Xem</Button>
                            {r.TrangThaiThanhToan !== "Y" && (
                              <Button size="sm" onClick={() => router.push(`/finance`)}>Thanh toán</Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        ) : (
          <>

            <Card className="p-4">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Sắp xếp theo:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-56 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Tên khách hàng</SelectItem>
                      <SelectItem value="room">Phòng</SelectItem>
                      <SelectItem value="status">Trạng thái thanh toán</SelectItem>
                      <SelectItem value="debt">Số tiền nợ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="ml-auto min-w-[220px]">
                  <Input placeholder="Tìm khách hàng..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="p-2">Khách hàng</th>
                      <th className="p-2">Phòng/Dãy</th>
                      <th className="p-2">Tổng đã thanh toán</th>
                      <th className="p-2">Còn nợ</th>
                      <th className="p-2">Trạng thái</th>
                      <th className="p-2">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedAndSearchedAggregates.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center p-6 text-gray-500">Không có khách hàng nào</td>
                      </tr>
                    )}
                    {sortedAndSearchedAggregates.map((c, idx) => (
                      <tr key={`${c.customerName}-${idx}`} className="border-b">
                        <td className="p-2">{c.customerName}</td>
                        <td className="p-2">{c.roomLabel}</td>
                        <td className="p-2">{currency(c.totalPaid)}</td>
                        <td className="p-2">{currency(c.totalDebt)}</td>
                        <td className="p-2">
                          {c.status === "Đã thanh toán" ? (
                            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 text-xs">Đã thanh toán</Badge>
                          ) : c.status === "Cần thanh toán" ? (
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">Cần thanh toán</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 text-xs">Còn nợ</Badge>
                          )}
                        </td>
                        <td className="p-2">
                          <Button size="sm" onClick={() => gotoSingle(c.customerId, c.customerName)}>Chi tiết</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}

        {loading && (
          <Card className="p-4">Đang tải...</Card>
        )}
      </div>
    </div>
  )
}


