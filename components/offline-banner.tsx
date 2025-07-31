"use client"

import { useOffline } from "@/hooks/use-offline"
import { WifiOff, Wifi } from "lucide-react"
import { useState, useEffect } from "react"

export function OfflineBanner() {
  const isOffline = useOffline()
  const [showBanner, setShowBanner] = useState(false)
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    if (isOffline) {
      setShowBanner(true)
      setWasOffline(true)
    } else if (wasOffline) {
      // Show "back online" message briefly
      setShowBanner(true)
      const timer = setTimeout(() => {
        setShowBanner(false)
        setWasOffline(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOffline, wasOffline])

  if (!showBanner) return null

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 p-3 text-center text-sm font-medium transition-colors ${
        isOffline ? "bg-red-600 text-white" : "bg-green-600 text-white"
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        {isOffline ? (
          <>
            <WifiOff className="h-4 w-4" />
            Bạn đang offline. Một số tính năng có thể bị hạn chế.
          </>
        ) : (
          <>
            <Wifi className="h-4 w-4" />
            Đã kết nối lại internet!
          </>
        )}
      </div>
    </div>
  )
}
