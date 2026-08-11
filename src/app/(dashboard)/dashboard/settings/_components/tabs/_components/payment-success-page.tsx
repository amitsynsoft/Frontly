"use client"

import { RefreshCcw, ShieldCheck } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { toast } from "sonner"

import { PageContainer } from "@/components/layouts/page-container"
import { BrandLogo } from "@/components/shared/brand-logo"
import { Button } from "@/components/ui/button"
import { defaultTenantTheme } from "@/config/theme"
import { DASHBOARD_ROUTES, SUBSCRIPTION_ROUTES } from "@/constants/routes"
import {
  paymentSuccessVerificationConfig,
  subscriptionOnboardingCopy,
} from "@/app/(dashboard)/dashboard/settings/_components/tabs/_components/config/subscription-onboarding.config"
import { usePaymentSuccessVerification } from "@/hooks/subscription-hooks/use-payment-success-verification"

function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const hasRedirectedRef = React.useRef(false)
  const { checkoutQuery, isReadyForDashboard, sessionId, verificationState } =
    usePaymentSuccessVerification(searchParams.toString())

  React.useEffect(() => {
    if (!isReadyForDashboard || hasRedirectedRef.current) {
      return
    }

    hasRedirectedRef.current = true
    toast.success(subscriptionOnboardingCopy.successToast)

    const timer = window.setTimeout(() => {
      router.replace(DASHBOARD_ROUTES.dashboard)
      router.refresh()
    }, paymentSuccessVerificationConfig.redirectDelayMs)

    return () => window.clearTimeout(timer)
  }, [isReadyForDashboard, router])

  function handleBackToPlans() {
    router.replace(SUBSCRIPTION_ROUTES.onboarding)
  }

  function getStateCopy() {
    switch (verificationState) {
      case "missing-session":
        return {
          description:
            subscriptionOnboardingCopy.paymentSuccess.missingSessionDescription,
          title: subscriptionOnboardingCopy.paymentSuccess.missingSessionTitle,
        }
      case "error":
        return {
          description:
            subscriptionOnboardingCopy.paymentSuccess.errorDescription,
          title: subscriptionOnboardingCopy.paymentSuccess.errorTitle,
        }
      case "active":
        return {
          description:
            subscriptionOnboardingCopy.paymentSuccess.paidDescription,
          title: subscriptionOnboardingCopy.paymentSuccess.paidTitle,
        }
      case "finalizing":
        return {
          description:
            subscriptionOnboardingCopy.paymentSuccess.activationDescription,
          title: subscriptionOnboardingCopy.paymentSuccess.activationTitle,
        }
      case "retry":
        return {
          description:
            subscriptionOnboardingCopy.paymentSuccess.retryDescription,
          title: subscriptionOnboardingCopy.paymentSuccess.retryTitle,
        }
      default:
        return {
          description:
            subscriptionOnboardingCopy.paymentSuccess.pollingDescription,
          title: subscriptionOnboardingCopy.paymentSuccess.pollingTitle,
        }
    }
  }

  const stateCopy = getStateCopy()
  const isLoading =
    verificationState === "pending" || verificationState === "finalizing"

  function renderAnimatedIcon() {
    if (isLoading) {
      return (
        <div className="relative flex size-20 items-center justify-center sm:size-24">
          <svg
            viewBox="0 0 64 64"
            className="size-16 animate-spin text-primary select-none sm:size-20"
          >
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="176"
              strokeDashoffset="60"
            />
          </svg>
        </div>
      )
    }

    if (verificationState === "active") {
      return (
        <div className="relative flex size-20 items-center justify-center sm:size-24">
          <svg
            viewBox="0 0 64 64"
            className="size-16 text-primary select-none sm:size-20"
          >
            {/* Animated Outer Circle */}
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="176"
              strokeDashoffset="176"
              className="animate-draw-circle"
            />
            {/* Animated Background Bubble */}
            <circle
              cx="32"
              cy="32"
              r="24"
              className="animate-scale-bg-success fill-primary/10"
            />
            {/* Animated Checkmark Tick */}
            <path
              d="M20 32 L28 40 L44 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="40"
              strokeDashoffset="40"
              className="animate-draw-check"
            />
          </svg>
        </div>
      )
    }

    // Error / Warning state
    return (
      <div className="relative flex size-20 items-center justify-center sm:size-24">
        <svg
          viewBox="0 0 64 64"
          className="size-16 text-destructive select-none sm:size-20"
        >
          {/* Animated Outer Circle */}
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="176"
            strokeDashoffset="176"
            className="animate-draw-circle"
          />
          {/* Animated Background Bubble */}
          <circle
            cx="32"
            cy="32"
            r="24"
            className="animate-scale-bg fill-destructive/10"
          />
          {/* Animated Exclamation mark */}
          <path
            d="M32 18 L32 38"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="20"
            strokeDashoffset="20"
            className="animate-draw-slash-1"
          />
          <circle
            cx="32"
            cy="46"
            r="2.5"
            className="animate-scale-bg fill-destructive"
          />
        </svg>
      </div>
    )
  }

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background/50 px-4 py-8 sm:px-6 lg:px-8">
      {/* Dynamic Background Glows */}
      <div
        className="pointer-events-none absolute top-1/4 left-1/4 -z-10 h-[280px] w-[280px] animate-pulse rounded-full bg-primary/5 blur-[60px] sm:h-[350px] sm:w-[350px] sm:blur-[80px]"
        style={{ animationDuration: "6s" }}
      />
      <div
        className="pointer-events-none absolute right-1/4 bottom-1/4 -z-10 h-[320px] w-[320px] animate-pulse rounded-full bg-secondary/10 blur-[70px] sm:h-[400px] sm:w-[400px] sm:blur-[90px]"
        style={{ animationDuration: "8s" }}
      />

      {/* Modern CSS Animation Styles */}
      <style>{`
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes scaleIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          60% {
            transform: scale(1.15);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-draw-circle {
          transform-origin: center;
          transform: rotate(-90deg);
          animation: draw 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-scale-bg-success {
          transform-origin: center;
          animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          animation-delay: 0.35s;
          opacity: 0;
        }
        .animate-draw-check {
          animation: draw 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 0.8s;
        }
        .animate-scale-bg {
          transform-origin: center;
          animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          animation-delay: 0.35s;
          opacity: 0;
        }
        .animate-draw-slash-1 {
          animation: draw 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 0.8s;
        }
        .animate-draw-slash-2 {
          animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 0.95s;
        }
        .animate-float-card {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      <PageContainer className="w-full max-w-[420px] animate-in items-center gap-5 text-center duration-700 ease-out fade-in-50 zoom-in-95 sm:gap-6">
        <BrandLogo
          brandName={defaultTenantTheme.brandName}
          className="mb-1 w-40 max-w-full sm:mb-2 sm:w-48"
          variant="full"
        />

        {/* Outer card wrapper for gradient border */}
        <div className="w-full rounded-2xl bg-gradient-to-b from-border via-border/50 to-primary/15 p-[1px] shadow-xl shadow-black/5 sm:rounded-3xl">
          {/* Main Card */}
          <div className="relative flex flex-col items-center gap-5 rounded-[15px] bg-card p-6 sm:gap-6 sm:rounded-[23px] sm:p-8 md:p-10">
            {/* Custom Animated Icon */}
            {renderAnimatedIcon()}

            {/* Info Texts */}
            <div className="space-y-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {stateCopy.title}
              </h1>
              <p className="mx-auto max-w-[280px] text-xs leading-relaxed text-muted-foreground sm:max-w-xs sm:text-sm">
                {stateCopy.description}
              </p>
            </div>

            {/* Verification Status Badge */}
            {verificationState === "pending" ||
            verificationState === "finalizing" ||
            verificationState === "active" ? (
              <div className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-muted/30 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground select-none">
                <ShieldCheck className="size-3.5 shrink-0 text-primary" />
                <span>
                  {verificationState === "active"
                    ? subscriptionOnboardingCopy.paymentSuccess.dashboardLabel
                    : verificationState === "finalizing"
                      ? subscriptionOnboardingCopy.paymentSuccess
                          .activationLabel
                      : ""}
                </span>
              </div>
            ) : null}

            {/* Action Buttons */}
            {verificationState === "error" ||
            verificationState === "missing-session" ||
            verificationState === "retry" ? (
              <div className="mt-1 flex w-full flex-col gap-2.5 sm:mt-2 sm:gap-3">
                {verificationState === "error" ? (
                  <Button
                    onClick={() => checkoutQuery.refetch()}
                    type="button"
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-xs transition-all duration-300 hover:scale-[1.02] hover:bg-primary/95 hover:shadow-md hover:shadow-primary/10 sm:h-12 sm:text-base"
                  >
                    <RefreshCcw className="size-4 shrink-0" />
                    <span>
                      {subscriptionOnboardingCopy.paymentSuccess.actionLabel}
                    </span>
                  </Button>
                ) : null}

                {verificationState === "missing-session" ||
                verificationState === "retry" ? (
                  <Button
                    onClick={handleBackToPlans}
                    type="button"
                    variant="outline"
                    className="h-10 w-full rounded-xl text-sm font-semibold sm:h-12 sm:text-base"
                  >
                    {subscriptionOnboardingCopy.paymentSuccess.backToPlansLabel}
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </PageContainer>
    </main>
  )
}

export { PaymentSuccessPage }
