"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { Plus, Wifi, Snowflake, Car, Tv, Menu, Filter, Zap, Droplets, Shield, Coffee } from "lucide-react"

// Types
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
  tenantIdCard?: string
  tenantBirthDate?: string
  tenantHometown?: {
    province: string
    district: string
    ward: string
    village?: string
  }
  tenantMembers?: Array<{
    name: string
    relationship: string
    birthDate: string
    idCard?: string
  }>
  description?: string
  contractStartDate?: string
  contractEndDate?: string
  cccdFront?: string
  cccdBack?: string
  roomType?: string
  furniture?: string[]
  utilities?: {
    electricity: boolean
    water: boolean
    internet: boolean
    parking: boolean
    security: boolean
    cleaning: boolean
  }
  deposit?: number
  electricityPrice?: number
  waterPrice?: number
  internetPrice?: number
  parkingPrice?: number
  cleaningPrice?: number
  rules?: string[]
}

interface ContractNotification {
  id: string
  roomNumber: string
  building: string
  tenantName: string
  tenantPhone?: string
  tenantEmail?: string
  contractEndDate: string
  daysUntilExpiry: number
  status: "expired" | "expiring" | "active"
  notificationSent: boolean
  lastNotificationDate?: string
}

// Mock Data
const mockBuildings: Building[] = [
  { id: "A", name: "Dãy A", description: "Dãy phòng chính" },
  { id: "B", name: "Dãy B", description: "Dãy phòng phụ" },
  { id: "C", name: "Dãy C", description: "Dãy phòng VIP" },
  { id: "D", name: "Dãy D", description: "Dãy phòng mới" },
]

const mockRooms: Room[] = [
  {
    id: "1",
    number: "101",
    building: "A",
    floor: 1,
    area: 20,
    price: 3000000,
    status: "occupied",
    amenities: ["wifi", "ac", "parking"],
    tenant: "Nguyễn Văn A",
    tenantPhone: "0901234567",
    tenantEmail: "nguyenvana@email.com",
    tenantIdCard: "123456789012",
    tenantBirthDate: "1990-05-15",
    tenantHometown: {
      province: "TP. Hồ Chí Minh",
      district: "Quận 1",
      ward: "Phường Bến Nghé",
      village: "",
    },
    tenantMembers: [
      {
        name: "Nguyễn Thị C",
        relationship: "Vợ/Chồng",
        birthDate: "1992-08-20",
        idCard: "123456789013",
      },
    ],
    description: "Phòng đầy đủ tiện nghi",
    contractStartDate: "2024-01-15",
    contractEndDate: "2025-01-14",
    roomType: "Phòng đơn",
    furniture: ["Giường", "Tủ quần áo", "Bàn học"],
    utilities: {
      electricity: true,
      water: true,
      internet: true,
      parking: true,
      security: true,
      cleaning: false,
    },
    deposit: 3000000,
    electricityPrice: 3500,
    waterPrice: 20000,
    internetPrice: 100000,
    parkingPrice: 150000,
    cleaningPrice: 0,
    rules: ["Không hút thuốc trong phòng", "Không nuôi thú cưng", "Giữ vệ sinh chung"],
  },
  {
    id: "2",
    number: "102",
    building: "A",
    floor: 1,
    area: 18,
    price: 2800000,
    status: "available",
    amenities: ["wifi", "ac"],
    description: "Phòng thoáng mát",
    roomType: "Phòng đơn",
    furniture: ["Giường", "Tủ quần áo"],
    utilities: {
      electricity: true,
      water: true,
      internet: true,
      parking: false,
      security: true,
      cleaning: false,
    },
    deposit: 2800000,
    electricityPrice: 3500,
    waterPrice: 20000,
    internetPrice: 100000,
    parkingPrice: 0,
    cleaningPrice: 0,
    rules: ["Không hút thuốc trong phòng", "Giữ vệ sinh chung"],
  },
]

// Constants
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

const furnitureOptions = [
  "Giường",
  "Tủ quần áo",
  "Bàn học",
  "Ghế",
  "Tủ lạnh",
  "Máy giặt",
  "Điều hòa",
  "Quạt",
  "Bàn ăn",
  "Kệ sách",
]

const roomTypes = ["Phòng đơn", "Phòng đôi", "Phòng gia đình", "Studio", "Căn hộ mini"]

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

const vietnamProvinces = [
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bắc Giang",
  "Bắc Kạn",
  "Bạc Liêu",
  "Bắc Ninh",
  "Bến Tre",
  "Bình Định",
  "Bình Dương",
  "Bình Phước",
  "Bình Thuận",
  "Cà Mau",
  "Cao Bằng",
  "Đắk Lắk",
  "Đắk Nông",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Giang",
  "Hà Nam",
  "Hà Tĩnh",
  "Hải Dương",
  "Hậu Giang",
  "Hòa Bình",
  "Hưng Yên",
  "Khánh Hòa",
  "Kiên Giang",
  "Kon Tum",
  "Lai Châu",
  "Lâm Đồng",
  "Lạng Sơn",
  "Lào Cai",
  "Long An",
  "Nam Định",
  "Nghệ An",
  "Ninh Bình",
  "Ninh Thuận",
  "Phú Thọ",
  "Quảng Bình",
  "Quảng Nam",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sóc Trăng",
  "Sơn La",
  "Tây Ninh",
  "Thái Bình",
  "Thái Nguyên",
  "Thanh Hóa",
  "Thừa Thiên Huế",
  "Tiền Giang",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái",
  "Phú Yên",
  "Cần Thơ",
  "Đà Nẵng",
  "Hải Phòng",
  "Hà Nội",
  "TP. Hồ Chí Minh",
]

const relationships = ["Vợ/Chồng", "Con", "Cha/Mẹ", "Anh/Chị/Em", "Ông/Bà", "Cháu", "Khác"]

// Helper functions
const getDaysUntilExpiry = (endDate: string): number => {
  const today = new Date()
  const expiry = new Date(endDate)
  const diffTime = expiry.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const getContractStatus = (endDate: string): "expired" | "expiring" | "active" => {
  const daysUntilExpiry = getDaysUntilExpiry(endDate)
  if (daysUntilExpiry < 0) return "expired"
  if (daysUntilExpiry <= 30) return "expiring"
  return "active"
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN")
}

// Main Component
export default function RoomsPage() {
  // State
  const [rooms, setRooms] = useState<Room[]>(mockRooms)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [filterBuilding, setFilterBuilding] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [contractNotifications, setContractNotifications] = useState<ContractNotification[]>([])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [isContractDetailsOpen, setIsContractDetailsOpen] = useState(false)
  const [isEditRoomOpen, setIsEditRoomOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [editSelectedAmenities, setEditSelectedAmenities] = useState<string[]>([])
  const [isAddContractOpen, setIsAddContractOpen] = useState(false)
  const [contractRoom, setContractRoom] = useState<Room | null>(null)
  const [extensionMonths, setExtensionMonths] = useState<number>(12)
  
  // Enhanced room form states
  const [selectedFurniture, setSelectedFurniture] = useState<string[]>([])
  const [selectedUtilities, setSelectedUtilities] = useState({
    electricity: true,
    water: true,
    internet: false,
    parking: false,
    security: false,
    cleaning: false,
  })
  const [roomRules, setRoomRules] = useState<string[]>([])
  const [newRule, setNewRule] = useState("")

  const [landlordInfo] = useState({
    name: "Công ty TNHH Quản lý Nhà trọ ABC",
    address: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
    phone: "028-1234-5678",
    email: "contact@nhatroabc.com",
    representative: "Nguyễn Văn Quản Lý",
    idNumber: "123456789",
    taxCode: "0123456789",
  })

  const [contractTerms] = useState([
    "Bên B có trách nhiệm thanh toán tiền thuê phòng đúng hạn vào ngày 5 hàng tháng.",
    "Bên B không được chuyển nhượng, cho thuê lại phòng trọ mà không có sự đồng ý của Bên A.",
    "Bên B có trách nhiệm giữ gìn tài sản trong phòng và báo cáo kịp thời khi có hư hỏng.",
    "Bên A có trách nhiệm cung cấp đầy đủ các dịch vụ như điện, nước, internet theo thỏa thuận.",
    "Hợp đồng có thể được gia hạn theo thỏa thuận của hai bên.",
    "Khi chấm dứt hợp đồng, Bên B phải trả lại phòng trong tình trạng ban đầu.",
    "Mọi tranh chấp sẽ được giải quyết thông qua thương lượng, hòa giải hoặc tòa án có thẩm quyền.",
  ])

  const [cccdImages, setCccdImages] = useState<{
    front: string | null
    back: string | null
  }>({
    front: null,
    back: null,
  })

  const [tenantInfo, setTenantInfo] = useState({
    members: [] as Array<{
      name: string
      relationship: string
      birthDate: string
      idCard: string
    }>,
  })

  // Effects
  useEffect(() => {
    const generateContractNotifications = (): ContractNotification[] => {
      return rooms
        .filter((room) => room.status === "occupied" && room.contractEndDate)
        .map((room) => {
          const daysUntilExpiry = getDaysUntilExpiry(room.contractEndDate!)
          const status = getContractStatus(room.contractEndDate!)

          return {
            id: room.id,
            roomNumber: room.number,
            building: room.building,
            tenantName: room.tenant!,
            tenantPhone: room.tenantPhone,
            tenantEmail: room.tenantEmail,
            contractEndDate: room.contractEndDate!,
            daysUntilExpiry,
            status,
            notificationSent: false,
            lastNotificationDate: undefined,
          }
        })
        .filter((notification) => notification.status !== "active")
    }

    setContractNotifications(generateContractNotifications())
  }, [rooms])

  // Filtered rooms
  const filteredRooms = rooms.filter((room) => {
    const matchesStatus = filterStatus === "all" || room.status === filterStatus
    const matchesBuilding = filterBuilding === "all" || room.building === filterBuilding
    const matchesSearch =
      room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.tenant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.description?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesStatus && matchesBuilding && matchesSearch
  })

  // Event handlers
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
      roomType: formData.get("roomType") as string,
      furniture: selectedFurniture,
      utilities: selectedUtilities,
      deposit: Number.parseInt(formData.get("deposit") as string) || Number.parseInt(formData.get("price") as string),
      electricityPrice: Number.parseInt(formData.get("electricityPrice") as string) || 3500,
      waterPrice: Number.parseInt(formData.get("waterPrice") as string) || 20000,
      internetPrice: Number.parseInt(formData.get("internetPrice") as string) || 100000,
      parkingPrice: Number.parseInt(formData.get("parkingPrice") as string) || 0,
      cleaningPrice: Number.parseInt(formData.get("cleaningPrice") as string) || 0,
      rules: roomRules,
    }

    setRooms([...rooms, newRoom])
    setIsAddDialogOpen(false)
    // Reset form states
    setSelectedAmenities([])
    setSelectedFurniture([])
    setSelectedUtilities({
      electricity: true,
      water: true,
      internet: false,
      parking: false,
      security: false,
      cleaning: false,
    })
    setRoomRules([])
  }

  const handleAddContract = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!contractRoom) return

    const formData = new FormData(event.currentTarget)

    const contractInfo = {
      tenantName: formData.get("tenantName") as string,
      tenantPhone: formData.get("tenantPhone") as string,
      tenantEmail: formData.get("tenantEmail") as string,
      tenantIdCard: formData.get("tenantIdCard") as string,
      tenantBirthDate: formData.get("tenantBirthDate") as string,
      tenantHometown: {
        province: formData.get("province") as string,
        district: formData.get("district") as string,
        ward: formData.get("ward") as string,
        village: (formData.get("village") as string) || "",
      },
      tenantMembers: tenantInfo.members,
      contractStartDate: formData.get("contractStartDate") as string,
      contractEndDate: formData.get("contractEndDate") as string,
      roomNumber: contractRoom.number,
      building: contractRoom.building,
      area: contractRoom.area,
      price: contractRoom.price,
      cccdFront: cccdImages.front || undefined,
      cccdBack: cccdImages.back || undefined,
    }

    const updatedRoom: Room = {
      ...contractRoom,
      status: "occupied",
      tenant: contractInfo.tenantName,
      tenantPhone: contractInfo.tenantPhone,
      tenantEmail: contractInfo.tenantEmail,
      tenantIdCard: contractInfo.tenantIdCard,
      tenantBirthDate: contractInfo.tenantBirthDate,
      tenantHometown: contractInfo.tenantHometown,
      tenantMembers: contractInfo.tenantMembers,
      contractStartDate: contractInfo.contractStartDate,
      contractEndDate: contractInfo.contractEndDate,
      cccdFront: cccdImages.front || undefined,
      cccdBack: cccdImages.back || undefined,
    }

    setRooms(rooms.map((room) => (room.id === contractRoom.id ? updatedRoom : room)))
    handlePrintContract(contractInfo)
    setIsAddContractOpen(false)
    setCccdImages({ front: null, back: null })
    setTenantInfo({ members: [] })
  }

  const handlePrintContract = (contractInfo: any) => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const room = rooms.find(r => r.number === contractInfo.roomNumber && r.building === contractInfo.building)
    
    const contractHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Hợp đồng thuê phòng trọ</title>
      <style>
        body { font-family: 'Times New Roman', serif; line-height: 1.6; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .title { font-size: 18px; font-weight: bold; text-transform: uppercase; }
        .subtitle { font-size: 14px; margin-top: 10px; }
        .section { margin: 20px 0; }
        .party-info { background: #f9f9f9; padding: 15px; margin: 10px 0; border-left: 4px solid #007bff; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .room-details { background: #f0f8ff; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .signature { display: flex; justify-content: space-between; margin-top: 50px; }
        .signature-box { text-align: center; width: 45%; }
        .signature-line { border-top: 1px solid #000; margin-top: 60px; padding-top: 5px; }
        @media print { body { margin: 0; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
        <div class="subtitle">Độc lập - Tự do - Hạnh phúc</div>
        <div style="margin: 30px 0;">
          <div class="title">HỢP ĐỒNG THUÊ PHÒNG TRỌ</div>
          <div class="subtitle">Số: ${Date.now()}/HDTP</div>
        </div>
      </div>

      <div class="section">
        <p>Hôm nay, ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}, tại ${landlordInfo.address}, chúng tôi gồm:</p>
      </div>

      <div class="party-info">
        <h3>BÊN A (BÊN CHO THUÊ):</h3>
        <table>
          <tr><td><strong>Tên tổ chức:</strong></td><td>${landlordInfo.name}</td></tr>
          <tr><td><strong>Địa chỉ:</strong></td><td>${landlordInfo.address}</td></tr>
          <tr><td><strong>Điện thoại:</strong></td><td>${landlordInfo.phone}</td></tr>
          <tr><td><strong>Email:</strong></td><td>${landlordInfo.email}</td></tr>
          <tr><td><strong>Người đại diện:</strong></td><td>${landlordInfo.representative}</td></tr>
          <tr><td><strong>CMND/CCCD:</strong></td><td>${landlordInfo.idNumber}</td></tr>
          <tr><td><strong>Mã số thuế:</strong></td><td>${landlordInfo.taxCode}</td></tr>
        </table>
      </div>

      <div class="party-info">
        <h3>BÊN B (BÊN THUÊ):</h3>
        <table>
          <tr><td><strong>Họ và tên:</strong></td><td>${contractInfo.tenantName}</td></tr>
          <tr><td><strong>Điện thoại:</strong></td><td>${contractInfo.tenantPhone}</td></tr>
          <tr><td><strong>Email:</strong></td><td>${contractInfo.tenantEmail || "Không có"}</td></tr>
          <tr><td><strong>CMND/CCCD:</strong></td><td>${contractInfo.tenantIdCard || "_________________"}</td></tr>
          <tr><td><strong>Ngày sinh:</strong></td><td>${contractInfo.tenantBirthDate ? new Date(contractInfo.tenantBirthDate).toLocaleDateString("vi-VN") : "_________________"}</td></tr>
          <tr><td><strong>Quê quán:</strong></td><td>${contractInfo.tenantHometown ? [contractInfo.tenantHometown.village, contractInfo.tenantHometown.ward, contractInfo.tenantHometown.district, contractInfo.tenantHometown.province].filter(Boolean).join(", ") : "_________________"}</td></tr>
        </table>
      </div>

      <div class="room-details">
        <h3>THÔNG TIN CHI TIẾT PHÒNG THUÊ:</h3>
        <table>
          <tr><td><strong>Số phòng:</strong></td><td>${contractInfo.roomNumber}</td></tr>
          <tr><td><strong>Dãy nhà:</strong></td><td>${contractInfo.building}</td></tr>
          <tr><td><strong>Loại phòng:</strong></td><td>${room?.roomType || "Không xác định"}</td></tr>
          <tr><td><strong>Diện tích:</strong></td><td>${contractInfo.area}m²</td></tr>
          <tr><td><strong>Giá thuê:</strong></td><td>${contractInfo.price.toLocaleString()}₫/tháng</td></tr>
          <tr><td><strong>Tiền đặt cọc:</strong></td><td>${(room?.deposit || contractInfo.price).toLocaleString()}₫</td></tr>
          <tr><td><strong>Ngày bắt đầu:</strong></td><td>${new Date(contractInfo.contractStartDate).toLocaleDateString("vi-VN")}</td></tr>
          <tr><td><strong>Ngày kết thúc:</strong></td><td>${new Date(contractInfo.contractEndDate).toLocaleDateString("vi-VN")}</td></tr>
        </table>

        ${room?.furniture && room.furniture.length > 0 ? `
        <div style="margin-top: 15px;">
          <h4>Nội thất trong phòng:</h4>
          <ul>
            ${room.furniture.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        ${room?.utilities ? `
        <div style="margin-top: 15px;">
          <h4>Dịch vụ và giá cước:</h4>
          <table>
            <thead>
              <tr><th>Dịch vụ</th><th>Có/Không</th><th>Giá cước</th></tr>
            </thead>
            <tbody>
              <tr><td>Điện</td><td>${room.utilities.electricity ? 'Có' : 'Không'}</td><td>${room.utilities.electricity ? (room.electricityPrice || 3500).toLocaleString() + '₫/kWh' : 'N/A'}</td></tr>
              <tr><td>Nước</td><td>${room.utilities.water ? 'Có' : 'Không'}</td><td>${room.utilities.water ? (room.waterPrice || 20000).toLocaleString() + '₫/m³' : 'N/A'}</td></tr>
              <tr><td>Internet</td><td>${room.utilities.internet ? 'Có' : 'Không'}</td><td>${room.utilities.internet ? (room.internetPrice || 100000).toLocaleString() + '₫/tháng' : 'N/A'}</td></tr>
              <tr><td>Chỗ đậu xe</td><td>${room.utilities.parking ? 'Có' : 'Không'}</td><td>${room.utilities.parking ? (room.parkingPrice || 0).toLocaleString() + '₫/tháng' : 'N/A'}</td></tr>
              <tr><td>An ninh</td><td>${room.utilities.security ? 'Có' : 'Không'}</td><td>Miễn phí</td></tr>
              <tr><td>Dọn dẹp</td><td>${room.utilities.cleaning ? 'Có' : 'Không'}</td><td>${room.utilities.cleaning ? (room.cleaningPrice || 0).toLocaleString() + '₫/tháng' : 'N/A'}</td></tr>
            </tbody>
          </table>
        </div>
        ` : ''}

        ${room?.rules && room.rules.length > 0 ? `
        <div style="margin-top: 15px;">
          <h4>Nội quy phòng trọ:</h4>
          <ul>
            ${room.rules.map(rule => `<li>${rule}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
      </div>

      <div class="section">
        <h3>ĐIỀU KHOẢN HỢP ĐỒNG:</h3>
        <ol>
          ${contractTerms.map((term, index) => `<li><strong>Điều ${index + 1}:</strong> ${term}</li>`).join("")}
        </ol>
      </div>

      <div class="signature">
        <div class="signature-box">
          <strong>BÊN A</strong><br>
          <em>(Ký tên, đóng dấu)</em>
          <div class="signature-line">${landlordInfo.representative}</div>
        </div>
        <div class="signature-box">
          <strong>BÊN B</strong><br>
          <em>(Ký tên)</em>
          <div class="signature-line">${contractInfo.tenantName}</div>
        </div>
      </div>
    </body>
    </html>
  `

    printWindow.document.write(contractHTML)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  const handleDeleteRoom = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa phòng này?")) {
      setRooms(rooms.filter((room) => room.id !== id))
    }
  }

  const handleMarkNotified = (contractId: string) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === contractId
          ? {
              ...room,
              notificationSent: true,
              lastNotificationDate: new Date().toISOString().split("T")[0],
            }
          : room,
      ),
    )
  }

  const handleExtendContract = (contractId: string, months = 12) => {
    const room = rooms.find((r) => r.id === contractId)
    if (room && room.contractEndDate) {
      const currentEndDate = new Date(room.contractEndDate)
      const newEndDate = new Date(currentEndDate.setMonth(currentEndDate.getMonth() + months))

      setRooms((prevRooms) =>
        prevRooms.map((r) =>
          r.id === contractId
            ? {
                ...r,
                contractEndDate: newEndDate.toISOString().split("T")[0],
                notificationSent: false,
              }
            : r,
        ),
      )
      alert(
        `Đã gia hạn hợp đồng phòng ${room.building}${room.number} thêm ${months} tháng đến ${newEndDate.toLocaleDateString("vi-VN")}`,
      )
      setIsContractDetailsOpen(false)
    }
  }

  const handleContactTenant = (contractId: string, method: "phone" | "email") => {
    const room = rooms.find((r) => r.id === contractId)
    if (room) {
      if (method === "phone" && room.tenantPhone) {
        window.open(`tel:${room.tenantPhone}`)
      } else if (method === "email" && room.tenantEmail) {
        const subject = `Thông báo gia hạn hợp đồng phòng ${room.building}${room.number}`
        const body = `Xin chào ${room.tenant},\n\nHợp đồng thuê phòng ${room.building}${room.number} của bạn sẽ hết hạn vào ngày ${room.contractEndDate ? new Date(room.contractEndDate).toLocaleDateString("vi-VN") : ""}.\n\nVui lòng liên hệ để thảo luận về việc gia hạn hợp đồng.\n\nTrân trọng,\nBan quản lý`
        window.open(
          `mailto:${room.tenantEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
        )
      }
    }
  }

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    if (checked) {
      setSelectedAmenities([...selectedAmenities, amenityId])
    } else {
      setSelectedAmenities(selectedAmenities.filter((id) => id !== amenityId))
    }
  }

  const handleFurnitureChange = (furniture: string, checked: boolean) => {
    if (checked) {
      setSelectedFurniture([...selectedFurniture, furniture])
    } else {
      setSelectedFurniture(selectedFurniture.filter((item) => item !== furniture))
    }
  }

  const handleUtilityChange = (utility: keyof typeof selectedUtilities, checked: boolean) => {
    setSelectedUtilities(prev => ({
      ...prev,
      [utility]: checked
    }))
  }

  const handleAddRule = () => {
    if (newRule.trim() && !roomRules.includes(newRule.trim())) {
      setRoomRules([...roomRules, newRule.trim()])
      setNewRule("")
    }
  }

  const handleRemoveRule = (index: number) => {
    setRoomRules(roomRules.filter((_, i) => i !== index))
  }

  const handleViewContractDetails = (room: Room) => {
    setSelectedRoom(room)
    setIsContractDetailsOpen(true)
  }

  const handleAddContractClick = (room: Room) => {
    setContractRoom(room)
    setIsAddContractOpen(true)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: "front" | "back") => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setCccdImages((prev) => ({
          ...prev,
          [type]: result,
        }))
      }
      reader.readAsDataURL(file)
    }
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
              <p className="text-gray-600">Quản lý thông tin các phòng trọ</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm phòng mới
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-[95vw] max-h-[95vh] overflow-y-auto mx-auto">
                <form onSubmit={handleAddRoom}>
                  <DialogHeader className="pb-4 text-center">
                    <DialogTitle className="text-xl font-semibold">Thêm phòng mới</DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Nhập thông tin chi tiết cho phòng trọ mới
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6 py-4">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Thông tin cơ bản</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="number" className="text-sm font-medium">
                            Số phòng *
                          </Label>
                          <Input
                            id="number"
                            name="number"
                            placeholder="VD: 101, 202"
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

                        <div className="space-y-2">
                          <Label htmlFor="roomType" className="text-sm font-medium">
                            Loại phòng *
                          </Label>
                          <Select name="roomType" defaultValue="Phòng đơn">
                            <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {roomTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

                        <div className="space-y-2">
                          <Label htmlFor="deposit" className="text-sm font-medium">
                            Tiền cọc (VND)
                          </Label>
                          <Input
                            id="deposit"
                            name="deposit"
                            type="number"
                            placeholder="3000000"
                            min="0"
                            className="focus:ring-2 focus:ring-blue-500"
                          />
                          <p className="text-xs text-gray-500">Để trống sẽ bằng giá thuê</p>
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

                    {/* Furniture */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Nội thất</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {furnitureOptions.map((furniture) => (
                          <div
                            key={furniture}
                            className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <Checkbox
                              id={`furniture-${furniture}`}
                              checked={selectedFurniture.includes(furniture)}
                              onCheckedChange={(checked) => handleFurnitureChange(furniture, checked as boolean)}
                              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                            <Label
                              htmlFor={`furniture-${furniture}`}
                              className="cursor-pointer text-sm font-medium"
                            >
                              {furniture}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Services & Utilities */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Dịch vụ & Tiện ích</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Utilities with pricing */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-800">Dịch vụ cơ bản</h4>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="utility-electricity"
                                  checked={selectedUtilities.electricity}
                                  onCheckedChange={(checked) => handleUtilityChange('electricity', checked as boolean)}
                                />
                                <Label htmlFor="utility-electricity" className="font-medium">Điện</Label>
                              </div>
                              {selectedUtilities.electricity && (
                                <div className="flex items-center space-x-2">
                                  <Input
                                    name="electricityPrice"
                                    type="number"
                                    placeholder="3500"
                                    className="w-20 h-8 text-sm"
                                  />
                                  <span className="text-sm text-gray-600">₫/kWh</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="utility-water"
                                  checked={selectedUtilities.water}
                                  onCheckedChange={(checked) => handleUtilityChange('water', checked as boolean)}
                                />
                                <Label htmlFor="utility-water" className="font-medium">Nước</Label>
                              </div>
                              {selectedUtilities.water && (
                                <div className="flex items-center space-x-2">
                                  <Input
                                    name="waterPrice"
                                    type="number"
                                    placeholder="20000"
                                    className="w-24 h-8 text-sm"
                                  />
                                  <span className="text-sm text-gray-600">₫/m³</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="utility-internet"
                                  checked={selectedUtilities.internet}
                                  onCheckedChange={(checked) => handleUtilityChange('internet', checked as boolean)}
                                />
                                <Label htmlFor="utility-internet" className="font-medium">Internet</Label>
                              </div>
                              {selectedUtilities.internet && (
                                <div className="flex items-center space-x-2">
                                  <Input
                                    name="internetPrice"
                                    type="number"
                                    placeholder="100000"
                                    className="w-24 h-8 text-sm"
                                  />
                                  <span className="text-sm text-gray-600">₫/tháng</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Additional services */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-800">Dịch vụ bổ sung</h4>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="utility-parking"
                                  checked={selectedUtilities.parking}
                                  onCheckedChange={(checked) => handleUtilityChange('parking', checked as boolean)}
                                />
                                <Label htmlFor="utility-parking" className="font-medium">Chỗ đậu xe</Label>
                              </div>
                              {selectedUtilities.parking && (
                                <div className="flex items-center space-x-2">
                                  <Input
                                    name="parkingPrice"
                                    type="number"
                                    placeholder="150000"
                                    className="w-24 h-8 text-sm"
                                  />
                                  <span className="text-sm text-gray-600">₫/tháng</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center space-x-2 p-3 border rounded-lg">
                              <Checkbox
                                id="utility-security"
                                checked={selectedUtilities.security}
                                onCheckedChange={(checked) => handleUtilityChange('security', checked as boolean)}
                              />
                              <Label htmlFor="utility-security" className="font-medium">An ninh 24/7</Label>
                            </div>

                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="utility-cleaning"
                                  checked={selectedUtilities.cleaning}
                                  onCheckedChange={(checked) => handleUtilityChange('cleaning', checked as boolean)}
                                />
                                <Label htmlFor="utility-cleaning" className="font-medium">Dọn dẹp</Label>
                              </div>
                              {selectedUtilities.cleaning && (
                                <div className="flex items-center space-x-2">
                                  <Input
                                    name="cleaningPrice"
                                    type="number"
                                    placeholder="200000"
                                    className="w-24 h-8 text-sm"
                                  />
                                  <span className="text-sm text-gray-600">₫/tháng</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Basic Amenities */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-800">Tiện ích cơ bản</h4>
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
                                  \
