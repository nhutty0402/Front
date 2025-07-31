"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
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
  Phone,
  Mail,
  CreditCard,
  MapPin,
  Clock,
  DollarSign,
  Printer,
  Upload,
  X,
  ImageIcon,
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
  status: "available" | "occupied"
  amenities: string[]
  tenant?: string
  tenantPhone?: string
  tenantEmail?: string
  description?: string
  contractId?: string
}

interface CCCDImages {
  front?: string
  back?: string
}

interface Contract {
  id: string
  roomId: string
  roomNumber: string
  building: string
  tenantName: string
  tenantPhone: string
  tenantEmail: string
  tenantCCCD: string
  tenantAddress: string
  tenantCCCDImages?: CCCDImages
  contractStartDate: string
  contractEndDate: string
  monthlyRent: number
  deposit: number
  contractType: string
  notes: string
  managerName: string
  managerPhone: string
  managerEmail: string
  managerCCCD: string
  managerAddress: string
  hostelName: string
  hostelPhone: string
  hostelEmail: string
  hostelLicense: string
  hostelAddress: string
  createdAt: string
  updatedAt: string
  extensions?: Extension[]
}

interface Extension {
  id: string
  extensionDate: string
  oldEndDate: string
  newEndDate: string
  extensionPeriod: number
  oldRent: number
  newRent: number
  rentIncreaseReason?: string
  notes?: string
}

interface ManagerProfile {
  QuanLiID: number
  SoDienThoaiDN: string
  MatKhauDN: string
  HoTenQuanLi: string
  DiaChiChiTiet: string
  GioiTinh: string
  NgaySinh: string
  Phuong: string
  Quan: string
  SoCCCD: string
  ThanhPho: string
  Email?: string
  ChucVu?: string
  NgayVaoLam?: string
  MoTa?: string
  Avatar?: string
  TenNhaTro?: string
  DiaChiNhaTro?: string
  SoGiayPhep?: string
  NgayCapGiayPhep?: string
}

interface HostelSettings {
  name: string
  address: string
  phone: string
  email: string
  businessLicense?: string
  businessLicenseDate?: string
  taxCode?: string
  bankAccount?: string
  bankName?: string
  representative?: string
  establishedDate?: string
  description?: string
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
    status: "available",
    amenities: ["wifi", "ac", "parking"],
    description: "Phòng đầy đủ tiện nghi",
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

const statusColors = {
  available: "bg-green-500",
  occupied: "bg-blue-500",
}

const statusLabels = {
  available: "Trống",
  occupied: "Đã thuê",
}

// Điều khoản hợp đồng mặc định
const DEFAULT_CONTRACT_TERMS = `Sau khi bàn bạc kỹ lưỡng, hai bên cùng thống nhất nội dung sau:

1. Bên A đồng ý cho bên B thuê 01 phòng ở tại địa chỉ: {HOSTEL_ADDRESS}

2. Thanh toán đầy đủ tiền theo đúng thỏa thuận.

3. Bảo quản các trang thiết bị và tài sản vật chất của bên A trong khi cho thuê (làm hỏng phải sửa, mất phải đền).

4. Không được tự ý sửa chữa, cải tạo cơ sở vật chất khi chưa được sự đồng ý của bên A.

5. Luôn có ý thức giữ gìn vệ sinh trong và ngoài khu vực phòng trọ.

6. Bên B phải chấp hành mọi quy định của pháp luật Nhà nước và quy định của địa phương.

7. Nếu bên B cho khách ở qua đêm thì phải báo trước và được sự đồng ý của bên A, đồng thời phải chịu trách nhiệm về các hành vi vi phạm pháp luật của khách trong thời gian ở lại (nếu có).

TRÁCH NHIỆM CHUNG:

• Hai bên phải tạo điều kiện thuận lợi cho nhau để thực hiện hợp đồng.

• Nếu một trong hai bên vi phạm hợp đồng trong thời gian hợp đồng vẫn còn hiệu lực thì bên còn lại có quyền đơn phương chấm dứt hợp đồng thuê nhà trọ. Ngoài ra, nếu hành vi vi phạm đó gây tổn thất cho bên bị vi phạm thì bên vi phạm sẽ phải bồi thường mọi thiệt hại gây ra.

• Trong trường hợp muốn chấm dứt hợp đồng trước thời hạn, cần phải báo trước cho bên kia ít nhất 30 ngày và hai bên phải có sự thống nhất với nhau.

• Kết thúc hợp đồng, Bên A phải trả lại đầy đủ tiền đặt cọc cho bên B.

• Bên nào vi phạm các điều khoản chung thì phải chịu trách nhiệm trước pháp luật.

• Hợp đồng này được lập thành 02 bản và có giá trị pháp lý như nhau, mỗi bên giữ một bản.`

// Default data
const defaultManagerProfile: ManagerProfile = {
  QuanLiID: 6,
  SoDienThoaiDN: "0857870065",
  MatKhauDN: "$2b$10$Gu4wdRJtvsc0a4OjwneZ4.gn6.g68WNAVU9Epo3OdK8K6/pF1Uvky",
  HoTenQuanLi: "Phạm Ty",
  DiaChiChiTiet: "456 đường Nguyễn Văn Cừ",
  GioiTinh: "Nữ",
  NgaySinh: "2004-10-31T17:00:00.000Z",
  Phuong: "Bùi Hữu Nghĩa",
  Quan: "Bình Thủy",
  SoCCCD: "123456789012",
  ThanhPho: "Cần Thơ",
  Email: "phamty@email.com",
  ChucVu: "Quản lý nhà trọ",
  NgayVaoLam: "2023-01-15",
  MoTa: "Quản lý nhà trọ với 2 năm kinh nghiệm, chuyên về quản lý tài chính và chăm sóc khách hàng.",
  Avatar: "/placeholder.svg?height=120&width=120",
  TenNhaTro: "Nhà trọ Phạm Ty",
  DiaChiNhaTro: "456 đường Nguyễn Văn Cừ, Phường Bùi Hữu Nghĩa, Quận Bình Thủy, TP. Cần Thơ",
  SoGiayPhep: "GP-CT-2023-001",
  NgayCapGiayPhep: "2023-01-10",
}

const defaultHostelSettings: HostelSettings = {
  name: "Nhà trọ Phạm Ty",
  address: "456 đường Nguyễn Văn Cừ, Phường Bùi Hữu Nghĩa, Quận Bình Thủy, TP. Cần Thơ",
  phone: "0857870065",
  email: "phamty@email.com",
  businessLicense: "GP-CT-2023-001",
  businessLicenseDate: "2023-01-10",
  taxCode: "1234567890",
  representative: "Phạm Ty",
  establishedDate: "2023-01-01",
  description: "Nhà trọ chất lượng cao, phục vụ sinh viên và người lao động",
}

export default function RoomsPage() {
  const [isExtendContractOpen, setIsExtendContractOpen] = useState(false)
  const [extendingContract, setExtendingContract] = useState<Contract | null>(null)
  const [cccdImages, setCccdImages] = useState<CCCDImages>({})
  const [contracts, setContracts] = useState<Contract[]>([])
  const [managerProfile, setManagerProfile] = useState<ManagerProfile | null>(null)
  const [hostelSettings, setHostelSettings] = useState<HostelSettings | null>(null)
  const { toast } = useToast()
  const [rooms, setRooms] = useState<Room[]>(mockRooms)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [filterBuilding, setFilterBuilding] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [isContractDetailsOpen, setIsContractDetailsOpen] = useState(false)
  const [isEditRoomOpen, setIsEditRoomOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [editSelectedAmenities, setEditSelectedAmenities] = useState<string[]>([])
  const [isAddContractOpen, setIsAddContractOpen] = useState(false)
  const [contractRoom, setContractRoom] = useState<Room | null>(null)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("managerProfile")
    const savedSettings = localStorage.getItem("hostelSettings")
    const savedContracts = localStorage.getItem("contracts")

    setManagerProfile(savedProfile ? JSON.parse(savedProfile) : defaultManagerProfile)
    setHostelSettings(savedSettings ? JSON.parse(savedSettings) : defaultHostelSettings)
    setContracts(savedContracts ? JSON.parse(savedContracts) : [])
  }, [])

  const filteredRooms = rooms.filter((room) => {
    const matchesStatus = filterStatus === "all" || room.status === filterStatus
    const matchesBuilding = filterBuilding === "all" || room.building === filterBuilding
    const matchesSearch =
      room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.tenant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.description?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesStatus && matchesBuilding && matchesSearch
  })

  const handleImageUpload = (file: File, type: "front" | "back") => {
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast({
        title: "Lỗi",
        description: "Kích thước file không được vượt quá 5MB",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      setCccdImages((prev) => ({
        ...prev,
        [type]: base64,
      }))
    }
    reader.readAsDataURL(file)
  }

  const removeImage = (type: "front" | "back") => {
    setCccdImages((prev) => ({
      ...prev,
      [type]: undefined,
    }))
  }

  const addContract = (contractData: Omit<Contract, "id" | "createdAt" | "updatedAt" | "managerName" | "managerPhone" | "managerEmail" | "managerCCCD" | "managerAddress" | "hostelName" | "hostelAddress" | "hostelPhone" | "hostelEmail" | "hostelLicense" | "hostelLicenseDate" | "extensions">) => {
    const now = new Date().toISOString()
    const newContract: Contract = {
      ...contractData,
      id: Date.now().toString(),
      // Thông tin quản lý từ profile
      managerName: managerProfile?.HoTenQuanLi || "",
      managerPhone: managerProfile?.SoDienThoaiDN || "",
      managerEmail: managerProfile?.Email || "",
      managerCCCD: managerProfile?.SoCCCD || "",
      managerAddress:
        `${managerProfile?.DiaChiChiTiet}, ${managerProfile?.Phuong}, ${managerProfile?.Quan}, ${managerProfile?.ThanhPho}` ||
        "",
      // Thông tin nhà trọ từ settings/profile
      hostelName: hostelSettings?.name || managerProfile?.TenNhaTro || "",
      hostelAddress: hostelSettings?.address || managerProfile?.DiaChiNhaTro || "",
      hostelPhone: hostelSettings?.phone || managerProfile?.SoDienThoaiDN || "",
      hostelEmail: hostelSettings?.email || managerProfile?.Email || "",
      hostelLicense: hostelSettings?.businessLicense || managerProfile?.SoGiayPhep || "",
      hostelLicenseDate: hostelSettings?.businessLicenseDate || managerProfile?.NgayCapGiayPhep || "",
      createdAt: now,
      updatedAt: now,
    }

    const updatedContracts = [...contracts, newContract]
    setContracts(updatedContracts)
    localStorage.setItem("contracts", JSON.stringify(updatedContracts))
  }

  const getContract = (id: string) => {
    return contracts.find((contract) => contract.id === id)
  }

  const extendContract = (id: string, extensionData: Omit<Extension, "id" | "createdAt">) => {
    const contract = contracts.find((c) => c.id === id)
    if (!contract) return

    const newExtension: Extension = {
      ...extensionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    const updatedContract: Contract = {
      ...contract,
      contractEndDate: extensionData.newEndDate,
      monthlyRent: extensionData.newRent,
      extensions: [...(contract.extensions || []), newExtension],
      updatedAt: new Date().toISOString(),
    }

    const updatedContracts = contracts.map((c) => (c.id === id ? updatedContract : c))
    setContracts(updatedContracts)
    localStorage.setItem("contracts", JSON.stringify(updatedContracts))
  }

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

    toast({
      title: "Thêm phòng thành công",
      description: `Phòng ${newRoom.building}${newRoom.number} đã được thêm vào hệ thống`,
    })
  }

  const handleAddContract = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!contractRoom) return

    const formData = new FormData(event.currentTarget)

    // Tạo hợp đồng mới với đầy đủ thông tin
    const contractData = {
      roomId: contractRoom.id,
      roomNumber: contractRoom.number,
      building: contractRoom.building,
      tenantName: formData.get("tenantName") as string,
      tenantPhone: formData.get("tenantPhone") as string,
      tenantEmail: formData.get("tenantEmail") as string,
      tenantCCCD: formData.get("tenantCCCD") as string,
      tenantAddress: formData.get("tenantAddress") as string,
      tenantCCCDImages: cccdImages,
      contractStartDate: formData.get("contractStartDate") as string,
      contractEndDate: formData.get("contractEndDate") as string,
      monthlyRent: contractRoom.price,
      deposit: Number(formData.get("deposit") as string) || 0,
      contractType: formData.get("contractType") as string,
      notes: formData.get("notes") as string,
    }

    // Thêm hợp đồng vào context (sẽ tự động thêm thông tin quản lý và nhà trọ)
    addContract(contractData)

    // Cập nhật trạng thái phòng
    const updatedRoom: Room = {
      ...contractRoom,
      status: "occupied",
      tenant: contractData.tenantName,
      tenantPhone: contractData.tenantPhone,
      tenantEmail: contractData.tenantEmail,
    }

    setRooms(rooms.map((room) => (room.id === contractRoom.id ? updatedRoom : room)))
    setIsAddContractOpen(false)
    setContractRoom(null)
    setCccdImages({}) // Reset CCCD images

    toast({
      title: "Tạo hợp đồng thành công",
      description: `Hợp đồng cho phòng ${contractRoom.building}${contractRoom.number} đã được tạo`,
    })
  }

  const handleViewContractDetails = (room: Room) => {
    // Tìm hợp đồng dựa trên roomId
    const contract = contracts.find((c) => c.roomId === room.id)
    if (contract) {
      setSelectedRoom({ ...room, contractId: contract.id })
      setIsContractDetailsOpen(true)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("vi-VN") + "₫"
  }

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    if (checked) {
      setSelectedAmenities([...selectedAmenities, amenityId])
    } else {
      setSelectedAmenities(selectedAmenities.filter((id) => id !== amenityId))
    }
  }

  const handleAddContractClick = (room: Room) => {
    setContractRoom(room)
    setIsAddContractOpen(true)
  }

  const handlePrintContract = (contract: Contract) => {
    // Thay thế placeholder trong điều khoản
    const contractTerms = DEFAULT_CONTRACT_TERMS.replace("{HOSTEL_ADDRESS}", contract.hostelAddress)

    // Tạo nội dung in
    const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Hợp đồng thuê phòng - ${contract.building}${contract.roomNumber}</title>
      <style>
        body { font-family: 'Times New Roman', serif; line-height: 1.6; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .title { font-size: 18px; font-weight: bold; text-transform: uppercase; }
        .section { margin: 20px 0; }
        .party { background: #f5f5f5; padding: 15px; margin: 10px 0; border-left: 4px solid #007bff; }
        .terms { background: #fff8dc; padding: 15px; margin: 10px 0; border: 1px solid #ddd; }
        .signature { display: flex; justify-content: space-between; margin-top: 50px; }
        .signature div { text-align: center; width: 45%; }
        .cccd-images { margin: 20px 0; }
        .cccd-image { max-width: 300px; margin: 10px; border: 1px solid #ddd; }
        @media print { body { margin: 0; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">HỢP ĐỒNG THUÊ PHÒNG TRỌ</div>
        <p>Số: ${contract.id}</p>
      </div>
      
      <div class="party">
        <h3>BÊN A - BÊN CHO THUÊ</h3>
        <p><strong>Họ và tên:</strong> ${contract.managerName}</p>
        <p><strong>CCCD:</strong> ${contract.managerCCCD}</p>
        <p><strong>Điện thoại:</strong> ${contract.managerPhone}</p>
        <p><strong>Địa chỉ:</strong> ${contract.managerAddress}</p>
      </div>
      
      <div class="party">
        <h3>BÊN B - BÊN THUÊ</h3>
        <p><strong>Họ và tên:</strong> ${contract.tenantName}</p>
        <p><strong>CCCD:</strong> ${contract.tenantCCCD || "Không có"}</p>
        <p><strong>Điện thoại:</strong> ${contract.tenantPhone}</p>
        <p><strong>Địa chỉ:</strong> ${contract.tenantAddress || "Không có"}</p>
        
        ${
          contract.tenantCCCDImages && (contract.tenantCCCDImages.front || contract.tenantCCCDImages.back)
            ? `
        <div class="cccd-images">
          <h4>Hình ảnh CCCD:</h4>
          ${contract.tenantCCCDImages.front ? `<img src="${contract.tenantCCCDImages.front}" alt="CCCD mặt trước" class="cccd-image">` : ""}
          ${contract.tenantCCCDImages.back ? `<img src="${contract.tenantCCCDImages.back}" alt="CCCD mặt sau" class="cccd-image">` : ""}
        </div>
        `
            : ""
        }
      </div>
      
      <div class="section">
        <h3>THÔNG TIN NHÀ TRỌ</h3>
        <p><strong>Tên:</strong> ${contract.hostelName}</p>
        <p><strong>Địa chỉ:</strong> ${contract.hostelAddress}</p>
        <p><strong>Giấy phép:</strong> ${contract.hostelLicense || "Không có"}</p>
      </div>
      
      <div class="terms">
        <h3>ĐIỀU KHOẢN HỢP ĐỒNG</h3>
        <p><strong>Phòng thuê:</strong> ${contract.building}${contract.roomNumber}</p>
        <p><strong>Thời hạn:</strong> Từ ${formatDate(contract.contractStartDate)} đến ${formatDate(contract.contractEndDate)}</p>
        <p><strong>Giá thuê:</strong> ${formatCurrency(contract.monthlyRent)}/tháng</p>
        ${contract.deposit ? `<p><strong>Tiền cọc:</strong> ${formatCurrency(contract.deposit)}</p>` : ""}
        <p><strong>Loại hợp đồng:</strong> ${contract.contractType}</p>
        
        <div style="margin-top: 20px; white-space: pre-line;">
          ${contractTerms}
        </div>
        
        ${contract.notes ? `<p><strong>Điều khoản đặc biệt:</strong> ${contract.notes}</p>` : ""}
      </div>
      
      ${
        contract.extensions && contract.extensions.length > 0
          ? `
        <div class="section">
          <h3>LỊCH SỬ GIA HẠN</h3>
          ${contract.extensions
            .map(
              (ext) => `
            <div style="border: 1px solid #ddd; padding: 10px; margin: 5px 0;">
              <p><strong>Ngày gia hạn:</strong> ${formatDate(ext.extensionDate)}</p>
              <p><strong>Gia hạn thêm:</strong> ${ext.extensionPeriod} tháng</p>
              <p><strong>Từ:</strong> ${formatDate(ext.oldEndDate)} <strong>đến:</strong> ${formatDate(ext.newEndDate)}</p>
              ${ext.oldRent !== ext.newRent ? `<p><strong>Thay đổi giá:</strong> ${formatCurrency(ext.oldRent)} → ${formatCurrency(ext.newRent)}</p>` : ""}
              ${ext.rentIncreaseReason ? `<p><strong>Lý do tăng giá:</strong> ${ext.rentIncreaseReason}</p>` : ""}
              ${ext.notes ? `<p><strong>Ghi chú:</strong> ${ext.notes}</p>` : ""}
            </div>
          `,
            )
            .join("")}
        </div>
      `
          : ""
      }
      
      <div class="signature">
        <div>
          <p><strong>BÊN A</strong></p>
          <p>(Ký và ghi rõ họ tên)</p>
          <br><br><br>
          <p>${contract.managerName}</p>
        </div>
        <div>
          <p><strong>BÊN B</strong></p>
          <p>(Ký và ghi rõ họ tên)</p>
          <br><br><br>
          <p>${contract.tenantName}</p>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <p><em>Ngày tạo hợp đồng: ${formatDate(contract.createdAt)}</em></p>
      </div>
    </body>
    </html>
  `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
      printWindow.close()
    }
  }

  const handleExtendContract = (contract: Contract) => {
    setExtendingContract(contract)
    setIsExtendContractOpen(true)
  }

  const handleSubmitExtension = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!extendingContract) return

    const formData = new FormData(event.currentTarget)
    const newEndDate = formData.get("newEndDate") as string
    const newRent = Number(formData.get("newRent") as string)
    const notes = formData.get("notes") as string
    const rentIncreaseReason = formData.get("rentIncreaseReason") as string

    // Tính số tháng gia hạn
    const oldEndDate = new Date(extendingContract.contractEndDate)
    const newEndDateObj = new Date(newEndDate)
    const extensionPeriod = Math.round((newEndDateObj.getTime() - oldEndDate.getTime()) / (1000 * 60 * 60 * 24 * 30))

    const extensionData = {
      extensionDate: new Date().toISOString().split("T")[0],
      oldEndDate: extendingContract.contractEndDate,
      newEndDate: newEndDate,
      extensionPeriod: extensionPeriod,
      oldRent: extendingContract.monthlyRent,
      newRent: newRent,
      rentIncreaseReason: newRent > extendingContract.monthlyRent ? rentIncreaseReason : undefined,
      notes: notes || undefined,
    }

    extendContract(extendingContract.id, extensionData)
    setIsExtendContractOpen(false)
    setExtendingContract(null)

    toast({
      title: "Gia hạn hợp đồng thành công",
      description: `Hợp đồng phòng ${extendingContract.building}${extendingContract.roomNumber} đã được gia hạn đến ${formatDate(newEndDate)}`,
    })
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
              <p className="text-gray-600">Quản lý thông tin các phòng trọ và hợp đồng</p>
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
                <Button className="h-10 bg-blue-600 hover:bg-blue-700 text-sm font-medium rounded-lg px-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm phòng mới
                </Button>
              </DialogTrigger>
              <DialogContent className="mx-4 max-w-[95vw] max-h-[90vh] overflow-y-auto rounded-xl">
                {/* Mobile form content similar to desktop but simplified */}
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
              const roomContract = contracts.find((c) => c.roomId === room.id)

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
                          <span className="font-semibold text-green-600">{formatCurrency(room.price)}</span>
                        </div>
                        {room.tenant && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Khách thuê:</span>
                            <span className="font-semibold truncate ml-2">{room.tenant}</span>
                          </div>
                        )}
                        {roomContract && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Hết hạn HĐ:</span>
                              <span className="font-semibold text-gray-900">
                                {formatDate(roomContract.contractEndDate)}
                              </span>
                            </div>
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
                        ) : roomContract ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-green-50 text-green-600 hover:bg-green-100 border-green-200 text-xs h-9"
                            onClick={() => handleViewContractDetails(room)}
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Chi Tiết Hợp Đồng
                          </Button>
                        ) : null}
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
          <DialogContent className="sm:max-w-[800px] mx-2 max-h-[90vh] overflow-y-auto rounded-xl p-4 sm:p-6">
            {selectedRoom && selectedRoom.contractId && (
              <>
                {(() => {
                  const contract = getContract(selectedRoom.contractId)
                  if (!contract) return <div>Không tìm thấy hợp đồng</div>

                  return (
                    <>
                      <div className="space-y-4 lg:space-y-6 py-2">
                        {/* Contract Header */}
                        <div className="flex items-center justify-between p-3 lg:p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                          <div>
                            <h3 className="font-bold text-gray-900 text-sm lg:text-base">HỢP ĐỒNG THUÊ PHÒNG TRỌ</h3>
                            <p className="text-xs text-gray-600">
                              Mã hợp đồng: {contract.id} | Phòng: {contract.building}
                              {contract.roomNumber}
                            </p>
                          </div>
                          <Badge className="px-3 py-1 text-xs bg-green-500">Đang hiệu lực</Badge>
                        </div>

                        {/* Party A - Landlord Information */}
                        <div className="space-y-3">
                          <h3 className="text-sm lg:text-base font-bold text-gray-900 border-b-2 border-blue-200 pb-2 flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-600" />
                            BÊN A - BÊN CHO THUÊ
                          </h3>
                          <div className="bg-yellow-50 border border-yellow-200 p-3 lg:p-4 rounded-lg space-y-3">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs lg:text-sm text-gray-600 font-medium">Họ và tên:</span>
                                </div>
                                <p className="font-bold text-sm lg:text-base ml-6 text-gray-900">
                                  {contract.managerName}
                                </p>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs lg:text-sm text-gray-600 font-medium">Số điện thoại:</span>
                                </div>
                                <p className="font-bold text-sm lg:text-base ml-6">
                                  <a
                                    href={`tel:${contract.managerPhone}`}
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    {contract.managerPhone}
                                  </a>
                                </p>
                              </div>

                              {contract.managerEmail && (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                    <span className="text-xs lg:text-sm text-gray-600 font-medium">Email:</span>
                                  </div>
                                  <p className="font-bold text-sm lg:text-base ml-6">
                                    <a
                                      href={`mailto:${contract.managerEmail}`}
                                      className="text-blue-600 hover:text-blue-800"
                                    >
                                      {contract.managerEmail}
                                    </a>
                                  </p>
                                </div>
                              )}

                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs lg:text-sm text-gray-600 font-medium">Số CCCD:</span>
                                </div>
                                <p className="font-bold text-sm lg:text-base ml-6 text-gray-900">
                                  {contract.managerCCCD}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span className="text-xs lg:text-sm text-gray-600 font-medium">
                                <span className="text-xs lg:text-sm text-gray-600 font-medium">Địa chỉ:</span>
                              </div>
                              <p className="font-bold text-sm lg:text-base ml-6 text-gray-900">
                                {contract.managerAddress}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Party B - Tenant Information */}
                        <div className="space-y-3">
                          <h3 className="text-sm lg:text-base font-bold text-gray-900 border-b-2 border-green-200 pb-2 flex items-center gap-2">
                            <User className="h-4 w-4 text-green-600" />
                            BÊN B - BÊN THUÊ
                          </h3>
                          <div className="bg-green-50 border border-green-200 p-3 lg:p-4 rounded-lg space-y-3">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs lg:text-sm text-gray-600 font-medium">Họ và tên:</span>
                                </div>
                                <p className="font-bold text-sm lg:text-base ml-6 text-gray-900">
                                  {contract.tenantName}
                                </p>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs lg:text-sm text-gray-600 font-medium">Số điện thoại:</span>
                                </div>
                                <p className="font-bold text-sm lg:text-base ml-6">
                                  <a href={`tel:${contract.tenantPhone}`} className="text-blue-600 hover:text-blue-800">
                                    {contract.tenantPhone}
                                  </a>
                                </p>
                              </div>

                              {contract.tenantEmail && (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                    <span className="text-xs lg:text-sm text-gray-600 font-medium">Email:</span>
                                  </div>
                                  <p className="font-bold text-sm lg:text-base ml-6">
                                    <a
                                      href={`mailto:${contract.tenantEmail}`}
                                      className="text-blue-600 hover:text-blue-800"
                                    >
                                      {contract.tenantEmail}
                                    </a>
                                  </p>
                                </div>
                              )}

                              {contract.tenantCCCD && (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-gray-500" />
                                    <span className="text-xs lg:text-sm text-gray-600 font-medium">Số CCCD:</span>
                                  </div>
                                  <p className="font-bold text-sm lg:text-base ml-6 text-gray-900">
                                    {contract.tenantCCCD}
                                  </p>
                                </div>
                              )}
                            </div>

                            {contract.tenantAddress && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs lg:text-sm text-gray-600 font-medium">
                                    Địa chỉ thường trú:
                                  </span>
                                </div>
                                <p className="font-bold text-sm lg:text-base ml-6 text-gray-900">
                                  {contract.tenantAddress}
                                </p>
                              </div>
                            )}

                            {/* CCCD Images */}
                            {contract.tenantCCCDImages &&
                              (contract.tenantCCCDImages.front || contract.tenantCCCDImages.back) && (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4 text-gray-500" />
                                    <span className="text-xs lg:text-sm text-gray-600 font-medium">Hình ảnh CCCD:</span>
                                  </div>
                                  <div className="ml-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {contract.tenantCCCDImages.front ? (
                                      <div className="space-y-2">
                                        <p className="text-xs text-gray-600">Mặt trước:</p>
                                        <img
                                          src={contract.tenantCCCDImages.front || "/placeholder.svg"}
                                          alt="CCCD mặt trước"
                                          className="w-full max-w-xs border rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                                          onClick={() => window.open(contract.tenantCCCDImages?.front, "_blank")}
                                        />
                                      </div>
                                    ) : null}
                                    {contract.tenantCCCDImages.back ? (
                                      <div className="space-y-2">
                                        <p className="text-xs text-gray-600">Mặt sau:</p>
                                        <img
                                          src={contract.tenantCCCDImages.back || "/placeholder.svg"}
                                          alt="CCCD mặt sau"
                                          className="w-full max-w-xs border rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                                          onClick={() => window.open(contract.tenantCCCDImages?.back, "_blank")}
                                        />
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>

                        {/* Hostel Information */}
                        <div className="space-y-3">
                          <h3 className="text-sm lg:text-base font-bold text-gray-900 border-b-2 border-purple-200 pb-2 flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-purple-600" />
                            THÔNG TIN NHÀ TRỌ
                          </h3>
                          <div className="bg-purple-50 border border-purple-200 p-3 lg:p-4 rounded-lg space-y-3">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Building2 className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs lg:text-sm text-gray-600 font-medium">Tên nhà trọ:</span>
                                </div>
                                <p className="font-bold text-sm lg:text-base ml-6 text-gray-900">
                                  {contract.hostelName}
                                </p>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs lg:text-sm text-gray-600 font-medium">Số điện thoại:</span>
                                </div>
                                <p className="font-bold text-sm lg:text-base ml-6 text-gray-900">
                                  {contract.hostelPhone}
                                </p>
                              </div>

                              {contract.hostelEmail && (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                    <span className="text-xs lg:text-sm text-gray-600 font-medium">Email:</span>
                                  </div>
                                  <p className="font-bold text-sm lg:text-base ml-6 text-gray-900">
                                    {contract.hostelEmail}
                                  </p>
                                </div>
                              )}

                              {contract.hostelLicense && (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-gray-500" />
                                    <span className="text-xs lg:text-sm text-gray-600 font-medium">Giấy phép KD:</span>
                                  </div>
                                  <p className="font-bold text-sm lg:text-base ml-6 text-gray-900">
                                    {contract.hostelLicense}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span className="text-xs lg:text-sm text-gray-600 font-medium">Địa chỉ:</span>
                              </div>
                              <p className="font-bold text-sm lg:text-base ml-6 text-gray-900">
                                {contract.hostelAddress}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Contract Terms */}
                        <div className="space-y-3">
                          <h3 className="text-sm lg:text-base font-bold text-gray-900 border-b-2 border-orange-200 pb-2 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-orange-600" />
                            ĐIỀU KHOẢN HỢP ĐỒNG
                          </h3>
                          <div className="bg-orange-50 border border-orange-200 p-3 lg:p-4 rounded-lg space-y-3">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs lg:text-sm text-gray-600 font-medium">Ngày bắt đầu:</span>
                                </div>
                                <p className="font-bold text-sm lg:text-base ml-6 text-gray-900">
                                  {formatDate(contract.contractStartDate)}
                                </p>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs lg:text-sm text-gray-600 font-medium">Ngày kết thúc:</span>
                                </div>
                                <p className="font-bold text-sm lg:text-base ml-6 text-gray-900">
                                  {formatDate(contract.contractEndDate)}
                                </p>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs lg:text-sm text-gray-600 font-medium">
                                    Giá thuê hàng tháng:
                                  </span>
                                </div>
                                <p className="font-bold text-green-600 text-sm lg:text-base ml-6">
                                  {formatCurrency(contract.monthlyRent)}
                                </p>
                              </div>

                              {contract.deposit && contract.deposit > 0 && (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-gray-500" />
                                    <span className="text-xs lg:text-sm text-gray-600 font-medium">Tiền cọc:</span>
                                  </div>
                                  <p className="font-bold text-orange-600 text-sm lg:text-base ml-6">
                                    {formatCurrency(contract.deposit)}
                                  </p>
                                </div>
                              )}

                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs lg:text-sm text-gray-600 font-medium">Loại hợp đồng:</span>
                                </div>
                                <p className="font-bold text-sm lg:text-base ml-6 text-gray-900">
                                  {contract.contractType}
                                </p>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs lg:text-sm text-gray-600 font-medium">
                                    Ngày tạo hợp đồng:
                                  </span>
                                </div>
                                <p className="font-bold text-sm lg:text-base ml-6 text-gray-900">
                                  {formatDate(contract.createdAt)}
                                </p>
                              </div>
                            </div>

                            {/* Contract Terms Text */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-gray-500" />
                                <span className="text-xs lg:text-sm text-gray-600 font-medium">
                                  Điều khoản chi tiết:
                                </span>
                              </div>
                              <div className="ml-6 bg-white p-3 rounded border border-gray-200">
                                <div className="font-medium text-sm lg:text-base text-gray-900 whitespace-pre-line">
                                  {DEFAULT_CONTRACT_TERMS.replace("{HOSTEL_ADDRESS}", contract.hostelAddress)}
                                </div>
                              </div>
                            </div>

                            {contract.notes && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs lg:text-sm text-gray-600 font-medium">
                                    Điều khoản đặc biệt:
                                  </span>
                                </div>
                                <div className="ml-6 bg-white p-3 rounded border border-gray-200">
                                  <p className="font-medium text-sm lg:text-base text-gray-900 whitespace-pre-wrap">
                                    {contract.notes}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Extension History */}
                        {contract.extensions && contract.extensions.length > 0 && (
                          <div className="space-y-3">
                            <h3 className="text-sm lg:text-base font-bold text-gray-900 border-b-2 border-indigo-200 pb-2 flex items-center gap-2">
                              <Clock className="h-4 w-4 text-indigo-600" />
                              LỊCH SỬ GIA HẠN HỢP ĐỒNG
                            </h3>
                            <div className="space-y-3">
                              {contract.extensions.map((extension, index) => (
                                <div
                                  key={extension.id}
                                  className="bg-indigo-50 border border-indigo-200 p-3 lg:p-4 rounded-lg"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-bold text-sm text-indigo-800">Lần gia hạn #{index + 1}</h4>
                                    <Badge className="bg-indigo-500 text-xs">+{extension.extensionPeriod} tháng</Badge>
                                  </div>

                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <span className="text-xs lg:text-sm text-gray-600 font-medium">
                                          Ngày gia hạn:
                                        </span>
                                      </div>
                                      <p className="font-bold text-sm lg:text-base ml-6 text-gray-900">
                                        {formatDate(extension.extensionDate)}
                                      </p>
                                    </div>

                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-gray-500" />
                                        <span className="text-xs lg:text-sm text-gray-600 font-medium">
                                          Thời hạn mới:
                                        </span>
                                      </div>
                                      <p className="font-bold text-sm lg:text-base ml-6 text-gray-900">
                                        {formatDate(extension.oldEndDate)} → {formatDate(extension.newEndDate)}
                                      </p>
                                    </div>

                                    {extension.oldRent !== extension.newRent && (
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                          <DollarSign className="h-4 w-4 text-gray-500" />
                                          <span className="text-xs lg:text-sm text-gray-600 font-medium">
                                            Thay đổi giá:
                                          </span>
                                        </div>
                                        <p className="font-bold text-sm lg:text-base ml-6">
                                          <span className="text-gray-600">{formatCurrency(extension.oldRent)}</span>
                                          <span className="mx-2">→</span>
                                          <span className="text-green-600">{formatCurrency(extension.newRent)}</span>
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  {extension.rentIncreaseReason && (
                                    <div className="mt-3 space-y-2">
                                      <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-gray-500" />
                                        <span className="text-xs lg:text-sm text-gray-600 font-medium">
                                          Lý do tăng giá:
                                        </span>
                                      </div>
                                      <div className="ml-6 bg-white p-2 rounded border border-gray-200">
                                        <p className="font-medium text-sm lg:text-base text-gray-900">
                                          {extension.rentIncreaseReason}
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  {extension.notes && (
                                    <div className="mt-3 space-y-2">
                                      <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-gray-500" />
                                        <span className="text-xs lg:text-sm text-gray-600 font-medium">
                                          Ghi chú gia hạn:
                                        </span>
                                      </div>
                                      <div className="ml-6 bg-white p-2 rounded border border-gray-200">
                                        <p className="font-medium text-sm lg:text-base text-gray-900 whitespace-pre-wrap">
                                          {extension.notes}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Contract Summary */}
                        <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 p-4 rounded-lg">
                          <h4 className="font-bold text-gray-900 mb-2">TÓM TẮT HỢP ĐỒNG</h4>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            Hợp đồng thuê phòng số{" "}
                            <strong>
                              {contract.building}
                              {contract.roomNumber}
                            </strong>{" "}
                            tại <strong>{contract.hostelName}</strong> giữa Bên A (
                            <strong>{contract.managerName}</strong>) và Bên B (<strong>{contract.tenantName}</strong>)
                            với giá thuê <strong>{formatCurrency(contract.monthlyRent)}/tháng</strong>, thời hạn từ{" "}
                            <strong>{formatDate(contract.contractStartDate)}</strong> đến{" "}
                            <strong>{formatDate(contract.contractEndDate)}</strong>.
                          </p>
                        </div>
                      </div>

                      <DialogFooter className="pt-3 border-t mt-3">
                        <div className="flex gap-2 w-full">
                          <Button
                            variant="outline"
                            onClick={() => handlePrintContract(contract)}
                            className="flex-1 h-9 lg:h-10 text-xs lg:text-sm"
                          >
                            <Printer className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                            In hợp đồng
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleExtendContract(contract)}
                            className="flex-1 h-9 lg:h-10 text-xs lg:text-sm bg-blue-50 text-blue-600 hover:bg-blue-100"
                          >
                            <Calendar className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                            Gia hạn
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setIsContractDetailsOpen(false)}
                            className="flex-1 h-9 lg:h-10 text-xs lg:text-sm"
                          >
                            Đóng
                          </Button>
                        </div>
                      </DialogFooter>
                    </>
                  )
                })()}
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Contract Dialog */}
        <Dialog open={isAddContractOpen} onOpenChange={setIsAddContractOpen}>
          <DialogContent className="sm:max-w-[800px] mx-2 max-h-[90vh] overflow-y-auto rounded-xl p-4 sm:p-6">
            {contractRoom && (
              <form onSubmit={handleAddContract}>
                <DialogHeader className="pb-3">
                  <DialogTitle className="text-base lg:text-xl font-semibold flex items-center gap-2">
                    <User className="h-4 w-4 lg:h-5 lg:w-5" />
                    Tạo hợp đồng thuê - Phòng {contractRoom.building}
                    {contractRoom.number}
                  </DialogTitle>
                  <DialogDescription className="text-xs lg:text-sm text-gray-600">
                    Nhập đầy đủ thông tin để tạo hợp đồng thuê phòng
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                  {/* Room Information */}
                  <div className="space-y-3">
                    <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-1">
                      Thông tin phòng thuê
                    </h3>
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
                          {formatCurrency(contractRoom.price)}/tháng
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Party A Information (Landlord) */}
                  <div className="space-y-3">
                    <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-1">
                      Bên A - Bên cho thuê (Thông tin từ hồ sơ cá nhân)
                    </h3>
                    <div className="bg-yellow-50 p-2 lg:p-4 rounded-lg space-y-2">
                      <div className="grid grid-cols-3 gap-1">
                        <span className="text-gray-600 text-xs lg:text-sm col-span-1">Họ và tên:</span>
                        <span className="font-medium text-xs lg:text-sm col-span-2 text-right">
                          {managerProfile?.HoTenQuanLi || "Chưa cập nhật"}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <span className="text-gray-600 text-xs lg:text-sm col-span-1">Số điện thoại:</span>
                        <span className="font-medium text-xs lg:text-sm col-span-2 text-right">
                          {managerProfile?.SoDienThoaiDN || "Chưa cập nhật"}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <span className="text-gray-600 text-xs lg:text-sm col-span-1">CCCD:</span>
                        <span className="font-medium text-xs lg:text-sm col-span-2 text-right">
                          {managerProfile?.SoCCCD || "Chưa cập nhật"}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <span className="text-gray-600 text-xs lg:text-sm col-span-1">Địa chỉ:</span>
                        <span className="font-medium text-xs lg:text-sm col-span-2 text-right">
                          {managerProfile
                            ? `${managerProfile.DiaChiChiTiet}, ${managerProfile.Phuong}, ${managerProfile.Quan}, ${managerProfile.ThanhPho}`
                            : "Chưa cập nhật"}
                        </span>
                      </div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <p className="text-xs text-orange-800">
                        <strong>Lưu ý:</strong> Thông tin Bên A chỉ có thể chỉnh sửa trong trang "Thông tin cá nhân".
                      </p>
                    </div>
                  </div>

                  {/* Hostel Information */}
                  <div className="space-y-3">
                    <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-1">
                      Thông tin nhà trọ (Từ cài đặt)
                    </h3>
                    <div className="bg-green-50 p-2 lg:p-4 rounded-lg space-y-2">
                      <div className="grid grid-cols-3 gap-1">
                        <span className="text-gray-600 text-xs lg:text-sm col-span-1">Tên nhà trọ:</span>
                        <span className="font-medium text-xs lg:text-sm col-span-2 text-right">
                          {hostelSettings?.name || "Chưa cập nhật"}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <span className="text-gray-600 text-xs lg:text-sm col-span-1">Địa chỉ:</span>
                        <span className="font-medium text-xs lg:text-sm col-span-2 text-right">
                          {hostelSettings?.address || "Chưa cập nhật"}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <span className="text-gray-600 text-xs lg:text-sm col-span-1">Giấy phép KD:</span>
                        <span className="font-medium text-xs lg:text-sm col-span-2 text-right">
                          {hostelSettings?.businessLicense || "Chưa cập nhật"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Party B Information (Tenant) */}
                  <div className="space-y-3">
                    <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-1">Bên B - Bên thuê</h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
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

                      <div className="space-y-1">
                        <Label htmlFor="tenantCCCD" className="text-xs lg:text-sm font-medium">
                          Số CCCD *
                        </Label>
                        <Input
                          id="tenantCCCD"
                          name="tenantCCCD"
                          placeholder="123456789012"
                          required
                          className="h-8 lg:h-10 text-xs lg:text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="tenantAddress" className="text-xs lg:text-sm font-medium">
                        Địa chỉ thường trú *
                      </Label>
                      <Input
                        id="tenantAddress"
                        name="tenantAddress"
                        placeholder="Số nhà, đường, phường, quận, thành phố"
                        required
                        className="h-8 lg:h-10 text-xs lg:text-sm"
                      />
                    </div>

                    {/* CCCD Images Upload */}
                    <div className="space-y-3">
                      <Label className="text-xs lg:text-sm font-medium">Hình ảnh CCCD</Label>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Front CCCD */}
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">Mặt trước</Label>
                          {cccdImages.front ? (
                            <div className="relative">
                              <img
                                src={cccdImages.front || "/placeholder.svg"}
                                alt="CCCD mặt trước"
                                className="w-full h-32 object-cover border rounded-lg"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 h-6 w-6 p-0"
                                onClick={() => removeImage("front")}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) handleImageUpload(file, "front")
                                }}
                                className="hidden"
                                id="cccd-front"
                              />
                              <label htmlFor="cccd-front" className="cursor-pointer">
                                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-xs text-gray-600">Tải lên ảnh mặt trước</p>
                              </label>
                            </div>
                          )}
                        </div>

                        {/* Back CCCD */}
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">Mặt sau</Label>
                          {cccdImages.back ? (
                            <div className="relative">
                              <img
                                src={cccdImages.back || "/placeholder.svg"}
                                alt="CCCD mặt sau"
                                className="w-full h-32 object-cover border rounded-lg"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 h-6 w-6 p-0"
                                onClick={() => removeImage("back")}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) handleImageUpload(file, "back")
                                }}
                                className="hidden"
                                id="cccd-back"
                              />
                              <label htmlFor="cccd-back" className="cursor-pointer">
                                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-xs text-gray-600">Tải lên ảnh mặt sau</p>
                              </label>
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-gray-500">
                        Tải lên hình ảnh CCCD để lưu trữ trong hợp đồng. Kích thước tối đa: 5MB
                      </p>
                    </div>
                  </div>

                  {/* Contract Information */}
                  <div className="space-y-3">
                    <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-1">
                      Điều khoản hợp đồng
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
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

                      <div className="space-y-1">
                        <Label htmlFor="deposit" className="text-xs lg:text-sm font-medium">
                          Tiền cọc (VND)
                        </Label>
                        <Input
                          id="deposit"
                          name="deposit"
                          type="number"
                          placeholder="0"
                          min="0"
                          className="h-8 lg:h-10 text-xs lg:text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="contractType" className="text-xs lg:text-sm font-medium">
                          Loại hợp đồng *
                        </Label>
                        <Select name="contractType" defaultValue="monthly">
                          <SelectTrigger className="h-8 lg:h-10 text-xs lg:text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Thuê theo tháng</SelectItem>
                            <SelectItem value="quarterly">Thuê theo quý</SelectItem>
                            <SelectItem value="yearly">Thuê theo năm</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="notes" className="text-xs lg:text-sm font-medium">
                        Điều khoản đặc biệt
                      </Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        placeholder="Các điều khoản đặc biệt, quy định về thanh toán, sử dụng phòng..."
                        rows={3}
                        className="text-xs lg:text-sm resize-none"
                      />
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs text-blue-800">
                        <strong>Thông tin hợp đồng:</strong> Hợp đồng sẽ được tạo giữa Bên A (
                        {managerProfile?.HoTenQuanLi || "Chưa cập nhật"}) và Bên B (thông tin sẽ được điền ở trên) cho
                        việc thuê phòng {contractRoom.building}
                        {contractRoom.number}
                        tại {hostelSettings?.name || "Chưa cập nhật"}. Điều khoản chi tiết sẽ được áp dụng theo mẫu
                        chuẩn.
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

        {/* Extend Contract Dialog */}
        <Dialog open={isExtendContractOpen} onOpenChange={setIsExtendContractOpen}>
          <DialogContent className="sm:max-w-[600px] mx-2 max-h-[90vh] overflow-y-auto rounded-xl p-4 sm:p-6">
            {extendingContract && (
              <form onSubmit={handleSubmitExtension}>
                <DialogHeader className="pb-3">
                  <DialogTitle className="text-base lg:text-xl font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4 lg:h-5 lg:w-5" />
                    Gia hạn hợp đồng - Phòng {extendingContract.building}
                    {extendingContract.number}
                  </DialogTitle>
                  <DialogDescription className="text-xs lg:text-sm text-gray-600">
                    Gia hạn thời gian thuê và cập nhật điều khoản hợp đồng
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                  {/* Current Contract Info */}
                  <div className="space-y-3">
                    <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-1">
                      Thông tin hợp đồng hiện tại
                    </h3>
                    <div className="bg-gray-50 p-3 lg:p-4 rounded-lg space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-600 text-xs lg:text-sm">Khách thuê:</span>
                          <p className="font-medium text-sm lg:text-base">{extendingContract.tenantName}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-xs lg:text-sm">Phòng:</span>
                          <p className="font-medium text-sm lg:text-base">
                            {extendingContract.building}
                            {extendingContract.number}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-xs lg:text-sm">Hết hạn hiện tại:</span>
                          <p className="font-medium text-sm lg:text-base text-red-600">
                            {formatDate(extendingContract.contractEndDate)}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-xs lg:text-sm">Giá thuê hiện tại:</span>
                          <p className="font-medium text-sm lg:text-base text-green-600">
                            {formatCurrency(extendingContract.monthlyRent)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Extension Details */}
                  <div className="space-y-3">
                    <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-1">Thông tin gia hạn</h3>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor="newEndDate" className="text-xs lg:text-sm font-medium">
                          Ngày kết thúc mới *
                        </Label>
                        <Input
                          id="newEndDate"
                          name="newEndDate"
                          type="date"
                          required
                          min={extendingContract.contractEndDate}
                          className="h-8 lg:h-10 text-xs lg:text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="newRent" className="text-xs lg:text-sm font-medium">
                          Giá thuê mới (VND) *
                        </Label>
                        <Input
                          id="newRent"
                          name="newRent"
                          type="number"
                          defaultValue={extendingContract.monthlyRent}
                          min="0"
                          required
                          className="h-8 lg:h-10 text-xs lg:text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="rentIncreaseReason" className="text-xs lg:text-sm font-medium">
                          Lý do thay đổi giá (nếu có)
                        </Label>
                        <Textarea
                          id="rentIncreaseReason"
                          name="rentIncreaseReason"
                          placeholder="VD: Tăng giá do lạm phát, cải thiện tiện ích..."
                          rows={2}
                          className="text-xs lg:text-sm resize-none"
                        />
                        <p className="text-xs text-gray-500">Chỉ cần điền nếu giá thuê mới khác với giá hiện tại</p>
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="notes" className="text-xs lg:text-sm font-medium">
                          Ghi chú gia hạn
                        </Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          placeholder="Ghi chú về việc gia hạn, thay đổi điều khoản..."
                          rows={3}
                          className="text-xs lg:text-sm resize-none"
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs text-blue-800">
                        <strong>Lưu ý:</strong> Việc gia hạn sẽ được lưu vào lịch sử hợp đồng. Thông tin gia hạn sẽ được
                        hiển thị trong chi tiết hợp đồng và có thể in cùng với hợp đồng gốc.
                      </p>
                    </div>
                  </div>
                </div>

                <DialogFooter className="pt-3 border-t mt-3">
                  <div className="flex gap-2 w-full">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsExtendContractOpen(false)}
                      className="flex-1 h-9 lg:h-10 text-xs lg:text-sm"
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 h-9 lg:h-10 text-xs lg:text-sm"
                    >
                      <Calendar className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                      Gia hạn hợp đồng
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )\
}
