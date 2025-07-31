"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, Bell, X, Calendar, Phone, Mail, FileText, CheckCircle } from "lucide-react"

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

interface ContractNotificationsProps {
  contracts: ContractNotification[]
  onMarkNotified: (contractId: string) => void
  onExtendContract: (contractId: string) => void
  onContactTenant: (contractId: string, method: "phone" | "email") => void
}

export function ContractNotifications({
  contracts,
  onMarkNotified,
  onExtendContract,
  onContactTenant,
}: ContractNotificationsProps) {
  const [showNotifications, setShowNotifications] = useState(true)
  const [filter, setFilter] = useState<"all" | "expired" | "expiring">("all")

  const expiredContracts = contracts.filter((contract) => contract.status === "expired")
  const expiringContracts = contracts.filter((contract) => contract.status === "expiring")
  const unnotifiedContracts = contracts.filter((contract) => !contract.notificationSent)

  const filteredContracts = contracts.filter((contract) => {
    if (filter === "all") return contract.status !== "active"
    return contract.status === filter
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  const getUrgencyLevel = (daysUntilExpiry: number) => {
    if (daysUntilExpiry < 0) return "critical" // Đã hết hạn
    if (daysUntilExpiry <= 7) return "high" // Trong 1 tuần
    if (daysUntilExpiry <= 15) return "medium" // Trong 2 tuần
    if (daysUntilExpiry <= 30) return "low" // Trong 1 tháng
    return "normal"
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "bg-red-100 border-red-300 text-red-800"
      case "high":
        return "bg-orange-100 border-orange-300 text-orange-800"
      case "medium":
        return "bg-yellow-100 border-yellow-300 text-yellow-800"
      case "low":
        return "bg-blue-100 border-blue-300 text-blue-800"
      default:
        return "bg-gray-100 border-gray-300 text-gray-800"
    }
  }

  if (!showNotifications || filteredContracts.length === 0) {
    return (
      <div className="mb-4">
        {(expiredContracts.length > 0 || expiringContracts.length > 0) && (
          <Button
            variant="outline"
            onClick={() => setShowNotifications(true)}
            className="w-full lg:w-auto border-orange-200 text-orange-700 hover:bg-orange-50"
          >
            <Bell className="h-4 w-4 mr-2" />
            {expiredContracts.length + expiringContracts.length} thông báo hợp đồng
            {unnotifiedContracts.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unnotifiedContracts.length} mới
              </Badge>
            )}
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4 mb-6">
      {/* Summary Card */}
      <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6 text-orange-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Thông báo hợp đồng</h3>
                <p className="text-sm text-gray-600">
                  {expiredContracts.length} đã hết hạn • {expiringContracts.length} sắp hết hạn
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Filter Buttons */}
              <div className="hidden lg:flex gap-1">
                <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
                  Tất cả
                </Button>
                <Button
                  variant={filter === "expired" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("expired")}
                >
                  Hết hạn ({expiredContracts.length})
                </Button>
                <Button
                  variant={filter === "expiring" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("expiring")}
                >
                  Sắp hết hạn ({expiringContracts.length})
                </Button>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowNotifications(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Filter */}
          <div className="lg:hidden mt-3 flex gap-1">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              Tất cả
            </Button>
            <Button
              variant={filter === "expired" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("expired")}
            >
              Hết hạn ({expiredContracts.length})
            </Button>
            <Button
              variant={filter === "expiring" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("expiring")}
            >
              Sắp hết hạn ({expiringContracts.length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredContracts.map((contract) => {
          const urgency = getUrgencyLevel(contract.daysUntilExpiry)
          const urgencyColor = getUrgencyColor(urgency)

          return (
            <Card key={contract.id} className={`border-l-4 ${urgencyColor.replace("bg-", "border-l-")}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {contract.status === "expired" ? (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-orange-600" />
                      )}
                      <h4 className="font-semibold text-gray-900">
                        Phòng {contract.building}
                        {contract.roomNumber}
                      </h4>
                      <Badge
                        variant={contract.status === "expired" ? "destructive" : "secondary"}
                        className={urgencyColor}
                      >
                        {contract.status === "expired"
                          ? `Hết hạn ${Math.abs(contract.daysUntilExpiry)} ngày`
                          : `Còn ${contract.daysUntilExpiry} ngày`}
                      </Badge>
                      {!contract.notificationSent && (
                        <Badge variant="destructive" className="animate-pulse">
                          Mới
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-600">
                          <strong>Khách thuê:</strong> {contract.tenantName}
                        </p>
                        <p className="text-gray-600">
                          <strong>Hết hạn:</strong> {formatDate(contract.contractEndDate)}
                        </p>
                        {contract.lastNotificationDate && (
                          <p className="text-gray-500 text-xs">
                            Đã thông báo: {formatDate(contract.lastNotificationDate)}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {/* Contact Actions */}
                        {contract.tenantPhone && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onContactTenant(contract.id, "phone")}
                            className="text-xs"
                          >
                            <Phone className="h-3 w-3 mr-1" />
                            Gọi
                          </Button>
                        )}
                        {contract.tenantEmail && (
                          // <Button
                          //   variant="outline"
                          //   size="sm"
                          //   onClick={() => onContactTenant(contract.id, "email")}
                          //   className="text-xs"
                          // >
                          //   <Mail className="h-3 w-3 mr-1" />
                          //   Email
                          // </Button>
                        )}

                        {/* Contract Actions */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onExtendContract(contract.id)}
                          className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          Gia hạn
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/contracts/${contract.id}`, "_blank")}
                          className="text-xs"
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          Xem HĐ
                        </Button>

                        {/* Mark as Notified */}
                        {!contract.notificationSent && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onMarkNotified(contract.id)}
                            className="text-xs bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Đã thông báo
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Urgency Message */}
                    <div className={`mt-3 p-2 rounded text-xs ${urgencyColor}`}>
                      {contract.status === "expired" ? (
                        <span>
                          ⚠️ <strong>Khẩn cấp:</strong> Hợp đồng đã hết hạn {Math.abs(contract.daysUntilExpiry)} ngày.
                          Cần xử lý ngay!
                        </span>
                      ) : contract.daysUntilExpiry <= 7 ? (
                        <span>
                          🔥 <strong>Rất gấp:</strong> Hợp đồng sẽ hết hạn trong {contract.daysUntilExpiry} ngày. Liên
                          hệ khách thuê ngay!
                        </span>
                      ) : contract.daysUntilExpiry <= 15 ? (
                        <span>
                          ⏰ <strong>Gấp:</strong> Hợp đồng sẽ hết hạn trong {contract.daysUntilExpiry} ngày. Cần chuẩn
                          bị gia hạn.
                        </span>
                      ) : (
                        <span>
                          📅 <strong>Lưu ý:</strong> Hợp đồng sẽ hết hạn trong {contract.daysUntilExpiry} ngày. Nên bắt
                          đầu thảo luận gia hạn.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredContracts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có thông báo</h3>
            <p className="text-gray-600">
              {filter === "expired"
                ? "Không có hợp đồng nào đã hết hạn"
                : filter === "expiring"
                  ? "Không có hợp đồng nào sắp hết hạn"
                  : "Tất cả hợp đồng đều còn hiệu lực"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
