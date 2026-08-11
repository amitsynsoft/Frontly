import type { PaginationQueryParams } from "@/types/dtos/api.dto"
import {
  ResourceTypeRequest,
  ResourceTypeResponse,
} from "@/types/dtos/resource-master.dto"

import { api } from "./api.config"

type GetResourceTypesParams = PaginationQueryParams

export const resourceMasterApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getResourceTypes: builder.query<
      ResourceTypeResponse[],
      GetResourceTypesParams
    >({
      query: (params) => ({
        url: "/v1/resource-types",
        method: "GET",
        params: {
          ...(params.page ? { page: params.page } : {}),
          ...(params.limit ? { limit: params.limit } : {}),
          ...(params.search ? { search: params.search } : {}),
          ...(params.status ? { status: params.status } : {}),
          ...(params.all !== undefined ? { all: params.all } : {}),
        },
      }),
      providesTags: ["ResourceTypes"],
    }),

    getResourceTypeById: builder.query<ResourceTypeResponse, number | string>({
      query: (id) => `/v1/resource-types/${id}`,
      providesTags: (_result, _error, id) => [{ type: "ResourceTypes", id }],
    }),

    createResourceType: builder.mutation<void, ResourceTypeRequest>({
      query: (body) => ({
        url: "/v1/resource-types",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ResourceTypes"],
    }),

    editResourceType: builder.mutation<
      void,
      {
        id: number | string
        body: ResourceTypeRequest
      }
    >({
      query: ({ id, body }) => ({
        url: `/v1/resource-types/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["ResourceTypes"],
    }),

    deleteResourceType: builder.mutation<void, number | string>({
      query: (id) => ({
        url: `/v1/resource-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ResourceTypes"],
    }),
  }),
})

export const {
  useGetResourceTypesQuery,
  useLazyGetResourceTypeByIdQuery,
  useGetResourceTypeByIdQuery,
  useCreateResourceTypeMutation,
  useEditResourceTypeMutation,
  useDeleteResourceTypeMutation,
} = resourceMasterApi
