"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface ManagerProfile {
  QuanLiID: number
  SoDienThoaiDN: string
  MatKhauDN: string
  HoTenQuanLi: string
  DiaChiChiTiet: string
  GioiTinh: string
  NgaySinh: string
  Phuong: string
  Quan: string
  SoCCCD: string
  ThanhPho: string
  Email?: string
  ChucVu?: string
  NgayVaoLam?: string
  MoTa?: string
  Avatar?: string
  TenNhaTro?: string
  DiaChiNhaTro?: string
  SoGiayPhep?: string
  NgayCapGiayPhep?: string
}

interface HostelSettings {
  name: string
  address: string
  phone: string
  email: string
  businessLicense?: string
  businessLicenseDate?: string
  taxCode?: string
  bankAccount?: string
  bankName?: string
  representative?: string
  establishedDate?: string
  description?: string
}

interface ContractExtension {
  id: string
  extensionDate: string
  oldEndDate: string
  newEndDate: string
  extensionPeriod: number // số tháng gia hạn
  oldRent: number
  newRent: number
  rentIncreaseReason?: string
  notes?: string
  createdAt: string
}

// Thêm interface cho hình ảnh CCCD
interface CCCDImages {
  front?: string // base64 string
  back?: string // base64 string
}

// Cập nhật interface Contract để thêm hình ảnh CCCD
interface Contract {
  id: string
  roomId: string
  roomNumber: string
  building: string
  tenantName: string
  tenantPhone: string
  tenantEmail?: string
  tenantCCCD?: string
  tenantAddress?: string
  tenantCCCDImages?: CCCDImages // Thêm trường này
  contractStartDate: string
  contractEndDate: string
  monthlyRent: number
  deposit?: number
  contractType: string
  notes?: string
  // Thông tin quản lý (từ profile)
  managerName: string
  managerPhone: string
  managerEmail?: string
  managerCCCD: string
  managerAddress: string
  // Thông tin nhà trọ (từ settings/profile)
  hostelName: string
  hostelAddress: string
  hostelPhone: string
  hostelEmail: string
  hostelLicense?: string
  hostelLicenseDate?: string
  // Thông tin gia hạn
  extensions?: ContractExtension[]
  createdAt: string
  updatedAt: string
}

interface HostelContextType {
  managerProfile: ManagerProfile | null
  hostelSettings: HostelSettings | null
  contracts: Contract[]
  updateManagerProfile: (profile: ManagerProfile) => void
  updateHostelSettings: (settings: HostelSettings) => void
  addContract: (
    contract: Omit<
      Contract,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "managerName"
      | "managerPhone"
      | "managerEmail"
      | "managerCCCD"
      | "managerAddress"
      | "hostelName"
      | "hostelAddress"
      | "hostelPhone"
      | "hostelEmail"
      | "hostelLicense"
      | "hostelLicenseDate"
      | "extensions"
    >,
  ) => void
  updateContract: (id: string, contract: Partial<Contract>) => void
  extendContract: (id: string, extension: Omit<ContractExtension, "id" | "createdAt">) => void
  getContract: (id: string) => Contract | undefined
  deleteContract: (id: string) => void
}

const HostelContext = createContext<HostelContextType | undefined>(undefined)

const defaultManagerProfile: ManagerProfile = {
  QuanLiID: 6,
  SoDienThoaiDN: "0857870065",
  MatKhauDN: "$2b$10$Gu4wdRJtvsc0a4OjwneZ4.gn6.g68WNAVU9Epo3OdK8K6/pF1Uvky",
  HoTenQuanLi: "Phạm Ty",
  DiaChiChiTiet: "456 đường Nguyễn Văn Cừ",
  GioiTinh: "Nữ",
  NgaySinh: "2004-10-31T17:00:00.000Z",
  Phuong: "Bùi Hữu Nghĩa",
  Quan: "Bình Thủy",
  SoCCCD: "123456789012",
  ThanhPho: "Cần Thơ",
  Email: "phamty@email.com",
  ChucVu: "Quản lý nhà trọ",
  NgayVaoLam: "2023-01-15",
  MoTa: "Quản lý nhà trọ với 2 năm kinh nghiệm, chuyên về quản lý tài chính và chăm sóc khách hàng.",
  Avatar: "/placeholder.svg?height=120&width=120",
  TenNhaTro: "Nhà trọ Phạm Ty",
  DiaChiNhaTro: "456 đường Nguyễn Văn Cừ, Phường Bùi Hữu Nghĩa, Quận Bình Thủy, TP. Cần Thơ",
  SoGiayPhep: "GP-CT-2023-001",
  NgayCapGiayPhep: "2023-01-10",
}

const defaultHostelSettings: HostelSettings = {
  name: "Nhà trọ Phạm Ty",
  address: "456 đường Nguyễn Văn Cừ, Phường Bùi Hữu Nghĩa, Quận Bình Thủy, TP. Cần Thơ",
  phone: "0857870065",
  email: "phamty@email.com",
  businessLicense: "GP-CT-2023-001",
  businessLicenseDate: "2023-01-10",
  taxCode: "1234567890",
  representative: "Phạm Ty",
  establishedDate: "2023-01-01",
  description: "Nhà trọ chất lượng cao, phục vụ sinh viên và người lao động",
}

export function HostelProvider({ children }: { children: React.ReactNode }) {
  const [managerProfile, setManagerProfile] = useState<ManagerProfile | null>(null)
  const [hostelSettings, setHostelSettings] = useState<HostelSettings | null>(null)
  const [contracts, setContracts] = useState<Contract[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("managerProfile")
    const savedSettings = localStorage.getItem("hostelSettings")
    const savedContracts = localStorage.getItem("contracts")

    setManagerProfile(savedProfile ? JSON.parse(savedProfile) : defaultManagerProfile)
    setHostelSettings(savedSettings ? JSON.parse(savedSettings) : defaultHostelSettings)
    setContracts(savedContracts ? JSON.parse(savedContracts) : [])
  }, [])

  const updateManagerProfile = (profile: ManagerProfile) => {
    setManagerProfile(profile)
    localStorage.setItem("managerProfile", JSON.stringify(profile))

    // Cập nhật hostelSettings từ managerProfile
    const updatedSettings: HostelSettings = {
      name: profile.TenNhaTro || hostelSettings?.name || "",
      address: profile.DiaChiNhaTro || hostelSettings?.address || "",
      phone: profile.SoDienThoaiDN || hostelSettings?.phone || "",
      email: profile.Email || hostelSettings?.email || "",
      businessLicense: profile.SoGiayPhep || hostelSettings?.businessLicense || "",
      businessLicenseDate: profile.NgayCapGiayPhep || hostelSettings?.businessLicenseDate || "",
      taxCode: hostelSettings?.taxCode || "",
      bankAccount: hostelSettings?.bankAccount || "",
      bankName: hostelSettings?.bankName || "",
      representative: hostelSettings?.representative || "",
      establishedDate: hostelSettings?.establishedDate || "",
      description: hostelSettings?.description || "",
    }
    setHostelSettings(updatedSettings)
    localStorage.setItem("hostelSettings", JSON.stringify(updatedSettings))
  }

  const updateHostelSettings = (settings: HostelSettings) => {
    setHostelSettings(settings)
    localStorage.setItem("hostelSettings", JSON.stringify(settings))
  }

  const addContract = (
    contractData: Omit<
      Contract,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "managerName"
      | "managerPhone"
      | "managerEmail"
      | "managerCCCD"
      | "managerAddress"
      | "hostelName"
      | "hostelAddress"
      | "hostelPhone"
      | "hostelEmail"
      | "hostelLicense"
      | "hostelLicenseDate"
      | "extensions"
    >,
  ) => {
    const now = new Date().toISOString()
    const newContract: Contract = {
      ...contractData,
      id: Date.now().toString(),
      // Thông tin quản lý từ profile
      managerName: managerProfile?.HoTenQuanLi || "",
      managerPhone: managerProfile?.SoDienThoaiDN || "",
      managerEmail: managerProfile?.Email || "",
      managerCCCD: managerProfile?.SoCCCD || "",
      managerAddress:
        `${managerProfile?.DiaChiChiTiet}, ${managerProfile?.Phuong}, ${managerProfile?.Quan}, ${managerProfile?.ThanhPho}` ||
        "",
      // Thông tin nhà trọ từ settings/profile
      hostelName: hostelSettings?.name || managerProfile?.TenNhaTro || "",
      hostelAddress: hostelSettings?.address || managerProfile?.DiaChiNhaTro || "",
      hostelPhone: hostelSettings?.phone || managerProfile?.SoDienThoaiDN || "",
      hostelEmail: hostelSettings?.email || managerProfile?.Email || "",
      hostelLicense: hostelSettings?.businessLicense || managerProfile?.SoGiayPhep || "",
      hostelLicenseDate: hostelSettings?.businessLicenseDate || managerProfile?.NgayCapGiayPhep || "",
      createdAt: now,
      updatedAt: now,
    }

    const updatedContracts = [...contracts, newContract]
    setContracts(updatedContracts)
    localStorage.setItem("contracts", JSON.stringify(updatedContracts))
  }

  const updateContract = (id: string, contractData: Partial<Contract>) => {
    const updatedContracts = contracts.map((contract) =>
      contract.id === id ? { ...contract, ...contractData, updatedAt: new Date().toISOString() } : contract,
    )
    setContracts(updatedContracts)
    localStorage.setItem("contracts", JSON.stringify(updatedContracts))
  }

  const extendContract = (id: string, extensionData: Omit<ContractExtension, "id" | "createdAt">) => {
    const contract = contracts.find((c) => c.id === id)
    if (!contract) return

    const newExtension: ContractExtension = {
      ...extensionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    const updatedContract: Contract = {
      ...contract,
      contractEndDate: extensionData.newEndDate,
      monthlyRent: extensionData.newRent,
      extensions: [...(contract.extensions || []), newExtension],
      updatedAt: new Date().toISOString(),
    }

    const updatedContracts = contracts.map((c) => (c.id === id ? updatedContract : c))
    setContracts(updatedContracts)
    localStorage.setItem("contracts", JSON.stringify(updatedContracts))
  }

  const getContract = (id: string) => {
    return contracts.find((contract) => contract.id === id)
  }

  const deleteContract = (id: string) => {
    const updatedContracts = contracts.filter((contract) => contract.id !== id)
    setContracts(updatedContracts)
    localStorage.setItem("contracts", JSON.stringify(updatedContracts))
  }

  return (
    <HostelContext.Provider
      value={{
        managerProfile,
        hostelSettings,
        contracts,
        updateManagerProfile,
        updateHostelSettings,
        addContract,
        updateContract,
        extendContract,
        getContract,
        deleteContract,
      }}
    >
      {children}
    </HostelContext.Provider>
  )
}

export function useHostel() {
  const context = useContext(HostelContext)
  if (context === undefined) {
    throw new Error("useHostel must be used within a HostelProvider")
  }
  return context
}
