import { baseApi } from "@/store/api/base-api"
import type {
  CreateServiceRequestDto,
  GetServiceQueryDto,
  ServiceDTO,
  UpdateServiceRequestDto,
} from "@/types/dtos/services.dto"

function getServicesQueryParams(params: GetServiceQueryDto | void) {
  if (!params) {
    return undefined
  }

  return {
    ...(params.page ? { page: params.page } : {}),
    ...(params.limit ? { limit: params.limit } : {}),
    ...(params.search ? { search: params.search } : {}),
    ...(params.status ? { status: params.status } : {}),
    ...(params.all !== undefined ? { all: params.all } : {}),
  }
}

export const serviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query<ServiceDTO[], GetServiceQueryDto | void>({
      query: (params) => ({
        url: "/v1/services/getAll",
        params: getServicesQueryParams(params),
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
          { type: "Services", id: "LIST" },
          ...servicesList.map((service: any) => ({
            type: "Services" as const,
            id: service.id,
          })),
        ]
      },
    }),

    getServiceById: builder.query<ServiceDTO, number | string>({
      query: (id) => `/v1/services/getById/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Services", id }],
    }),

    createService: builder.mutation<ServiceDTO, CreateServiceRequestDto>({
      query: (body) => ({
        url: "/v1/services/create-service",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Services", id: "LIST" }],
    }),

    updateService: builder.mutation<
      ServiceDTO,
      { id: number | string; body: UpdateServiceRequestDto }
    >({
      query: ({ body, id }) => ({
        url: `/v1/services/edit-service/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Services", id },
        { type: "Services", id: "LIST" },
      ],
    }),
    deleteService: builder.mutation<void, number | string>({
      query: (id) => ({
        url: `/v1/services/delete-service/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Services", id },
        { type: "Services", id: "LIST" },
      ],
    }),
  }),
})

export const {
  useCreateServiceMutation,
  useDeleteServiceMutation,
  useGetServiceByIdQuery,
  useGetServicesQuery,
  useUpdateServiceMutation,
} = serviceApi
