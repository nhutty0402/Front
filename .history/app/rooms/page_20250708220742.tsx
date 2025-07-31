"use client"
import React from "react"
import type { FunctionComponent } from "react"
import { useState } from "react"
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
import { ContractNotifications } from "@/components/contract-notifications"
import {
  Plus,
  Edit,
  Trash2,
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
    number: "A102",
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
  "H��i Phòng",
  "Hà Nội",
  "TP. Hồ Chí Minh",
]

const relationships = ["Vợ/Chồng", "Con", "Cha/Mẹ", "Anh/Chị/Em", "Ông/Bà", "Cháu", "Khác"]

const RoomsPage: FunctionComponent = () => {
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

  const [landlordInfo, setLandlordInfo] = useState({
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

  const [showContractPreview, setShowContractPreview] = useState(false)
  const [contractData, setContractData] = useState<any>(null)

  const [cccdImages, setCccdImages] = useState<{
    front: string | null
    back: string | null
  }>({
    front: null,
    back: null,
  })

  const [tenantInfo, setTenantInfo] = useState({
    idCard: "",
    birthDate: "",
    hometown: {
      province: "",
      district: "",
      ward: "",
      village: "",
    },
    members: [] as Array<{
      name: string
      relationship: string
      birthDate: string
      idCard: string
    }>,
  })

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

  const removeImage = (type: "front" | "back") => {
    setCccdImages((prev) => ({
      ...prev,
      [type]: null,
    }))
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

  const handleEditRoom = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!editingRoom) return

    const formData = new FormData(event.currentTarget)

    const updatedRoom: Room = {
      ...editingRoom,
      number: formData.get("number") as string,
      building: formData.get("building") as string,
      floor: Number.parseInt(formData.get("floor") as string),
      area: Number.parseInt(formData.get("area") as string),
      price: Number.parseInt(formData.get("price") as string),
      status: formData.get("status") as Room["status"],
      amenities: editSelectedAmenities,
      description: formData.get("description") as string,
    }

    setRooms(rooms.map((room) => (room.id === editingRoom.id ? updatedRoom : room)))
    setIsEditRoomOpen(false)
    setEditingRoom(null)
    setEditSelectedAmenities([])
  }

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
          notificationSent: (room as any).notificationSent || false,
          lastNotificationDate: (room as any).lastNotificationDate,
        }
      })
      .filter((notification) => notification.status !== "active")
  }

  const filteredRooms = rooms.filter((room) => {
    const matchesStatus = filterStatus === "all" || room.status === filterStatus
    const matchesBuilding = filterBuilding === "all" || room.building === filterBuilding
    const matchesSearch =
      room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.tenant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.description?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesStatus && matchesBuilding && matchesSearch
  })

  React.useEffect(() => {
    setContractNotifications(generateContractNotifications())
  }, [rooms])

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
    setContractData(contractInfo)
    setShowContractPreview(true)
    setIsAddContractOpen(false)
    setCccdImages({ front: null, back: null })
    setTenantInfo({
      idCard: "",
      birthDate: "",
      hometown: { province: "", district: "", ward: "", village: "" },
      members: [],
    })
  }

  const handleDeleteRoom = (id: string) => {
    setRooms(rooms.filter((room) => room.id !== id))
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
    if (room) {
      const currentEndDate = new Date(room.contractEndDate!)
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
        const body = `Xin chào ${room.tenant},\n\nHợp đồng thuê phòng ${room.building}${room.number} của bạn sẽ hết hạn vào ngày ${new Date(room.contractEndDate!).toLocaleDateString("vi-VN")}.\n\nVui lòng liên hệ để thảo luận về việc gia hạn hợp đồng.\n\nTrân trọng,\nBan quản lý`
        window.open(
          `mailto:${room.tenantEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
        )
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    if (checked) {
      setSelectedAmenities([...selectedAmenities, amenityId])
    } else {
      setSelectedAmenities(selectedAmenities.filter((id) => id !== amenityId))
    }
  }

  const handleEditAmenityChange = (amenityId: string, checked: boolean) => {
    if (checked) {
      setEditSelectedAmenities([...editSelectedAmenities, amenityId])
    } else {
      setEditSelectedAmenities(editSelectedAmenities.filter((id) => id !== amenityId))
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

  const handleEditRoomClick = (room: Room) => {
    setEditingRoom(room)
    setEditSelectedAmenities(room.amenities)
    setIsEditRoomOpen(true)
  }

  const handleAddContractClick = (room: Room) => {
    setContractRoom(room)
    setIsAddContractOpen(true)
  }

  const handleCloseAddContract = () => {
    setIsAddContractOpen(false)
    setCccdImages({ front: null, back: null })
    setTenantInfo({
      idCard: "",
      birthDate: "",
      hometown: { province: "", district: "", ward: "", village: "" },
      members: [],
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
                                  <Icon className="h-4 w-4 text-gray-600" />
                                  <span>{amenity.name}</span>
                                </Label>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Room Rules */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Nội quy phòng trọ</h3>
                      
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            value={newRule}
                            onChange={(e) => setNewRule(e.target.value)}
                            placeholder="Nhập nội quy mới..."
                            className="flex-1"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                handleAddRule()
                              }
                            }}
                          />
                          <Button type="button" onClick={handleAddRule} variant="outline">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {roomRules.length > 0 && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Nội quy đã thêm:</Label>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                              {roomRules.map((rule, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <span className="text-sm">{rule}</span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveRule(index)}
                                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
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
          {/* Contract Notifications */}
          <ContractNotifications
            contracts={contractNotifications}
            onMarkNotified={handleMarkNotified}
            onExtendContract={handleExtendContract}
            onContactTenant={handleContactTenant}
          />

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

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden space-y-4 p-4 bg-white rounded-xl border shadow-sm">
              <div className="grid grid-cols-1 gap-4">
                <Select value={filterBuilding} onValueChange={setFilterBuilding}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Chọn dãy nhà" />
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
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="available">Trống</SelectItem>
                    <SelectItem value="occupied">Đã thuê</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setFilterBuilding("all")
                  setFilterStatus("all")
                  setSearchTerm("")
                }}
                className="w-full h-12"
              >
                Xóa bộ lọc
              </Button>
            </div>
          )}

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
                <form onSubmit={handleAddRoom}>
                  <DialogHeader className="pb-4 text-center">
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

                    <div className="space-y-3">
                      <Label htmlFor="roomType" className="text-base font-medium">
                        Loại phòng *
                      </Label>
                      <Select name="roomType" defaultValue="Phòng đơn">
                        <SelectTrigger className="h-12">
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
                      <Label htmlFor="deposit" className="text-base font-medium">
                        Tiền cọc (VND)
                      </Label>
                      <Input id="deposit" name="deposit" type="number" placeholder="3000000" className="h-12" />
                      <p className="text-xs text-gray-500">Để trống sẽ bằng giá thuê</p>
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

                    {/* Mobile Furniture */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Nội thất</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {furnitureOptions.slice(0, 6).map((furniture) => (
                          <div key={furniture} className="flex items-center space-x-3 p-3 border rounded-lg">
                            <Checkbox
                              id={`mobile-furniture-${furniture}`}
                              checked={selectedFurniture.includes(furniture)}
                              onCheckedChange={(checked) => handleFurnitureChange(furniture, checked as boolean)}
                            />
                            <Label
                              htmlFor={`mobile-furniture-${furniture}`}
                              className="text-sm font-medium"
                            >
                              {furniture}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mobile Services */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Dịch vụ & Tiện ích</Label>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="mobile-utility-electricity"
                              checked={selectedUtilities.electricity}
                              onCheckedChange={(checked) => handleUtilityChange('electricity', checked as boolean)}
                            />
                            <Label htmlFor="mobile-utility-electricity" className="font-medium">Điện</Label>
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
                              id="mobile-utility-water"
                              checked={selectedUtilities.water}
                              onCheckedChange={(checked) => handleUtilityChange('water', checked as boolean)}
                            />
                            <Label htmlFor="mobile-utility-water" className="font-medium">Nước</Label>
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
                              id="mobile-utility-internet"
                              checked={selectedUtilities.internet}
                              onCheckedChange={(checked) => handleUtilityChange('internet', checked as boolean)}
                            />
                            <Label htmlFor="mobile-utility-internet" className="font-medium">Internet</Label>
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
              const contractStatus = room.contractEndDate ? getContractStatus(room.contractEndDate) : null
              const daysUntilExpiry = room.contractEndDate ? getDaysUntilExpiry(room.contractEndDate) : null

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
                          {room.roomType && (
                            <p className="text-xs text-blue-600 font-medium">{room.roomType}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={`${statusColors[room.status]} text-xs px-3 py-1 rounded-full`}>
                            {statusLabels[room.status]}
                          </Badge>
                          {contractStatus === "expired" && (
                            <Badge variant="destructive" className="text-xs px-3 py-1 rounded-full">
                              Hết hạn HĐ
                            </Badge>
                          )}
                          {contractStatus === "expiring" && (
                            <Badge
                              variant="secondary"
                              className="bg-orange-100 text-orange-800 text-xs px-3 py-1 rounded-full"
                            >
                              Sắp hết hạn
                            </Badge>
                          )}
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
                          <span className="font-semibold text-green-600">{room.price.toLocaleString()}₫</span>
                        </div>
                        {room.deposit && room.deposit !== room.price && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tiền cọc:</span>
                            <span className="font-semibold text-orange-600">{room.deposit.toLocaleString()}₫</span>
                          </div>
                        )}
                        {room.tenant && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Khách thuê:</span>
                            <span className="font-semibold truncate ml-2">{room.tenant}</span>
                          </div>
                        )}
                        {room.contractEndDate && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Hết hạn HĐ:</span>
                              <span
                                className={`font-semibold ${
                                  contractStatus === "expired"
                                    ? "text-red-600"
                                    : contractStatus === "expiring"
                                      ? "text-orange-600"
                                      : "text-gray-900"
                                }`}
                              >
                                {formatDate(room.contractEndDate)}
                              </span>
                            </div>
                            {daysUntilExpiry !== null && (
                              <div
                                className="text-xs text-center p-2 rounded-lg font-medium"
                                style={{
                                  backgroundColor:
                                    contractStatus === "expired"
                                      ? "#fef2f2"
                                      : contractStatus === "expiring"
                                        ? "#fff7ed"
                                        : "#f9fafb",
                                  color:
                                    contractStatus === "expired"
                                      ? "#dc2626"
                                      : contractStatus === "expiring"
                                        ? "#ea580c"
                                        : "#6b7280",
                                }}
                              >
                                {daysUntilExpiry < 0
                                  ? `Đã hết hạn ${Math.abs(daysUntilExpiry)} ngày`
                                  : `Còn ${daysUntilExpiry} ngày`}
                              </div>
                            )}
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

                      {/* Furniture Preview */}
                      {room.furniture && room.furniture.length > 0 && (
                        <div className="text-xs text-gray-600">
                          <span className="font-medium">Nội thất: </span>
                          {room.furniture.slice(0, 3).join(", ")}
                          {room.furniture.length > 3 && ` +${room.furniture.length - 3} khác`}
                        </div>
                      )}

                      {room.description && <p className="text-sm text-gray-600 line-clamp-2">{room.description}</p>}

                      {/* Actions */}
                      <div className="flex gap-2 pt-3">
                        {room.status !== "occupied" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs h-9 bg-transparent"
                            onClick={() => handleEditRoomClick(room)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Sửa
                          </Button>
                        )}

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
                        ) : room.tenant ? (
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

                        {room.status !== "occupied" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 bg-transparent h-9 px-3"
                            onClick={() => handleDeleteRoom(room.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
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
          <DialogContent className="max-w-4xl w-[95vw] max-h-[95vh] overflow-y-auto mx-auto">
            {selectedRoom && (
              <>
                <DialogHeader className="pb-3 text-center">
                  <DialogTitle className="text-xl font-semibold flex items-center justify-center gap-2">
                    <FileText className="h-5 w-5" />
                    Chi tiết hợp đồng - Phòng {selectedRoom.number}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-gray-600">
                    Thông tin chi tiết về hợp đồng thuê phòng
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-2">
                  {/* Contract Status */}
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 text-base">Trạng thái hợp đồng</h3>
                      <p className="text-sm text-gray-600">Tình trạng hiện tại</p>
                    </div>
                    {(() => {
                      const contractStatus = selectedRoom.contractEndDate
                        ? getContractStatus(selectedRoom.contractEndDate)
                        : null
                      return (
                        <Badge
                          className={`px-3 py-1 text-sm ${
                            contractStatus === "expired"
                              ? "bg-red-500"
                              : contractStatus === "expiring"
                                ? "bg-orange-500"
                                : "bg-green-500"
                          }`}
                        >
                          {contractStatus === "expired"
                            ? "Đã hết hạn"
                            : contractStatus === "expiring"
                              ? "Sắp hết hạn"
                              : "Còn hiệu lực"}
                        </Badge>
                      )
                    })()}
                  </div>

                  {/* Room Information */}
                  <div className="space-y-3">
                    <h3 className="text-base font-medium text-gray-900 border-b pb-2 flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Thông tin phòng
                    </h3>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-sm text-gray-600">Phòng số</div>
                          <div className="font-bold text-lg">
                            {selectedRoom.building}{selectedRoom.number}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Loại phòng</div>
                          <div className="font-bold text-lg">{selectedRoom.roomType || "N/A"}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Diện tích</div>
                          <div className="font-bold text-lg">{selectedRoom.area}m²</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Giá thuê</div>
                          <div className="font-bold text-lg text-green-600">
                            {selectedRoom.price.toLocaleString()}₫
                          </div>
                        </div>
                      </div>

                      {/* Furniture and Services */}
                      {selectedRoom.furniture && selectedRoom.furniture.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-green-200">
                          <div className="text-sm font-medium text-gray-700 mb-2">Nội thất:</div>
                          <div className="flex flex-wrap gap-2">
                            {selectedRoom.furniture.map((item, index) => (
                              <span key={index} className="bg-white px-2 py-1 rounded text-sm">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedRoom.utilities && (
                        <div className="mt-4 pt-3 border-t border-green-200">
                          <div className="text-sm font-medium text-gray-700 mb-2">Dịch vụ:</div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                            {selectedRoom.utilities.electricity && (
                              <div className="bg-white p-2 rounded">
                                Điện: {selectedRoom.electricityPrice?.toLocaleString()}₫/kWh
                              </div>
                            )}
                            {selectedRoom.utilities.water && (
                              <div className="bg-white p-2 rounded">
                                Nước: {selectedRoom.waterPrice?.toLocaleString()}₫/m³
                              </div>
                            )}
                            {selectedRoom.utilities.internet && (
                              <div className="bg-white p-2 rounded">
                                Internet: {selectedRoom.internetPrice?.toLocaleString()}₫/tháng
                              </div>
                            )}
                            {selectedRoom.utilities.parking && (
                              <div className="bg-white p-2 rounded">
                                Đậu xe: {selectedRoom.parkingPrice?.toLocaleString()}₫/tháng
                              </div>
                            )}
                            {selectedRoom.utilities.security && (
                              <div className="bg-white p-2 rounded">An ninh 24/7</div>
                            )}
                            {selectedRoom.utilities.cleaning && (
                              <div className="bg-white p-2 rounded">
                                Dọn dẹp: {selectedRoom.cleaningPrice?.toLocaleString()}₫/tháng
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {selectedRoom.rules && selectedRoom.rules.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-green-200">
                          <div className="text-sm font-medium text-gray-700 mb-2">Nội quy:</div>
                          <ul className="text-sm space-y-1">
                            {selectedRoom.rules.map((rule, index) => (
                              <li key={index} className="bg-white p-2 rounded">• {rule}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Landlord Information */}
                  <div className="space-y-3">
                    <h3 className="text-base font-medium text-gray-900 border-b pb-2 flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Thông tin Bên A (Bên cho thuê)
                    </h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Tên tổ chức:</strong> {landlordInfo.name}
                        </div>
                        <div>
                          <strong>Người đại diện:</strong> {landlordInfo.representative}
                        </div>
                        <div>
                          <strong>Điện thoại:</strong> {landlordInfo.phone}
                        </div>
                        <div>
                          <strong>Email:</strong> {landlordInfo.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tenant Information */}
                  {selectedRoom.tenant && (
                    <div className="space-y-3">
                      <h3 className="text-base font-medium text-gray-900 border-b pb-2 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Thông tin Bên B (Khách thuê)
                      </h3>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong>Họ và tên:</strong> {selectedRoom.tenant}
                          </div>
                          {selectedRoom.tenantPhone && (
                            <div>
                              <strong>Số điện thoại:</strong>{" "}
                              <a
                                href={`tel:${selectedRoom.tenantPhone}`}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                {selectedRoom.tenantPhone}
                              </a>
                            </div>
                          )}
                          {selectedRoom.tenantEmail && (
                            <div>
                              <strong>Email:</strong>{" "}
                              <a
                                href={`mailto:${selectedRoom.tenantEmail}`}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                {selectedRoom.tenantEmail}
                              </a>
                            </div>
                          )}
                          {selectedRoom.tenantIdCard && (
                            <div>
                              <strong>CCCD/CMND:</strong> {selectedRoom.tenantIdCard}
                            </div>
                          )}
                          {selectedRoom.tenantBirthDate && (
                            <div>
                              <strong>Ngày sinh:</strong>{" "}
                              {new Date(selectedRoom.tenantBirthDate).toLocaleDateString("vi-VN")}
                            </div>
                          )}
                          {selectedRoom.tenantHometown && (
                            <div className="md:col-span-2">
                              <strong>Quê quán:</strong>{" "}
                              {[
                                selectedRoom.tenantHometown.village,
                                selectedRoom.tenantHometown.ward,
                                selectedRoom.tenantHometown.district,
                                selectedRoom.tenantHometown.province,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </div>
                          )}
                        </div>

                        {selectedRoom.tenantMembers && selectedRoom.tenantMembers.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-yellow-200">
                            <div className="text-sm font-medium text-gray-700 mb-2">
                              Thành viên ở cùng ({selectedRoom.tenantMembers.length} người):
                            </div>
                            <div className="space-y-2">
                              {selectedRoom.tenantMembers.map((member, index) => (
                                <div key={index} className="bg-white p-3 rounded text-sm">
                                  <div className="font-medium">{member.name}</div>
                                  <div className="text-gray-600">
                                    {member.relationship} • {new Date(member.birthDate).toLocaleDateString("vi-VN")}
                                    {member.idCard && ` • ${member.idCard}`}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* CCCD Images Display */}
                  {(selectedRoom.cccdFront || selectedRoom.cccdBack) && (
                    <div className="space-y-3">
                      <h3 className="text-base font-medium text-gray-900 border-b pb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Hình ảnh CCCD/CMND
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedRoom.cccdFront && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700">CCCD/CMND mặt trước</Label>
                              <div className="border rounded-lg overflow-hidden">
                                <img
                                  src={selectedRoom.cccdFront || "/placeholder.svg"}
                                  alt="CCCD mặt trước"
                                  className="w-full h-40 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => window.open(selectedRoom.cccdFront, "_blank")}
                                />
                              </div>
                            </div>
                          )}
                          {selectedRoom.cccdBack && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700">CCCD/CMND mặt sau</Label>
                              <div className="border rounded-lg overflow-hidden">
                                <img
                                  src={selectedRoom.cccdBack || "/placeholder.svg"}
                                  alt="CCCD mặt sau"
                                  className="w-full h-40 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => window.open(selectedRoom.cccdBack, "_blank")}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">💡 Nhấp vào hình ảnh để xem kích thước đầy đủ</p>
                      </div>
                    </div>
                  )}

                  {/* Contract Information */}
                  {selectedRoom.contractStartDate && selectedRoom.contractEndDate && (
                    <div className="space-y-3">
                      <h3 className="text-base font-medium text-gray-900 border-b pb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Thông tin hợp đồng
                      </h3>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong>Ngày bắt đầu:</strong> {formatDate(selectedRoom.contractStartDate)}
                          </div>
                          <div>
                            <strong>Ngày kết thúc:</strong> {formatDate(selectedRoom.contractEndDate)}
                          </div>
                          <div>
                            <strong>Thời hạn hợp đồng:</strong>{" "}
                            {Math.ceil(
                              (new Date(selectedRoom.contractEndDate).getTime() -
                                new Date(selectedRoom.contractStartDate).getTime()) /
                                (1000 * 60 * 60 * 24 * 30),
                            )}{" "}
                            tháng
                          </div>
                          <div>
                            <strong>Tiền cọc:</strong> {(selectedRoom.deposit || selectedRoom.price).toLocaleString()}₫
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-purple-200">
                          <div
                            className={`text-sm font-medium ${(() => {
                              const contractStatus = getContractStatus(selectedRoom.contractEndDate)
                              const daysUntilExpiry = getDaysUntilExpiry(selectedRoom.contractEndDate)
                              return contractStatus === "expired"
                                ? "text-red-600"
                                : contractStatus === "expiring"
                                  ? "text-orange-600"
                                  : "text-green-600"
                            })()}`}
                          >
                            {(() => {
                              const contractStatus = getContractStatus(selectedRoom.contractEndDate)
                              const daysUntilExpiry = getDaysUntilExpiry(selectedRoom.contractEndDate)
                              return contractStatus === "expired"
                                ? `Hợp đồng đã hết hạn ${Math.abs(daysUntilExpiry)} ngày`
                                : contractStatus === "expiring"
                                  ? `Hợp đồng sẽ hết hạn trong ${daysUntilExpiry} ngày`
                                  : "Hợp đồng còn hiệu lực"
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Extension Section */}
                  {selectedRoom.contractEndDate &&
                    (() => {
                      const contractStatus = getContractStatus(selectedRoom.contractEndDate)
                      return (
                        (contractStatus === "expired" || contractStatus === "expiring") && (
                          <div className="space-y-3">
                            <h3 className="text-base font-medium text-gray-900 border-b pb-2">
                              Gia hạn hợp đồng
                            </h3>
                            <div className="bg-orange-50 p-4 rounded-lg space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="extensionMonths" className="text-sm font-medium">
                                  Thời gian gia hạn:
                                </Label>
                                <Select
                                  value={extensionMonths.toString()}
                                  onValueChange={(value) => setExtensionMonths(Number(value))}
                                >
                                  <SelectTrigger className="h-10 text-sm">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="3">3 tháng</SelectItem>
                                    <SelectItem value="6">6 tháng</SelectItem>
                                    <SelectItem value="12">12 tháng</SelectItem>
                                    <SelectItem value="24">24 tháng</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="text-sm bg-orange-100 p-3 rounded">
                                <strong>Ngày kết thúc mới:</strong> {(() => {
                                  const currentEndDate = new Date(selectedRoom.contractEndDate!)
                                  const newEndDate = new Date(
                                    currentEndDate.setMonth(currentEndDate.getMonth() + extensionMonths),
                                  )
                                  return newEndDate.toLocaleDateString("vi-VN")
                                })()}
                              </div>
                              <Button
                                onClick={() => handleExtendContract(selectedRoom.id, extensionMonths)}
                                className="w-full h-10 bg-orange-600 hover:bg-orange-700 text-sm"
                              >
                                <Calendar className="h-4 w-4 mr-2" />
                                Gia hạn hợp đồng {extensionMonths} tháng
                              </Button>
                            </div>
                          </div>
                        )
                      )
                    })()}
                </div>

                <DialogFooter className="pt-4 border-t mt-4">
                  <div className="flex gap-3 w-full">
                    <Button
                      variant="outline"
                      onClick={() => setIsContractDetailsOpen(false)}
                      className="flex-1 h-10 text-sm"
                    >
                      Đóng
                    </Button>
                    <Button
                      onClick={() => {
                        if (selectedRoom) {
                          const contractInfo = {
                            tenantName: selectedRoom.tenant!,
                            tenantPhone: selectedRoom.tenantPhone!,
                            tenantEmail: selectedRoom.tenantEmail || "",
                            contractStartDate: selectedRoom.contractStartDate!,
                            contractEndDate: selectedRoom.contractEndDate!,
                            roomNumber: selectedRoom.number,
                            building: selectedRoom.building,
                            area: selectedRoom.area,
                            price: selectedRoom.price,
                            cccdFront: selectedRoom.cccdFront,
                            cccdBack: selectedRoom.cccdBack,
                            tenantIdCard: selectedRoom.tenantIdCard,
                            tenantBirthDate: selectedRoom.tenantBirthDate,
                            tenantHometown: selectedRoom.tenantHometown,
                            tenantMembers: selectedRoom.tenantMembers,
                          }
                          handlePrintContract(contractInfo)
                        }
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 h-10 text-sm"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      In hợp đồng
                    </Button>
                  </div>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Contract Dialog */}
        <Dialog open={isAddContractOpen} onOpenChange={setIsAddContractOpen}>
          <DialogContent className="max-w-4xl w-[95vw] max-h-[95vh] overflow-y-auto mx-auto">
            {contractRoom && (
              <form onSubmit={handleAddContract}>
                <DialogHeader className="pb-4 text-center">
                  <DialogTitle className="text-xl font-semibold flex items-center justify-center gap-2">
                    <FileText className="h-5 w-5" />
                    Tạo hợp đồng thuê phòng - {contractRoom.number}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-gray-600">
                    Nhập đầy đủ thông tin để tạo hợp đồng thuê phòng chính thức
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* Room Information Display */}
                  <div className="space-y-3">
                    <h3 className="text-base font-medium text-gray-900 border-b pb-2">
                      Thông tin phòng thuê
                    </h3>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-sm text-gray-600">Phòng số</div>
                          <div className="font-bold text-lg">
                            {contractRoom.building}{contractRoom.number}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Loại phòng</div>
                          <div className="font-bold text-lg">{contractRoom.roomType || "N/A"}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Diện tích</div>
                          <div className="font-bold text-lg">{contractRoom.area}m²</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Giá thuê</div>
                          <div className="font-bold text-lg text-green-600">{contractRoom.price.toLocaleString()}₫</div>
                        </div>
                      </div>

                      {/* Show room details */}
                      {contractRoom.furniture && contractRoom.furniture.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-green-200">
                          <div className="text-sm font-medium text-gray-700 mb-2">Nội thất có sẵn:</div>
                          <div className="flex flex-wrap gap-2">
                            {contractRoom.furniture.map((item, index) => (
                              <span key={index} className="bg-white px-2 py-1 rounded text-sm">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {contractRoom.utilities && (
                        <div className="mt-4 pt-3 border-t border-green-200">
                          <div className="text-sm font-medium text-gray-700 mb-2">Dịch vụ bao gồm:</div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                            {contractRoom.utilities.electricity && (
                              <div className="bg-white p-2 rounded">
                                ⚡ Điện: {contractRoom.electricityPrice?.toLocaleString()}₫/kWh
                              </div>
                            )}
                            {contractRoom.utilities.water && (
                              <div className="bg-white p-2 rounded">
                                💧 Nước: {contractRoom.waterPrice?.toLocaleString()}₫/m³
                              </div>
                            )}
                            {contractRoom.utilities.internet && (
                              <div className="bg-white p-2 rounded">
                                📶 Internet: {contractRoom.internetPrice?.toLocaleString()}₫/tháng
                              </div>
                            )}
                            {contractRoom.utilities.parking && (
                              <div className="bg-white p-2 rounded">
                                🚗 Đậu xe: {contractRoom.parkingPrice?.toLocaleString()}₫/tháng
                              </div>
                            )}
                            {contractRoom.utilities.security && (
                              <div className="bg-white p-2 rounded">🛡️ An ninh 24/7</div>
                            )}
                            {contractRoom.utilities.cleaning && (
                              <div className="bg-white p-2 rounded">
                                🧹 Dọn dẹp: {contractRoom.cleaningPrice?.toLocaleString()}₫/tháng
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Landlord Information */}
                  <div className="space-y-3">
                    <h3 className="text-base font-medium text-gray-900 border-b pb-2 flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Thông tin Bên A (Bên cho thuê)
                    </h3>
                    <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Tên tổ chức/cá nhân</Label>
                          <Input
                            value={landlordInfo.name}
                            onChange={(e) => setLandlordInfo({ ...landlordInfo, name: e.target.value })}
                            className="mt-1 h-9 text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Người đại diện</Label>
                          <Input
                            value={landlordInfo.representative}
                            onChange={(e) => setLandlordInfo({ ...landlordInfo, representative: e.target.value })}
                            className="mt-1 h-9 text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Địa chỉ</Label>
                        <Input
                          value={landlordInfo.address}
                          onChange={(e) => setLandlordInfo({ ...landlordInfo, address: e.target.value })}
                          className="mt-1 h-9 text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Điện thoại</Label>
                          <Input
                            value={landlordInfo.phone}
                            onChange={(e) => setLandlordInfo({ ...landlordInfo, phone: e.target.value })}
                            className="mt-1 h-9 text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Email</Label>
                          <Input
                            value={landlordInfo.email}
                            onChange={(e) => setLandlordInfo({ ...landlordInfo, email: e.target.value })}
                            className="mt-1 h-9 text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Mã số thuế</Label>
                          <Input
                            value={landlordInfo.taxCode}
                            onChange={(e) => setLandlordInfo({ ...landlordInfo, taxCode: e.target.value })}
                            className="mt-1 h-9 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tenant Information */}
                  <div className="space-y-3">
                    <h3 className="text-base font-medium text-gray-900 border-b pb-2 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Thông tin Bên B (Khách thuê)
                    </h3>
                    <div className="bg-yellow-50 p-4 rounded-lg space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="tenantName" className="text-sm font-medium text-gray-700">
                            Họ và tên *
                          </Label>
                          <Input
                            id="tenantName"
                            name="tenantName"
                            placeholder="Nguyễn Văn A"
                            required
                            className="mt-1 h-9 text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="tenantPhone" className="text-sm font-medium text-gray-700">
                            Số điện thoại *
                          </Label>
                          <Input
                            id="tenantPhone"
                            name="tenantPhone"
                            type="tel"
                            placeholder="0901234567"
                            required
                            className="mt-1 h-9 text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="tenantEmail" className="text-sm font-medium text-gray-700">
                            Email
                          </Label>
                          <Input
                            id="tenantEmail"
                            name="tenantEmail"
                            type="email"
                            placeholder="email@example.com"
                            className="mt-1 h-9 text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="tenantIdCard" className="text-sm font-medium text-gray-700">
                            Số CCCD/CMND *
                          </Label>
                          <Input
                            id="tenantIdCard"
                            name="tenantIdCard"
                            placeholder="123456789012"
                            required
                            className="mt-1 h-9 text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="tenantBirthDate" className="text-sm font-medium text-gray-700">
                          Ngày sinh *
                        </Label>
                        <Input
                          id="tenantBirthDate"
                          name="tenantBirthDate"
                          type="date"
                          required
                          className="mt-1 h-9 text-sm"
                        />
                      </div>

                      {/* Hometown */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700">Quê quán *</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="province" className="text-xs text-gray-600">
                              Tỉnh/Thành phố
                            </Label>
                            <Select name="province" required>
                              <SelectTrigger className="h-9 text-sm">
                                <SelectValue placeholder="Chọn tỉnh/thành phố" />
                              </SelectTrigger>
                              <SelectContent>
                                {vietnamProvinces.map((province) => (
                                  <SelectItem key={province} value={province}>
                                    {province}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="district" className="text-xs text-gray-600">
                              Quận/Huyện
                            </Label>
                            <Input
                              id="district"
                              name="district"
                              placeholder="Nhập quận/huyện"
                              required
                              className="h-9 text-sm"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="ward" className="text-xs text-gray-600">
                              Phường/Xã
                            </Label>
                            <Input
                              id="ward"
                              name="ward"
                              placeholder="Nhập phường/xã"
                              required
                              className="h-9 text-sm"
                            />
                          </div>
                          <div>
                            <Label htmlFor="village" className="text-xs text-gray-600">
                              Ấp/Thôn (nếu có)
                            </Label>
                            <Input id="village" name="village" placeholder="Nhập ấp/thôn" className="h-9 text-sm" />
                          </div>
                        </div>
                      </div>

                      {/* Family Members */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium text-gray-700">Thành viên ở cùng</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newMember = { name: "", relationship: "", birthDate: "", idCard: "" }
                              setTenantInfo((prev) => ({
                                ...prev,
                                members: [...prev.members, newMember],
                              }))
                            }}
                            className="h-8 text-sm"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Thêm thành viên
                          </Button>
                        </div>

                        {tenantInfo.members.map((member, index) => (
                          <div key={index} className="bg-white p-3 rounded border space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">Thành viên {index + 1}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setTenantInfo((prev) => ({
                                    ...prev,
                                    members: prev.members.filter((_, i) => i !== index),
                                  }))
                                }}
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs text-gray-600">Họ và tên</Label>
                                <Input
                                  value={member.name}
                                  onChange={(e) => {
                                    const newMembers = [...tenantInfo.members]
                                    newMembers[index].name = e.target.value
                                    setTenantInfo((prev) => ({ ...prev, members: newMembers }))
                                  }}
                                  placeholder="Nhập họ tên"
                                  className="h-8 text-sm"
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-gray-600">Mối quan hệ</Label>
                                <Select
                                  value={member.relationship}
                                  onValueChange={(value) => {
                                    const newMembers = [...tenantInfo.members]
                                    newMembers[index].relationship = value
                                    setTenantInfo((prev) => ({ ...prev, members: newMembers }))
                                  }}
                                >
                                  <SelectTrigger className="h-8 text-sm">
                                    <SelectValue placeholder="Chọn mối quan hệ" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {relationships.map((rel) => (
                                      <SelectItem key={rel} value={rel}>
                                        {rel}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs text-gray-600">Ngày sinh</Label>
                                <Input
                                  type="date"
                                  value={member.birthDate}
                                  onChange={(e) => {
                                    const newMembers = [...tenantInfo.members]
                                    newMembers[index].birthDate = e.target.value
                                    setTenantInfo((prev) => ({ ...prev, members: newMembers }))
                                  }}
                                  className="h-8 text-sm"
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-gray-600">CCCD/CMND (nếu có)</Label>
                                <Input
                                  value={member.idCard}
                                  onChange={(e) => {
                                    const newMembers = [...tenantInfo.members]
                                    newMembers[index].idCard = e.target.value
                                    setTenantInfo((prev) => ({ ...prev, members: newMembers }))
                                  }}
                                  placeholder="Số CCCD/CMND"
                                  className="h-8 text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        {tenantInfo.members.length === 0 && (
                          <div className="text-center py-4 text-gray-500 text-sm border-2 border-dashed border-gray-200 rounded">
                            Chưa có thành viên nào. Nhấn "Thêm thành viên" để thêm.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* CCCD Images */}
                  <div className="space-y-3">
                    <h3 className="text-base font-medium text-gray-900 border-b pb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Hình ảnh CCCD/CMND
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* CCCD Front */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">CCCD/CMND mặt trước</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                            {cccdImages.front ? (
                              \
