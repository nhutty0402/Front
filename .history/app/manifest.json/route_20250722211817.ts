// app/manifest.json/route.ts
import { NextResponse } from "next/server"

export function GET() {
  return NextResponse.json(
    {
      name: "Quản lý Nhà trọ",
      short_name: "Nhà trọ",
      description: "Ứng dụng quản lý nhà trọ toàn diện",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#3b82f6",
      orientation: "portrait-primary",
      icons: [
        {
          src: "/icon-192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable"
        },
        {
          src: "/icon-512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable"
        }
      ],
      categories: ["business", "productivity"],
      lang: "vi",
      dir: "ltr"
    },
    {
      headers: {
        "Content-Type": "application/manifest+json"
      }
    }
  )
}
