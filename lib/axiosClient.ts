"use client"

import axios from "axios"
import Cookies from "js-cookie"

const axiosClient = axios.create()

axiosClient.interceptors.request.use((config) => {
  const token = Cookies.get("token")
  if (token && token !== "null" && token !== "undefined") {
    config.headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    }
  }
  return config
})

export default axiosClient


