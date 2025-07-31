// Định nghĩa kiểu dữ liệu cho lịch sử giao dịch
export interface TransactionHistory {
  KhachHangID: number;
  PhongID: number;
  ChiSoID: number;
  LoaiGiaoDich: string;
  SoTien: number;
  PhuongThuc: string;
  NoiDung: string;
  NgayGiaoDich: string; // ISO date string
}

// Mock data mẫu
export const mockTransactionHistory: TransactionHistory[] = [
  {
    KhachHangID: 10,
    PhongID: 33,
    ChiSoID: 6,
    LoaiGiaoDich: "ThanhToanTienPhong",
    SoTien: 1200000,
    PhuongThuc: "Chuyển khoản",
    NoiDung: "Khách thanh toán tiền phòng tháng 6",
    NgayGiaoDich: "2024-06-01T10:00:00Z",
  },
  // Thêm các giao dịch khác nếu cần
];

// Hàm lấy lịch sử giao dịch (có thể thay bằng API thực tế)
export function getTransactionHistoryByRoom(roomId: number): TransactionHistory[] {
  return mockTransactionHistory.filter((item) => item.PhongID === roomId);
} 