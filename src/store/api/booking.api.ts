import {
  CancelCustomerBookingRequestDto,
  CreateCustomerBookingRequestDto,
  CustomerBookingDto,
  GetCustomerBookingQueryDto,
  UpdateCustomerBookingStatusRequestDto,
} from "@/types/dtos/booking.dto"

import { api } from "./api.config"

export const customerBookingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCustomerBookings: builder.query<
      CustomerBookingDto[],
      GetCustomerBookingQueryDto
    >({
      query: (params) => ({
        url: "/v1/customer-bookings",
        method: "GET",
        params: {
          ...(params.page ? { page: params.page } : {}),
          ...(params.limit ? { limit: params.limit } : {}),
          ...(params.search ? { search: params.search } : {}),
          ...(params.status ? { status: params.status } : {}),
          ...(params.all !== undefined ? { all: params.all } : {}),
          ...(params.tenantId ? { tenantId: params.tenantId } : {}),
          ...(params.branchId ? { branchId: params.branchId } : {}),
          ...(params.customerId ? { customerId: params.customerId } : {}),
          ...(params.tenantUserId ? { tenantUserId: params.tenantUserId } : {}),
          ...(params.startDate ? { startDate: params.startDate } : {}),
          ...(params.endDate ? { endDate: params.endDate } : {}),
        },
      }),
      providesTags: ["CustomerBookings"],
    }),

    getCustomerBookingById: builder.query<CustomerBookingDto, number | string>({
      query: (id) => `/v1/customer-bookings/${id}`,
      providesTags: (_result, _error, id) => [
        { type: "CustomerBookings", id },
      ],
    }),

    createCustomerBooking: builder.mutation<
      void,
      CreateCustomerBookingRequestDto
    >({
      query: (body) => ({
        url: "/v1/customer-bookings",
        method: "POST",
        body,
      }),
      invalidatesTags: ["CustomerBookings"],
    }),

    cancelCustomerBooking: builder.mutation<
      void,
      {
        id: number | string
        body: CancelCustomerBookingRequestDto
      }
    >({
      query: ({ id, body }) => ({
        url: `/v1/customer-bookings/${id}/cancel`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["CustomerBookings"],
    }),

    updateCustomerBookingStatus: builder.mutation<
      void,
      {
        id: number | string
        body: UpdateCustomerBookingStatusRequestDto
      }
    >({
      query: ({ id, body }) => ({
        url: `/v1/customer-bookings/${id}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["CustomerBookings"],
    }),
  }),
})

export const {
  useGetCustomerBookingsQuery,
  useLazyGetCustomerBookingByIdQuery,
  useGetCustomerBookingByIdQuery,
  useCreateCustomerBookingMutation,
  useCancelCustomerBookingMutation,
  useUpdateCustomerBookingStatusMutation,
} = customerBookingApi