import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { PWAInstall } from "@/components/pwa-install"
import { OfflineBanner } from "@/components/offline-banner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Quản lý Nhà trọ",
  description: "Ứng dụng quản lý nhà trọ toàn diện",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Quản lý Nhà trọ",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Quản lý Nhà trọ",
    title: "Quản lý Nhà trọ",
    description: "Ứng dụng quản lý nhà trọ toàn diện",
  },
  twitter: {
    card: "summary",
    title: "Quản lý Nhà trọ",
    description: "Ứng dụng quản lý nhà trọ toàn diện",
  },
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Quản lý Nhà trọ" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <OfflineBanner />
          {children}
          <PWAInstall />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
