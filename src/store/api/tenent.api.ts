import type { PaginationQueryParams } from "@/types/dtos/api.dto"
import {
  GetAllTenents,
  GetTenantByIdResponseDto,
  TenantRequest,
} from "@/types/dtos/tenent.dto"

import { api } from "./api.config"

export const adminCompanyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCompanies: builder.query<GetAllTenents[], PaginationQueryParams | void>({
      query: (params) => ({
        url: "/v1/tenants/getAll",
        method: "GET",
        params: params
          ? {
              ...(params.page ? { page: params.page } : {}),
              ...(params.limit ? { limit: params.limit } : {}),
              ...(params.search ? { search: params.search } : {}),
              ...(params.status ? { status: params.status } : {}),
              ...(params.all !== undefined ? { all: params.all } : {}),
            }
          : undefined,
      }),
      providesTags: ["Organizations"],
    }),

    getCompanyById: builder.query<GetTenantByIdResponseDto, number | string>({
      query: (id) => `/v1/tenants/getById/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Organizations", id }],
    }),

    createCompany: builder.mutation<void, TenantRequest>({
      query: (body) => ({
        url: "/v1/tenants/create-tenant",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Organizations"],
    }),

    updateCompany: builder.mutation<
      GetAllTenents,
      { id: string; body: TenantRequest }
    >({
      query: ({ id, body }) => ({
        url: `/v1/tenants/edit-tenant/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Organizations"],
    }),

    updateCompanyStatus: builder.mutation<
      any,
      { companyId: string; status: "Active" | "InActive" }
    >({
      query: ({ companyId, status }) => ({
        url: `/v1/tenants/update-status/${companyId}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Organizations"],
    }),

    deleteCompany: builder.mutation<any, string>({
      query: (id) => ({
        url: `/v1/tenants/delete-tenant/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Organizations"],
    }),
  }),
})

export const {
  useGetCompaniesQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useUpdateCompanyStatusMutation,
  useDeleteCompanyMutation,
  useGetCompanyByIdQuery,
  useLazyGetCompanyByIdQuery,
} = adminCompanyApi
