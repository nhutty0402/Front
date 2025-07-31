"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Menu, Zap, Droplets, Calculator, Save, History, TrendingUp, AlertCircle, DollarSign } from "lucide-react"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { Sidebar } from "@/components/sidebar"

interface Room {
  id: number
  building: string
  number: string
  tenant: string
  lastElectricReading: number
  lastWaterReading: number
}

interface Reading {
  id: number
  roomId: number
  month: string
  oldElectric: number
  newElectric: number
  electricConsumption: number
  electricPrice: number
  electricAmount: number
  oldWater: number
  newWater: number
  waterConsumption: number
  waterPrice: number
  waterAmount: number
  totalAmount: number
  status: string
  date: string
}

interface PriceSettings {
  electric: number
  water: number
}

export default function MeterReadingsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedBuilding, setSelectedBuilding] = useState("all")
  const [selectedRoom, setSelectedRoom] = useState("")
  const [currentMonth, setCurrentMonth] = useState("")
  const [newElectricReading, setNewElectricReading] = useState("")
  const [newWaterReading, setNewWaterReading] = useState("")
  const [electricConsumption, setElectricConsumption] = useState(0)
  const [waterConsumption, setWaterConsumption] = useState(0)
  const [electricAmount, setElectricAmount] = useState(0)
  const [waterAmount, setWaterAmount] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const [showPriceManager, setShowPriceManager] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [prices, setPrices] = useState<PriceSettings>({
    electric: 3500,
    water: 12000,
  })

  const [newPrices, setNewPrices] = useState({
    electric: "",
    water: "",
  })

  const [rooms] = useState<Room[]>([
    {
      id: 1,
      building: "A",
      number: "101",
      tenant: "Nguyễn Văn A",
      lastElectricReading: 150,
      lastWaterReading: 25,
    },
    {
      id: 2,
      building: "A",
      number: "102",
      tenant: "Trần Thị B",
      lastElectricReading: 200,
      lastWaterReading: 30,
    },
    {
      id: 3,
      building: "B",
      number: "201",
      tenant: "Lê Văn C",
      lastElectricReading: 180,
      lastWaterReading: 28,
    },
    {
      id: 4,
      building: "B",
      number: "202",
      tenant: "Phạm Thị D",
      lastElectricReading: 0,
      lastWaterReading: 0,
    },
  ])

  const [readings, setReadings] = useState<Reading[]>([
    {
      id: 1,
      roomId: 1,
      month: "12/2024",
      oldElectric: 100,
      newElectric: 150,
      electricConsumption: 50,
      electricPrice: 3500,
      electricAmount: 175000,
      oldWater: 20,
      newWater: 25,
      waterConsumption: 5,
      waterPrice: 12000,
      waterAmount: 60000,
      totalAmount: 235000,
      status: "Đã thanh toán",
      date: "15/12/2024",
    },
  ])

  const updateDate = new Date().toLocaleDateString("vi-VN")
  const buildings = [...new Set(rooms.map((room) => room.building))]
  const filteredRooms = selectedBuilding === "all" ? rooms : rooms.filter((room) => room.building === selectedBuilding)
  const selectedRoomData = rooms.find((room) => room.id.toString() === selectedRoom)

  useEffect(() => {
    const now = new Date()
    const monthYear = `${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`
    setCurrentMonth(monthYear)
  }, [])

  // Calculate electric consumption and amount
  useEffect(() => {
    if (selectedRoomData && newElectricReading) {
      const newReading = Number.parseInt(newElectricReading) || 0
      const oldReading = selectedRoomData.lastElectricReading

      if (newReading >= oldReading) {
        const consumption = newReading - oldReading
        const amount = consumption * prices.electric
        setElectricConsumption(consumption)
        setElectricAmount(amount)
      } else {
        setElectricConsumption(0)
        setElectricAmount(0)
      }
    } else {
      setElectricConsumption(0)
      setElectricAmount(0)
    }
  }, [newElectricReading, selectedRoomData, prices.electric])

  // Calculate water consumption and amount
  useEffect(() => {
    if (selectedRoomData && newWaterReading) {
      const newReading = Number.parseInt(newWaterReading) || 0
      const oldReading = selectedRoomData.lastWaterReading

      if (newReading >= oldReading) {
        const consumption = newReading - oldReading
        const amount = consumption * prices.water
        setWaterConsumption(consumption)
        setWaterAmount(amount)
      } else {
        setWaterConsumption(0)
        setWaterAmount(0)
      }
    } else {
      setWaterConsumption(0)
      setWaterAmount(0)
    }
  }, [newWaterReading, selectedRoomData, prices.water])

  // Calculate total amount
  useEffect(() => {
    setTotalAmount(electricAmount + waterAmount)
  }, [electricAmount, waterAmount])

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString("vi-VN")} VNĐ`
  }

  const handleRoomChange = (roomId: string) => {
    setSelectedRoom(roomId)
    setNewElectricReading("")
    setNewWaterReading("")
    setElectricConsumption(0)
    setWaterConsumption(0)
    setElectricAmount(0)
    setWaterAmount(0)
    setTotalAmount(0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedRoom || !newElectricReading || !newWaterReading) {
      setMessage({ type: "error", text: "Vui lòng điền đầy đủ thông tin" })
      return
    }

    if (!selectedRoomData) return

    const newElectric = Number.parseInt(newElectricReading)
    const newWater = Number.parseInt(newWaterReading)

    if (newElectric < selectedRoomData.lastElectricReading) {
      setMessage({ type: "error", text: "Chỉ số điện mới phải lớn hơn hoặc bằng chỉ số cũ" })
      return
    }

    if (newWater < selectedRoomData.lastWaterReading) {
      setMessage({ type: "error", text: "Chỉ số nước mới phải lớn hơn hoặc bằng chỉ số cũ" })
      return
    }

    const newReading: Reading = {
      id: Date.now(),
      roomId: selectedRoomData.id,
      month: currentMonth,
      oldElectric: selectedRoomData.lastElectricReading,
      newElectric: newElectric,
      electricConsumption: electricConsumption,
      electricPrice: prices.electric,
      electricAmount: electricAmount,
      oldWater: selectedRoomData.lastWaterReading,
      newWater: newWater,
      waterConsumption: waterConsumption,
      waterPrice: prices.water,
      waterAmount: waterAmount,
      totalAmount: totalAmount,
      status: "Chưa thanh toán",
      date: updateDate,
    }

    setReadings([newReading, ...readings])
    setMessage({ type: "success", text: `Cập nhật chỉ số thành công! Tổng tiền: ${formatCurrency(totalAmount)}` })

    // Reset form
    setSelectedRoom("")
    setNewElectricReading("")
    setNewWaterReading("")
    setElectricConsumption(0)
    setWaterConsumption(0)
    setElectricAmount(0)
    setWaterAmount(0)
    setTotalAmount(0)

    setTimeout(() => setMessage(null), 5000)
  }

  const handleUpdatePrice = (type: "electric" | "water") => {
    const newPrice = newPrices[type]
    if (newPrice && !isNaN(Number(newPrice)) && Number(newPrice) > 0) {
      setPrices((prev) => ({ ...prev, [type]: Number(newPrice) }))
      setNewPrices((prev) => ({ ...prev, [type]: "" }))
      setMessage({
        type: "success",
        text: `Cập nhật giá ${type === "electric" ? "điện" : "nước"} thành công: ${formatCurrency(Number(newPrice))}/${type === "electric" ? "kWh" : "m³"}`,
      })
      setTimeout(() => setMessage(null), 3000)
    } else {
      setMessage({ type: "error", text: "Vui lòng nhập giá hợp lệ (lớn hơn 0)" })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const roomReadings = selectedRoom ? readings.filter((r) => r.roomId.toString() === selectedRoom) : []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-50">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Mobile Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 lg:hidden">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Cập nhật chỉ số</h1>
              <p className="text-sm text-gray-500">Điện nước tháng {currentMonth}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cập nhật chỉ số điện nước</h1>
              <p className="text-gray-600">Quản lý và cập nhật chỉ số tiêu thụ điện nước</p>
            </div>
            <Button variant="outline" onClick={() => setShowPriceManager(!showPriceManager)}>
              <Calculator className="h-4 w-4 mr-2" />
              Quản lý giá
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-6 space-y-6">
          {/* Message */}
          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">{message.text}</span>
              </div>
            </div>
          )}

          {/* Price Manager */}
          {showPriceManager && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Quản lý giá điện nước
                </CardTitle>
                <CardDescription>Cập nhật giá để tính toán chính xác thành tiền</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Electric Price */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Điện</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm">Giá hiện tại</Label>
                        <div className="text-lg font-bold text-blue-600">{formatCurrency(prices.electric)}/kWh</div>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Nhập giá mới (VNĐ)"
                          value={newPrices.electric}
                          onChange={(e) => setNewPrices((prev) => ({ ...prev, electric: e.target.value }))}
                          className="flex-1"
                        />
                        <Button size="sm" onClick={() => handleUpdatePrice("electric")}>
                          Cập nhật
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Water Price */}
                  <div className="p-4 bg-cyan-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Droplets className="h-4 w-4 text-cyan-600" />
                      <span className="font-medium">Nước</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm">Giá hiện tại</Label>
                        <div className="text-lg font-bold text-cyan-600">{formatCurrency(prices.water)}/m³</div>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Nhập giá mới (VNĐ)"
                          value={newPrices.water}
                          onChange={(e) => setNewPrices((prev) => ({ ...prev, water: e.target.value }))}
                          className="flex-1"
                        />
                        <Button size="sm" onClick={() => handleUpdatePrice("water")}>
                          Cập nhật
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Price Manager Button - Mobile */}
          <div className="lg:hidden">
            <Button variant="outline" onClick={() => setShowPriceManager(!showPriceManager)} className="w-full">
              <Calculator className="h-4 w-4 mr-2" />
              {showPriceManager ? "Ẩn quản lý giá" : "Quản lý giá điện nước"}
            </Button>
          </div>

          {/* Update Form */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Nhập chỉ số mới
              </CardTitle>
              <CardDescription>Ngày cập nhật: {updateDate}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Room Selection */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label>Dãy phòng</Label>
                    <select
                      value={selectedBuilding}
                      onChange={(e) => {
                        setSelectedBuilding(e.target.value)
                        setSelectedRoom("")
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Tất cả dãy</option>
                      {buildings.map((building) => (
                        <option key={building} value={building}>
                          Dãy {building}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Phòng</Label>
                    <select
                      value={selectedRoom}
                      onChange={(e) => handleRoomChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Chọn phòng</option>
                      {filteredRooms.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.building}
                          {room.number} - {room.tenant}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Readings Input */}
                {selectedRoomData && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Electric Reading */}
                    <div className="p-4 bg-blue-50 rounded-lg space-y-3">
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-blue-900">Điện</h3>
                        <Badge variant="outline" className="ml-auto">
                          {formatCurrency(prices.electric)}/kWh
                        </Badge>
                      </div>

                      <div>
                        <Label className="text-sm">Chỉ số cũ</Label>
                        <Input
                          type="number"
                          value={selectedRoomData.lastElectricReading}
                          readOnly
                          className="bg-white"
                        />
                      </div>

                      <div>
                        <Label className="text-sm">Chỉ số mới</Label>
                        <Input
                          type="number"
                          value={newElectricReading}
                          onChange={(e) => setNewElectricReading(e.target.value)}
                          placeholder="Nhập chỉ số mới"
                          required
                        />
                      </div>

                      <div>
                        <Label className="text-sm">Tiêu thụ</Label>
                        <div className="px-3 py-2 bg-white border rounded-md font-semibold text-blue-600">
                          {electricConsumption} kWh
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm">Thành tiền</Label>
                        <div className="px-3 py-2 bg-blue-100 border rounded-md font-bold text-blue-700">
                          {formatCurrency(electricAmount)}
                        </div>
                      </div>

                      {electricConsumption > 0 && (
                        <div className="text-xs text-gray-600 bg-white p-2 rounded">
                          Tính toán: {electricConsumption} kWh × {formatCurrency(prices.electric)} ={" "}
                          {formatCurrency(electricAmount)}
                        </div>
                      )}
                    </div>

                    {/* Water Reading */}
                    <div className="p-4 bg-cyan-50 rounded-lg space-y-3">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-5 w-5 text-cyan-600" />
                        <h3 className="font-semibold text-cyan-900">Nước</h3>
                        <Badge variant="outline" className="ml-auto">
                          {formatCurrency(prices.water)}/m³
                        </Badge>
                      </div>

                      <div>
                        <Label className="text-sm">Chỉ số cũ</Label>
                        <Input type="number" value={selectedRoomData.lastWaterReading} readOnly className="bg-white" />
                      </div>

                      <div>
                        <Label className="text-sm">Chỉ số mới</Label>
                        <Input
                          type="number"
                          value={newWaterReading}
                          onChange={(e) => setNewWaterReading(e.target.value)}
                          placeholder="Nhập chỉ số mới"
                          required
                        />
                      </div>

                      <div>
                        <Label className="text-sm">Tiêu thụ</Label>
                        <div className="px-3 py-2 bg-white border rounded-md font-semibold text-cyan-600">
                          {waterConsumption} m³
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm">Thành tiền</Label>
                        <div className="px-3 py-2 bg-cyan-100 border rounded-md font-bold text-cyan-700">
                          {formatCurrency(waterAmount)}
                        </div>
                      </div>

                      {waterConsumption > 0 && (
                        <div className="text-xs text-gray-600 bg-white p-2 rounded">
                          Tính toán: {waterConsumption} m³ × {formatCurrency(prices.water)} ={" "}
                          {formatCurrency(waterAmount)}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Total Cost */}
                {selectedRoomData && totalAmount > 0 && (
                  <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <span className="font-semibold text-gray-900">Tổng tiền điện nước:</span>
                      </div>
                      <span className="text-2xl font-bold text-green-600">{formatCurrency(totalAmount)}</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      Điện: {formatCurrency(electricAmount)} + Nước: {formatCurrency(waterAmount)}
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full lg:w-auto" disabled={!selectedRoomData || totalAmount === 0}>
                  <Save className="h-4 w-4 mr-2" />
                  Cập nhật chỉ số {totalAmount > 0 && `(${formatCurrency(totalAmount)})`}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Reading History */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <History className="h-4 w-4" />
                Lịch sử chỉ số
              </CardTitle>
            </CardHeader>
            <CardContent>
              {roomReadings.length > 0 ? (
                <div className="space-y-3">
                  {roomReadings.map((reading) => (
                    <div key={reading.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">Tháng {reading.month}</h4>
                          <p className="text-sm text-gray-600">Cập nhật: {reading.date}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={reading.status === "Đã thanh toán" ? "default" : "secondary"}>
                            {reading.status}
                          </Badge>
                          <div className="text-lg font-bold text-green-600 mt-1">
                            {formatCurrency(reading.totalAmount)}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-blue-50 rounded">
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">Điện</span>
                          </div>
                          <p className="text-gray-600">
                            Chỉ số: {reading.oldElectric} → {reading.newElectric}
                          </p>
                          <p className="font-medium">Tiêu thụ: {reading.electricConsumption} kWh</p>
                          <p className="font-medium">Giá: {formatCurrency(reading.electricPrice)}/kWh</p>
                          <p className="font-bold text-blue-600">
                            Thành tiền: {formatCurrency(reading.electricAmount)}
                          </p>
                        </div>
                        <div className="p-3 bg-cyan-50 rounded">
                          <div className="flex items-center gap-2 mb-2">
                            <Droplets className="h-4 w-4 text-cyan-600" />
                            <span className="font-medium">Nước</span>
                          </div>
                          <p className="text-gray-600">
                            Chỉ số: {reading.oldWater} → {reading.newWater}
                          </p>
                          <p className="font-medium">Tiêu thụ: {reading.waterConsumption} m³</p>
                          <p className="font-medium">Giá: {formatCurrency(reading.waterPrice)}/m³</p>
                          <p className="font-bold text-cyan-600">Thành tiền: {formatCurrency(reading.waterAmount)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {selectedRoom ? "Chưa có lịch sử chỉ số" : "Chọn phòng để xem lịch sử"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
