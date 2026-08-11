import type { PaginationQueryParams } from "@/types/dtos/api.dto"

export type ServiceDTO = {
  id: string
  name: string
  description: string
}

export type GetServiceQueryDto = PaginationQueryParams & {
  tenantId?: number
}

export type CreateServiceRequestDto = {
  name: string
  description: string
}

export type UpdateServiceRequestDto = Partial<CreateServiceRequestDto>
