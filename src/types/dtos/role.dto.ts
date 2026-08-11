import type { PaginationQueryParams } from "@/types/dtos/api.dto"

export type RoleDto = {
  id: number
  name: string
  description: string
  permissions: {
    all: boolean
  }
  schedules: string[]
}
export type GetRoleQueryDto = PaginationQueryParams

export type CreateRoleRequestDto = {
  name: string
  description: string
  permissions: {
    bookings: boolean
    schedules: boolean
    users: boolean
  }
}
