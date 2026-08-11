import type { PaginationQueryParams } from "@/types/dtos/api.dto"

import {
  DesignationResponse,
  DesignationRequest,
} from "@/types/dtos/designation.dto"

import { api } from "./api.config"

type GetDesignationParams = PaginationQueryParams

export const designationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDesignations: builder.query<DesignationResponse[], GetDesignationParams>(
      {
        query: (params) => ({
          url: "/v1/designations",
          method: "GET",
          params: {
            ...(params.page ? { page: params.page } : {}),
            ...(params.limit ? { limit: params.limit } : {}),
            ...(params.search ? { search: params.search } : {}),
            ...(params.status ? { status: params.status } : {}),
            ...(params.all !== undefined ? { all: params.all } : {}),
          },
        }),
        providesTags: ["Designations"],
      }
    ),

    getDesignationById: builder.query<DesignationResponse, number | string>({
      query: (id) => `/v1/designations/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Designations", id }],
    }),

    createDesignation: builder.mutation<void, DesignationRequest>({
      query: (body) => ({
        url: "/v1/designations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Designations"],
    }),

    editDesignation: builder.mutation<
      void,
      {
        id: number | string
        body: DesignationRequest
      }
    >({
      query: ({ id, body }) => ({
        url: `/v1/designations/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Designations"],
    }),

    deleteDesignation: builder.mutation<void, number | string>({
      query: (id) => ({
        url: `/v1/designations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Designations"],
    }),
  }),
})

export const {
  useGetDesignationsQuery,
  useLazyGetDesignationByIdQuery,
  useGetDesignationByIdQuery,
  useCreateDesignationMutation,
  useEditDesignationMutation,
  useDeleteDesignationMutation,
} = designationApi
