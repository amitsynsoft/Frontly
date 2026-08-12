import type { PaginationQueryParams } from "@/types/dtos/api.dto"

export interface StaffScheduleRequest {
  tenantUserId: string
  branchId: string
  scheduleDate: string
  rruleUntil: string
  rrule: string[]
}

export interface StaffScheduleResponse {
  id: number | string
  tenantUserId: string
  branchId: string
  scheduleDate: string
  isRepeat: boolean
  repeatDayOfWeek?: string
  rruleUntil?: string
  rrule?: string[]
  status?: string
  createdAt?: string
  updatedAt?: string
}

export interface GetStaffSchedulesParams extends PaginationQueryParams {
  tenantId?: string
  tenantUserId?: string
  branchId?: string
  startDate?: string
  endDate?: string
  status?: string
  all?: boolean
}
