"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"

import { PageContainer } from "@/components/layouts/page-container"
import { BrandLogo } from "@/components/shared/brand-logo"
import { Button } from "@/components/ui/button"
import { defaultTenantTheme } from "@/config/theme"
import { DASHBOARD_ROUTES, SUBSCRIPTION_ROUTES } from "@/constants/routes"
import { subscriptionOnboardingCopy } from "@/app/(dashboard)/dashboard/settings/_components/tabs/_components/config/subscription-onboarding.config"

function PaymentCancelledPage() {
  const router = useRouter()

  function handleBackToPlans() {
    router.replace(SUBSCRIPTION_ROUTES.onboarding)
  }

  function handleGoToDashboard() {
    router.replace(DASHBOARD_ROUTES.dashboard)
  }

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background/50 px-4 py-8 sm:px-6 lg:px-8">
      {/* Dynamic Background Glows */}
      <div
        className="pointer-events-none absolute top-1/4 left-1/4 -z-10 h-[280px] w-[280px] animate-pulse rounded-full bg-destructive/5 blur-[60px] sm:h-[350px] sm:w-[350px] sm:blur-[80px]"
        style={{ animationDuration: "6s" }}
      />
      <div
        className="pointer-events-none absolute right-1/4 bottom-1/4 -z-10 h-[320px] w-[320px] animate-pulse rounded-full bg-primary/5 blur-[70px] sm:h-[400px] sm:w-[400px] sm:blur-[90px]"
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
          animation: draw 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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
        <div className="w-full rounded-2xl bg-gradient-to-b from-border via-border/50 to-destructive/15 p-[1px] shadow-xl shadow-black/5 sm:rounded-3xl">
          {/* Main Card */}
          <div className="relative flex flex-col items-center gap-5 rounded-[15px] bg-card p-6 sm:gap-6 sm:rounded-[23px] sm:p-8 md:p-10">
            {/* Animated SVG Cancel Icon */}
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
                {/* First diagonal line of the 'X' */}
                <path
                  d="M23 23 L41 41"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="30"
                  strokeDashoffset="30"
                  className="animate-draw-slash-1"
                />
                {/* Second diagonal line of the 'X' */}
                <path
                  d="M41 23 L23 41"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="30"
                  strokeDashoffset="30"
                  className="animate-draw-slash-2"
                />
              </svg>
            </div>

            {/* Info Texts */}
            <div className="space-y-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {subscriptionOnboardingCopy.paymentCancelled.title}
              </h1>
              <p className="mx-auto max-w-[280px] text-xs leading-relaxed text-muted-foreground sm:max-w-xs sm:text-sm">
                {subscriptionOnboardingCopy.paymentCancelled.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-1 flex w-full flex-col gap-2.5 sm:mt-2 sm:gap-3">
              <Button
                onClick={handleBackToPlans}
                type="button"
                className="group/btn flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-xs transition-all duration-300 hover:scale-[1.02] hover:bg-primary/95 hover:shadow-md hover:shadow-primary/10 sm:h-12 sm:text-base"
              >
                <ArrowLeft className="size-4 transition-transform duration-300 group-hover/btn:-translate-x-1" />
                <span>
                  {subscriptionOnboardingCopy.paymentCancelled.backToPlansLabel}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </PageContainer>
    </main>
  )
}

export { PaymentCancelledPage }
