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
  // Thêm các trường thông tin chi tiết phòng
  roomType?: string // Loại phòng (VIP, thường, cao cấp...)
  furnishing?: string[] // Nội thất (giường, tủ, bàn...)
  utilities?: string[] // Tiện ích đi kèm
  deposit?: number // Tiền cọc tùy chỉnh
  electricityPrice?: number // Giá điện
  waterPrice?: number // Giá nước
  internetPrice?: number // Giá internet
  parkingPrice?: number // Giá gửi xe
  cleaningService?: boolean // Dịch vụ dọn dẹp
  securityDeposit?: number // Tiền đặt cọc an ninh
  notes?: string // Ghi chú đặc biệt
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
    roomType: "Phòng VIP",
    furnishing: ["Giường đôi", "Tủ quần áo", "Bàn học", "Ghế"],
    utilities: ["Điều hòa", "Tủ lạnh", "Máy nước nóng"],
    deposit: 3000000,
    electricityPrice: 3500,
    waterPrice: 25000,
    internetPrice: 100000,
    parkingPrice: 50000,
    cleaningService: true,
    securityDeposit: 500000,
    notes: "Phòng có ban công rộng, view đẹp",
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
    roomType: "Phòng thường",
    furnishing: ["Giường đơn", "Tủ quần áo"],
    utilities: ["Điều hòa"],
    deposit: 2800000,
    electricityPrice: 3500,
    waterPrice: 25000,
    notes: "Phòng gần cầu thang",
  },
  {
    id: "3",
    number: "B201",
    building: "B",
    floor: 2,
    area: 22,
    price: 3200000,
    status: "occupied",
    amenities: ["wifi", "ac", "tv"],
    tenant: "Trần Thị B",
    tenantPhone: "0907654321",
    tenantEmail: "tranthib@email.com",
    tenantIdCard: "987654321098",
    tenantBirthDate: "1988-12-10",
    tenantHometown: {
      province: "Hà Nội",
      district: "Quận Ba Đình",
      ward: "Phường Điện Biên",
      village: "",
    },
    tenantMembers: [
      {
        name: "Trần Văn D",
        relationship: "Con",
        birthDate: "2015-03-25",
        idCard: "",
      },
    ],
    contractStartDate: "2024-06-01",
    contractEndDate: "2025-05-31",
    roomType: "Phòng cao cấp",
    furnishing: ["Giường đôi", "Tủ quần áo", "Bàn học", "TV"],
    utilities: ["Điều hòa", "Tủ lạnh", "TV"],
    deposit: 3200000,
    electricityPrice: 3500,
    waterPrice: 25000,
    internetPrice: 100000,
    cleaningService: false,
    notes: "Phòng yên tĩnh, phù hợp gia đình",
  },
  {
    id: "4",
    number: "C202",
    building: "C",
    floor: 2,
    area: 25,
    price: 3500000,
    status: "available",
    amenities: ["wifi", "ac", "tv"],
    roomType: "Phòng VIP",
    furnishing: ["Giường đôi", "Tủ quần áo", "Bàn học", "Sofa"],
    utilities: ["Điều hòa", "Tủ lạnh", "TV", "Máy giặt"],
    deposit: 3500000,
    electricityPrice: 3500,
    waterPrice: 25000,
    internetPrice: 100000,
    parkingPrice: 100000,
    cleaningService: true,
    securityDeposit: 1000000,
    notes: "Phòng VIP với đầy đủ tiện nghi",
  },
  {
    id: "5",
    number: "D301",
    building: "D",
    floor: 3,
    area: 20,
    price: 3100000,
    status: "available",
    amenities: ["wifi", "ac"],
    roomType: "Phòng mới",
    furnishing: ["Giường đơn", "Tủ quần áo", "Bàn học"],
    utilities: ["Điều hòa"],
    deposit: 3100000,
    electricityPrice: 3500,
    waterPrice: 25000,
    notes: "Phòng mới xây, sạch sẽ",
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

const availableFurnishing = [
  "Giường đơn",
  "Giường đôi",
  "Tủ quần áo",
  "Bàn học",
  "Ghế",
  "Sofa",
  "Kệ sách",
  "Gương",
  "Rèm cửa",
  "Thảm trải sàn",
]

const availableUtilities = [
  "Điều hòa",
  "Tủ lạnh",
  "TV",
  "Máy giặt",
  "Máy nước nóng",
  "Lò vi sóng",
  "Bếp điện",
  "Quạt trần",
]

const roomTypes = ["Phòng thường", "Phòng cao cấp", "Phòng VIP", "Phòng mới", "Studio"]

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

// Remove maintenance from these objects
const statusColors = {
  available: "bg-green-500",
  occupied: "bg-blue-500",
}

const statusLabels = {
  available: "Trống",
  occupied: "Đã thuê",
}

// Helper function to calculate days until contract expiry
const getDaysUntilExpiry = (endDate: string): number => {
  const today = new Date()
  const expiry = new Date(endDate)
  const diffTime = expiry.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// Helper function to get contract status
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
  "Hải Phòng",
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
const [selectedFurnishing, setSelectedFurnishing] = useState<string[]>([])
const [selectedUtilities, setSelectedUtilities] = useState<string[]>([])
const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
const [isContractDetailsOpen, setIsContractDetailsOpen] = useState(false)
const [isEditRoomOpen, setIsEditRoomOpen] = useState(false)
const [editingRoom, setEditingRoom] = useState<Room | null>(null)
const [editSelectedAmenities, setEditSelectedAmenities] = useState<string[]>([])
const [editSelectedFurnishing, setEditSelectedFurnishing] = useState<string[]>([])
const [editSelectedUtilities, setEditSelectedUtilities] = useState<string[]>([])
const [isAddContractOpen, setIsAddContractOpen] = useState(false)
const [contractRoom, setContractRoom] = useState<Room | null>(null)
const [extensionMonths, setExtensionMonths] = useState<number>(12)
const [landlordInfo, setLandlordInfo] = useState({
  name: "Công ty TNHH Quản lý Nhà trọ ABC",
  address: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
  phone: "028-1234-5678",
  email: "contact@nhatroabc.com",
  representative: "Nguyễn Văn Quản Lý",
  idNumber: "123456789",
  taxCode: "0123456789",
})

const [contractTerms, setContractTerms] = useState([
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
    // Thêm các thông tin chi tiết mới
    roomType: formData.get("roomType") as string,
    furnishing: selectedFurnishing,
    utilities: selectedUtilities,
    deposit: Number.parseInt(formData.get("deposit") as string) || Number.parseInt(formData.get("price") as string),
    electricityPrice: Number.parseInt(formData.get("electricityPrice") as string) || 3500,
    waterPrice: Number.parseInt(formData.get("waterPrice") as string) || 25000,
    internetPrice: Number.parseInt(formData.get("internetPrice") as string) || 0,
    parkingPrice: Number.parseInt(formData.get("parkingPrice") as string) || 0,
    cleaningService: formData.get("cleaningService") === "on",
    securityDeposit: Number.parseInt(formData.get("securityDeposit") as string) || 0,
    notes: formData.get("notes") as string,
  }

  setRooms([...rooms, newRoom])
  setIsAddDialogOpen(false)
  setSelectedAmenities([])
  setSelectedFurnishing([])
  setSelectedUtilities([])
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
    // Cập nhật các thông tin chi tiết
    roomType: formData.get("roomType") as string,
    furnishing: editSelectedFurnishing,
    utilities: editSelectedUtilities,
    deposit: Number.parseInt(formData.get("deposit") as string) || Number.parseInt(formData.get("price") as string),
    electricityPrice: Number.parseInt(formData.get("electricityPrice") as string) || 3500,
    waterPrice: Number.parseInt(formData.get("waterPrice") as string) || 25000,
    internetPrice: Number.parseInt(formData.get("internetPrice") as string) || 0,
    parkingPrice: Number.parseInt(formData.get("parkingPrice") as string) || 0,
    cleaningService: formData.get("cleaningService") === "on",
    securityDeposit: Number.parseInt(formData.get("securityDeposit") as string) || 0,
    notes: formData.get("notes") as string,
  }

  setRooms(rooms.map((room) => (room.id === editingRoom.id ? updatedRoom : room)))
  setIsEditRoomOpen(false)
  setEditingRoom(null)
  setEditSelectedAmenities([])
  setEditSelectedFurnishing([])
  setEditSelectedUtilities([])
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

// Thêm useEffect để cập nhật contract notifications
React.useEffect(() => {
  setContractNotifications(generateContractNotifications())
}, [rooms])

const handlePrintContract = (contractInfo: any) => {
  const printWindow = window.open("", "_blank")
  if (!printWindow) return

  const cccdFrontImage = contractInfo.cccdFront
    ? `<img src="${contractInfo.cccdFront}" style="max-width: 200px; max-height: 150px; border: 1px solid #ddd; margin: 5px;">`
    : "Chưa có hình ảnh"
  const cccdBackImage = contractInfo.cccdBack
    ? `<img src="${contractInfo.cccdBack}" style="max-width: 200px; max-height: 150px; border: 1px solid #ddd; margin: 5px;">`
    : "Chưa có hình ảnh"

  // Tìm thông tin phòng từ danh sách rooms
  const roomInfo = rooms.find(r => r.number === contractInfo.roomNumber && r.building === contractInfo.building)

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
      .terms { margin: 15px 0; }
      .terms li { margin: 8px 0; }
      .signature { display: flex; justify-content: space-between; margin-top: 50px; }
      .signature-box { text-align: center; width: 45%; }
      .signature-line { border-top: 1px solid #000; margin-top: 60px; padding-top: 5px; }
      table { width: 100%; border-collapse: collapse; margin: 15px 0; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #f2f2f2; }
      .cccd-images { display: flex; justify-content: space-around; margin: 20px 0; }
      .cccd-item { text-align: center; }
      .room-details { background: #f0f8ff; padding: 15px; margin: 15px 0; border-left: 4px solid #4CAF50; }
      .price-breakdown { background: #fff8dc; padding: 15px; margin: 15px 0; border-left: 4px solid #ff9800; }
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

      ${
        contractInfo.tenantMembers && contractInfo.tenantMembers.length > 0
          ? `
      <div style="margin-top: 15px;">
        <h4>Thành viên ở cùng (${contractInfo.tenantMembers.length} người):</h4>
        <table style="margin-top: 10px;">
          <thead>
            <tr>
              <th>Họ và tên</th>
              <th>Mối quan hệ</th>
              <th>Ngày sinh</th>
              <th>CCCD/CMND</th>
            </tr>
          </thead>
          <tbody>
            ${contractInfo.tenantMembers
              .map(
                (member) => `
              <tr>
                <td>${member.name}</td>
                <td>${member.relationship}</td>
                <td>${new Date(member.birthDate).toLocaleDateString("vi-VN")}</td>
                <td>${member.idCard || "Không có"}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
      `
          : ""
      }
      
      ${
        contractInfo.cccdFront || contractInfo.cccdBack
          ? `
      <div style="margin-top: 15px;">
        <h4>Hình ảnh CCCD/CMND:</h4>
        <div class="cccd-images">
          <div class="cccd-item">
            <div><strong>Mặt trước:</strong></div>
            ${cccdFrontImage}
          </div>
          <div class="cccd-item">
            <div><strong>Mặt sau:</strong></div>
            ${cccdBackImage}
          </div>
        </div>
      </div>
      `
          : ""
      }
    </div>

    <div class="room-details">
      <h3>THÔNG TIN CHI TIẾT PHÒNG THUÊ:</h3>
      <table>
        <tr><td><strong>Số phòng:</strong></td><td>${contractInfo.roomNumber}</td></tr>
        <tr><td><strong>Dãy nhà:</strong></td><td>${contractInfo.building}</td></tr>
        <tr><td><strong>Tầng:</strong></td><td>${roomInfo?.floor || "N/A"}</td></tr>
        <tr><td><strong>Loại phòng:</strong></td><td>${roomInfo?.roomType || "Phòng thường"}</td></tr>
        <tr><td><strong>Diện tích:</strong></td><td>${contractInfo.area}m²</td></tr>
        <tr><td><strong>Giá thuê:</strong></td><td>${contractInfo.price.toLocaleString()}₫/tháng</td></tr>
        <tr><td><strong>Tiền đặt cọc:</strong></td><td>${(roomInfo?.deposit || contractInfo.price).toLocaleString()}₫</td></tr>
        ${roomInfo?.securityDeposit ? `<tr><td><strong>Tiền cọc an ninh:</strong></td><td>${roomInfo.securityDeposit.toLocaleString()}₫</td></tr>` : ""}
        <tr><td><strong>Ngày bắt đầu:</strong></td><td>${new Date(contractInfo.contractStartDate).toLocaleDateString("vi-VN")}</td></tr>
        <tr><td><strong>Ngày kết thúc:</strong></td><td>${new Date(contractInfo.contractEndDate).toLocaleDateString("vi-VN")}</td></tr>
        <tr><td><strong>Thời hạn hợp đồng:</strong></td><td>${Math.ceil((new Date(contractInfo.contractEndDate).getTime() - new Date(contractInfo.contractStartDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} tháng</td></tr>
      </table>

      ${roomInfo?.furnishing && roomInfo.furnishing.length > 0 ? `
      <div style="margin-top: 15px;">
        <h4>Nội thất trong phòng:</h4>
        <ul>
          ${roomInfo.furnishing.map(item => `<li>${item}</li>`).join("")}
        </ul>
      </div>
      ` : ""}

      ${roomInfo?.utilities && roomInfo.utilities.length > 0 ? `
      <div style="margin-top: 15px;">
        <h4>Tiện ích đi kèm:</h4>
        <ul>
          ${roomInfo.utilities.map(item => `<li>${item}</li>`).join("")}
        </ul>
      </div>
      ` : ""}

      ${roomInfo?.amenities && roomInfo.amenities.length > 0 ? `
      <div style="margin-top: 15px;">
        <h4>Dịch vụ có sẵn:</h4>
        <ul>
          ${roomInfo.amenities.map(amenity => {
            const amenityNames = {
              wifi: "WiFi",
              ac: "Điều hòa",
              parking: "Chỗ đậu xe",
              tv: "TV",
              electricity: "Điện",
              water: "Nước",
              security: "An ninh",
              kitchen: "Bếp chung"
            };
            return `<li>${amenityNames[amenity] || amenity}</li>`;
          }).join("")}
        </ul>
      </div>
      ` : ""}

      ${roomInfo?.notes ? `
      <div style="margin-top: 15px;">
        <h4>Ghi chú đặc biệt:</h4>
        <p>${roomInfo.notes}</p>
      </div>
      ` : ""}
    </div>

    <div class="price-breakdown">
      <h3>BẢNG GIÁ DỊCH VỤ:</h3>
      <table>
        <tr><td><strong>Tiền thuê phòng:</strong></td><td>${contractInfo.price.toLocaleString()}₫/tháng</td></tr>
        <tr><td><strong>Giá điện:</strong></td><td>${(roomInfo?.electricityPrice || 3500).toLocaleString()}₫/kWh</td></tr>
        <tr><td><strong>Giá nước:</strong></td><td>${(roomInfo?.waterPrice || 25000).toLocaleString()}₫/người/tháng</td></tr>
        ${roomInfo?.internetPrice ? `<tr><td><strong>Phí internet:</strong></td><td>${roomInfo.internetPrice.toLocaleString()}₫/tháng</td></tr>` : ""}
        ${roomInfo?.parkingPrice ? `<tr><td><strong>Phí gửi xe:</strong></td><td>${roomInfo.parkingPrice.toLocaleString()}₫/tháng</td></tr>` : ""}
        ${roomInfo?.cleaningService ? `<tr><td><strong>Dịch vụ dọn dẹp:</strong></td><td>Có</td></tr>` : ""}
      </table>
    </div>

    <div class="section">
      <h3>ĐIỀU KHOẢN HỢP ĐỒNG:</h3>
      <div class="terms">
        <ol>
          ${contractTerms.map((term, index) => `<li><strong>Điều ${index + 1}:</strong> ${term}</li>`).join("")}
          ${roomInfo?.cleaningService ? `<li><strong>Điều ${contractTerms.length + 1}:</strong> Bên A cung cấp dịch vụ dọn dẹp định kỳ cho phòng.</li>` : ""}
          ${roomInfo?.securityDeposit ? `<li><strong>Điều ${contractTerms.length + (roomInfo?.cleaningService ? 2 : 1)}:</strong> Bên B đã đặt cọc an ninh ${roomInfo.securityDeposit.toLocaleString()}₫ để đảm bảo việc tuân thủ các quy định của tòa nhà.</li>` : ""}
        </ol>
      </div>
    </div>

    <div class="section">
      <h3>CAM KẾT CỦA CÁC BÊN:</h3>
      <p><strong>Bên A cam kết:</strong></p>
      <ul>
        <li>Giao phòng đúng thời hạn và trong tình trạng tốt</li>
        <li>Cung cấp đầy đủ các dịch vụ đã thỏa thuận</li>
        <li>Không tăng giá thuê trong thời hạn hợp đồng</li>
        ${roomInfo?.furnishing && roomInfo.furnishing.length > 0 ? `<li>Đảm bảo các nội thất trong phòng hoạt động tốt: ${roomInfo.furnishing.join(", ")}</li>` : ""}
        ${roomInfo?.utilities && roomInfo.utilities.length > 0 ? `<li>Bảo trì các tiện ích: ${roomInfo.utilities.join(", ")}</li>` : ""}
      </ul>
      <p><strong>Bên B cam kết:</strong></p>
      <ul>
        <li>Thanh toán tiền thuê đúng hạn</li>
        <li>Sử dụng phòng đúng mục đích</li>
        <li>Bảo quản tài sản và trả lại phòng trong tình trạng ban đầu</li>
        <li>Tuân thủ các quy định về an ninh và trật tự</li>
        ${roomInfo?.cleaningService ? `<li>Phối hợp với dịch vụ dọn dẹp định kỳ</li>` : ""}
      </ul>
    </div>

    <div class="section">
      <p>Hợp đồng này có hiệu lực kể từ ngày ký và được lập thành 02 bản có giá trị pháp lý như nhau, mỗi bên giữ 01 bản.</p>
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
      const body = `Xin chào ${room.tenant},

Hợp đồng thuê phòng ${room.building}${room.number} của bạn sẽ hết hạn vào ngày ${new Date(room.contractEndDate!).toLocaleDateString("vi-VN")}.

Vui lòng liên hệ để thảo luận về việc gia hạn hợp đồng.

Trân trọng,
Ban quản lý`
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

const handleFurnishingChange = (item: string, checked: boolean) => {
  if (checked) {
    setSelectedFurnishing([...selectedFurnishing, item])
  } else {
    setSelectedFurnishing(selectedFurnishing.filter((i) => i !== item))
  }
}

const handleUtilityChange = (item: string, checked: boolean) => {
  if (checked) {
    setSelectedUtilities([...selectedUtilities, item])
  } else {
    setSelectedUtilities(selectedUtilities.filter((i) => i !== item))
  }
}

const handleEditAmenityChange = (amenityId: string, checked: boolean) => {
  if (checked) {
    setEditSelectedAmenities([...editSelectedAmenities, amenityId])
  } else {
    setEditSelectedAmenities(editSelectedAmenities.filter((id) => id !== amenityId))
  }
}

const handleEditFurnishingChange = (item: string, checked: boolean) => {
  if (checked) {
    setEditSelectedFurnishing([...editSelectedFurnishing, item])
  } else {
    setEditSelectedFurnishing(editSelectedFurnishing.filter((i) => i !== item))
  }
}

const handleEditUtilityChange = (item: string, checked: boolean) => {
  if (checked) {
    setEditSelectedUtilities([...editSelectedUtilities, item])
  } else {
    setEditSelectedUtilities(editSelectedUtilities.filter((i) => i !== item))
  }
}

const handleViewContractDetails = (room: Room) => {
  setSelectedRoom(room)
  setIsContractDetailsOpen(true)
}

const handleEditRoomClick = (room: Room) => {
  setEditingRoom(room)
  setEditSelectedAmenities(room.amenities)
  setEditSelectedFurnishing(room.furnishing || [])
  setEditSelectedUtilities(room.utilities || [])
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
            <DialogContent className="sm:max-w-[800px] mx-4 max-h-[90vh] overflow-y-auto">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="roomType" className="text-sm font-medium">
                          Loại phòng *
                        </Label>
                        <Select name="roomType" defaultValue="Phòng thường">
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  {/* Pricing Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Chi tiết giá cả</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="deposit" className="text-sm font-medium">
                          Tiền cọc (VND)
                        </Label>
                        <Input
                          id="deposit"
                          name="deposit"
                          type="number"
                          placeholder="Mặc định bằng giá thuê"
                          min="0"
                          className="focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="securityDeposit" className="text-sm font-medium">
                          Tiền cọc an ninh (VND)
                        </Label>
                        <Input
                          id="securityDeposit"
                          name="securityDeposit"
                          type="number"
                          placeholder="0"
                          min="0"
                          className="focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="electricityPrice" className="text-sm font-medium">
                          Giá điện (VND/kWh)
                        </Label>
                        <Input
                          id="electricityPrice"
                          name="electricityPrice"
                          type="number"
                          placeholder="3500"
                          min="0"
                          className="focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="waterPrice" className="text-sm font-medium">
                          Giá nước (VND/người/tháng)
                        </Label>
                        <Input
                          id="waterPrice"
                          name="waterPrice"
                          type="number"
                          placeholder="25000"
                          min="0"
                          className="focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="internetPrice" className="text-sm font-medium">
                          Phí internet (VND/tháng)
                        </Label>
                        <Input
                          id="internetPrice"
                          name="internetPrice"
                          type="number"
                          placeholder="0"
                          min="0"
                          className="focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="parkingPrice" className="text-sm font-medium">
                          Phí gửi xe (VND/tháng)
                        </Label>
                        <Input
                          id="parkingPrice"
                          name="parkingPrice"
                          type="number"
                          placeholder="0"
                          min="0"
                          className="focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex items-center space-x-2 pt-6">
                        <Checkbox
                          id="cleaningService"
                          name="cleaningService"
                          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                        <Label htmlFor="cleaningService" className="text-sm font-medium">
                          Có dịch vụ dọn dẹp
                        </Label>
                      </div>
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

                  {/* Furnishing */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Nội thất</h3>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableFurnishing.map((item) => (
                        <div
                          key={item}
                          className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Checkbox
                            id={`furnishing-${item}`}
                            checked={selectedFurnishing.includes(item)}
                            onCheckedChange={(checked) => handleFurnishingChange(item, checked as boolean)}
                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          />
                          <Label
                            htmlFor={`furnishing-${item}`}
                            className="cursor-pointer text-sm font-medium"
                          >
                            {item}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Utilities */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Tiện ích đi kèm</h3>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableUtilities.map((item) => (
                        <div
                          key={item}
                          className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Checkbox
                            id={`utility-${item}`}
                            checked={selectedUtilities.includes(item)}
                            onCheckedChange={(checked) => handleUtilityChange(item, checked as boolean)}
                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          />
                          <Label
                            htmlFor={`utility-${item}`}
                            className="cursor-pointer text-sm font-medium"
                          >
                            {item}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Mô tả & Ghi chú</h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium">
                          Mô tả chi tiết
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Mô tả về phòng, vị trí, đặc điểm nổi bật..."
                          rows={3}
                          className="focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes" className="text-sm font-medium">
                          Ghi chú đặc biệt
                        </Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          placeholder="Các ghi chú quan trọng khác..."
                          rows={2}
                          className="focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </div>
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
              <div>
                <Button className="h-10 bg-blue-600 hover:bg-blue-700 text-sm font-medium rounded-lg px-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm phòng mới
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent className="mx-4 max-w-[95vw] max-h-[90vh] overflow-y-auto rounded-xl">
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

                  <div className="space-y-3">
                    <Label htmlFor="roomType" className="text-base font-medium">
                      Loại phòng *
                    </Label>
                    <Select name="roomType" defaultValue="Phòng thường">
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
                          <p className="text-xs text-blue-600 font-medium mt-1">{room.roomType}</p>
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

                    {room.description && <p className="text-sm text-gray-600 line-clamp-2">{room.description}</p>}

                    {/* Actions */}
                    <div className="flex gap-2 pt-3">
                      {/* Only show Edit button if room is not occupied */}
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

                      {/* Delete button - only show if room is not occupied */}
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
        <DialogContent className="sm:max-w-[600px] mx-2 max-h-[90vh] overflow-y-auto rounded-xl p-4 sm:p-6">
          {selectedRoom && (
            <>
              <DialogHeader className="pb-3">
                <DialogTitle className="text-base lg:text-xl font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4 lg:h-5 lg:w-5" />
                  Chi tiết hợp đồng - Phòng {selectedRoom.number}
                </DialogTitle>
                <DialogDescription className="text-xs lg:text-sm text-gray-600">
                  Thông tin chi tiết về hợp đồng thuê phòng
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 lg:space-y-6 py-2">
                {/* Contract Status */}
                <div className="flex items-center justify-between p-2 lg:p-4 bg-blue-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900 text-xs lg:text-base">Trạng thái hợp đồng</h3>
                    <p className="text-xs text-gray-600">Tình trạng hiện tại</p>
                  </div>
                  {(() => {
                    const contractStatus = selectedRoom.contractEndDate
                      ? getContractStatus(selectedRoom.contractEndDate)
                      : null
                    return (
                      <Badge
                        className={`px-2 py-0.5 text-xs ${
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

                {/* Room Details */}
                <div className="space-y-2">
                  <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-2 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Thông tin chi tiết phòng
                  </h3>
                  <div className="bg-green-50 p-2 lg:p-4 rounded-lg space-y-2">
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-gray-600 text-xs lg:text-sm col-span-1">Số phòng:</span>
                      <span className="font-medium text-xs lg:text-sm col-span-2 text-right">
                        {selectedRoom.building}{selectedRoom.number}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-gray-600 text-xs lg:text-sm col-span-1">Loại phòng:</span>
                      <span className="font-medium text-xs lg:text-sm col-span-2 text-right">
                        {selectedRoom.roomType || "Phòng thường"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-gray-600 text-xs lg:text-sm col-span-1">Tầng:</span>
                      <span className="font-medium text-xs lg:text-sm col-span-2 text-right">
                        {selectedRoom.floor}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-gray-600 text-xs lg:text-sm col-span-1">Diện tích:</span>
                      <span className="font-medium text-xs lg:text-sm col-span-2 text-right">
                        {selectedRoom.area}m²
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-gray-600 text-xs lg:text-sm col-span-1">Giá thuê:</span>
                      <span className="font-medium text-green-600 text-xs lg:text-sm col-span-2 text-right">
                        {selectedRoom.price.toLocaleString()}₫/tháng
                      </span>
                    </div>
                    {selectedRoom.deposit && (
                      <div className="grid grid-cols-3 gap-1">
                        <span className="text-gray-600 text-xs lg:text-sm col-span-1">Tiền cọc:</span>
                        <span className="font-medium text-orange-600 text-xs lg:text-sm col-span-2 text-right">
                          {selectedRoom.deposit.toLocaleString()}₫
                        </span>
                      </div>
                    )}
                    {selectedRoom.securityDeposit && selectedRoom.securityDeposit > 0 && (
                      <div className="grid grid-cols-3 gap-1">
                        <span className="text-gray-600 text-xs lg:text-sm col-span-1">Cọc an ninh:</span>
                        <span className="font-medium text-red-600 text-xs lg:text-sm col-span-2 text-right">
                          {selectedRoom.securityDeposit.toLocaleString()}₫
                        </span>
                      </div>
                    )}

                    {/* Furnishing */}
                    {selectedRoom.furnishing && selectedRoom.furnishing.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-green-200">
                        <div className="text-xs lg:text-sm font-medium text-gray-700 mb-2">
                          Nội thất ({selectedRoom.furnishing.length} món):
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {selectedRoom.furnishing.map((item, index) => (
                            <span key={index} className="bg-white px-2 py-1 rounded text-xs border">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Utilities */}
                    {selectedRoom.utilities && selectedRoom.utilities.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-green-200">
                        <div className="text-xs lg:text-sm font-medium text-gray-700 mb-2">
                          Tiện ích ({selectedRoom.utilities.length} món):
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {selectedRoom.utilities.map((item, index) => (
                            <span key={index} className="bg-white px-2 py-1 rounded text-xs border">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pricing Details */}
                    <div className="mt-4 pt-3 border-t border-green-200">
                      <div className="text-xs lg:text-sm font-medium text-gray-700 mb-2">Bảng giá dịch vụ:</div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Điện:</span>
                          <span>{(selectedRoom.electricityPrice || 3500).toLocaleString()}₫/kWh</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Nước:</span>
                          <span>{(selectedRoom.waterPrice || 25000).toLocaleString()}₫/người/tháng</span>
                        </div>
                        {selectedRoom.internetPrice && selectedRoom.internetPrice > 0 && (
                          <div className="flex justify-between">
                            <span>Internet:</span>
                            <span>{selectedRoom.internetPrice.toLocaleString()}₫/tháng</span>
                          </div>
                        )}
                        {selectedRoom.parkingPrice && selectedRoom.parkingPrice > 0 && (
                          <div className="flex justify-between">
                            <span>Gửi xe:</span>
                            <span>{selectedRoom.parkingPrice.toLocaleString()}₫/tháng</span>
                          </div>
                        )}
                        {selectedRoom.cleaningService && (
                          <div className="flex justify-between">
                            <span>Dọn dẹp:</span>
                            <span className="text-green-600">Có</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedRoom.notes && (
                      <div className="mt-4 pt-3 border-t border-green-200">
                        <div className="text-xs lg:text-sm font-medium text-gray-700 mb-1">Ghi chú:</div>
                        <p className="text-xs text-gray-600">{selectedRoom.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Landlord Information */}
                <div className="space-y-2">
                  <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-2 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Thông tin Bên A (Bên cho thuê)
                  </h3>
                  <div className="bg-blue-50 p-2 lg:p-4 rounded-lg space-y-2">
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-gray-600 text-xs lg:text-sm col-span-1">Tên tổ chức:</span>
                      <span className="font-medium text-xs lg:text-sm col-span-2 text-right">
                        {landlordInfo.name}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-gray-600 text-xs lg:text-sm col-span-1">Người đại diện:</span>
                      <span className="font-medium text-xs lg:text-sm col-span-2 text-right">
                        {landlordInfo.representative}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-gray-600 text-xs lg:text-sm col-span-1">Điện thoại:</span>
                      <span className="font-medium text-xs lg:text-sm col-span-2 text-right">
                        {landlordInfo.phone}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-gray-600 text-xs lg:text-sm col-span-1">Email:</span>
                      <span className="font-medium text-xs lg:text-sm col-span-2 text-right">
                        {landlordInfo.email}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tenant Information */}
                {selectedRoom.tenant && (
                  <div className="space-y-2">
                    <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-2 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Thông tin Bên B (Khách thuê)
                    </h3>
                    <div className="bg-yellow-50 p-2 lg:p-4 rounded-lg space-y-2">
                      <div className="grid grid-cols-3 gap-1">
                        <span className="text-gray-600 text-xs lg:text-sm col-span-1">Họ và tên:</span>
                        <span className="font-medium text-xs lg:text-sm col-span-2 text-right">
                          {selectedRoom.tenant}
                        </span>
                      </div>
                      {selectedRoom.tenantPhone && (
                        <div className="grid grid-cols-3 gap-1">
                          <span className="text-gray-600 text-xs lg:text-sm col-span-1">Số điện thoại:</span>
                          <a
                            href={`tel:${selectedRoom.tenantPhone}`}
                            className="font-medium text-blue-600 hover:text-blue-800 text-xs lg:text-sm col-span-2 text-right"
                          >
                            {selectedRoom.tenantPhone}
                          </a>
                        </div>
                      )}
                      {selectedRoom.tenantEmail && (
                        <div className="grid grid-cols-3 gap-1">
                          <span className="text-gray-600 text-xs lg:text-sm col-span-1">Email:</span>
                          <a
                            href={`mailto:${selectedRoom.tenantEmail}`}
                            className="font-medium text-blue-600 hover:text-blue-800 text-xs lg:text-sm col-span-2 text-right break-all"
                          >
                            {selectedRoom.tenantEmail}
                          </a>
                        </div>
                      )}
                      {selectedRoom.tenantIdCard && (
                        <div className="grid grid-cols-3 gap-1">
                          <span className="text-gray-600 text-xs lg:text-sm col-span-1">CCCD/CMND:</span>
                          <span className="font-medium text-xs lg:text-sm col-span-2 text-right">
                            {selectedRoom.tenantIdCard}
                          </span>
                        </div>
                      )}
                      {selectedRoom.tenantBirthDate && (
                        <div className="grid grid-cols-3 gap-1">
                          <span className="text-gray-600 text-xs lg:text-sm col-span-1">Ngày sinh:</span>
                          <span className="font-medium text-xs lg:text-sm col-span-2 text-right">
                            {new Date(selectedRoom.tenantBirthDate).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                      )}
                      {selectedRoom.tenantHometown && (
                        <div className="grid grid-cols-3 gap-1">
                          <span className="text-gray-600 text-xs lg:text-sm col-span-1">Quê quán:</span>
                          <span className="font-medium text-xs lg:text-sm col-span-2 text-right">
                            {[
                              selectedRoom.tenantHometown.village,
                              selectedRoom.tenantHometown.ward,
                              selectedRoom.tenantHometown.district,
                              selectedRoom.tenantHometown.province,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        </div>
                      )}

                      {/* Hiển thị thành viên ở cùng */}
                      {selectedRoom.tenantMembers && selectedRoom.tenantMembers.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-yellow-200">
                          <div className="text-xs lg:text-sm font-medium text-gray-700 mb-2">
                            Thành viên ở cùng ({selectedRoom.tenantMembers.length} người):
                          </div>
                          <div className="space-y-2">
                            {selectedRoom.tenantMembers.map((member, index) => (
                              <div key={index} className="bg-white p-2 rounded text-xs">
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
                  <div className="space-y-2">
                    <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Hình ảnh CCCD/CMND
                    </h3>
                    <div className="bg-gray-50 p-2 lg:p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedRoom.cccdFront && (
                          <div className="space-y-2">
                            <Label className="text-xs font-medium text-gray-700">CCCD/CMND mặt trước</Label>
                            <div className="border rounded-lg overflow-hidden">
                              <img
                                src={selectedRoom.cccdFront || "/placeholder.svg"}
                                alt="CCCD mặt trước"
                                className="w-full h-32 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => window.open(selectedRoom.cccdFront, "_blank")}
                              />
                            </div>
                          </div>
                        )}
                        {selectedRoom.cccdBack && (
                          <div className="space-y-2">
                            <Label className="text-xs font-medium text-gray-700">CCCD/CMND mặt sau</Label>
                            <div className="border rounded-lg overflow-hidden">
                              <img
                                src={selectedRoom.cccdBack || "/placeholder.svg"}
                                alt="CCCD mặt sau"
                                className="w-full h-32 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => window.open(selectedRoom.cccdBack, "_blank")}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">💡 Nhấp vào hình ảnh để xem kích thước đầy đủ</p>
                    </div>
                  </div>
                )}

                {/* Contract Information */}
                {selectedRoom.contractStartDate && selectedRoom.contractEndDate && (
                  <div className="space-y-2">
                    <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Thông tin hợp đồng
                    </h3>
                    <div className="bg-yellow-50 p-2 lg:p-4 rounded-lg space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-xs text-gray-600">Phòng số</div>
                          <div className="font-bold text-lg">
                            {selectedRoom.building}
                            {selectedRoom.number}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Diện tích</div>
                          <div className="font-bold text-lg">{selectedRoom.area}m²</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Giá thuê</div>
                          <div className="font-bold text-lg text-green-600">
                            {selectedRoom.price.toLocaleString()}₫
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Tiền cọc</div>
                          <div className="font-bold text-lg text-orange-600">
                            {(selectedRoom.deposit || selectedRoom.price).toLocaleString()}₫
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-white p-3 rounded border">
                          <div className="text-xs text-gray-600">Ngày bắt đầu</div>
                          <div className="font-medium text-sm">{formatDate(selectedRoom.contractStartDate)}</div>
                        </div>
                        <div className="bg-white p-3 rounded border">
                          <div className="text-xs text-gray-600">Ngày kết thúc</div>
                          <div className="font-medium text-sm">{formatDate(selectedRoom.contractEndDate)}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded border">
                          <div className="text-xs text-gray-600">Thời hạn hợp đồng</div>
                          <div className="font-medium text-sm">
                            {Math.ceil(
                              (new Date(selectedRoom.contractEndDate).getTime() -
                                new Date(selectedRoom.contractStartDate).getTime()) /
                                (1000 * 60 * 60 * 24 * 30),
                            )}{" "}
                            tháng
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded border">
                          <div className="text-xs text-gray-600">Tình trạng</div>
                          <div
                            className={`font-medium text-sm ${(() => {
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
                                ? `Đã hết hạn ${Math.abs(daysUntilExpiry)} ngày`
                                : contractStatus === "expiring"
                                  ? `Còn ${daysUntilExpiry} ngày`
                                  : "Còn hiệu lực"
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contract Terms */}
                <div className="space-y-2">
                  <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-2">
                    Điều khoản hợp đồng
                  </h3>
                  <div className="bg-gray-50 p-2 lg:p-4 rounded-lg max-h-32 overflow-y-auto">
                    <ol className="text-xs space-y-1">
                      {contractTerms.slice(0, 3).map((term, index) => (
                        <li key={index} className="flex gap-2">
                          <span className="font-medium min-w-fit">Điều {index + 1}:</span>
                          <span className="text-gray-700">{term}</span>
                        </li>
                      ))}
                      <li className="text-xs text-gray-500 italic mt-2">
                        ... và {contractTerms.length - 3} điều khoản khác (xem đầy đủ khi in hợp đồng)
                      </li>
                    </ol>
                  </div>
                </div>

                {/* Extension Section - Show if contract is expired or expiring */}
                {selectedRoom.contractEndDate &&
                  (() => {
                    const contractStatus = getContractStatus(selectedRoom.contractEndDate)
                    return (
                      (contractStatus === "expired" || contractStatus === "expiring") && (
                        <div className="space-y-2">
                          <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-1">
                            Gia hạn hợp đồng
                          </h3>
                          <div className="bg-orange-50 p-2 lg:p-4 rounded-lg space-y-3">
                            <div className="space-y-2">
                              <Label htmlFor="extensionMonths" className="text-xs lg:text-sm font-medium">
                                Thời gian gia hạn:
                              </Label>
                              <Select
                                value={extensionMonths.toString()}
                                onValueChange={(value) => setExtensionMonths(Number(value))}
                              >
                                <SelectTrigger className="h-8 lg:h-10 text-xs lg:text-sm">
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
                            <div className="text-xs bg-orange-100 p-2 rounded">
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
                              className="w-full h-9 lg:h-10 bg-orange-600 hover:bg-orange-700 text-xs lg:text-sm"
                            >
                              <Calendar className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                              Gia hạn hợp đồng {extensionMonths} tháng
                            </Button>
                          </div>
                        </div>
                      )
                    )
                  })()}
              </div>

              <DialogFooter className="pt-3 border-t mt-3">
                <div className="flex gap-2 w-full">
                  <Button
                    variant="outline"
                    onClick={() => setIsContractDetailsOpen(false)}
                    className="flex-1 h-9 lg:h-10 text-xs lg:text-sm"
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
                    className="flex-1 bg-blue-600 hover:bg-blue-700 h-9 lg:h-10 text-xs lg:text-sm"
                  >
                    <FileText className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                    In hợp đồng
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Room Dialog */}
      <Dialog open={isEditRoomOpen} onOpenChange={setIsEditRoomOpen}>
        <DialogContent className="sm:max-w-[800px] mx-2 max-h-[90vh] overflow-y-auto rounded-xl p-4 sm:p-6">
          {editingRoom && (
            <form onSubmit={handleEditRoom}>
              <DialogHeader className="pb-3">
                <DialogTitle className="text-base lg:text-xl font-semibold">
                  Chỉnh sửa phòng {editingRoom.number}
                </DialogTitle>
                <DialogDescription className="text-xs lg:text-sm text-gray-600">
                  Cập nhật thông tin chi tiết cho phòng trọ
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                {/* Basic Information */}
                <div className="space-y-3">
                  <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-1">Thông tin cơ bản</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="edit-number" className="text-xs lg:text-sm font-medium">
                        Số phòng *
                      </Label>
                      <Input
                        id="edit-number"
                        name="number"
                        defaultValue={editingRoom.number}
                        required
                        className="h-8 lg:h-10 text-xs lg:text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="edit-building" className="text-xs lg:text-sm font-medium">
                        Dãy nhà *
                      </Label>
                      <Select name="building" defaultValue={editingRoom.building}>
                        <SelectTrigger className="h-8 lg:h-10 text-xs lg:text-sm">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="edit-roomType" className="text-xs lg:text-sm font-medium">
                        Loại phòng *
                      </Label>
                      <Select name="roomType" defaultValue={editingRoom.roomType || "Phòng thường"}>
                        <SelectTrigger className="h-8 lg:h-10 text-xs lg:text-sm">
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

                    <div className="space-y-1">
                      <Label htmlFor="edit-floor" className="text-xs lg:text-sm font-medium">
                        Tầng *
                      </Label>
                      <Input
                        id="edit-floor"
                        name="floor"
                        type="number"
                        defaultValue={editingRoom.floor}
                        min="1"
                        required
                        className="h-8 lg:h-10 text-xs lg:text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="edit-area" className="text-xs lg:text-sm font-medium">
                        Diện tích (m²) *
                      </Label>
                      <Input
                        id="edit-area"
                        name="area"
                        type="number"
                        defaultValue={editingRoom.area}
                        min="1"
                        required
                        className="h-8 lg:h-10 text-xs lg:text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="edit-price" className="text-xs lg:text-sm font-medium">
                        Giá thuê (VND) *
                      </Label>
                      <Input
                        id="edit-price"
                        name="price"
                        type="number"
                        defaultValue={editingRoom.price}
                        min="0"
                        required
                        className="h-8 lg:h-10 text-xs lg:text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="edit-status" className="text-xs lg:text-sm font-medium">
                      Trạng thái *
                    </Label>
                    <Select name="status" defaultValue={editingRoom.status}>
                      <SelectTrigger className="h-8 lg:h-10 text-xs lg:text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Trống</SelectItem>
                        <SelectItem value="occupied">Đã thuê</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Pricing Details */}
                <div className="space-y-3">
                  <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-1">Chi tiết giá cả</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="edit-deposit" className="text-xs lg:text-sm font-medium">
                        Tiền cọc (VND)
                      </Label>
                      <Input
                        id="edit-deposit"
                        name="deposit"
                        type="number"
                        defaultValue={editingRoom.deposit || editingRoom.price}
                        min="0"
                        className="h-8 lg:h-10 text-xs lg:text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="edit-securityDeposit" className="text-xs lg:text-sm font-medium">
                        Tiền cọc an ninh (VND)
                      </Label>
                      <Input
                        id="edit-securityDeposit"
                        name="securityDeposit"
                        type="number"
                        defaultValue={editingRoom.securityDeposit || 0}
                        min="0"
                        className="h-8 lg:h-10 text-xs lg:text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="edit-electricityPrice" className="text-xs lg:text-sm font-medium">
                        Giá điện (VND/kWh)
                      </Label>
                      <Input
                        id="edit-electricityPrice"
                        name="electricityPrice"
                        type="number"
                        defaultValue={editingRoom.electricityPrice || 3500}
                        min="0"
                        className="h-8 lg:h-10 text-xs lg:text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="edit-waterPrice" className="text-xs lg:text-sm font-medium">\
