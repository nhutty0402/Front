"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

export function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallBanner(true)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallBanner(false)
      setDeferredPrompt(null)
    }

    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setDeferredPrompt(null)
      setShowInstallBanner(false)
    }
  }

  const handleDismiss = () => {
    setShowInstallBanner(false)
    localStorage.setItem("pwa-install-dismissed", "true")
  }

  // Don't show if already installed or dismissed
  if (isInstalled || !showInstallBanner) return null

  // Check if user previously dismissed
  if (typeof window !== "undefined" && localStorage.getItem("pwa-install-dismissed")) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:w-80 bg-background border border-border rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-sm">Cài đặt ứng dụng</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={handleDismiss}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mb-3">Cài đặt ứng dụng để truy cập nhanh hơn và sử dụng offline</p>
      <div className="flex gap-2">
        <Button onClick={handleInstallClick} size="sm" className="flex-1">
          Cài đặt
        </Button>
        <Button variant="outline" onClick={handleDismiss} size="sm">
          Để sau
        </Button>
      </div>
    </div>
  )
}
