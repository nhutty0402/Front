"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bell, BellOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function NotificationManager() {
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [isSupported, setIsSupported] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if ("Notification" in window) {
      setIsSupported(true)
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async () => {
    if (!isSupported) {
      toast({
        title: "Không hỗ trợ",
        description: "Trình duyệt không hỗ trợ thông báo",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result)

      if (result === "granted") {
        toast({
          title: "Thành công",
          description: "Đã bật thông báo thành công",
        })

        // Send test notification
        new Notification("Quản lý Nhà trọ", {
          body: "Thông báo đã được kích hoạt!",
          icon: "/icon-192.png",
          badge: "/icon-192.png",
        })
      } else {
        toast({
          title: "Từ chối",
          description: "Bạn đã từ chối quyền thông báo",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể yêu cầu quyền thông báo",
        variant: "destructive",
      })
    }
  }

  if (!isSupported) return null

  return (
    <Button variant="ghost" size="sm" onClick={requestPermission} disabled={permission === "granted"}>
      {permission === "granted" ? <Bell className="h-4 w-4 text-green-600" /> : <BellOff className="h-4 w-4" />}
      <span className="sr-only">{permission === "granted" ? "Thông báo đã bật" : "Bật thông báo"}</span>
    </Button>
  )
}
