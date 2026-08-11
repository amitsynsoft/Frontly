import type { PaginationQueryParams } from "@/types/dtos/api.dto"
import {
  StaffServiceRequest,
  StaffServiceResponse,
  UpdateStaffServiceRequest,
} from "@/types/dtos/staff-service.dto"

import { api } from "./api.config"

type GetStaffServicesParams = PaginationQueryParams & {
  tenantId?: string
  tenantUserId?: number
  branchServiceId?: number
}

export const staffServiceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStaffServices: builder.query<
      StaffServiceResponse[],
      GetStaffServicesParams
    >({
      query: (params) => ({
        url: "/v1/staff-services",
        method: "GET",
        params: {
          ...(params.page ? { page: params.page } : {}),
          ...(params.limit ? { limit: params.limit } : {}),
          ...(params.search ? { search: params.search } : {}),
          ...(params.status ? { status: params.status } : {}),
          ...(params.all !== undefined ? { all: params.all } : {}),
          ...(params.tenantId ? { tenantId: params.tenantId } : {}),
          ...(params.tenantUserId ? { tenantUserId: params.tenantUserId } : {}),
          ...(params.branchServiceId
            ? { branchServiceId: params.branchServiceId }
            : {}),
        },
      }),
      providesTags: ["StaffServices"],
    }),

    getStaffServiceById: builder.query<StaffServiceResponse, number | string>({
      query: (id) => `/v1/staff-services/${id}`,
      providesTags: (_result, _error, id) => [{ type: "StaffServices", id }],
    }),

    createStaffService: builder.mutation<void, StaffServiceRequest>({
      query: (body) => ({
        url: "/v1/staff-services",
        method: "POST",
        body,
      }),
      invalidatesTags: ["StaffServices"],
    }),

    updateStaffService: builder.mutation<
      void,
      {
        tenantUserId: number | string
        body: UpdateStaffServiceRequest
      }
    >({
      query: ({ tenantUserId, body }) => ({
        url: `/v1/staff-services/${tenantUserId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["StaffServices"],
    }),

    deleteStaffService: builder.mutation<void, number | string>({
      query: (id) => ({
        url: `/v1/staff-services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["StaffServices"],
    }),
  }),
})

export const {
  useGetStaffServicesQuery,
  useLazyGetStaffServiceByIdQuery,
  useGetStaffServiceByIdQuery,
  useCreateStaffServiceMutation,
  useUpdateStaffServiceMutation,
  useDeleteStaffServiceMutation,
} = staffServiceApi
