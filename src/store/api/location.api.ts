import type { PaginationQueryParams } from "@/types/dtos/api.dto"
import {
  GetLocationByIdResponseDto,
  LocationRequest,
} from "@/types/dtos/location.dto"

import { api } from "./api.config"

type GetLocationsParams = PaginationQueryParams & {
  tenantId?: string
}

export const locationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getLocations: builder.query<any, GetLocationsParams>({
      query: (params) => ({
        url: `/v1/branches/getAll`,
        method: "GET",
        params: {
          ...(params.page ? { page: params.page } : {}),
          ...(params.limit ? { limit: params.limit } : {}),
          ...(params.search ? { search: params.search } : {}),
          ...(params.tenantId ? { tenantId: params.tenantId } : {}),
          ...(params.status ? { status: params.status } : {}),
          ...(params.all !== undefined ? { all: params.all } : {}),
        },
      }),
      providesTags: ["Locations"],
    }),

    getLocationById: builder.query<GetLocationByIdResponseDto, number | string>(
      {
        query: (id) => `/v1/branches/getById/${id}`,
        providesTags: (_result, _error, id) => [{ type: "Locations", id }],
      }
    ),

    createLocation: builder.mutation<any, LocationRequest>({
      query: (body) => ({
        url: "/v1/branches/create-branch",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Locations"],
    }),

    editLocation: builder.mutation<
      any,
      { locationId: string; body: LocationRequest }
    >({
      query: ({ locationId, body }) => ({
        url: `/v1/branches/edit-branch/${locationId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Locations"],
    }),
    updateLocationStatus: builder.mutation<
      any,
      { locationId: string; isActive: boolean }
    >({
      query: ({ locationId, isActive }) => ({
        url: `/v1/branches/update-status/${locationId}`,
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: ["Locations"],
    }),

    deleteLocation: builder.mutation<any, string>({
      query: (locationId) => ({
        url: `/v1/branches/delete-branch/${locationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Locations"],
    }),
  }),
})

export const {
  useGetLocationsQuery,
  useCreateLocationMutation,
  useEditLocationMutation,
  useUpdateLocationStatusMutation,
  useDeleteLocationMutation,
  useGetLocationByIdQuery,
  useLazyGetLocationByIdQuery,
} = locationApi
