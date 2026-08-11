import type {
  CheckSubscriptionResponseDTO,
  CurrentSubscriptionDTO,
  SubscribeTenantRequestDTO,
  SubscribeTenantResponseDTO,
  SubscriptionPlanDTO,
} from "@/types/dtos/subscription.dto"

import { api } from "./api.config"

export const subscriptionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptionPlans: builder.query<SubscriptionPlanDTO[], void>({
      query: () => ({
        url: "/v1/subscriptions/plans",
        method: "GET",
      }),
      providesTags: ["Subscriptions"],
    }),

    getCurrentSubscription: builder.query<CurrentSubscriptionDTO | null, void>({
      query: () => ({
        url: "/v1/subscriptions/current",
        method: "GET",
        headers: {
          hideErrorToast: "true",
        },
      }),
      providesTags: () => [{ type: "Subscriptions", id: "CURRENT" }],
    }),

    subscribeTenant: builder.mutation<
      SubscribeTenantResponseDTO | void,
      SubscribeTenantRequestDTO
    >({
      query: (body) => ({
        url: "/v1/subscriptions/subscribe",
        method: "POST",
        body,
        headers: {
          hideSuccessToast: "true",
        },
      }),
      invalidatesTags: [
        "Subscriptions",
        { type: "Subscriptions", id: "CURRENT" },
      ],
    }),

    cancelSubscription: builder.mutation<void, void>({
      query: () => ({
        url: "/v1/subscriptions/cancel",
        method: "POST",
      }),
      invalidatesTags: [
        "Subscriptions",
        { type: "Subscriptions", id: "CURRENT" },
      ],
    }),

    changeSubscription: builder.mutation<void, { newPlanId: number }>({
      query: ({ newPlanId }) => ({
        url: "/v1/subscriptions/change-plan",
        method: "PUT",
        body: {
          newPlanId,
        },
      }),
      invalidatesTags: [
        "Subscriptions",
        { type: "Subscriptions", id: "CURRENT" },
      ],
    }),

    reactivateSubscription: builder.mutation<void, void>({
      query: () => ({
        url: "/v1/subscriptions/reactivate",
        method: "POST",
      }),
      invalidatesTags: [
        "Subscriptions",
        { type: "Subscriptions", id: "CURRENT" },
      ],
    }),

    checkSubscription: builder.query<CheckSubscriptionResponseDTO, string>({
      query: (sessionId) => ({
        url: `/v1/subscriptions/checkout-session/${sessionId}`,
        method: "GET",
        headers: {
          hideErrorToast: "true",
        },
      }),
      providesTags: () => [{ type: "Subscriptions", id: "CURRENT" }],
    }),
  }),
})

export const {
  useGetSubscriptionPlansQuery,
  useGetCurrentSubscriptionQuery,
  useLazyGetCurrentSubscriptionQuery,
  useSubscribeTenantMutation,
  useCheckSubscriptionQuery,
  useLazyCheckSubscriptionQuery,
  useCancelSubscriptionMutation,
  useChangeSubscriptionMutation,
  useReactivateSubscriptionMutation,
} = subscriptionApi
