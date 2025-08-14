"use client"

import { useEffect } from "react"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"

export default function useAuthGuard() {
  const router = useRouter()

  useEffect(() => {
    const token = Cookies.get("token")
    if (!token || token === "null" || token === "undefined" || token.trim() === "") {
      router.replace("/login")
    }
  }, [router])
}
