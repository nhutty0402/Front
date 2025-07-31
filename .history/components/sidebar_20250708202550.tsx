"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  Building2,
  Users,
  FileText,
  DollarSign,
  MessageSquare,
  BarChart3,
  Settings,
  User,
  Wrench,
  Zap,
} from "lucide-react"

const navigation = [
  { name: "Trang chủ", href: "/", icon: Home },
  { name: "Quản lý phòng", href: "/rooms", icon: Building2 },
  { name: "Quản lý khách hàng", href: "/tenants", icon: Users },
  { name: "Doanh thu", href: "/reports", icon: BarChart3 },
  // { name: "Hợp đồng", href: "/contracts", icon: FileText },
  { name: "Quản lý hóa đơn", href: "/finance", icon: DollarSign },
  { name: "Dịch vụ", href: "/services", icon: Wrench },
  { name: "Cập nhật chỉ số", href: "/meter-readings", icon: Zap },
  { name: "Yêu cầu", href: "/requests", icon: MessageSquare },




]

const secondaryNavigation = [
  { name: "Hồ sơ", href: "/profile", icon: User },
  { name: "Cài đặt", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <Building2 className="h-8 w-8 text-blue-600" />
        <span className="ml-2 text-xl font-bold text-gray-900">Nhà Trọ Cần Thơ</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Secondary Navigation */}
      <div className="border-t border-gray-200 px-4 py-4 space-y-1">
        {secondaryNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
