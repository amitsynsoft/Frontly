import {
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  ProfileResponse,
  SignupRequest,
} from "@/types/dtos/auth.dto"

import { api } from "./api.config"

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/v1/auth/login",
        method: "POST",
        body: credentials,
        headers: { hideErrorToast: "false", hideSuccessToast: "true" },
      }),
    }),
    register: builder.mutation<unknown, SignupRequest>({
      query: (userData) => ({
        url: "/v1/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/v1/auth/logout",
        method: "POST",
        headers: { hideErrorToast: "false", hideSuccessToast: "true" },
      }),
    }),
    forgotPassword: builder.mutation<
      {
        success: boolean
        message: string
      },
      {
        email: string
      }
    >({
      query: (body) => ({
        url: "/v1/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),
    getProfile: builder.query<ProfileResponse, string>({
      query: (token) => ({
        url: "/v1/auth/getProfileByToken",
        method: "GET",
        headers: {
          hideErrorToast: "true",
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    changePassword: builder.mutation<unknown, ChangePasswordRequest>({
      query: (body) => ({
        url: `/v1/auth/change-password`,
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<
      {
        success: boolean
        message: string
      },
      {
        token: string
        newPassword: string
      }
    >({
      query: (body) => ({
        url: "/v1/auth/reset-password",
        method: "POST",
        body,
      }),
    }),

    sendOTPByToken: builder.mutation<
      {
        success: boolean
        message: string
      },
      {
        token: string
      }
    >({
      query: (body) => ({
        url: "/v1/auth/send-otp-by-token",
        method: "POST",
        body,
        headers: {
          hideSuccessToast: "true",
        },
      }),
    }),

    verifyOTP: builder.mutation<
      {
        token: string
        accessToken: string
      },
      {
        token: string
        otp: string
      }
    >({
      query: (body) => ({
        url: "/v1/auth/verify-otp",
        method: "POST",
        body,
        headers: { hideErrorToast: "true", hideSuccessToast: "true" },
      }),
    }),
  }),
})

export const {
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useGetProfileQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useResetPasswordMutation,
  useVerifyOTPMutation,
  useSendOTPByTokenMutation,
} = authApi
