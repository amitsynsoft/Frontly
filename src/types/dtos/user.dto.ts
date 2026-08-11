import type { PaginationQueryParams } from "@/types/dtos/api.dto"
import { DesignationResponse } from "./designation.dto"

export type UserDTO = {
  id: number
  tenantId: number
  email: string
  fullName: string
  passwordHash: string
  otp: null
  isPasswordSet: boolean
  tenantUserLevelId: number
  tenantUserDesignationId?: number
  designation?: DesignationResponse
  profilePic: string
  status: "Active" | "InActive"
  bio: string
  createdAt: string
  updatedAt: string
  roles: [
    {
      id: number
      name: string
      description: string
      permissions: {
        bookings: string[]
        schedules: string[]
      }
      createdAt: string
      updatedAt: string
    },
  ]
  level: null
  branchServices: []
}

export type GetUserQueryDto = PaginationQueryParams & {
  tenantId?: number
}

export type CreateUserRequestDto = {
  tenantId: number
  email: string
  fullName: string
  // password: string
  tenantUserDesignationId?: number
  roleId: number
  tenantUserLevelId?: number
  profilePic: string
  status: "Active" | "InActive"
  bio: string
}
export type UpdateUserRequestDto = {
  tenantId: number
  email: string
  fullName: string
  // password: string
  tenantUserDesignationId?: number
  roleId: number
  tenantUserLevelId?: number
  profilePic: string
  status: "Active" | "InActive"
  bio: string
}
