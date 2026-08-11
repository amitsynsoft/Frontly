import { baseApi } from "@/store/api/base-api"
import type {
  BranchServiceDTO,
  CreateBranchServiceRequestDto,
  GetBranchServiceQueryDto,
  UpdateBranchServiceRequestDto,
} from "@/types/dtos/branchservices.dto"

function getBranchServicesQueryParams(params: GetBranchServiceQueryDto | void) {
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

export const branchServiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBranchServices: builder.query<
      BranchServiceDTO[],
      GetBranchServiceQueryDto | void
    >({
      query: (params) => ({
        url: "/v1/branch-services/getAll",
        params: getBranchServicesQueryParams(params),
      }),
      providesTags: (result) => {
        const servicesList = Array.isArray(result)
          ? result
          : Array.isArray((result as any)?.result)
            ? (result as any).result
            : Array.isArray((result as any)?.data)
              ? (result as any).data
              : []

        return [
          { type: "BranchServices", id: "LIST" },
          ...servicesList.map((service: any) => ({
            type: "BranchServices" as const,
            id: service.id,
          })),
        ]
      },
    }),

    getBranchServiceById: builder.query<BranchServiceDTO, number | string>({
      query: (id) => `/v1/branch-services/getById/${id}`,
      providesTags: (_result, _error, id) => [{ type: "BranchServices", id }],
    }),

    createBranchService: builder.mutation<
      BranchServiceDTO,
      CreateBranchServiceRequestDto
    >({
      query: (body) => ({
        url: "/v1/branch-services/create-branch-service",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "BranchServices", id: "LIST" }],
    }),

    updateBranchService: builder.mutation<
      BranchServiceDTO,
      { id: number | string; body: UpdateBranchServiceRequestDto }
    >({
      query: ({ body, id }) => ({
        url: `/v1/branch-services/edit-branch-service/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "BranchServices", id },
        { type: "BranchServices", id: "LIST" },
      ],
    }),

    updateBranchServiceStatus: builder.mutation<
      BranchServiceDTO,
      { serviceId: string; isActive: boolean }
    >({
      query: ({ serviceId, isActive }) => ({
        url: `/v1/branch-services/update-status/${serviceId}`,
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: (_result, _error, { serviceId }) => [
        { type: "BranchServices", id: serviceId },
        { type: "BranchServices", id: "LIST" },
      ],
    }),

    deleteBranchService: builder.mutation<void, number | string>({
      query: (id) => ({
        url: `/v1/branch-services/delete-branch-service/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "BranchServices", id },
        { type: "BranchServices", id: "LIST" },
      ],
    }),
  }),
})

export const {
  useGetBranchServicesQuery,
  useLazyGetBranchServicesQuery,
  useCreateBranchServiceMutation,
  useUpdateBranchServiceMutation,
  useUpdateBranchServiceStatusMutation,
  useDeleteBranchServiceMutation,
  useGetBranchServiceByIdQuery,
  useLazyGetBranchServiceByIdQuery,
} = branchServiceApi
