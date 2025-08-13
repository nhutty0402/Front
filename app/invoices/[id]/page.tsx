"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axiosClient from "@/lib/axiosClient"
import Cookies from "js-cookie"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { Badge } from "@/components/ui/badge"
import { Menu, Printer, ArrowLeft } from "lucide-react"

interface InvoiceDetail {
  ChiSoID: number
  ThangNam: string
  SoDienDaTieuThu: number
  SoNuocDaTieuThu: number
  GiaDienMoi: number | string
  GiaNuocMoi: number | string
  TienPhong: number | string
  TongTien: number | string
  TienNo: number | null
  Tientra?: number | string
  TienTra?: number | string
  TrangThaiThanhToan: string
  DayPhong: string
  SoPhong: string | number
  HoTenKhachHang: string
  SoDienThoai: string
  PhiSuaChua?: number | string
  PhiTru?: number | string
  NgayVao?: string
  NgayBatDau?: string
}

function currency(n: number | string | null | undefined) {
  const num = Number(n || 0)
  return `${num.toLocaleString("vi-VN")} VNĐ`
}

interface InvoiceServiceItem {
  ten: string
  gia: number
}

interface InvoiceViewModel {
  chiSoID: number | string
  phong: string
  thangNam: string
  ngayVao: string
  tenKhachHang: string
  soDienThoai: string
  tienPhong: number
  tienDien: number
  tienNuoc: number
  suaChua: number
  phiTru: number
  tienNo: number
  tienTra: number
  dsDichVu: InvoiceServiceItem[]
  tongCong: number
  tongCongChu: string
  trangThai: string
}

function numberToVietnamese(num: number): string {
  if (!Number.isFinite(num)) return ""
  if (num === 0) return "không"
  const dv = ["", "ngàn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"]
  const ch = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"]
  const readTriple = (n: number, full: boolean): string => {
    const tr = Math.floor(n / 100)
    const chuc = Math.floor((n % 100) / 10)
    const dvn = n % 10
    let s = ""
    if (full || tr > 0) {
      s += ch[tr] + " trăm"
      if (chuc === 0 && dvn > 0) s += " lẻ"
    }
    if (chuc > 0 && chuc !== 1) {
      s += (s ? " " : "") + ch[chuc] + " mươi"
      if (dvn === 1) s += " mốt"
      else if (dvn === 5) s += " lăm"
      else if (dvn > 0) s += " " + ch[dvn]
    } else if (chuc === 1) {
      s += (s ? " " : "") + "mười"
      if (dvn === 1) s += " một"
      else if (dvn === 5) s += " lăm"
      else if (dvn > 0) s += " " + ch[dvn]
    } else if (chuc === 0 && dvn > 0) {
      s += (s ? " " : "") + ch[dvn]
    }
    return s
  }
  let i = 0
  let words: string[] = []
  while (num > 0 && i < dv.length) {
    const n = num % 1000
    if (n !== 0) {
      const prefix = readTriple(n, words.length > 0)
      const unit = dv[i]
      words.unshift(prefix + (unit ? " " + unit : ""))
    }
    num = Math.floor(num / 1000)
    i++
  }
  return words.join(" ").replace(/\s+/g, " ").trim()
}

export default function InvoiceDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<InvoiceDetail | null>(null)
  const [view, setView] = useState<InvoiceViewModel | null>(null)

  useEffect(() => {
    const token = Cookies.get("token")
    console.log("Token từ cookie:", token)
    if (!token || token === "null" || token === "undefined") {
      console.warn("Không có token → chuyển về /login")
      router.replace("/login")
      return
    }
  
    const fetchDetail = async () => {
      try {
        setLoading(true)
        setError(null)
        const id = params?.id
  
        // Gọi API
        const res = await axiosClient.get(`https://all-oqry.onrender.com/api/hoadon/hoadon/chitiet/${id}`)
        console.log("API trả về:", res.data)
  
        // Lấy chi tiết từ API (bất kể dạng nào)
        let detail: any
        if (Array.isArray(res.data)) {
          detail = res.data[0]
        } else if (res.data?.data) {
          detail = res.data.data
        } else {
          detail = res.data
        }
  

        console.log("Chi tiết sau khi parse:", detail)
        setData(detail as InvoiceDetail)
  
        // Chuyển sang ViewModel dựa trên dữ liệu API
        const toNumber = (v: any) => Number(v ?? 0) || 0
  
        const vm: InvoiceViewModel = {
          chiSoID: detail?.chiSoID ?? detail?.ChiSoID,
          phong: detail?.phong || `${String(detail?.DayPhong ?? "").trim()} ${String(detail?.SoPhong ?? "").trim()}`.trim(),
          thangNam: detail?.thangNam || String(detail?.ThangNam ?? ""),
          ngayVao: (detail?.ngayVao || detail?.NgayVao || detail?.NgayBatDau || "-")
            .replace("T00:00:00.000Z", "")
            .replace("T00:00:00Z", ""),
            tenKhachHang:
            (detail?.tenKhachHang ||
              detail?.TenKhachHang ||
              detail?.HoTenKhachHang ||
              detail?.khachHang?.hoTen ||
              detail?.KhachHang?.hoTen ||
              "").trim(),
          // ✅ Lấy SĐT khách hàng từ nhiều key khác nhau
          soDienThoai:
            (detail?.soDienThoai ||
              detail?.SoDienThoai ||
              detail?.SDT ||
              detail?.khachHang?.soDienThoai ||
              detail?.KhachHang?.soDienThoai ||
              "").trim(),
          tienPhong: toNumber(detail?.tienPhong || detail?.TienPhong),
          tienDien: toNumber(detail?.tienDien || detail?.TienDien),
          tienNuoc: toNumber(detail?.tienNuoc || detail?.TienNuoc),
          suaChua: toNumber(detail?.suaChua || detail?.PhiSuaChua),
          phiTru: toNumber(detail?.phiTru || detail?.PhiTru),
          tienTra: toNumber(detail?.tienTra || detail?.TienTra),
          tienNo: toNumber(detail?.tienNo),
          dsDichVu: Array.isArray(detail?.dsDichVu) ? detail.dsDichVu : [],
          tongCong: toNumber(detail?.tongCong),
          tongCongChu: detail?.tongCongChu || (numberToVietnamese(toNumber(detail?.tongCong)) + " đồng"),
          trangThai: detail?.trangThai ||
            (String(detail?.TrangThaiThanhToan) === "Y" || String(detail?.TrangThaiThanhToan) === "0"
              ? "Đã thanh toán"
              : "Chưa thanh toán"),
        }
  
        console.log("InvoiceViewModel:", vm)
        setView(vm)
      } catch (e: any) {
        console.error(e)
        setError(e?.message || "Không thể tải chi tiết hoá đơn")
      } finally {
        setLoading(false)
      }
    }
  
    fetchDetail()
  }, [params?.id, router])
  
  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-50">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <div className="lg:pl-64 p-4 max-w-4xl mx-auto space-y-4">
        {/* Mobile Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 lg:hidden -mx-4 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="font-bold text-lg">Xuất hoá đơn</div>
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Quay lại
          </Button>
        {/* <div className="flex items-center gap-2">
         
          {data && (
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-1" /> In hoá đơn
            </Button>
          )}
        </div> */}

        <Card className="p-6 bg-white">
          {loading && <div>Đang tải...</div>}
          {error && <div className="text-red-600">{error}</div>}
          {!loading && !error && data && view && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xl font-bold">Hoá đơn tiền phòng</div>
                  <div className="text-sm text-gray-600">Tháng: {view.thangNam}</div>
                </div>
                <div>
                  {view.trangThai === "Đã thanh toán" ? (
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">Đã thanh toán</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">Chưa thanh toán</Badge>
                  )}
                </div>
              </div>

              {/* Derived helpers */}
              {(() => {
                return (
                  <div className="max-w-md mx-auto print:max-w-full">
                    {/* Header like screenshot */}
                    <div className="text-center">
                      <div className="text-xl font-extrabold tracking-wide">HÓA ĐƠN TIỀN TRỌ</div>
                    </div>

                    {/* Info left */}
                    <div className="mt-4 space-y-1 text-sm">
                      <div><span className="font-semibold">Họ tên:</span> {view.tenKhachHang}</div>
                      <div><span className="font-semibold">Số điện thoại:</span> {view.soDienThoai}</div>
                      <div><span className="font-semibold">Phòng:</span> {view.phong}</div>
                      <div><span className="font-semibold">Ngày vào:</span> {String(view.ngayVao)}</div>
                    </div>

                    <div className="my-3 border-t" />

                    {/* Rows like receipt */}
                    <div className="text-sm">
                      <div className="flex items-center justify-between py-2">
                        <div>Tiền phòng:</div>
                        <div className="tabular-nums">{currency(view.tienPhong)}</div>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div>Điện:</div>
                        <div className="tabular-nums">{currency(view.tienDien)}</div>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div>Nước:</div>
                        <div className="tabular-nums">{currency(view.tienNuoc)}</div>
                      </div>
                      {view.dsDichVu.map((dv, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2">
                          <div>{dv.ten}:</div>
                          <div className="tabular-nums">{currency(dv.gia)}</div>
                        </div>
                      ))}
                      <div className="flex items-center justify-between py-2">
                        <div>Sửa chữa:</div>
                        <div className="tabular-nums">{currency(view.suaChua)}</div>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div>Phí trừ:</div>
                        <div className="tabular-nums">{currency(view.phiTru)}</div>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div>Tiền trả:</div>
                        <div className="tabular-nums">{currency(view.tienTra)}</div>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div>Tiền nợ:</div>
                        <div className="tabular-nums">{currency(view.tienNo)}</div>
                      </div>
                    </div>

                    <div className="mt-4 text-center">
                      <div className="font-extrabold">TỔNG CỘNG: <span className="text-red-600">{currency(view.tongCong)}</span></div>
                      <div className="text-sm italic mt-1">Bằng chữ: {view.tongCongChu}</div>
                    </div>

                    {/* Chỉ hiển thị các trường theo yêu cầu, ẩn khu vực chữ ký */}

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-6 print:hidden">
                      <Button onClick={() => window.print()} variant="default">In hóa đơn</Button>
                      <Button onClick={() => router.back()} variant="outline">Đóng</Button>
                    </div>
                  </div>
                )
              })()}

            </div>
          )}
        </Card>
      </div>
    </div>
  )
}


