import type { PaginationQueryParams } from "@/types/dtos/api.dto"

export type StaffRoleDto = {
  id: number
  name: string
  description: string
  permissions: Record<string, string[]>
  createdAt: string
  updatedAt: string
  UserRole?: {
    id: number
    userId: number
    roleId: number
    companyId: number
    isActive: boolean
    createdAt: string
    updatedAt: string
  }
}

export type StaffUserDto = {
  id: number
  username: string
  email: string
  passwordHash?: string
  fullName: string
  phone: string
  isActive: boolean
  lastLogin: string | null
  otp: string | null
  isPasswordSet: boolean
  createdAt: string
  updatedAt: string
  roles: StaffRoleDto[]
}

export type StaffLocationDto = {
  id: number
  companyId: number
  name: string
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  latitude: string
  longitude: string
  timezone: string
  phone: string
  tollFreeNumber: string
  email: string
  description: string
  operatingHours: string
  isActive: boolean
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export type StaffSpecialityDto = {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

export type StaffServiceDto = {
  id: number
  companyId: number
  serviceName: string
  description: string
  durationMinutes: number
  amount: string
  currencyId: number
  bookingMode: number
  maxCapacity: number
  images: string[]
  tags: string[]
  maxAdvanceBookingDays: number
  isActive: boolean
  allowSendingReminder: boolean
  allowsOneTimePayment: boolean
  allowsRecurringPayment: boolean
  createdBy: number
  updatedBy: number
  createdAt: string
  updatedAt: string
  StaffService: {
    id: number
    staffId: number
    serviceId: number
    durationMinutes: number
    amount: string
    currencyId: number
    createdAt: string
    updatedAt: string
  }
}

export type StaffDto = {
  id: number
  userId: number
  companyLocationId: number
  companyId: number
  profilePic: string
  status: string
  bio: string
  createdAt: string
  updatedAt: string
  user: StaffUserDto
  location: StaffLocationDto | null
  specialityIds?: number[]
  serviceIds?: number[]
  specialities?: StaffSpecialityDto[]
  services?: StaffServiceDto[]
}

export type GetStaffQueryDto = PaginationQueryParams & {
  companyId?: number | string
}

export type CreateStaffRequestDto = {
  username: string
  email: string
  fullName: string
  phone: string
  password: string
  companyLocationId: number
  companyId: number
  profilePic: string
  bio: string
  specialityIds?: number[]
  serviceIds?: number[]
}

export type UpdateStaffRequestDto = {
  username: string
  email: string
  fullName: string
  phone: string
  password?: string
  companyLocationId: number
  companyId: number
  profilePic: string
  bio: string
  status: string
  specialityIds?: number[]
  serviceIds?: number[]
}
