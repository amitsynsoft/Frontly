export interface ApiBookingCustomer {
  id: number
  tenantId: number
  preferredBranchId: number
  fullName: string
  phone: string
  isActive: boolean
  otp?: string
  createdAt: string
  updatedAt: string
}

export interface ApiBookingBranch {
  id: number
  tenantId: number
  name: string
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  latitude: string
  longitude: string
  timezone: string
  frontdeskNumber: string
  mobileNumber: string
  tollFreeNumber: string
  email: string
  description: string
  operatingHours: Record<string, any>
  isActive: boolean
  metadata: {
    parking: boolean
    facilities: string[]
    wheelchairAccessible: boolean
  }
  createdAt: string
  updatedAt: string
}

export interface ApiBookingType {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

export interface ApiBookingCurrency {
  id: number
  name: string
  symbol: string
  createdAt: string
  updatedAt: string
}

export interface ApiBookingService {
  id: number
  tenantId: number
  branchId: number
  customerBookingId: number
  branchServicesId: number
  serviceName: string
  tenantUserId: number
  tenantUserLevelId: number | null
  branchResourceId: number | null
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
    createdAt: string
    updatedAt: string
  }
}

export interface ApiBookingPayment {
  id: number
  customerBookingId: number
  amount: string
  currencyId: number
  transactionDate: string
  paymentMethod: string
  transactionId: string | null
  transactionStatus: string
  createdAt: string
  updatedAt: string
}

export interface ApiBooking {
  id: number
  bookingTypeId: number
  tenantId: number
  branchId: number
  customerId: number
  bookingDate: string
  totalDurationInMinutes: number
  scheduleDays: any | null
  status: string
  subTotalAmount: string
  taxAmount: string
  discountAmount: string
  finalAmount: string
  currencyId: number
  isCancelled: boolean
  cancellationDate: string | null
  cancellationReason: string | null
  cancelledUsing: string | null
  cancelledBy: string | null
  paymentStatus: string
  notes: string | null
  bookingNumber: string
  createdAt: string
  updatedAt: string
  customer: ApiBookingCustomer
  branch: ApiBookingBranch
  bookingType: ApiBookingType
  currency: ApiBookingCurrency
  bookingServices: ApiBookingService[]
  payments: ApiBookingPayment[]
}
