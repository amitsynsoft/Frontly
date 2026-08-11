import { baseApi } from "@/store/api/base-api"
import type {
  CreateTenantUserLevelRequestDto,
  GetTenantUserLevelQueryDto,
  TenantUserLevelDto,
} from "@/types/dtos/tenant-user-levels.dto"

function getTenantUserLevelQueryParams(
  params: GetTenantUserLevelQueryDto | void
) {
  if (!params) {
    return undefined
  }

  return {
    ...(params.page ? { page: params.page } : {}),
    ...(params.limit ? { limit: params.limit } : {}),
    ...(params.search ? { search: params.search } : {}),
    ...(params.status ? { status: params.status } : {}),
    ...(params.all !== undefined ? { all: params.all } : {}),
    ...(params.tenantId ? { tenantId: params.tenantId } : {}),
  }
}

export const tenantUserLevelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTenantUserLevels: builder.query<
      TenantUserLevelDto[],
      GetTenantUserLevelQueryDto | void
    >({
      query: (params) => ({
        url: "/v1/tenant-user-levels",
        params: getTenantUserLevelQueryParams(params),
      }),
      providesTags: (result) => {
        const tenantUserLevelsList = Array.isArray(result)
          ? result
          : Array.isArray((result as any)?.result)
            ? (result as any).result
            : Array.isArray((result as any)?.data)
              ? (result as any).data
              : []

        return [
          { type: "TenantUserLevel", id: "LIST" },
          ...tenantUserLevelsList.map((tenantUserLevel: any) => ({
            type: "TenantUserLevel" as const,
            id: tenantUserLevel.id,
          })),
        ]
      },
    }),

    getTenantUserLevelById: builder.query<TenantUserLevelDto, number | string>({
      query: (id) => `/v1/tenant-user-levels/${id}`,
      providesTags: (_result, _error, id) => [{ type: "TenantUserLevel", id }],
    }),

    createTenantUserLevel: builder.mutation<
      TenantUserLevelDto,
      CreateTenantUserLevelRequestDto
    >({
      query: (body) => ({
        url: "/v1/tenant-user-levels",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "TenantUserLevel", id: "LIST" }],
    }),

    updateTenantUserLevel: builder.mutation<
      TenantUserLevelDto,
      { id: number | string; body: CreateTenantUserLevelRequestDto }
    >({
      query: ({ body, id }) => ({
        url: `/v1/tenant-user-levels/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "TenantUserLevel", id },
        { type: "TenantUserLevel", id: "LIST" },
      ],
    }),
    deleteTenantUserLevel: builder.mutation<void, number | string>({
      query: (id) => ({
        url: `/v1/tenant-user-levels/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "TenantUserLevel", id },
        { type: "TenantUserLevel", id: "LIST" },
      ],
    }),
  }),
})

export const {
  useCreateTenantUserLevelMutation,
  useDeleteTenantUserLevelMutation,
  useLazyGetTenantUserLevelByIdQuery,
  useGetTenantUserLevelsQuery,
  useUpdateTenantUserLevelMutation,
} = tenantUserLevelApi
