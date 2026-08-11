import type {
  GetStaffSchedulesParams,
  StaffScheduleRequest,
  StaffScheduleResponse,
} from "@/types/dtos/staff-schedule.dto"

import { api } from "./api.config"

export const staffScheduleApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStaffSchedules: builder.query<any, GetStaffSchedulesParams>({
      query: ({
        page = 1,
        limit = 10,
        search,
        status,
        all,
        tenantId,
        tenantUserId,
        branchId,
        startDate,
        endDate,
      }) => ({
        url: "/v1/staff-schedules/getAll",
        method: "GET",
        params: {
          page,
          limit,
          search,
          status,
          all,
          tenantId,
          tenantUserId,
          branchId,
          startDate,
          endDate,
        },
      }),
      providesTags: ["StaffSchedule"],
    }),

    getStaffScheduleById: builder.query<any, string>({
      query: (id) => ({
        url: `/v1/staff-schedules/getById/${id}`,
        method: "GET",
      }),
      providesTags: ["StaffSchedule"],
    }),

    createStaffSchedule: builder.mutation<any, StaffScheduleRequest>({
      query: (body) => ({
        url: "/v1/staff-schedules/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["StaffSchedule"],
    }),

    getServiceAvailability: builder.query<
      any,
      {
        userId: string
        startDate: string
        endDate: string
        timezone?: string
        elevenlabs?: boolean
        branchId?: string
      }
    >({
      query: ({
        userId,
        startDate,
        endDate,
        timezone,
        elevenlabs,
        branchId,
      }) => ({
        url: `/v1/services/${userId}/availability`,
        method: "GET",
        params: {
          startDate,
          endDate,
          timezone,
          elevenlabs,
          branchId,
        },
      }),
    }),

    updateStaffSchedule: builder.mutation<
      any,
      {
        id: string
        data: StaffScheduleRequest
      }
    >({
      query: ({ id, data }) => ({
        url: `/v1/staff-schedules/edit/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["StaffSchedule"],
    }),

    deleteStaffSchedule: builder.mutation<any, string>({
      query: (id) => ({
        url: `/v1/staff-schedules/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["StaffSchedule"],
    }),
  }),
})

export const {
  useGetStaffSchedulesQuery,
  useGetServiceAvailabilityQuery,
  useGetStaffScheduleByIdQuery,
  useCreateStaffScheduleMutation,
  useUpdateStaffScheduleMutation,
  useDeleteStaffScheduleMutation,
} = staffScheduleApi
