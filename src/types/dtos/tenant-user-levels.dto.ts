import type { PaginationQueryParams } from "@/types/dtos/api.dto"

export type TenantUserLevelDto = {
  id: number
  tenantId: number
  level: string
  description: string
  createdAt: string
  updatedAt: string
  tenant: {
    id: number
    name: string
    status: string
  }
}
export type GetTenantUserLevelQueryDto = PaginationQueryParams & {
  tenantId?: number
}

export type CreateTenantUserLevelRequestDto = {
  tenantId: number
  level: string
  description: string
}

export type UpdateTenantUserLevelRequestDto = CreateTenantUserLevelRequestDto
