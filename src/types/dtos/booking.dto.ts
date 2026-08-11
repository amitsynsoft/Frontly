import type { PaginationQueryParams } from "@/types/dtos/api.dto"

export type GetCustomerBookingQueryDto = PaginationQueryParams & {
  tenantId?: number
  branchId?: number
  customerId?: number
  tenantUserId?: number
  startDate?: string
  endDate?: string
}

export type CustomerDto = {
  id: number
  tenantId: number
  preferredBranchId?: number
  fullName: string
  phone: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type BranchDto = {
  id: number
  tenantId: number
  name: string
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  frontdeskNumber?: string
  mobileNumber?: string
  tollFreeNumber?: string
  email?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  metadata?: {
    parking?: boolean
    facilities?: string[]
    wheelchairAccessible?: boolean
  }
}

export type BookingTypeDto = {
  id: number
  name: string
}

export type CurrencyDto = {
  id: number
  name: string
  symbol: string
}

export type BookingServiceResponseDto = {
  id: number
  tenantId: number
  branchId: number
  customerBookingId: number
  branchServicesId: number
  serviceName: string
  tenantUserId: number
  tenantUserLevelId?: number | null
  branchResourceId?: number | null
  appointmentDate: string
  durationInMinutes: number
  startTime: string
  endTime: string
  cost: string
  discountAmount: string
  finalCost: string
  status: string
  currencyId: number
  createdAt: string
  updatedAt: string
  tenantUser?: {
    id: number
    tenantId: number
    email: string
    fullName: string
    profilePic: string
    status: string
    bio: string
  }
  tags?: string[]
  branchService?: {
    id: number
    name: string
    tags?: string[]
  }
  branchResource?: {
    id: number
    name: string
  }
}

export type PaymentDto = {
  id: number
  customerBookingId: number
  amount: string
  currencyId: number
  transactionDate: string
  paymentMethod: string
  transactionStatus: string
}

export type CustomerBookingDto = {
  id: number
  tenantId: number
  branchId: number
  customerId: number
  bookingTypeId: number
  currencyId: number
  status: string
  notes?: string
  paymentMethod?: string
  createdAt: string
  updatedAt: string

  // Keep compatibility with old code
  services?: BookingServiceDto[]

  // Rich metadata from new GET response
  bookingServices?: BookingServiceResponseDto[]
  customer?: CustomerDto
  branch?: BranchDto
  bookingType?: BookingTypeDto
  currency?: CurrencyDto
  payments?: PaymentDto[]

  // Core properties
  bookingDate?: string
  totalDurationInMinutes?: number
  subTotalAmount?: string
  taxAmount?: string
  discountAmount?: string
  finalAmount?: string
  isCancelled?: boolean
  cancellationDate?: string | null
  cancellationReason?: string | null
  cancelledUsing?: string | null
  cancelledBy?: string | null
  paymentStatus?: string
  bookingNumber?: string
}

export type BookingServiceDto = {
  branchServicesId: number
  tenantUserId: number
  tenantUserLevelId: number
  branchResourceId: number
  appointmentDate: string
  startTime: string
}

export type CreateCustomerBookingRequestDto = {
  tenantId: number
  branchId: number
  customerId: number
  bookingTypeId: number
  currencyId: number

  services: {
    branchServicesId: number
    tenantUserId: number
    branchResourceId: number
    appointmentDate: string
    startTime: string
  }[]
  notes?: string
}

export type CancelCustomerBookingRequestDto = {
  cancellationReason: string
  cancelledUsing: string
  cancelledBy: string
}

export type UpdateCustomerBookingStatusRequestDto = {
  status: string
}
