import type { PaginationQueryParams } from "@/types/dtos/api.dto"

export type SpecialityDto = {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}
export type GetSpecialityQueryDto = PaginationQueryParams

export type CreateSpecialityRequestDto = {
  name: string
}

export type UpdateSpecialityRequestDto = {
  name: string
}
