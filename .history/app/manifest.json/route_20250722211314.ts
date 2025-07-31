// app/manifest.json/route.ts
import { NextResponse } from "next/server";
import manifest from "@/../../public/manifest.json"; // đảm bảo bạn có file này đúng JSON chuẩn

export function GET() {
  return new NextResponse(JSON.stringify(manifest), {
    headers: {
      "Content-Type": "application/manifest+json",
    },
  });
}
