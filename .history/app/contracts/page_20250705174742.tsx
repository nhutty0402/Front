"use client"

import { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { Plus, Edit, Trash2, FileText, Calendar, Menu, Eye, Download, User, Building } from "lucide-react"

interface ContractAPI {
  QuanLiID: number
  PhongID_id: number
  KhachHangID_id: number
  DayPhong: string
  NgayBatDau: string
  NgayKetThuc: string
  ChuKy: string
  TienDatCoc: number
  TrangThaiHopDong: string
  NgayTaoHopDong: string
  SoLuongThanhVien: number
  GhiChuHopDong: string
  ThoiHanHopDong: string
}

interface Customer {
  HoTenKhachHang: string
  SoDienThoai: string
  NgaySinh: string
  GioiTinh: string
  CongViec: string
  TinhThanh: string
  QuanHuyen: string
  PhuongXa: string
  DiaChiCuThe: string
  SoCCCD: string
  NgayCapCCCD: string
  NoiCapCCCD: string
}

interface Room {
  PhongID: number
  SoPhong: string
  DayPhong: string
  GiaPhong: string
  TrangThaiPhong: string
  MoTaPhong: string
  DienTich: string
  TienIch: string[]
}

interface Manager {
  QuanLiID: number
  SoDienThoaiDN: string
  HoTenQuanLi: string
  DiaChiChiTiet: string
  GioiTinh: string
  NgaySinh: string
  Phuong: string
  Quan: string
  SoCCCD: string
  ThanhPho: string
}

interface Contract {
  id: string
  contractNumber: string
  room: string
  building: string
  tenant: string
  tenantPhone: string
  startDate: string
  endDate: string
  rentAmount: number
  deposit: number
  status: "active" | "expired" | "terminated" | "pending"
  terms: string
  createdDate: string
  witnesses?: string
  emergencyContact?: string
  emergencyPhone?: string
  contractAPI?: ContractAPI
  customerData?: Customer
  roomData?: Room
  managerData?: Manager
}

const mockContracts: Contract[] = [
  {
    id: "1",
    contractNumber: "HD001",
    room: "A101",
    building: "A",
    tenant: "Nguyễn Văn A",
    tenantPhone: "0901234567",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    rentAmount: 3000000,
    deposit: 6000000,
    status: "active",
    terms: "Thanh toán trước ngày 5 hàng tháng. Không được nuôi thú cưng.",
    createdDate: "2024-12-20",
    witnesses: "Trần Thị B",
    emergencyContact: "Nguyễn Thị C",
    emergencyPhone: "0912345678",
  },
]

const statusColors = {
  active: "bg-green-500",
  expired: "bg-red-500",
  terminated: "bg-gray-500",
  pending: "bg-yellow-500",
}

const statusLabels = {
  active: "Đang hiệu lực",
  expired: "Hết hạn",
  terminated: "Đã chấm dứt",
  pending: "Chờ ký",
}

const contractTerms = `TRÁCH NHIỆM CỦA BÊN B (KHÁCH THUÊ):

1. Thanh toán đầy đủ tiền theo đúng thỏa thuận.

2. Bảo quản các trang thiết bị và tài sản vật chất của bên A trong thời gian thuê (làm hỏng phải sửa, mất phải đền).

3. Không được tự ý sửa chữa, cải tạo cơ sở vật chất khi chưa được sự đồng ý của bên A.

4. Luôn có ý thức giữ gìn vệ sinh trong và ngoài khu vực phòng trọ.

5. Bên B phải chấp hành mọi quy định của pháp luật Nhà nước và quy định của địa phương.

6. Nếu bên B cho khách ở qua đêm thì phải báo trước và được sự đồng ý của bên A, đồng thời phải chịu trách nhiệm về các hành vi vi phạm pháp luật của khách trong thời gian ở lại (nếu có).

TRÁCH NHIỆM CHUNG:

1. Hai bên phải tạo điều kiện thuận lợi cho nhau để thực hiện hợp đồng.

2. Nếu một trong hai bên vi phạm hợp đồng trong thời gian hợp đồng vẫn còn hiệu lực thì bên còn lại có quyền đơn phương chấm dứt hợp đồng thuê nhà trọ. Ngoài ra, nếu hành vi vi phạm đó gây tổn thất cho bên bị vi phạm thì bên vi phạm sẽ phải bồi thường mọi thiệt hại gây ra.

3. Trong trường hợp muốn chấm dứt hợp đồng trước thời hạn, cần phải báo trước cho bên kia ít nhất 30 ngày và hai bên phải có sự thống nhất với nhau.

4. Kết thúc hợp đồng, Bên A phải trả lại đầy đủ tiền đặt cọc cho bên B.

5. Bên nào vi phạm các điều khoản chung thì phải chịu trách nhiệm trước pháp luật.

6. Hợp đồng này được lập thành 02 bản và có giá trị pháp lý như nhau, mỗi bên giữ một bản.`

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>(mockContracts)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [prefilledRoom, setPrefilledRoom] = useState("")
  const [prefilledBuilding, setPrefilledBuilding] = useState("")

  // Check URL params for prefilled room info
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const room = urlParams.get("room")
    const building = urlParams.get("building")

    if (room && building) {
      setPrefilledRoom(room)
      setPrefilledBuilding(building)
      setIsAddDialogOpen(true)

      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const filteredContracts = contracts.filter((contract) => {
    const matchesStatus = filterStatus === "all" || contract.status === filterStatus
    const matchesSearch =
      contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.room.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleAddContract = async (formData: FormData) => {
    // Get manager profile from localStorage
    const savedProfile = localStorage.getItem("managerProfile")
    const managerProfile = savedProfile
      ? JSON.parse(savedProfile)
      : {
          QuanLiID: 6,
          SoDienThoaiDN: "0857870065",
          HoTenQuanLi: "Phạm Ty",
          DiaChiChiTiet: "456 đường Nguyễn Văn Cừ",
          GioiTinh: "Nữ",
          NgaySinh: "2004-10-31T17:00:00.000Z",
          Phuong: "Bùi Hữu Nghĩa",
          Quan: "Bình Thủy",
          SoCCCD: "123456789012",
          ThanhPho: "Cần Thơ",
          TenNhaTro: "Nhà trọ Phạm Ty",
          DiaChiNhaTro: "456 đường Nguyễn Văn Cừ, Phường Bùi Hữu Nghĩa, Quận Bình Thủy, TP. Cần Thơ",
        }

    // Prepare API data with manager info
    const contractAPI: ContractAPI = {
      QuanLiID: managerProfile.QuanLiID,
      PhongID_id: Number.parseInt(formData.get("roomId") as string) || 33,
      KhachHangID_id: Number.parseInt(formData.get("customerId") as string) || 10,
      DayPhong: formData.get("building") as string,
      NgayBatDau: formData.get("startDate") as string,
      NgayKetThuc: formData.get("endDate") as string,
      ChuKy: formData.get("contractPeriod") as string,
      TienDatCoc: Number.parseInt(formData.get("deposit") as string),
      TrangThaiHopDong: "HoatDong",
      NgayTaoHopDong: new Date().toISOString().split("T")[0],
      SoLuongThanhVien: Number.parseInt(formData.get("memberCount") as string) || 1,
      GhiChuHopDong: (formData.get("notes") as string) || "Hợp đồng chính thức",
      ThoiHanHopDong: formData.get("contractPeriod") as string,
    }

    // Use manager profile data
    const managerData: Manager = {
      QuanLiID: managerProfile.QuanLiID,
      SoDienThoaiDN: managerProfile.SoDienThoaiDN,
      HoTenQuanLi: managerProfile.HoTenQuanLi,
      DiaChiChiTiet: managerProfile.DiaChiChiTiet,
      GioiTinh: managerProfile.GioiTinh,
      NgaySinh: managerProfile.NgaySinh,
      Phuong: managerProfile.Phuong,
      Quan: managerProfile.Quan,
      SoCCCD: managerProfile.SoCCCD,
      ThanhPho: managerProfile.ThanhPho,
    }

    // Rest of the function remains the same...
    const customerData: Customer = {
      HoTenKhachHang: formData.get("tenant") as string,
      SoDienThoai: formData.get("tenantPhone") as string,
      NgaySinh: (formData.get("birthDate") as string) || "1990-01-01",
      GioiTinh: (formData.get("gender") as string) || "Nam",
      CongViec: (formData.get("job") as string) || "Nhân viên",
      TinhThanh: (formData.get("province") as string) || "Cần Thơ",
      QuanHuyen: (formData.get("district") as string) || "Ninh Kiều",
      PhuongXa: (formData.get("ward") as string) || "An Khánh",
      DiaChiCuThe: (formData.get("address") as string) || "123/4 đường ABC",
      SoCCCD: formData.get("idCard") as string,
      NgayCapCCCD: (formData.get("idCardDate") as string) || "2015-05-10",
      NoiCapCCCD: (formData.get("idCardPlace") as string) || "Công an TP Cần Thơ",
    }

    const roomData: Room = {
      PhongID: Number.parseInt(formData.get("roomId") as string) || 15,
      SoPhong: formData.get("room") as string,
      DayPhong: formData.get("building") as string,
      GiaPhong: formData.get("rentAmount") as string,
      TrangThaiPhong: "DaThue",
      MoTaPhong: (formData.get("roomDescription") as string) || "Ghi chú sẽ cập nhật sau",
      DienTich: (formData.get("roomArea") as string) || "12.0",
      TienIch: ["Wifi"],
    }

    const newContract: Contract = {
      id: Date.now().toString(),
      contractNumber: formData.get("contractNumber") as string,
      room: formData.get("room") as string,
      building: formData.get("building") as string,
      tenant: formData.get("tenant") as string,
      tenantPhone: formData.get("tenantPhone") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      rentAmount: Number.parseInt(formData.get("rentAmount") as string),
      deposit: Number.parseInt(formData.get("deposit") as string),
      status: "pending",
      terms: contractTerms,
      createdDate: new Date().toISOString().split("T")[0],
      witnesses: formData.get("witnesses") as string,
      emergencyContact: formData.get("emergencyContact") as string,
      emergencyPhone: formData.get("emergencyPhone") as string,
      contractAPI,
      customerData,
      roomData,
      managerData,
    }

    // In real app, send to API
    console.log("Contract API Data:", contractAPI)
    console.log("Customer Data:", customerData)
    console.log("Room Data:", roomData)
    console.log("Manager Data:", managerData)

    setContracts([...contracts, newContract])
    setIsAddDialogOpen(false)
    setPrefilledRoom("")
    setPrefilledBuilding("")

    alert("Hợp đồng đã được tạo thành công!")
  }

  const handleDeleteContract = (id: string) => {
    if (confirm("Bạn có chắc muốn xóa hợp đồng này?")) {
      setContracts(contracts.filter((contract) => contract.id !== id))
    }
  }

  const handleViewContract = (contract: Contract) => {
    setSelectedContract(contract)
    setIsViewDialogOpen(true)
  }

  const handlePrintContract = (contract: Contract) => {
    // Get manager profile from localStorage if not in contract
    const savedProfile = localStorage.getItem("managerProfile")
    const managerProfile = savedProfile ? JSON.parse(savedProfile) : null

    const manager = contract.managerData ||
      managerProfile || {
        HoTenQuanLi: "Phạm Ty",
        SoDienThoaiDN: "0857870065",
        DiaChiChiTiet: "456 đường Nguyễn Văn Cừ",
        Phuong: "Bùi Hữu Nghĩa",
        Quan: "Bình Thủy",
        ThanhPho: "Cần Thơ",
        SoCCCD: "123456789012",
        NgaySinh: "2004-10-31T17:00:00.000Z",
        TenNhaTro: "Nhà trọ Phạm Ty",
        DiaChiNhaTro: "456 đường Nguyễn Văn Cừ, Phường Bùi Hữu Nghĩa, Quận Bình Thủy, TP. Cần Thơ",
      }

    const customer = contract.customerData
    const room = contract.roomData
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Hợp đồng thuê phòng trọ - ${contract.contractNumber}</title>
      <style>
        body { font-family: 'Times New Roman', serif; line-height: 1.6; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .title { font-size: 18px; font-weight: bold; text-transform: uppercase; }
        .subtitle { font-size: 16px; margin: 10px 0; }
        .content { margin: 20px 0; }
        .section { margin: 15px 0; }
        .signature { display: flex; justify-content: space-between; margin-top: 50px; }
        .signature-box { text-align: center; width: 45%; }
        .bold { font-weight: bold; }
        .indent { margin-left: 20px; }
        .terms { margin: 10px 0; white-space: pre-line; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
        <div class="subtitle">Độc lập - Tự do - Hạnh phúc</div>
        <div style="margin: 20px 0;">***********</div>
        <div class="title">HỢP ĐỒNG THUÊ PHÒNG TRỌ</div>
        <div class="subtitle">Số: ${contract.contractNumber}</div>
      </div>

      <div class="content">
        <div class="section">
          <p>Hôm nay, ngày ${new Date(contract.createdDate).toLocaleDateString("vi-VN")}, tại ${manager?.DiaChiNhaTro || manager?.DiaChiChiTiet || "địa chỉ nhà trọ"}, chúng tôi gồm có:</p>
        </div>

        <div class="section">
          <p class="bold">BÊN A (BÊN CHO THUÊ):</p>
          <div class="indent">
            <p>Ông/Bà: <span class="bold">${manager?.HoTenQuanLi || "Tên quản lý"}</span></p>
            <p>Sinh năm: ${manager?.NgaySinh ? new Date(manager.NgaySinh).getFullYear() : "____"}</p>
            <p>CCCD số: ${manager?.SoCCCD || "____________"}</p>
            <p>Địa chỉ thường trú: ${manager?.DiaChiChiTiet || "____________"}, ${manager?.Phuong || "____"}, ${manager?.Quan || "____"}, ${manager?.ThanhPho || "____"}</p>
            <p>Điện thoại: ${manager?.SoDienThoaiDN || "____________"}</p>
          </div>
        </div>

        <div class="section">
          <p class="bold">BÊN B (BÊN THUÊ):</p>
          <div class="indent">
            <p>Ông/Bà: <span class="bold">${customer?.HoTenKhachHang || contract.tenant}</span></p>
            <p>Sinh năm: ${customer?.NgaySinh ? new Date(customer.NgaySinh).getFullYear() : "____"}</p>
            <p>CCCD số: ${customer?.SoCCCD || "____________"} cấp ngày ${customer?.NgayCapCCCD ? new Date(customer.NgayCapCCCD).toLocaleDateString("vi-VN") : "____"} tại ${customer?.NoiCapCCCD || "____________"}</p>
            <p>Nghề nghiệp: ${customer?.CongViec || "____________"}</p>
            <p>Địa chỉ thường trú: ${customer?.DiaChiCuThe || "____________"}, ${customer?.PhuongXa || "____"}, ${customer?.QuanHuyen || "____"}, ${customer?.TinhThanh || "____"}</p>
            <p>Điện thoại: ${contract.tenantPhone}</p>
          </div>
        </div>

        <div class="section">
          <p>Sau khi bàn bạc, thỏa thuận, hai bên cùng nhau ký kết hợp đồng thuê phòng trọ với những nội dung sau:</p>
        </div>

        <div class="section">
          <p class="bold">ĐIỀU 1: THÔNG TIN PHÒNG THUÊ</p>
          <div class="indent">
            <p>- Phòng số: <span class="bold">${contract.room}</span> (Dãy ${contract.building})</p>
            <p>- Diện tích: ${room?.DienTich || "____"} m²</p>
            <p>- Tiện ích: ${room?.TienIch?.join(", ") || "Wifi"}</p>
            <p>- Mô tả: ${room?.MoTaPhong || "Phòng đầy đủ tiện nghi"}</p>
          </div>
        </div>

        <div class="section">
          <p class="bold">ĐIỀU 2: THỜI HẠN THUÊ</p>
          <div class="indent">
            <p>- Thời hạn thuê: ${contract.contractAPI?.ThoiHanHopDong || "6 tháng"}</p>
            <p>- Từ ngày: ${new Date(contract.startDate).toLocaleDateString("vi-VN")}</p>
            <p>- Đến ngày: ${new Date(contract.endDate).toLocaleDateString("vi-VN")}</p>
          </div>
        </div>

        <div class="section">
          <p class="bold">ĐIỀU 3: GIÁ THUÊ VÀ PHƯƠNG THỨC THANH TOÁN</p>
          <div class="indent">
            <p>- Giá thuê: <span class="bold">${contract.rentAmount.toLocaleString()} VNĐ/tháng</span></p>
            <p>- Tiền đặt cọc: <span class="bold">${contract.deposit.toLocaleString()} VNĐ</span></p>
            <p>- Thanh toán: Trước ngày 5 hàng tháng</p>
            <p>- Số lượng thành viên: ${contract.contractAPI?.SoLuongThanhVien || 1} người</p>
          </div>
        </div>

        <div class="section">
          <p class="bold">ĐIỀU 4: TRÁCH NHIỆM CỦA CÁC BÊN</p>
          <div class="terms">${contract.terms}</div>
        </div>

        <div class="section">
          <p>Hợp đồng có hiệu lực kể từ ngày ký và được lập thành 02 bản có giá trị pháp lý như nhau, mỗi bên giữ 01 bản.</p>
        </div>

        <div class="signature">
          <div class="signature-box">
            <p class="bold">ĐẠI DIỆN BÊN A</p>
            <p>(Ký và ghi rõ họ tên)</p>
            <br><br><br>
            <p class="bold">${manager?.HoTenQuanLi || "Tên quản lý"}</p>
          </div>
          <div class="signature-box">
            <p class="bold">ĐẠI DIỆN BÊN B</p>
            <p>(Ký và ghi rõ họ tên)</p>
            <br><br><br>
            <p class="bold">${customer?.HoTenKhachHang || contract.tenant}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const generateContractHTML = (contract: Contract) => {
    // Get manager profile from localStorage if not in contract
    const savedProfile = localStorage.getItem("managerProfile")
    const managerProfile = savedProfile ? JSON.parse(savedProfile) : null

    const manager = contract.managerData ||
      managerProfile || {
        HoTenQuanLi: "Phạm Ty",
        SoDienThoaiDN: "0857870065",
        DiaChiChiTiet: "456 đường Nguyễn Văn Cừ",
        Phuong: "Bùi Hữu Nghĩa",
        Quan: "Bình Thủy",
        ThanhPho: "Cần Thơ",
        SoCCCD: "123456789012",
        NgaySinh: "2004-10-31T17:00:00.000Z",
        TenNhaTro: "Nhà trọ Phạm Ty",
        DiaChiNhaTro: "456 đường Nguyễn Văn Cừ, Phường Bùi Hữu Nghĩa, Quận Bình Thủy, TP. Cần Thơ",
      }

    const customer = contract.customerData
    const room = contract.roomData

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Hợp đồng thuê phòng trọ - ${contract.contractNumber}</title>
        <style>
          body { font-family: 'Times New Roman', serif; line-height: 1.6; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .title { font-size: 18px; font-weight: bold; text-transform: uppercase; }
          .subtitle { font-size: 16px; margin: 10px 0; }
          .content { margin: 20px 0; }
          .section { margin: 15px 0; }
          .signature { display: flex; justify-content: space-between; margin-top: 50px; }
          .signature-box { text-align: center; width: 45%; }
          .bold { font-weight: bold; }
          .indent { margin-left: 20px; }
          .terms { margin: 10px 0; white-space: pre-line; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
          <div class="subtitle">Độc lập - Tự do - Hạnh phúc</div>
          <div style="margin: 20px 0;">***********</div>
          <div class="title">HỢP ĐỒNG THUÊ PHÒNG TRỌ</div>
          <div class="subtitle">Số: ${contract.contractNumber}</div>
        </div>

        <div class="content">
          <div class="section">
            <p>Hôm nay, ngày ${new Date(contract.createdDate).toLocaleDateString("vi-VN")}, tại ${manager?.DiaChiNhaTro || manager?.DiaChiChiTiet || "địa chỉ nhà trọ"}, chúng tôi gồm có:</p>
          </div>

          <div class="section">
            <p class="bold">BÊN A (BÊN CHO THUÊ):</p>
            <div class="indent">
              <p>Ông/Bà: <span class="bold">${manager?.HoTenQuanLi || "Tên quản lý"}</span></p>
              <p>Sinh năm: ${manager?.NgaySinh ? new Date(manager.NgaySinh).getFullYear() : "____"}</p>
              <p>CCCD số: ${manager?.SoCCCD || "____________"}</p>
              <p>Địa chỉ thường trú: ${manager?.DiaChiChiTiet || "____________"}, ${manager?.Phuong || "____"}, ${manager?.Quan || "____"}, ${manager?.ThanhPho || "____"}</p>
              <p>Điện thoại: ${manager?.SoDienThoaiDN || "____________"}</p>
            </div>
          </div>

          <div class="section">
            <p class="bold">BÊN B (BÊN THUÊ):</p>
            <div class="indent">
              <p>Ông/Bà: <span class="bold">${customer?.HoTenKhachHang || contract.tenant}</span></p>
              <p>Sinh năm: ${customer?.NgaySinh ? new Date(customer.NgaySinh).getFullYear() : "____"}</p>
              <p>CCCD số: ${customer?.SoCCCD || "____________"} cấp ngày ${customer?.NgayCapCCCD ? new Date(customer.NgayCapCCCD).toLocaleDateString("vi-VN") : "____"} tại ${customer?.NoiCapCCCD || "____________"}</p>
              <p>Nghề nghiệp: ${customer?.CongViec || "____________"}</p>
              <p>Địa chỉ thường trú: ${customer?.DiaChiCuThe || "____________"}, ${customer?.PhuongXa || "____"}, ${customer?.QuanHuyen || "____"}, ${customer?.TinhThanh || "____"}</p>
              <p>Điện thoại: ${contract.tenantPhone}</p>
            </div>
          </div>

          <div class="section">
            <p>Sau khi bàn bạc, thỏa thuận, hai bên cùng nhau ký kết hợp đồng thuê phòng trọ với những nội dung sau:</p>
          </div>

          <div class="section">
            <p class="bold">ĐIỀU 1: THÔNG TIN PHÒNG THUÊ</p>
            <div class="indent">
              <p>- Phòng số: <span class="bold">${contract.room}</span> (Dãy ${contract.building})</p>
              <p>- Diện tích: ${room?.DienTich || "____"} m²</p>
              <p>- Tiện ích: ${room?.TienIch?.join(", ") || "Wifi"}</p>
              <p>- Mô tả: ${room?.MoTaPhong || "Phòng đầy đủ tiện nghi"}</p>
            </div>
          </div>

          <div class="section">
            <p class="bold">ĐIỀU 2: THỜI HẠN THUÊ</p>
            <div class="indent">
              <p>- Thời hạn thuê: ${contract.contractAPI?.ThoiHanHopDong || "6 tháng"}</p>
              <p>- Từ ngày: ${new Date(contract.startDate).toLocaleDateString("vi-VN")}</p>
              <p>- Đến ngày: ${new Date(contract.endDate).toLocaleDateString("vi-VN")}</p>
            </div>
          </div>

          <div class="section">
            <p class="bold">ĐIỀU 3: GIÁ THUÊ VÀ PHƯƠNG THỨC THANH TOÁN</p>
            <div class="indent">
              <p>- Giá thuê: <span class="bold">${contract.rentAmount.toLocaleString()} VNĐ/tháng</span></p>
              <p>- Tiền đặt cọc: <span class="bold">${contract.deposit.toLocaleString()} VNĐ</span></p>
              <p>- Thanh toán: Trước ngày 5 hàng tháng</p>
              <p>- Số lượng thành viên: ${contract.contractAPI?.SoLuongThanhVien || 1} người</p>
            </div>
          </div>

          <div class="section">
            <p class="bold">ĐIỀU 4: TRÁCH NHIỆM CỦA CÁC BÊN</p>
            <div class="terms">${contract.terms}</div>
          </div>

          <div class="section">
            <p>Hợp đồng có hiệu lực kể từ ngày ký và được lập thành 02 bản có giá trị pháp lý như nhau, mỗi bên giữ 01 bản.</p>
          </div>

          <div class="signature">
            <div class="signature-box">
              <p class="bold">ĐẠI DIỆN BÊN A</p>
              <p>(Ký và ghi rõ họ tên)</p>
              <br><br><br>
              <p class="bold">${manager?.HoTenQuanLi || "Tên quản lý"}</p>
            </div>
            <div class="signature-box">
              <p class="bold">ĐẠI DIỆN BÊN B</p>
              <p>(Ký và ghi rõ họ tên)</p>
              <br><br><br>
              <p class="bold">${customer?.HoTenKhachHang || contract.tenant}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }

  const getDaysUntilExpiry = (endDate: string) => {
    const today = new Date()
    const expiry = new Date(endDate)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Hợp đồng</h1>
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="mb-4 lg:mb-6 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Quản lý Hợp đồng</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">
                Quản lý hợp đồng thuê phòng và theo dõi thời hạn
              </p>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full lg:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo hợp đồng mới
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] mx-4 max-h-[90vh] overflow-y-auto">
                <form action={handleAddContract}>
                  <DialogHeader>
                    <DialogTitle>Tạo hợp đồng mới</DialogTitle>
                    <DialogDescription>Nhập thông tin hợp đồng thuê phòng</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    {/* Contract Info */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Thông tin hợp đồng
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contractNumber">Số hợp đồng</Label>
                          <Input id="contractNumber" name="contractNumber" placeholder="HD001" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contractPeriod">Chu kỳ hợp đồng</Label>
                          <Select name="contractPeriod" defaultValue="6 tháng">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3 tháng">3 tháng</SelectItem>
                              <SelectItem value="6 tháng">6 tháng</SelectItem>
                              <SelectItem value="12 tháng">12 tháng</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="memberCount">Số lượng thành viên</Label>
                          <Input id="memberCount" name="memberCount" type="number" defaultValue="1" min="1" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="startDate">Ngày bắt đầu</Label>
                          <Input id="startDate" name="startDate" type="date" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="endDate">Ngày kết thúc</Label>
                          <Input id="endDate" name="endDate" type="date" required />
                        </div>
                      </div>
                    </div>

                    {/* Room Info */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        Thông tin phòng
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="building">Dãy</Label>
                          <Select name="building" defaultValue={prefilledBuilding || "A"}>
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
                        <div className="space-y-2">
                          <Label htmlFor="room">Phòng</Label>
                          <Input id="room" name="room" placeholder="A101" defaultValue={prefilledRoom} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="roomArea">Diện tích (m²)</Label>
                          <Input id="roomArea" name="roomArea" type="number" placeholder="12" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="roomId">Room ID</Label>
                          <Input id="roomId" name="roomId" type="number" placeholder="15" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="roomDescription">Mô tả phòng</Label>
                        <Input id="roomDescription" name="roomDescription" placeholder="Phòng đầy đủ tiện nghi" />
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Thông tin khách thuê
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="tenant">Tên khách thuê</Label>
                          <Input id="tenant" name="tenant" placeholder="Nguyễn Văn A" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tenantPhone">Số điện thoại</Label>
                          <Input id="tenantPhone" name="tenantPhone" placeholder="0901234567" required />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="birthDate">Ngày sinh</Label>
                          <Input id="birthDate" name="birthDate" type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender">Giới tính</Label>
                          <Select name="gender" defaultValue="Nam">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Nam">Nam</SelectItem>
                              <SelectItem value="Nữ">Nữ</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="job">Nghề nghiệp</Label>
                          <Input id="job" name="job" placeholder="Kỹ sư" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="idCard">Số CCCD</Label>
                          <Input id="idCard" name="idCard" placeholder="123456789012" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="idCardDate">Ngày cấp CCCD</Label>
                          <Input id="idCardDate" name="idCardDate" type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="idCardPlace">Nơi cấp CCCD</Label>
                          <Input id="idCardPlace" name="idCardPlace" placeholder="Công an TP Cần Thơ" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="province">Tỉnh/Thành phố</Label>
                          <Input id="province" name="province" placeholder="Cần Thơ" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="district">Quận/Huyện</Label>
                          <Input id="district" name="district" placeholder="Ninh Kiều" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ward">Phường/Xã</Label>
                          <Input id="ward" name="ward" placeholder="An Khánh" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Địa chỉ cụ thể</Label>
                        <Input id="address" name="address" placeholder="123/4 đường ABC" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customerId">Customer ID</Label>
                        <Input id="customerId" name="customerId" type="number" placeholder="10" />
                      </div>
                    </div>

                    {/* Financial Info */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Thông tin tài chính</h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="rentAmount">Tiền thuê (VND/tháng)</Label>
                          <Input id="rentAmount" name="rentAmount" type="number" placeholder="3000000" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="deposit">Tiền cọc (VND)</Label>
                          <Input id="deposit" name="deposit" type="number" placeholder="6000000" required />
                        </div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Thông tin bổ sung</h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="witnesses">Người chứng kiến</Label>
                          <Input id="witnesses" name="witnesses" placeholder="Trần Thị B" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emergencyContact">Người liên hệ khẩn cấp</Label>
                          <Input id="emergencyContact" name="emergencyContact" placeholder="Nguyễn Thị C" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyPhone">SĐT khẩn cấp</Label>
                        <Input id="emergencyPhone" name="emergencyPhone" placeholder="0912345678" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Ghi chú</Label>
                        <Textarea id="notes" name="notes" placeholder="Hợp đồng chính thức" rows={3} />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full lg:w-auto">
                      Tạo hợp đồng
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search and Filter */}
          <div className="mb-4 lg:mb-6 flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Tìm kiếm theo số hợp đồng, tên khách thuê hoặc phòng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Đang hiệu lực</SelectItem>
                <SelectItem value="pending">Chờ ký</SelectItem>
                <SelectItem value="expired">Hết hạn</SelectItem>
                <SelectItem value="terminated">Đã chấm dứt</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contracts List */}
          <div className="space-y-4">
            {filteredContracts.map((contract) => {
              const daysUntilExpiry = getDaysUntilExpiry(contract.endDate)
              const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0
              return (
                <Card key={contract.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3">
                      <div className="flex-1">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 mb-2">
                          <CardTitle className="text-lg">{contract.contractNumber}</CardTitle>
                          <div className="flex gap-2">
                            <Badge className={statusColors[contract.status]} size="sm">
                              {statusLabels[contract.status]}
                            </Badge>
                            {isExpiringSoon && (
                              <Badge variant="outline" className="border-orange-500 text-orange-600">
                                Sắp hết hạn
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CardDescription className="text-sm">
                          {contract.building} - {contract.room} - {contract.tenant} • {contract.tenantPhone}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent"
                          onClick={() => handleViewContract(contract)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Xem
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent"
                          onClick={() => handlePrintContract(contract)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          In
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Thời hạn</p>
                        <p className="text-sm">
                          {new Date(contract.startDate).toLocaleDateString("vi-VN")} -{" "}
                          {new Date(contract.endDate).toLocaleDateString("vi-VN")}
                        </p>
                        {contract.status === "active" && (
                          <p className="text-xs text-gray-500">
                            {daysUntilExpiry > 0
                              ? `Còn ${daysUntilExpiry} ngày`
                              : `Quá hạn ${Math.abs(daysUntilExpiry)} ngày`}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tiền thuê</p>
                        <p className="text-sm font-bold">{contract.rentAmount.toLocaleString()}₫/tháng</p>
                        <p className="text-xs text-gray-500">Cọc: {contract.deposit.toLocaleString()}₫</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ngày tạo</p>
                        <p className="text-sm">{new Date(contract.createdDate).toLocaleDateString("vi-VN")}</p>
                        {contract.witnesses && (
                          <p className="text-xs text-gray-500">Chứng kiến: {contract.witnesses}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Edit className="h-3 w-3 mr-1" />
                        Sửa
                      </Button>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Calendar className="h-3 w-3 mr-1" />
                        Gia hạn
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 bg-transparent"
                        onClick={() => handleDeleteContract(contract.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredContracts.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Không tìm thấy hợp đồng</h3>
              <p className="text-gray-600 dark:text-gray-400">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
            </div>
          )}
        </div>
      </main>

      {/* View Contract Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[900px] mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết hợp đồng - {selectedContract?.contractNumber}</DialogTitle>
            <DialogDescription>Xem thông tin chi tiết hợp đồng thuê phòng</DialogDescription>
          </DialogHeader>
          {selectedContract && (
            <div className="space-y-6">
              {/* API Data Display */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Dữ liệu API Hợp đồng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto">
                      {JSON.stringify(selectedContract.contractAPI, null, 2)}
                    </pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Dữ liệu Khách hàng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto">
                      {JSON.stringify(selectedContract.customerData, null, 2)}
                    </pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Dữ liệu Phòng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto">
                      {JSON.stringify(selectedContract.roomData, null, 2)}
                    </pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Dữ liệu Quản lý</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto">
                      {JSON.stringify(selectedContract.managerData, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              </div>

              {/* Contract Terms */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Điều khoản hợp đồng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm whitespace-pre-line bg-gray-50 dark:bg-gray-800 p-4 rounded">
                    {selectedContract.terms}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => selectedContract && handlePrintContract(selectedContract)}>
              <Download className="h-4 w-4 mr-2" />
              In hợp đồng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
