export type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
  meta?: ApiMeta
}

export type ApiMeta = {
  currentPage?: number
  page?: number
  limit?: number
  pageSize?: number
  totalItems?: number
  total?: number
  totalCount?: number
  totalPages?: number
}

export type ApiListResponse<TItem> = ApiResponse<TItem[]> | TItem[]

export const DEFAULT_PAGINATION_PARAMS = {
  page: 1,
  limit: 10,
  search: "",
  status: "",
  all: false,
} as const

export type PaginationParams = {
  page: number
  limit: number
  search: string
  status: string
  all: boolean
}

export type PaginationQueryParams = Partial<PaginationParams>

export type QueryParams = PaginationQueryParams & {
  organizationId?: string
  branchId?: string
}
