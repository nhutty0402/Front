"use client"
import React from "react"

import type { FunctionComponent } from "react"

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
  Box,
  RefreshCw,
  Home,
  Loader,
} from "lucide-react"
import axios from 'axios';
import { useNotification } from '@/hooks/use-notification';

interface Building {
  id: string
  name: string
  description?: string
}

interface Room {
  id: string
  number: string
  building: string
  floor?: number
  area: number
  price: number
  status: "available" | "occupied" | "booked"
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
  contractNumber?: string
  contractCreatedAt?: string
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
    area: 20,
    price: 3000000,
    status: "occupied" as "occupied",
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
  },
  {
    id: "2",
    number: "A102",
    building: "A",
    area: 18,
    price: 2800000,
    status: "available" as "available",
    amenities: ["wifi", "ac"],
    description: "Phòng thoáng mát",
  },
  {
    id: "3",
    number: "B201",
    building: "B",
    area: 22,
    price: 3200000,
    status: "occupied" as "occupied",
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
  },
  {
    id: "4",
    number: "C202",
    building: "C",
    area: 25,
    price: 3500000,
    status: "available" as "available",
    amenities: ["wifi", "ac", "tv"],
  },
  {
    id: "5",
    number: "D301",
    building: "D",
    area: 20,
    price: 3100000,
    status: "available" as "available",
    amenities: ["wifi", "ac"],
  },
]

const availableAmenities = [
  { id: "Wifi", name: "WiFi", icon: Wifi },
  { id: "Máy lạnh", name: "Máy lạnh", icon: Snowflake },
  { id: "Máy nước nóng", name: "Máy nước nóng", icon: Droplets },
  { id: "Tủ lạnh", name: "Tủ lạnh", icon: Box },
  { id: "Máy giặt", name: "Máy giặt", icon: Loader },
  { id: "Nội thất cơ bản", name: "Nội thất cơ bản", icon: Home },
]

const amenityIcons = {
  Wifi: Wifi,
  "Máy lạnh": Snowflake,
  "Máy nước nóng": Droplets,
  "Tủ lạnh": Box,
  "Máy giặt": Loader,
  "Nội thất cơ bản": Home,
}

// Remove maintenance from these objects
const statusColors = {
  available: "bg-green-500",
  occupied: "bg-blue-500",
  booked: "bg-yellow-500",
}

const statusLabels = {
  available: "Trống",
  occupied: "Đã thuê",
  booked: "Đã đặt cọc",
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
  const [rooms, setRooms] = useState<Room[]>([]);
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
  const [landlordInfo, setLandlordInfo] = useState({
    name: "Công ty TNHH Quản lý Nhà trọ ABC",
    address: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
    phone: "028-1234-5678",
    email: "contact@nhatroabc.com",
    representative: "Nguyễn Văn Quản Lý",
    idNumber: "123456789",
    taxCode: "0123456789",
    representativeHometown: "TP. Hồ Chí Minh",
    representativeProvince: "TP. Hồ Chí Minh",
    representativeDistrict: "Quận 1",
    representativeWard: "",
    representativeAddress: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
    representativeIdCard: "123456789012",
    representativeBirthDate: "1990-05-15",
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null)

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

  const [contractDuration, setContractDuration] = useState<string>("12"); // tháng, mặc định 1 năm
  const [addContractStartDate, setAddContractStartDate] = useState<string>("");
  const [addContractEndDate, setAddContractEndDate] = useState<string>("");

  // 1. Thêm state quản lý modal và danh sách đặt cọc
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingRoomId, setBookingRoomId] = useState<number | null>(null);
  const [bookings, setBookings] = useState<Array<{
    HoTenKhach: string;
    SoDienThoai: string;
    PhongID: number;
    SoTienDatCoc: number;
    NgayDatCoc: string;
  }>>([]);
  const [bookingForm, setBookingForm] = useState({
    HoTenKhach: '',
    SoDienThoai: '',
    PhongID: 0,
    SoTienDatCoc: '',
    NgayDatCoc: '',
  });

  const { addNotification } = useNotification();

  const [lastAddedRoom, setLastAddedRoom] = useState<{ building: string; number: string } | null>(null);

  // 1. Thêm state quản lý số lượng thành viên ở
  const [soLuongThanhVien, setSoLuongThanhVien] = useState(tenantInfo.members.length + 1);

  // 2. Khi thêm/xóa thành viên ở cùng, cập nhật lại state này
  useEffect(() => {
    setSoLuongThanhVien(tenantInfo.members.length + 1);
  }, [tenantInfo.members.length]);

  // Thêm state quản lý tiền cọc ở đầu component RoomsPage
  const [deposit, setDeposit] = useState(0);

  // Khi contractRoom thay đổi, cập nhật deposit mặc định
  useEffect(() => {
    if (contractRoom) setDeposit(contractRoom.price || 0);
  }, [contractRoom]);

  useEffect(() => {
    // Lấy danh sách phòng
    axios.get('https://all-oqry.onrender.com/api/phong')
      .then(res => {
        const mappedRooms = res.data.map((phong: any) => ({
          id: phong.PhongID, // Sử dụng đúng PhongID làm id
          number: phong.SoPhong,
          building: phong.DayPhong,
          area: Number(phong.DienTich?.replace(/[^\d.]/g, '') || 0),
          price: Number(phong.GiaPhong),
          status: 'available' as 'available',
          amenities: phong.TienIch || [],
          description: phong.MoTaPhong,
        }));
        // Sau khi lấy phòng, lấy hợp đồng
        axios.get('https://all-oqry.onrender.com/api/hopdong')
          .then(contractRes => {
            const contracts = contractRes.data; // Giả sử trả về mảng hợp đồng
            let mergedRooms = mappedRooms.map((room: Room) => {
              const contract = contracts.find((c: any) => String(c.PhongID_id) === String(room.id) && c.TrangThaiHopDong === 'HoatDong');
              if (contract) {
                return {
                  ...room,
                  status: 'occupied',
                  tenant: contract.HoTenKhachHang || contract.TenKhachHang || '',
                  tenantPhone: contract.SoDienThoai || '',
                  contractStartDate: contract.NgayBatDau,
                  contractEndDate: contract.NgayKetThuc,
                };
              }
              return room;
            });
            // Tiếp tục lấy danh sách phòng đã đặt cọc
            axios.get('https://all-oqry.onrender.com/api/phong/phongdaco')
              .then(bookedRes => {
                const booked = bookedRes.data.data.map((phong: any) => String(phong.PhongID));
                mergedRooms = mergedRooms.map((room: Room) =>
                  booked.includes(String(room.id)) && room.status !== 'occupied'
                    ? { ...room, status: 'booked' as 'booked' }
                    : room
                );
                setRooms(mergedRooms);
              })
              .catch(() => {
                setRooms(mergedRooms);
              });
          })
          .catch(() => {
            setRooms(mappedRooms);
          });
      })
      .catch(() => setRooms([]));
  }, []);

  useEffect(() => {
    axios.get('https://all-oqry.onrender.com/api/phong/phongdaco')
      .then(res => {
        const booked = res.data.data.map((phong: any) => ({
          id: phong.PhongID,
          number: phong.SoPhong,
          building: phong.DayPhong,
          area: Number(phong.DienTich?.replace(/[^\d.]/g, '') || 0),
          price: Number(phong.GiaPhong),
          status: 'booked' as 'booked',
          amenities: phong.TienIch || [],
          description: phong.MoTaPhong,
        }));
        setRooms(prevRooms => {
          // Cập nhật trạng thái phòng đã đặt cọc
          const updatedRooms = prevRooms.map(room => {
            const found = booked.find((b: Room) => String(b.id) === String(room.id));
            return found ? { ...room, status: 'booked' as 'booked' } : room;
          });
          // Thêm phòng booked chưa có trong rooms
          booked.forEach((b: Room) => {
            if (!updatedRooms.some(r => String(r.id) === String(b.id))) {
              updatedRooms.push(b);
            }
          });
          return updatedRooms;
        });
      })
      .catch(() => {
        // Xử lý lỗi nếu cần
      });
  }, []);

  // 2. Hàm mở modal đặt cọc
  const handleOpenBooking = (roomId: number | string) => {
    const idNum = typeof roomId === 'string' ? Number(roomId) : roomId;
    setBookingRoomId(idNum);
    setIsBookingOpen(true);
    setBookingForm({ HoTenKhach: '', SoDienThoai: '', PhongID: idNum, SoTienDatCoc: '', NgayDatCoc: '' });
  };

  // 3. Hàm đóng modal
  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setBookingRoomId(null);
  };

  // 4. Hàm submit đặt cọc
  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (typeof bookingRoomId !== 'number' || isNaN(bookingRoomId)) return;

    const bookingData = {
      HoTenKhach: bookingForm.HoTenKhach,
      SoDienThoai: bookingForm.SoDienThoai,
      PhongID: bookingRoomId,
      SoTienDatCoc: Number(bookingForm.SoTienDatCoc),
      NgayDatCoc: bookingForm.NgayDatCoc,
    };

    try {
      await axios.post('https://all-oqry.onrender.com/api/phong/dat-phong', bookingData);
      setBookings([
        ...bookings,
        bookingData,
      ]);
      setRooms(prevRooms => prevRooms.map(room =>
        Number(room.id) === Number(bookingRoomId) ? { ...room, status: "booked" } : room
      ));
      setIsBookingOpen(false);
      setBookingRoomId(null);
      // Nếu muốn, có thể thêm thông báo thành công ở đây
      addNotification('Đặt cọc thành công!', 'success');
    } catch (error) {
      // Nếu muốn, có thể thêm thông báo lỗi ở đây
      addNotification('Đặt cọc thất bại!', 'error');
    }
  };

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

  const handleAddRoom = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newRoom = {
      SoPhong: String(formData.get('number') || ''),
      DayPhong: String(formData.get('building') || ''),
      GiaPhong: Number(formData.get('price') || 0),
      MoTaPhong: String(formData.get('description') || ''),
      DienTich: String(formData.get('area') || ''),
      TienIch: selectedAmenities,
    };
    try {
      await axios.post('https://all-oqry.onrender.com/api/phong/them', newRoom);
      // Gọi lại API để lấy danh sách mới nhất và map lại dữ liệu
      const res = await axios.get('https://all-oqry.onrender.com/api/phong');
      const mappedRooms = res.data.map((phong: any) => ({
        id: phong._id || phong.id || Date.now().toString(),
        number: phong.SoPhong,
        building: phong.DayPhong,
        area: Number(phong.DienTich?.replace(/[^\d.]/g, '') || 0),
        price: phong.GiaPhong,
        status: 'available' as 'available',
        amenities: phong.TienIch || [],
        description: phong.MoTaPhong,
      }));
      setRooms(mappedRooms);
      // Lấy phòng mới nhất vừa thêm (giả sử là cuối danh sách)
      const lastRoom = mappedRooms[mappedRooms.length - 1];
      setLastAddedRoom({ building: lastRoom.building, number: lastRoom.number });
      setIsAddDialogOpen(false);
      setSelectedAmenities([]);
      addNotification(`Đã thêm phòng ${lastRoom.building}-${lastRoom.number} thành công!`, 'success');
    } catch (error: any) {
      addNotification('Lỗi khi thêm phòng!', 'error');
    }
  };

  const handleEditRoom = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!editingRoom) return

    const formData = new FormData(event.currentTarget)

    const updatedRoom: Room = {
      ...editingRoom,
      number: formData.get("number") as string,
      building: formData.get("building") as string,
      area: Number.parseInt(formData.get("area") as string),
      price: Number.parseInt(formData.get("price") as string),
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
    const matchesStatus = filterStatus === "all" || room.status === filterStatus;
    const matchesBuilding = filterBuilding === "all" || room.building === filterBuilding;
    // Chuẩn hóa dữ liệu để tìm kiếm linh hoạt
    const normalize = (str: string = "") => str.toLowerCase().replace(/\s|-/g, "");
    const search = normalize(searchTerm);
    const roomNumber = normalize(room.number);
    const roomBuilding = normalize(room.building);
    const roomTenant = normalize(room.tenant || "");
    const roomDescription = normalize(room.description || "");
    // Ghép dãy và số phòng cho phép tìm "A101", "A-101", "A 101"
    const roomFull = normalize(room.building + room.number);
    const matchesSearch =
      roomNumber.includes(search) ||
      roomBuilding.includes(search) ||
      roomFull.includes(search) ||
      roomTenant.includes(search) ||
      roomDescription.includes(search);
    return matchesStatus && matchesBuilding && matchesSearch;
  });

  interface AddContractDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  contractRoom: { number: string } | null;
  handleAddContract: (e: React.FormEvent) => void;
}

const AddContractDialog: React.FC<AddContractDialogProps> = ({
  isOpen,
  setIsOpen,
  contractRoom,
  handleAddContract,
}) => {
  const [landlordInfo, setLandlordInfo] = useState({
    representative: "",
    address: "",
    representativeProvince: "",
    representativeDistrict: "",
    representativeWard: "",
    representativeGender: "",
    representativeIdCard: "",
    representativeBirthDate: "",
  });

  // Lấy token từ localStorage (hoặc props/context tùy bạn)
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchLandlordInfo = async () => {
      try {
        const res = await fetch("https://all-oqry.onrender.com/api/quanli/thong-tin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setLandlordInfo({
          representative: data.HoTenQuanLi,
          address: data.DiaChiChiTiet,
          representativeProvince: data.ThanhPho,
          representativeDistrict: data.Quan,
          representativeWard: data.Phuong,
          representativeGender: data.GioiTinh,
          representativeIdCard: data.SoCCCD,
          representativeBirthDate: data.NgaySinh?.slice(0, 10) || "",
        });
      } catch (error) {
        console.error("Lỗi lấy thông tin quản lý:", error);
      }
    };

    if (isOpen) fetchLandlordInfo();
  }, [isOpen, token]);


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
          <h4>Thành viên ở cùng:</h4>
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
      ${
        contractInfo.tenantMembers
          .map(
            (member: any) => `
        <tr>
          <td>${member.name || "Không có"}</td>
          <td>${member.relationship || "Không có"}</td>
          <td>${member.birthDate ? new Date(member.birthDate).toLocaleDateString("vi-VN") : "Không có"}</td>
          <td>${member.idCard || "Không có"}</td>
        </tr>
      `
          )
          .join("")
      }
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

      <div class="section">
        <h3>THÔNG TIN PHÒNG THUÊ:</h3>
        <table>
          <tr><td><strong>Số phòng:</strong></td><td>${contractInfo.roomNumber}</td></tr>
          <tr><td><strong>Dãy nhà:</strong></td><td>${contractInfo.building}</td></tr>
          <tr><td><strong>Diện tích:</strong></td><td>${contractInfo.area}m²</td></tr>
          <tr><td><strong>Giá thuê:</strong></td><td>${contractInfo.price.toLocaleString()}₫/tháng</td></tr>
          <tr><td><strong>Tiền đặt cọc:</strong></td><td>${contractInfo.price.toLocaleString()}₫ (1 tháng tiền thuê)</td></tr>
          <tr><td><strong>Ngày bắt đầu:</strong></td><td>${new Date(contractInfo.contractStartDate).toLocaleDateString("vi-VN")}</td></tr>
          <tr><td><strong>Ngày kết thúc:</strong></td><td>${new Date(contractInfo.contractEndDate).toLocaleDateString("vi-VN")}</td></tr>
          <tr><td><strong>Thời hạn hợp đồng:</strong></td><td>${Math.ceil((new Date(contractInfo.contractEndDate).getTime() - new Date(contractInfo.contractStartDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} tháng</td></tr>

        </table>
      </div>

      <div class="section">
        <h3>ĐIỀU KHOẢN HỢP ĐỒNG:</h3>
        <div class="terms">
          <ol>
            ${contractTerms.map((term, index) => `<li><strong>Điều ${index + 1}:</strong> ${term}</li>`).join("")}
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
        </ul>
        <p><strong>Bên B cam kết:</strong></p>
        <ul>
          <li>Thanh toán tiền thuê đúng hạn</li>
          <li>Sử dụng phòng đúng mục đích</li>
          <li>Bảo quản tài sản và trả lại phòng trong tình trạng ban đầu</li>
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

  const handleAddContract = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!contractRoom) return

    const formData = new FormData(event.currentTarget)

    // Lấy các trường cần thiết từ form và state
    const QuanLiID = 1; // hoặc lấy từ user đăng nhập
    const PhongID_id = contractRoom.id;
    const KhachHangID_id = 10; // cần lấy đúng id khách hàng thực tế
    const DayPhong = contractRoom.building;
    const NgayBatDau = addContractStartDate;
    const NgayKetThuc = addContractEndDate;
    const ChuKy = (formData.get('chuKyThuTien') as string) || '';
    const TienDatCoc = deposit;
    const TrangThaiHopDong = 'HoatDong';
    const NgayTaoHopDong = new Date().toISOString().split('T')[0];
    const SoLuongThanhVien = Number(formData.get('soLuongThanhVien')) || 1;
    const GhiChuHopDong = 'H';
    const ThoiHanHopDong = contractDuration + ' tháng';

    const payload = {
      QuanLiID,
      PhongID_id,
      KhachHangID_id,
      DayPhong,
      NgayBatDau,
      NgayKetThuc,
      ChuKy,
      TienDatCoc,
      TrangThaiHopDong,
      NgayTaoHopDong,
      SoLuongThanhVien,
      GhiChuHopDong,
      ThoiHanHopDong,
    };

    try {
      await axios.post('https://all-oqry.onrender.com/api/hopdong/them', payload);
      setRooms(rooms.map((room) => (room.id === contractRoom.id ? { ...contractRoom, status: "occupied" } : room)))
      setIsAddContractOpen(false)
      addNotification('Tạo hợp đồng thành công!', 'success');
    } catch (error) {
      addNotification('Lỗi khi tạo hợp đồng!', 'error');
    }
  }

  const handleDeleteRoom = (id: string) => {
    setRooms(rooms.filter((room) => room.id !== id))
  }

  const handleDeleteRoomClick = (room: Room) => {
    setRoomToDelete(room)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (roomToDelete) {
      setRooms(rooms.filter((room) => room.id !== roomToDelete.id))
      setIsDeleteDialogOpen(false)
      setRoomToDelete(null)
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

  // Auto update contract end date when start date or duration changes
  React.useEffect(() => {
    if (addContractStartDate && contractDuration) {
      const start = new Date(addContractStartDate)
      let months = 0
      switch (contractDuration) {
        case "3": months = 3; break;
        case "6": months = 6; break;
        case "8": months = 8; break;
        case "12": months = 12; break;
        case "24": months = 24; break;
        case "36": months = 36; break;
        case "48": months = 48; break;
        case "60": months = 60; break;
        case "72": months = 72; break;
        default: months = 12;
      }
      const end = new Date(start)
      end.setMonth(end.getMonth() + months)
      setAddContractEndDate(end.toISOString().split("T")[0])
    }
  }, [addContractStartDate, contractDuration])

  // Hàm thêm khách hàng mới
  const handleAddCustomer = async (formData: FormData) => {
    const values = [
      formData.get('tenantName'), // HoTenKhachHang
      formData.get('tenantPhone') || null, // SoDienThoai
      formData.get('tenantBirthDate'), // NgaySinh
      formData.get('tenantGender'), // GioiTinh
      formData.get('CongViec'), // CongViec
      formData.get('province'), // TinhThanh
      formData.get('district'), // QuanHuyen
      formData.get('ward'), // PhuongXa
      formData.get('village'), // DiaChiCuThe
      formData.get('tenantIdCard'), // SoCCCD
      formData.get('NgayCapCCCD'), // NgayCapCCCD
      formData.get('NoiCapCCCD'), // NoiCapCCCD
      cccdImages.front, // CCCDMT
      cccdImages.back, // CCCDMS
    ];
    try {
      await axios.post('https://all-oqry.onrender.com/api/khachhang/them', values);
      addNotification('Thêm khách hàng thành công!', 'success');
    } catch (error) {
      addNotification('Lỗi khi thêm khách hàng!', 'error');
    }
  }

  // Hàm cập nhật thông tin quản lý
  const handleUpdateManager = async (data: {
    HoTenQuanLi: string,
    SoCCCD: string,
    NgaySinh: string,
    GioiTinh: string,
    ThanhPho: string,
    Quan: string,
    Phuong: string,
    DiaChiChiTiet: string
  }) => {
    try {
      await axios.post('https://all-oqry.onrender.com/api/quanli/cap-nhat', data);
      addNotification('Cập nhật thông tin quản lý thành công!', 'success');
    } catch (error) {
      addNotification('Lỗi khi cập nhật thông tin quản lý!', 'error');
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
                          {/* <Label htmlFor="floor" className="text-sm font-medium">
                            Tầng *
                          </Label> */}
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
                  </div>
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
                    <SelectItem value="booked">Đã đặt cọc</SelectItem>
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
                <SelectItem value="booked">Đã đặt cọc</SelectItem>
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
              {/* Hiển thị dãy và số phòng vừa thêm */}
              {lastAddedRoom && (
                <div className="mt-4 p-3 bg-green-50 border border-green-300 rounded text-green-800 text-center">
                  <strong>Đã thêm phòng:</strong> Dãy <b>{lastAddedRoom.building}</b> - Số phòng <b>{lastAddedRoom.number}</b>
                </div>
              )}
              <DialogContent className="mx-4 max-w-[95vw] max-h-[90vh] overflow-y-auto rounded-xl">
                <form onSubmit={handleAddRoom}>
                  <DialogHeader className="pb-4">
                    <DialogTitle className="text-lg">Thêm phòng mới</DialogTitle>
                    <DialogDescription>Nhập thông tin phòng trọ mới</DialogDescription>
                  </DialogHeader>

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

                  <div className="space-y-5 py-4">
                    <div className="space-y-3">
                      <Label htmlFor="number" className="text-base font-medium">
                        Số phòng *
                      </Label>
                      <Input id="number" name="number" placeholder="A101" required className="h-12 text-base" />
                    </div>

                   

                    <div className="grid grid-cols-2 gap-4">
                      {/* <div className="space-y-3">
                        <Label htmlFor="floor" className="text-base font-medium">
                          Tầng *
                        </Label>
                        <Input id="floor" name="floor" type="number" placeholder="1" required className="h-12" />
                      </div> */}
    
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="area" className="text-base font-medium">
                          Diện tích (m²) *
                        </Label>
                        <Input id="area" name="area" type="number" placeholder="20" required className="h-12" />
                      </div>

                    <div className="space-y-3">
                      <Label htmlFor="price" className="text-base font-medium">
                        Giá thuê (VND) *
                      </Label>
                      <Input id="price" name="price" type="number" placeholder="3000000" required className="h-12" />
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
                        <div className="flex items-center gap-2">
                          {(() => {
                            // Tách dãy và số phòng từ room.number nếu có dạng A101
                            let building = room.building;
                            let number = room.number;
                            // Nếu room.number bắt đầu bằng room.building, tách số phòng phía sau
                            if (room.number && room.building && room.number.startsWith(room.building)) {
                              number = room.number.slice(room.building.length);
                            }
                            return (
                              <>
                                <span className="text-blue-600 font-bold text-lg">{building}</span>
                                <span className="text-gray-900 font-bold text-lg">· {number}</span>
                              </>
                            );
                          })()}
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
                            {/* nút chỉnh sửa phòng */}
                          </Button>
                        )}

                        {room.status === "available" ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200 text-xs h-9"
                              onClick={() => handleAddContractClick(room)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Thêm Hợp Đồng
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200 text-xs h-9"
                              onClick={() => handleOpenBooking(room.id)}
                            >
                              Đặt cọc
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 bg-transparent h-9 px-3"
                              onClick={() => handleDeleteRoomClick(room)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        ) : room.status === "booked" && !room.tenant ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200 text-xs h-9"
                              onClick={() => handleAddContractClick(room)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Thêm Hợp Đồng
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 bg-transparent h-9 px-3"
                              onClick={() => handleDeleteRoomClick(room)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        ) : room.status === "occupied" ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 bg-green-50 text-green-600 hover:bg-green-100 border-green-200 text-xs h-9"
                              onClick={() => handleViewContractDetails(room)}
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              Chi Tiết Hợp Đồng
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 bg-transparent h-9 px-3"
                              onClick={() => handleDeleteRoomClick(room)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
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
          <DialogContent className="sm:max-w-[600px] mx-2 max-h-[90vh] overflow-y-auto rounded-xl p-4 sm:p-6">
            {selectedRoom && selectedRoom.status === 'booked' && !selectedRoom.tenant ? (
              <>
                <DialogHeader className="pb-3">
                  <DialogTitle className="text-base lg:text-xl font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 lg:h-5 lg:w-5" />
                    Thông tin đặt cọc - Phòng {selectedRoom.number}
                  </DialogTitle>
                  <DialogDescription className="text-xs lg:text-sm text-gray-600">
                    Thông tin đặt cọc phòng này
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 lg:space-y-6 py-2">
                  {/* Tìm booking tương ứng */}
                  {(() => {
                    const booking = bookings.find(b => b.PhongID === Number(selectedRoom.id));
                    if (!booking) return <div className="text-center text-gray-500">Không có thông tin đặt cọc</div>;
                    return (
                      <div className="bg-yellow-50 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Người đặt cọc:</span>
                          <span className="font-semibold">{booking.HoTenKhach}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Số điện thoại:</span>
                          <span className="font-semibold">{booking.SoDienThoai}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Số tiền đã cọc:</span>
                          <span className="font-semibold text-yellow-700">{booking.SoTienDatCoc.toLocaleString()}₫</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Ngày đặt cọc:</span>
                          <span className="font-semibold">{new Date(booking.NgayDatCoc).toLocaleDateString("vi-VN")}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
                <DialogFooter className="pt-3 border-t mt-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsContractDetailsOpen(false)}
                    className="flex-1 h-9 lg:h-10 text-xs lg:text-sm"
                  >
                    Đóng
                  </Button>
                </DialogFooter>
              </>
            ) : selectedRoom ? (
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
                  {/* Thông tin hợp đồng tổng quan */}
                  <div className="bg-blue-100 border border-blue-200 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" /> Thông tin hợp đồng
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div><span className="font-medium">Số hợp đồng:</span> {selectedRoom.contractNumber || 'Không có'}</div>
                      <div><span className="font-medium">Ngày tạo hợp đồng:</span> {selectedRoom.contractCreatedAt ? new Date(selectedRoom.contractCreatedAt).toLocaleDateString('vi-VN') : 'Không có'}</div>
                      <div><span className="font-medium">Ngày bắt đầu:</span> {selectedRoom.contractStartDate ? new Date(selectedRoom.contractStartDate).toLocaleDateString('vi-VN') : 'Không có'}</div>
                      <div><span className="font-medium">Ngày kết thúc:</span> {selectedRoom.contractEndDate ? new Date(selectedRoom.contractEndDate).toLocaleDateString('vi-VN') : 'Không có'}</div>
                      <div><span className="font-medium">Thời hạn hợp đồng:</span> {selectedRoom.contractStartDate && selectedRoom.contractEndDate ? `${Math.ceil((new Date(selectedRoom.contractEndDate).getTime() - new Date(selectedRoom.contractStartDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} tháng` : 'Không có'}</div>
                      <div><span className="font-medium">Trạng thái hợp đồng:</span> {selectedRoom.contractEndDate ? getContractStatus(selectedRoom.contractEndDate) === 'expired' ? 'Đã hết hạn' : getContractStatus(selectedRoom.contractEndDate) === 'expiring' ? 'Sắp hết hạn' : 'Còn hiệu lực' : 'Không có'}</div>
                      <div><span className="font-medium">Số tiền cọc:</span> {selectedRoom.price ? `${selectedRoom.price.toLocaleString()}₫` : 'Không có'}</div>
                      <div><span className="font-medium">Số tiền thuê:</span> {selectedRoom.price ? `${selectedRoom.price.toLocaleString()}₫/tháng` : 'Không có'}</div>
                      <div><span className="font-medium">Tên khách thuê:</span> {selectedRoom.tenant || 'Không có'}</div>
                      <div><span className="font-medium">Số điện thoại khách thuê:</span> {selectedRoom.tenantPhone || 'Không có'}</div>
                    </div>
                  </div>

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

                  {/* Landlord Information */}
                  <div className="space-y-2">
                    <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-2 flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Thông tin Bên A (Bên cho thuê)
                    </h3>
                    <div className="bg-blue-50 p-2 lg:p-4 rounded-lg space-y-2">
                 
                      {/* Địa chỉ */}
                      <div className="grid grid-cols-3 gap-1">
                        <span className="text-gray-600 text-xs lg:text-sm col-span-1">Địa chỉ:</span>
                        <span className="font-medium text-xs lg:text-sm col-span-2 text-right">
                          {landlordInfo.address || ""}
                        </span>
                      </div>
                      {/* Điện thoại */}
                      <div className="grid grid-cols-3 gap-1">
                        <span className="text-gray-600 text-xs lg:text-sm col-span-1">Điện thoại:</span>
                        <span className="font-medium text-xs lg:text-sm col-span-2 text-right">
                          {landlordInfo.phone || ""}
                        </span>
                      </div>
                      {/* Người đại diện */}
                      <div className="grid grid-cols-3 gap-1">
                        <span className="text-gray-600 text-xs lg:text-sm col-span-1">Người đại diện:</span>
                        <span className="font-medium text-xs lg:text-sm col-span-2 text-right">
                          {landlordInfo.representative || ""}
                        </span>
                      </div>
                      {/* Ngày sinh */}
                      <div className="grid grid-cols-3 gap-1">
                        <span className="text-gray-600 text-xs lg:text-sm col-span-1">Ngày sinh:</span>
                        <span className="font-medium text-xs lg:text-sm col-span-2 text-right">
                          {landlordInfo.representativeBirthDate ? new Date(landlordInfo.representativeBirthDate).toLocaleDateString("vi-VN") : ""}
                        </span>
                      </div>
                      {/* Giới tính */}
                      <div className="grid grid-cols-3 gap-1">
                        <span className="text-gray-600 text-xs lg:text-sm col-span-1">Giới tính:</span>
                        <span className="font-medium text-xs lg:text-sm col-span-2 text-right">
                          {/* {landlordInfo.representativeGender || ""} */}
                        </span>
                      </div>
                      {/* Thành phố */}
                      <div className="grid grid-cols-3 gap-1">
                        <span className="text-gray-600 text-xs lg:text-sm col-span-1">Thành phố:</span>
                        <span className="font-medium text-xs lg:text-sm col-span-2 text-right">
                          {landlordInfo.representativeProvince || ""}
                        </span>
                      </div>
                      {/* Quận/Huyện */}
                      <div className="grid grid-cols-3 gap-1">
                        <span className="text-gray-600 text-xs lg:text-sm col-span-1">Quận/Huyện:</span>
                        <span className="font-medium text-xs lg:text-sm col-span-2 text-right">
                          {landlordInfo.representativeDistrict || ""}
                        </span>
                      </div>
                      {/* Phường/Xã */}
                      <div className="grid grid-cols-3 gap-1">
                        <span className="text-gray-600 text-xs lg:text-sm col-span-1">Phường/Xã:</span>
                        <span className="font-medium text-xs lg:text-sm col-span-2 text-right">
                          {landlordInfo.representativeWard || ""}
                        </span>
                      </div>
                      {/* Số CCCD/CMND */}
                      <div className="grid grid-cols-3 gap-1">
                        <span className="text-gray-600 text-xs lg:text-sm col-span-1">CMND/CCCD:</span>
                        <span className="font-medium text-xs lg:text-sm col-span-2 text-right">
                          {landlordInfo.idNumber || ""}
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
                              {selectedRoom.price.toLocaleString()}₫
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
                              )} tháng
                              <span className="block text-xs text-gray-500 mt-1">
                                ({formatDate(selectedRoom.contractStartDate)} - {formatDate(selectedRoom.contractEndDate)})
                              </span>
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
                    <div className="bg-gray-50 p-2 lg:p-4 rounded-lg max-h-64 overflow-y-auto">
                      <ol className="text-xs space-y-1">
                        {contractTerms.map((term, index) => (
                          <li key={index} className="flex gap-2">
                            <span className="font-medium min-w-fit">Điều {index + 1}:</span>
                            <span className="text-gray-700">{term}</span>
                          </li>
                        ))}
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

                  {/* Action Buttons */}
                  {selectedRoom.tenant && (
                    <div className="space-y-2">
                      <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-1">
                        Liên hệ khách thuê
                      </h3>
                      {/* <div className="grid grid-cols-2 gap-2">
                        {selectedRoom.tenantPhone && (
                          <Button
                            variant="outline"
                            onClick={() => window.open(`tel:${selectedRoom.tenantPhone}`)}
                            className="h-9 lg:h-10 text-xs lg:text-sm"
                          >
                            📞 Gọi điện
                          </Button>
                        )}
                        {selectedRoom.tenantEmail && (
                          <Button
                            variant="outline"
                            onClick={() => {
                              const subject = `Liên hệ về phòng ${selectedRoom.building}${selectedRoom.number}`
                              const body = `Xin chào ${selectedRoom.tenant},\n\nTôi cần liên hệ với bạn về phòng ${selectedRoom.building}${selectedRoom.number}.\n\nTrân trọng,\nBan quản lý`
                              window.open(
                                `mailto:${selectedRoom.tenantEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
                              )
                            }}
                            className="h-9 lg:h-10 text-xs lg:text-sm"
                          >
                            ✉️ Gửi email
                          </Button>
                        )}
                      </div> */}
                    </div>
                  )}
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
            ) : null}
          </DialogContent>
        </Dialog>

        {/* Edit Room Dialog */}
        <Dialog open={isEditRoomOpen} onOpenChange={setIsEditRoomOpen}>
          <DialogContent className="sm:max-w-[600px] mx-2 max-h-[90vh] overflow-y-auto rounded-xl p-4 sm:p-6">
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

                    <div className="grid grid-cols-3 gap-3">
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

                    {/* Services & Amenities */}
                    <div className="space-y-3">
                      <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-1">Dịch vụ & Tiện ích</h3>

                      <div className="grid grid-cols-2 gap-2">
                        {availableAmenities.map((amenity) => {
                          const Icon = amenity.icon
                          return (
                            <div
                              key={amenity.id}
                              className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <Checkbox
                                id={`edit-${amenity.id}`}
                                checked={editSelectedAmenities.includes(amenity.id)}
                                onCheckedChange={(checked) => handleEditAmenityChange(amenity.id, checked as boolean)}
                                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 h-3 w-3 lg:h-4 lg:w-4"
                              />
                              <Label
                                htmlFor={`edit-${amenity.id}`}
                                className="flex items-center space-x-1 cursor-pointer text-xs lg:text-sm"
                              >
                                <Icon className="h-3 w-3 lg:h-4 lg:w-4 text-gray-600" />
                                <span>{amenity.name}</span>
                              </Label>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                      <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-1">Mô tả</h3>

                      <div className="space-y-1">
                        <Label htmlFor="edit-description" className="text-xs lg:text-sm font-medium">
                          Mô tả chi tiết
                        </Label>
                        <Textarea
                          id="edit-description"
                          name="description"
                          defaultValue={editingRoom.description}
                          placeholder="Mô tả về phòng, vị trí, đặc điểm nổi bật..."
                          rows={3}
                          className="text-xs lg:text-sm resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="pt-3 border-t mt-3">
                    <div className="flex gap-2 w-full">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditRoomOpen(false)}
                        className="flex-1 h-9 lg:h-10 text-xs lg:text-sm"
                      >
                        Hủy
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 h-9 lg:h-10 text-xs lg:text-sm"
                      >
                        <Edit className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                        Cập nhật
                      </Button>
                    </div>
                  </DialogFooter>
                </div>
              </form>
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
                    <FileText className="h-4 w-4 lg:h-5 lg:w-5" />
                    Tạo hợp đồng thuê phòng - {contractRoom.number}
                  </DialogTitle>
                  <DialogDescription className="text-xs lg:text-sm text-gray-600">
                    Nhập đầy đủ thông tin để tạo hợp đồng thuê phòng chính thức
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* Landlord Information */}
                  <div className="space-y-3">
                    <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-2 flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Thông tin Bên A (Bên cho thuê)
                    </h3>
                    <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                        <Label className="text-xs font-medium text-gray-700">Địa chỉ</Label>
                        <Input
                          value={landlordInfo.address}
                          onChange={(e) => setLandlordInfo({ ...landlordInfo, address: e.target.value })}
                          className="mt-1 h-9 text-sm"
                        />
                      </div>
                        <div>
                          <Label className="text-xs font-medium text-gray-700">Người đại diện</Label>
                          <Input
                            value={landlordInfo.representative}
                            onChange={(e) => setLandlordInfo({ ...landlordInfo, representative: e.target.value })}
                            className="mt-1 h-9 text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-gray-700">Tỉnh/Thành phố (người đại diện)</Label>
                          <Input
                            value={landlordInfo.representativeProvince || ""}
                            onChange={e => setLandlordInfo({ ...landlordInfo, representativeProvince: e.target.value })}
                            className="mt-1 h-9 text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-gray-700">Quận/Huyện (người đại diện)</Label>
                          <Input
                            value={landlordInfo.representativeDistrict || ""}
                            onChange={e => setLandlordInfo({ ...landlordInfo, representativeDistrict: e.target.value })}
                            className="mt-1 h-9 text-sm"
                          />
                        </div>
                        
                        <div>
                        <Label className="text-xs font-medium text-gray-700 mt-3 block">Phường/Xã (người đại diện)</Label>
                        <Input
                          id="representativeWard"
                          name="representativeWard"
                          value={landlordInfo.representativeWard || ""}
                          onChange={e => setLandlordInfo({ ...landlordInfo, representativeWard: e.target.value })}
                          placeholder="Nhập phường/xã"
                          className="mt-1 h-9 text-sm"
                        />
                        </div>
                        <div>
                        <Label htmlFor="tenantGender" className="text-xs font-medium text-gray-700">
                             Giới tính
                        </Label>
                        <select
                         id="tenantGender"
                        name="tenantGender"
                        required
                        className="mt-1 h-9 text-sm w-full rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        defaultValue=""
                          >
                          <option value="" disabled>-- Chọn giới tính --</option>
                          <option value="Nam">Nam</option>
                          <option value="Nữ">Nữ</option>
                          <option value="Khác">Khác</option>
                            </select>
                        </div>


                        <div>
                          <Label className="text-xs font-medium text-gray-700">Số CCCD người đại diện</Label>
                          <Input
                            value={landlordInfo.representativeIdCard || ""}
                            onChange={e => setLandlordInfo({ ...landlordInfo, representativeIdCard: e.target.value })}
                            className="mt-1 h-9 text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-gray-700">Ngày sinh người đại diện</Label>
                          <Input
                            type="date"
                            value={landlordInfo.representativeBirthDate || ""}
                            onChange={e => setLandlordInfo({ ...landlordInfo, representativeBirthDate: e.target.value })}
                            className="mt-1 h-9 text-sm"
                          />
                        </div>
                      </div>
                  
                    
                    </div>
                  </div>

                  {/* Room Information */}
                  <div className="space-y-3">
                    <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-2">
                      Thông tin phòng thuê
                    </h3>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-xs text-gray-600">Phòng số</div>
                          <div className="font-bold text-lg">
                            {contractRoom.building}
                            {contractRoom.number}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-600">Diện tích</div>
                          <div className="font-bold text-lg">{contractRoom.area}m²</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-600">Giá thuê</div>
                          <div className="font-bold text-lg text-green-600">{contractRoom.price.toLocaleString()}₫</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-600">Tiền cọc</div>
                          <Input
                            id="deposit"
                            name="deposit"
                            type="number"
                            min={0}
                            required
                            className="font-bold text-lg text-orange-600 text-center h-9"
                            value={deposit}
                            onChange={e => setDeposit(Number(e.target.value))}
                          />
                          <div className="text-xs text-gray-500 mt-1">VNĐ</div>
                        </div>
                      </div>
                    </div>
   {/* Contract Amenities */}
                    <div className="space-y-3">
                    <Label className="text-sm font-medium">Dịch vụ & Tiện ích</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {availableAmenities.map((amenity) => {
                        const Icon = amenity.icon
                        return (
                          <div
                            key={amenity.id}
                            className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <Checkbox
                              id={`contract-${amenity.id}`}
                              checked={contractRoom.amenities?.includes(amenity.id) || false}
                              disabled
                              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                            <Label
                              htmlFor={`contract-${amenity.id}`}
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

                  {/* Tenant Information */}
                  <div className="space-y-3">
                    <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-2 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Thông tin Bên B (Khách thuê)
                    </h3>
                    <div className="bg-yellow-50 p-4 rounded-lg space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="tenantName" className="text-xs font-medium text-gray-700">
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
                          <Label htmlFor="tenantPhone" className="text-xs font-medium text-gray-700">
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
                        <div>
                            <Label htmlFor="tenantJob" className="text-xs font-medium text-gray-700">
                             Nghề nghiệp
                             </Label>
                             <Input
                               id="tenantJob"
                               name="CongViec"
                               placeholder="Ví dụ: Kỹ sư"
                              className="mt-1 h-9 text-sm"
                             />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
  <Label htmlFor="tenantGender" className="text-xs font-medium text-gray-700">
    Giới tính
  </Label>
  <select
    id="tenantGender"
    name="tenantGender"
    required
    className="mt-1 h-9 text-sm w-full rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
    defaultValue=""
  >
    <option value="" disabled>-- Chọn giới tính --</option>
    <option value="Nam">Nam</option>
    <option value="Nữ">Nữ</option>
    <option value="Khác">Khác</option>
  </select>
</div>

                        
                        <div>
                          <Label htmlFor="tenantIdCard" className="text-xs font-medium text-gray-700">
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
  

<div>
  <Label htmlFor="tenantIdIssueDate" className="text-xs font-medium text-gray-700">
    Ngày cấp CCCD/CMND
  </Label>
  <Input
    id="tenantIdIssueDate"
    name="NgayCapCCCD"
    type="date"
    className="mt-1 h-9 text-sm"
  />
</div>

<div>
  <Label htmlFor="tenantIdIssuePlace" className="text-xs font-medium text-gray-700">
    Nơi cấp CCCD/CMND
  </Label>
  <Input
    id="tenantIdIssuePlace"
    name="NoiCapCCCD"
    placeholder="Ví dụ: Công an TP Cần Thơ"
    className="mt-1 h-9 text-sm"
  />
</div>

                      </div>

                      <div>
                        <Label htmlFor="tenantBirthDate" className="text-xs font-medium text-gray-700">
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

                      {/* Quê quán */}
                      <div className="space-y-3">
                        <Label className="text-xs font-medium text-gray-700">Quê quán *</Label>
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
                              Địa chỉ cụ thể
                            </Label>
                            <Input id="village" name="village" placeholder="Nhập địa chỉ cụ thể" className="h-9 text-sm" />
                          </div>
                        </div>
                      </div>
                         {/* Số lượng thành viên ở */}
                  <div className="mt-4">
                    <Label htmlFor="soLuongThanhVien" className="text-xs font-medium text-gray-700">
                      Số lượng thành viên ở *
                    </Label>
                    <Input
                      id="soLuongThanhVien"
                      name="soLuongThanhVien"
                      type="number"
                      min="1"
                      required
                      className="mt-1 h-9 text-sm"
                      value={soLuongThanhVien}
                      onChange={e => setSoLuongThanhVien(Number(e.target.value))}
                    />
                  </div>
                      {/* Thành viên ở cùng */}
                 
                    </div>
                  </div>

                  {/* CCCD Images */}
                  <div className="space-y-3">
                    <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Hình ảnh CCCD/CMND
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* CCCD Front */}
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-gray-700">CCCD/CMND mặt trước</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                            {cccdImages.front ? (
                              <div className="relative">
                                <img
                                  src={cccdImages.front || "/placeholder.svg"}
                                  alt="CCCD mặt trước"
                                  className="w-full h-32 object-cover rounded"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute top-1 right-1 h-6 w-6 p-0"
                                  onClick={() => removeImage("front")}
                                >
                                  ×
                                </Button>
                              </div>
                            ) : (
                              <div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, "front")}
                                  className="hidden"
                                  id="cccd-front"
                                />
                                <label htmlFor="cccd-front" className="cursor-pointer">
                                  <div className="text-gray-500">
                                    <FileText className="h-8 w-8 mx-auto mb-2" />
                                    <p className="text-sm">Chọn ảnh CCCD mặt trước</p>
                                    <p className="text-xs text-gray-400">PNG, JPG tối đa 5MB</p>
                                  </div>
                                </label>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* CCCD Back */}
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-gray-700">CCCD/CMND mặt sau</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                            {cccdImages.back ? (
                              <div className="relative">
                                <img
                                  src={cccdImages.back || "/placeholder.svg"}
                                  alt="CCCD mặt sau"
                                  className="w-full h-32 object-cover rounded"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute top-1 right-1 h-6 w-6 p-0"
                                  onClick={() => removeImage("back")}
                                >
                                  ×
                                </Button>
                              </div>
                            ) : (
                              <div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, "back")}
                                  className="hidden"
                                  id="cccd-back"
                                />
                                <label htmlFor="cccd-back" className="cursor-pointer">
                                  <div className="text-gray-500">
                                    <FileText className="h-8 w-8 mx-auto mb-2" />
                                    <p className="text-sm">Chọn ảnh CCCD mặt sau</p>
                                    <p className="text-xs text-gray-400">PNG, JPG tối đa 5MB</p>
                                  </div>
                                </label>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="bg-blue-100 p-3 rounded text-sm text-blue-800">
                        <strong>Lưu ý:</strong> Hình ảnh CCCD/CMND sẽ được lưu trữ để phục vụ cho việc quản lý hợp đồng.
                        Vui lòng đảm bảo hình ảnh rõ nét và đầy đủ thông tin.
                      </div>
                    </div>
                  </div>

                  {/* Contract Duration */}
                  <div className="space-y-3">
                    <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Thời hạn hợp đồng
                    </h3>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="contractStartDate" className="text-xs font-medium text-gray-700">
                            Ngày bắt đầu *
                          </Label>
                          <Input
                            id="contractStartDate"
                            name="contractStartDate"
                            type="date"
                            required
                            className="mt-1 h-9 text-sm"
                            value={addContractStartDate}
                            onChange={e => setAddContractStartDate(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="contract-duration" className="text-xs font-medium text-gray-700">
                            Thời hạn hợp đồng *
                          </Label>
                          <Select value={contractDuration} onValueChange={setContractDuration}>
                            <SelectTrigger className="mt-1 h-9 text-sm">
                              <SelectValue placeholder="Chọn chu kì" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3">3 tháng</SelectItem>
                              <SelectItem value="6">6 tháng</SelectItem>
                              <SelectItem value="8">8 tháng</SelectItem>
                              <SelectItem value="12">1 năm</SelectItem>
                              <SelectItem value="24">2 năm</SelectItem>
                              <SelectItem value="36">3 năm</SelectItem>
                              <SelectItem value="48">4 năm</SelectItem>
                              <SelectItem value="60">5 năm</SelectItem>
                              <SelectItem value="72">6 năm</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="contractEndDate" className="text-xs font-medium text-gray-700">
                            Ngày kết thúc
                          </Label>
                          <Input
                            id="contractEndDate"
                            name="contractEndDate"
                            type="date"
                            className="mt-1 h-9 text-sm bg-gray-100"
                            value={addContractEndDate}
                            readOnly
                            tabIndex={-1}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                      {/* Chu kỳ thu tiền */}
                      <div>
                    <Label htmlFor="chuKyThuTien" className="text-xs font-medium text-gray-700 mt-3 block">Chu kỳ thu tiền</Label>
                    <select
                      id="chuKyThuTien"
                      name="chuKyThuTien"
                      required
                      className="mt-1 h-9 text-sm w-full rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      defaultValue="1 tháng"
                    >
                      <option value="1 tháng">1 tháng</option>
                      <option value="3 tháng">3 tháng</option>
                      <option value="6 tháng">6 tháng</option>
                      <option value="12 tháng">12 tháng</option>
                    </select>
                  </div>

                  {/* Contract Terms Preview */}
                  <div className="space-y-3">
                    <h3 className="text-sm lg:text-base font-medium text-gray-900 border-b pb-2">
                      Điều khoản hợp đồng
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto">
                      <ol className="text-xs space-y-2">
                        {contractTerms.map((term, index) => (
                          <li key={index} className="flex gap-2">
                            <span className="font-medium min-w-fit">Điều {index + 1}:</span>
                            <span>{term}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                          <div className="bg-blue-100 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Lưu ý:</strong> Sau khi tạo hợp đồng, bạn sẽ có thể xem trước và in hợp đồng chính thức
                      với đầy đủ thông tin các bên và điều khoản.
                    </p>
                  </div>    
                </div>

                <DialogFooter className="pt-4 border-t mt-4">
                  <div className="flex gap-3 w-full">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseAddContract}
                      className="flex-1 h-10 text-sm bg-transparent"
                    >
                      Hủy
                    </Button>
                    <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 h-10 text-sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Tạo hợp đồng
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Contract Preview Dialog */}
        <Dialog open={showContractPreview} onOpenChange={setShowContractPreview}>
          <DialogContent className="sm:max-w-[900px] mx-2 max-h-[90vh] overflow-y-auto rounded-xl p-6">
            {contractData && (
              <>
                <DialogHeader className="pb-4">
                  <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Hợp đồng thuê phòng đã tạo thành công
                  </DialogTitle>
                  <DialogDescription className="text-sm text-gray-600">
                    Xem trước hợp đồng và thực hiện in ấn
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Hợp đồng đã được tạo thành công!</span>
                    </div>
                    <p className="text-sm text-green-700 mt-2">
                      Phòng {contractData.building}
                      {contractData.roomNumber} đã được cho thuê cho khách hàng {contractData.tenantName}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900 border-b pb-2">Thông tin Bên A</h3>
                      <div className="bg-blue-50 p-4 rounded-lg space-y-2 text-sm">
                        <div>
                          <strong>Tên:</strong> {landlordInfo.name}
                        </div>
                        <div>
                          <strong>Đại diện:</strong> {landlordInfo.representative}
                        </div>
                        <div>
                          <strong>Điện thoại:</strong> {landlordInfo.phone}
                        </div>
                        <div>
                          <strong>Email:</strong> {landlordInfo.email}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900 border-b pb-2">Thông tin Bên B</h3>
                      <div className="bg-yellow-50 p-4 rounded-lg space-y-2 text-sm">
                        <div>
                          <strong>Tên:</strong> {contractData.tenantName}
                        </div>
                        <div>
                          <strong>Điện thoại:</strong> {contractData.tenantPhone}
                        </div>
                        <div>
                          <strong>Email:</strong> {contractData.tenantEmail || "Không có"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CCCD Images in Preview */}
                  {(contractData.cccdFront || contractData.cccdBack) && (
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900 border-b pb-2">Hình ảnh CCCD/CMND</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {contractData.cccdFront && (
                            <div className="space-y-2">
                              <div className="text-sm font-medium text-gray-700">CCCD/CMND mặt trước</div>
                              <div className="border rounded-lg overflow-hidden">
                                <img
                                  src={contractData.cccdFront || "/placeholder.svg"}
                                  alt="CCCD mặt trước"
                                  className="w-full h-32 object-cover"
                                />
                              </div>
                            </div>
                          )}
                          {contractData.cccdBack && (
                            <div className="space-y-2">
                              <div className="text-sm font-medium text-gray-700">CCCD/CMND mặt sau</div>
                              <div className="border rounded-lg overflow-hidden">
                                <img
                                  src={contractData.cccdBack || "/placeholder.svg"}
                                  alt="CCCD mặt sau"
                                  className="w-full h-32 object-cover"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">Chi tiết hợp đồng</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Phòng</div>
                        <div className="font-medium">
                          {contractData.building}
                          {contractData.roomNumber}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Diện tích</div>
                        <div className="font-medium">{contractData.area}m²</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Giá thuê</div>
                        <div className="font-medium text-green-600">{contractData.price.toLocaleString()}₫/tháng</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Thời hạn</div>
                        <div className="font-medium">
                          {Math.ceil(
                            (new Date(contractData.contractEndDate).getTime() -
                              new Date(contractData.contractStartDate).getTime()) /
                              (1000 * 60 * 60 * 24 * 30),
                          )} tháng
                          <span className="block text-xs text-gray-500 mt-1">
                            ({new Date(contractData.contractStartDate).toLocaleDateString("vi-VN")} - {new Date(contractData.contractEndDate).toLocaleDateString("vi-VN")})
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
                      <div>
                        <div className="text-gray-600">Ngày bắt đầu</div>
                        <div className="font-medium">
                          {new Date(contractData.contractStartDate).toLocaleDateString("vi-VN")}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Ngày kết thúc</div>
                        <div className="font-medium">
                          {new Date(contractData.contractEndDate).toLocaleDateString("vi-VN")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter className="pt-4 border-t">
                  <div className="flex gap-3 w-full">
                    <Button variant="outline" onClick={() => setShowContractPreview(false)} className="flex-1 h-10">
                      Đóng
                    </Button>
                    <Button
                      onClick={() => handlePrintContract(contractData)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 h-10"
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

        {/* Modal đặt cọc phòng */}
        {isBookingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative animate-fade-in">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-lg font-bold text-blue-700">Phòng đặt trước</h3>
                <button
                  className="text-2xl text-gray-500 hover:text-red-500 absolute right-4 top-2"
                  onClick={handleCloseBooking}
                  aria-label="Đóng"
                >
                  &times;
                </button>
              </div>
              <form className="space-y-4" onSubmit={handleBookingSubmit}>
                <div>
                  <label htmlFor="booking-name" className="block text-sm font-medium text-gray-700">Họ và Tên:</label>
                  <input
                    id="booking-name"
                    type="text"
                    required
                    className="mt-1 w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    value={bookingForm.HoTenKhach}
                    onChange={e => setBookingForm({ ...bookingForm, HoTenKhach: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="booking-phone" className="block text-sm font-medium text-gray-700">Số Điện Thoại:</label>
                  <input
                    id="booking-phone"
                    type="tel"
                    required
                    className="mt-1 w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    value={bookingForm.SoDienThoai}
                    onChange={e => setBookingForm({ ...bookingForm, SoDienThoai: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="booking-deposit" className="block text-sm font-medium text-gray-700">Số Tiền Đã Cọc (VNĐ):</label>
                  <input
                    id="booking-deposit"
                    type="number"
                    required
                    className="mt-1 w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    value={bookingForm.SoTienDatCoc}
                    onChange={e => setBookingForm({ ...bookingForm, SoTienDatCoc: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="booking-date" className="block text-sm font-medium text-gray-700">Ngày Đặt Cọc:</label>
                  <input
                    id="booking-date"
                    type="date"
                    required
                    className="mt-1 w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    value={bookingForm.NgayDatCoc}
                    onChange={e => setBookingForm({ ...bookingForm, NgayDatCoc: e.target.value })}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded mt-2"
                >
                  Lưu
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Delete Room Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-xs mx-auto text-center">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-red-600">Xác nhận xóa phòng</DialogTitle>
              <DialogDescription>Bạn có chắc chắn muốn xóa phòng <b>{roomToDelete?.number}</b> không?</DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setIsDeleteDialogOpen(false)}>
                Hủy
              </Button>
              <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={handleConfirmDelete}>
                Xóa
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default RoomsPage
