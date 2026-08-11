"use client"

import * as React from "react"

import { paymentSuccessVerificationConfig } from "@/app/(dashboard)/dashboard/settings/_components/tabs/_components/config/subscription-onboarding.config"
import {
  useCheckSubscriptionQuery,
  useGetCurrentSubscriptionQuery,
} from "@/store/api/subscription.api"
import type { CheckSubscriptionResponseDTO } from "@/types/dtos/subscription.dto"

import { isSubscriptionActive } from "../../lib/utils/subscription-utils/subscription-access"

const paidStatuses = new Set(["paid"])
const completeStatuses = new Set(["complete", "completed"])
const failedStatuses = new Set(["canceled", "cancelled", "expired", "failed"])
const failedPaymentStatuses = new Set(["failed"])

type PaymentSuccessVerificationState =
  | "active"
  | "error"
  | "finalizing"
  | "missing-session"
  | "pending"
  | "retry"

function getCheckoutSessionId(searchParams: URLSearchParams) {
  return (
    searchParams.get("session_id") ??
    searchParams.get("sessionId") ??
    searchParams.get("checkout_session_id") ??
    ""
  ).trim()
}

function isSubscriptionCheckPaid(
  subscription: CheckSubscriptionResponseDTO | undefined
) {
  const sessionStatus = subscription?.status?.trim().toLowerCase()
  const paymentStatus = subscription?.paymentStatus?.trim().toLowerCase()

  return Boolean(
    sessionStatus &&
    paymentStatus &&
    completeStatuses.has(sessionStatus) &&
    paidStatuses.has(paymentStatus)
  )
}

function isSubscriptionCheckFailed(
  subscription: CheckSubscriptionResponseDTO | undefined
) {
  const sessionStatus = subscription?.status?.trim().toLowerCase()
  const paymentStatus = subscription?.paymentStatus?.trim().toLowerCase()

  return Boolean(
    (sessionStatus && failedStatuses.has(sessionStatus)) ||
    (paymentStatus && failedPaymentStatuses.has(paymentStatus))
  )
}

function usePaymentSuccessVerification(searchParamsString: string) {
  const sessionId = React.useMemo(
    () => getCheckoutSessionId(new URLSearchParams(searchParamsString)),
    [searchParamsString]
  )
  const checkoutQuery = useCheckSubscriptionQuery(sessionId, {
    pollingInterval: paymentSuccessVerificationConfig.pollingIntervalMs,
    refetchOnMountOrArgChange: true,
    skip: !sessionId,
  })
  const isPaid = isSubscriptionCheckPaid(checkoutQuery.currentData)
  const isFailed = isSubscriptionCheckFailed(checkoutQuery.currentData)
  const currentSubscriptionQuery = useGetCurrentSubscriptionQuery(undefined, {
    pollingInterval: paymentSuccessVerificationConfig.pollingIntervalMs,
    refetchOnMountOrArgChange: true,
    skip: !isPaid || isFailed,
  })
  const hasActiveSubscription = isSubscriptionActive(
    currentSubscriptionQuery.currentData
  )
  const isReadyForDashboard = isPaid && hasActiveSubscription

  const verificationState: PaymentSuccessVerificationState = !sessionId
    ? "missing-session"
    : isReadyForDashboard
      ? "active"
      : isFailed
        ? "retry"
        : isPaid
          ? "finalizing"
          : checkoutQuery.isError
            ? "error"
            : "pending"

  return {
    checkoutQuery,
    isReadyForDashboard,
    sessionId,
    verificationState,
  }
}

export { usePaymentSuccessVerification }
export type { PaymentSuccessVerificationState }
