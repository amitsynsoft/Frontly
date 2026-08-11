import type { PaginationQueryParams } from "@/types/dtos/api.dto"

export type BranchServiceDTO = {
  id: string
  tenantId: string
  branchId: string
  serviceId: string
  durationMinutes: string
  cost: string
  currencyId: string
  bookingMode: number
  maxCapacity: number
  images: string[]
  tags: string[]
  minAdvanceBookingDays: number
  isActive: boolean
  allowSendingReminder: boolean
  createdBy: string
  updatedBy: string
  createdAt: string
  updatedAt: string
  tenant: {
    id: string
    name: string
    status: string
  }
  branch: {
    id: string
    name: string
    isActive: boolean
  }
  serviceMaster: {
    id: string
    name: string
    description: string
  }
  currency: {
    id: string
    name: string
    symbol: string
  }
  resourceIds?: number[]
  resources?: {
    id: number
    name: string
  }[]
  levelCosts?: {
    id: number
    branchLevelId: number
    cost: string
    branchLevel: {
      id: number
      level: string
      description: string
    }
  }[]
}

export type GetBranchServiceQueryDto = PaginationQueryParams & {
  tenantId?: number
}

export type CreateBranchServiceRequestDto = {
  tenantId: number
  branchId: number
  serviceId: number
  durationMinutes: number
  cost: number
  currencyId: number
  bookingMode: number
  maxCapacity: number
  images: string[]
  tags?: string[]
  minAdvanceBookingDays: number
  isActive: boolean
  allowSendingReminder: boolean
  resourceIds?: number[]
  levelCosts?: {
    branchLevelId: number
    cost: number
  }[]
}

export type UpdateBranchServiceRequestDto =
  Partial<CreateBranchServiceRequestDto>

// export type GetServiceByIdResponseDto = {
//   id: number
//   companyId: number
//   serviceName: string
//   description: string
//   durationMinutes: number
//   amount: string
//   currencyId: number
//   bookingMode: number
//   maxCapacity: number
//   images: string[]
//   tags: string[]
//   maxAdvanceBookingDays: number
//   isActive: boolean
//   allowSendingReminder: boolean
//   allowsOneTimePayment: boolean
//   allowsRecurringPayment: boolean
//   createdBy: number
//   updatedBy: number
//   createdAt: string
//   updatedAt: string
//   company: {
//     id: number
//     name: string
//     status: string
//   }
//   currency: {
//     id: number
//     name: string
//     symbol: string
//   }
// }
