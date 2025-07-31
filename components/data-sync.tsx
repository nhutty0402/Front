"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Cloud, CloudOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DataSyncProps {
  onSync?: () => Promise<void>
}

export function DataSync({ onSync }: DataSyncProps) {
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    setIsOnline(navigator.onLine)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Load last sync time
    const savedLastSync = localStorage.getItem("lastSync")
    if (savedLastSync) {
      setLastSync(new Date(savedLastSync))
    }

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleSync = async () => {
    if (!isOnline) {
      toast({
        title: "Không có kết nối",
        description: "Vui lòng kiểm tra kết nối internet",
        variant: "destructive",
      })
      return
    }

    setIsSyncing(true)
    try {
      if (onSync) {
        await onSync()
      }

      // Simulate sync delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const now = new Date()
      setLastSync(now)
      localStorage.setItem("lastSync", now.toISOString())

      toast({
        title: "Đồng bộ thành công",
        description: "Dữ liệu đã được cập nhật",
      })
    } catch (error) {
      toast({
        title: "Lỗi đồng bộ",
        description: "Không thể đồng bộ dữ liệu",
        variant: "destructive",
      })
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={handleSync} disabled={isSyncing || !isOnline}>
        <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
        <span className="sr-only">Đồng bộ dữ liệu</span>
      </Button>

      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        {isOnline ? <Cloud className="h-3 w-3 text-green-600" /> : <CloudOff className="h-3 w-3 text-red-600" />}
        {lastSync && (
          <span>
            {lastSync.toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>
    </div>
  )
}
