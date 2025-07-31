"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Building2,
  Menu,
  Download,
  Filter,
} from "lucide-react"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { Sidebar } from "@/components/sidebar"

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(0)}M VNĐ`
  }
  return `${value.toLocaleString("vi-VN")} VNĐ`
}

const SimpleBarChart = ({ data }: { data: any[] }) => {
  const maxValue = Math.max(
    ...data.map((d) => Math.max(d.revenue || 0, d.expenses || 0))
  )

  return (
    <div className="h-80 w-full">
      <div className="space-y-4 p-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>{item.month}</span>
              <span>{formatCurrency(item.revenue)}</span>
            </div>
            <div className="flex gap-2 h-8">
              <div
                className="bg-blue-500 rounded flex items-center justify-center text-white text-xs font-medium"
                style={{ width: `${(item.revenue / maxValue) * 100}%` }}
              >
                {item.revenue > maxValue * 0.3 && "DT"}
              </div>
              <div
                className="bg-red-500 rounded flex items-center justify-center text-white text-xs font-medium"
                style={{ width: `${(item.expenses / maxValue) * 100}%` }}
              >
                {item.expenses > maxValue * 0.2 && "CP"}
              </div>
            </div>
          </div>
        ))}
        <div className="flex gap-4 text-sm mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Doanh thu</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Chi phí</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const SimpleLineChart = ({ data }: { data: any[] }) => {
  return (
    <div className="h-80 w-full">
      <div className="space-y-4 p-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="w-8 text-sm font-medium">{item.month}</div>
            <div className="flex-1 flex gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>Đã thuê</span>
                  <span className="font-medium text-green-600">{item.occupied}%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{ width: `${item.occupied}%` }}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>Trống</span>
                  <span className="font-medium text-orange-600">{item.vacant}%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-orange-500 h-3 rounded-full"
                    style={{ width: `${item.vacant}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const SimpleColumnChart = ({ data }: { data: any[] }) => {
  const maxValue = Math.max(...data.map((item) => item.value))

  return (
    <div className="h-80 w-full p-4 flex flex-col justify-end">
      <div className="flex items-end gap-4 h-full">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className="bg-blue-500 w-full rounded-t"
              style={{
                height: `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color,
              }}
              title={`${item.name}: ${formatCurrency(item.value)}`}
            ></div>
            <span className="mt-2 text-sm font-medium text-center">{item.name}</span>
            <span className="text-xs text-gray-500">{formatCurrency(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SimpleColumnChart;
