export type StaffServiceRequest = {
  tenantUserId: number
  branchServiceIds: number[]
}

export type UpdateStaffServiceRequest = {
  branchServiceIds: number[]
}

export type StaffServiceResponse = {
  id: number
  tenantUserId: number
  branchServiceId: number
  createdAt: string
  updatedAt: string

  tenantUser: {
    id: number
    email: string
    tenantId: number
    status: string
  }

  branchService: {
    id: number
    tenantId: number
    branchId: number
    serviceId: number
    durationMinutes: number
    cost: string

    currencyId?: number
    bookingMode?: number
    maxCapacity?: number
    images?: string[] | null
    tags?: string[] | null
    minAdvanceBookingDays?: number
    isActive?: boolean
    allowSendingReminder?: boolean
    createdBy?: number
    updatedBy?: number

    createdAt?: string
    updatedAt?: string

    branch: {
      id: number
      name: string
    }
  }
}
export type AvailabilitySlot = {
  id: string
  title: string
  type: "available" | "expired" | "booked"
  slot: string
  start: string
  end: string
  day: string
  timeSlot: string
  isExpired: boolean
  isAvailable: boolean
  backgroundColor: string
  borderColor: string
  textColor: string
}

export type AvailabilityResponse = {
  providerId: number
  startDate: string
  endDate: string
  availability: AvailabilitySlot[]
}