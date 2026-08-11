import type { PaginationQueryParams } from "@/types/dtos/api.dto"
import {
  BranchResourceRequest,
  BranchResourceResponse,
} from "@/types/dtos/resource.dto"

import { api } from "./api.config"

type GetResourcesParams = PaginationQueryParams & {
  tenantId?: string | number
  branchId?: string | number
}

export const resourceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getResources: builder.query<BranchResourceResponse[], GetResourcesParams>({
      query: (params) => ({
        url: "/v1/branch-resources",
        method: "GET",
        params: {
          ...(params.page ? { page: params.page } : {}),
          ...(params.limit ? { limit: params.limit } : {}),
          ...(params.search ? { search: params.search } : {}),
          ...(params.status ? { status: params.status } : {}),
          ...(params.all !== undefined ? { all: params.all } : {}),
          ...(params.tenantId ? { tenantId: params.tenantId } : {}),
          ...(params.branchId ? { branchId: params.branchId } : {}),
        },
      }),
      providesTags: ["Resources"],
    }),

    getResourceById: builder.query<BranchResourceResponse, number | string>({
      query: (id) => `/v1/branch-resources/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Resources", id }],
    }),

    createResource: builder.mutation<void, BranchResourceRequest>({
      query: (body) => ({
        url: "/v1/branch-resources",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Resources"],
    }),

    editResource: builder.mutation<
      void,
      {
        id: number | string
        body: BranchResourceRequest
      }
    >({
      query: ({ id, body }) => ({
        url: `/v1/branch-resources/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Resources"],
    }),

    deleteResource: builder.mutation<void, number | string>({
      query: (id) => ({
        url: `/v1/branch-resources/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Resources"],
    }),
  }),
})

export const {
  useGetResourcesQuery,
  useLazyGetResourceByIdQuery,
  useGetResourceByIdQuery,
  useCreateResourceMutation,
  useEditResourceMutation,
  useDeleteResourceMutation,
} = resourceApi
