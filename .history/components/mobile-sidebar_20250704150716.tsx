"use client"

import { Fragment } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Dialog, Transition } from "@headlessui/react"
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
  X,
  User,
  Wrench,
  Zap,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Quản lý phòng", href: "/rooms", icon: Building2 },
  { name: "Khách thuê", href: "/tenants", icon: Users },
  { name: "Hợp đồng", href: "/contracts", icon: FileText },
  { name: "Tài chính", href: "/finance", icon: DollarSign },
  { name: "Dịch vụ", href: "/services", icon: Wrench },
  { name: "Cập nhật chỉ số", href: "/meter-readings", icon: Zap },
  { name: "Yêu cầu", href: "/requests", icon: MessageSquare },
  { name: "Báo cáo", href: "/reports", icon: BarChart3 },
]

const secondaryNavigation = [
  { name: "Hồ sơ", href: "/profile", icon: User },
  { name: "Cài đặt", href: "/settings", icon: Settings },
]

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname()

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/80" />
        </Transition.Child>

        <div className="fixed inset-0 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                {/* Header */}
                <div className="flex h-16 shrink-0 items-center justify-between">
                  <div className="flex items-center">
                    <Building2 className="h-8 w-8 text-blue-600" />
                    <span className="ml-2 text-xl font-bold text-gray-900">Nhà Trọ Cần Thơ</span>
                  </div>
                  <button type="button" className="-m-2.5 p-2.5" onClick={onClose}>
                    <span className="sr-only"> </span>
                    <X className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => {
                          const isActive = pathname === item.href
                          return (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                onClick={onClose}
                                className={cn(
                                  "flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                                  isActive
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-700 hover:text-blue-700 hover:bg-blue-50",
                                )}
                              >
                                <item.icon className="h-6 w-6 shrink-0" />
                                {item.name}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </li>
                    <li className="mt-auto">
                      <ul role="list" className="-mx-2 space-y-1">
                        {secondaryNavigation.map((item) => {
                          const isActive = pathname === item.href
                          return (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                onClick={onClose}
                                className={cn(
                                  "flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                                  isActive
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-700 hover:text-blue-700 hover:bg-blue-50",
                                )}
                              >
                                <item.icon className="h-6 w-6 shrink-0" />
                                {item.name}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
