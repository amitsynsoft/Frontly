"use client"

import {
  AlertTriangle,
  CalendarClock,
  Loader2,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react"
import * as React from "react"
import { toast } from "sonner"

import { PageContainer } from "@/components/layouts/page-container"
import { BrandLogo } from "@/components/shared/brand-logo"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { defaultTenantTheme } from "@/config/theme"
import { subscriptionOnboardingCopy } from "@/app/(dashboard)/dashboard/settings/_components/tabs/_components/config/subscription-onboarding.config"
import type { SubscriptionPlan } from "@/app/(dashboard)/dashboard/settings/_components/tabs/_components/types/subscription-onboarding.types"
import { mapSubscriptionPlans } from "@/lib/utils/subscription-utils/subscription-plan.mapper"
import {
  useGetSubscriptionPlansQuery,
  useSubscribeTenantMutation,
} from "@/store/api/subscription.api"

import { SubscriptionPlanCard } from "./subscription-plan-card"

type StatePanelProps = {
  actionLabel?: string
  description: string
  isLoading?: boolean
  onAction?: () => void
  title: string
}

const trustItemIcons = [ShieldCheck, CalendarClock, RefreshCcw]

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object") {
    const errorRecord = error as Record<string, unknown>
    const data = errorRecord.data

    if (data && typeof data === "object") {
      const dataRecord = data as Record<string, unknown>

      if (typeof dataRecord.message === "string") {
        return dataRecord.message
      }
    }

    if (typeof errorRecord.message === "string") {
      return errorRecord.message
    }
  }

  return subscriptionOnboardingCopy.checkout.startFailedToast
}

function StatePanel({
  actionLabel,
  description,
  isLoading,
  onAction,
  title,
}: StatePanelProps) {
  return (
    <div className="mx-auto flex min-h-80 w-full max-w-2xl flex-col items-center justify-center gap-4 rounded-lg border border-border bg-card p-8 text-center shadow-xs">
      <div className="grid size-12 place-items-center rounded-md border border-border bg-muted text-muted-foreground">
        {isLoading ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <AlertTriangle className="size-5" />
        )}
      </div>
      <div className="space-y-1.5">
        <h2 className="text-lg font-semibold tracking-normal text-foreground">
          {title}
        </h2>
        <p className="max-w-md text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      {actionLabel && onAction ? (
        <Button onClick={onAction} type="button" variant="outline">
          <RefreshCcw className="mr-1.5 size-4" />
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}

function PlanGridSkeleton() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          className="flex min-h-80 flex-col gap-5 rounded-lg border border-border bg-card p-6"
          key={index}
        >
          <div className="flex items-center justify-between">
            <Skeleton className="size-10 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <Skeleton className="h-10 w-36" />
          <div className="mt-auto space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>
      ))}
    </div>
  )
}

function SubscriptionOnboardingClient() {
  const plansQuery = useGetSubscriptionPlansQuery()
  const [subscribeTenant] = useSubscribeTenantMutation()
  const [selectedPlanId, setSelectedPlanId] = React.useState<number | null>(
    null
  )
  const [redirectingPlanId, setRedirectingPlanId] = React.useState<
    number | null
  >(null)

  const plans = React.useMemo(
    () => mapSubscriptionPlans(plansQuery.currentData ?? []),
    [plansQuery.currentData]
  )

  const selectedPlan = React.useMemo(
    () =>
      plans.find((plan) => plan.id === selectedPlanId) ??
      plans.find((plan) => plan.highlighted) ??
      plans[0],
    [plans, selectedPlanId]
  )

  async function handlePlanSelect(planId: SubscriptionPlan["id"]) {
    setSelectedPlanId(planId)
    setRedirectingPlanId(planId)

    try {
      const response = await subscribeTenant({
        planId,
      }).unwrap()
      const checkoutUrl = response?.checkoutUrl?.trim()

      if (!checkoutUrl) {
        throw new Error(subscriptionOnboardingCopy.checkout.redirectUrlMissing)
      }

      window.location.assign(checkoutUrl)
    } catch (error) {
      setRedirectingPlanId(null)
      toast.error(getErrorMessage(error))
    }
  }

  function renderSubscriptionContent() {
    if (redirectingPlanId) {
      return (
        <StatePanel
          description={
            subscriptionOnboardingCopy.checkout.redirectingDescription
          }
          isLoading
          title={subscriptionOnboardingCopy.checkout.redirectingTitle}
        />
      )
    }

    if (plansQuery.isLoading || plansQuery.isUninitialized) {
      return <PlanGridSkeleton />
    }

    if (plansQuery.isError) {
      return (
        <StatePanel
          actionLabel={subscriptionOnboardingCopy.plansError.retryLabel}
          description={subscriptionOnboardingCopy.plansError.description}
          onAction={plansQuery.refetch}
          title={subscriptionOnboardingCopy.plansError.title}
        />
      )
    }

    if (!plans.length) {
      return (
        <StatePanel
          actionLabel={subscriptionOnboardingCopy.plansEmpty.retryLabel}
          description={subscriptionOnboardingCopy.plansEmpty.description}
          onAction={plansQuery.refetch}
          title={subscriptionOnboardingCopy.plansEmpty.title}
        />
      )
    }

    return (
      <div className="grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <SubscriptionPlanCard
            disabled={redirectingPlanId !== null}
            key={plan.id}
            onSelect={handlePlanSelect}
            plan={plan}
            selected={plan.id === selectedPlan?.id}
          />
        ))}
      </div>
    )
  }

  return (
    <PageContainer className="max-w-6xl items-center gap-8">
      <div className="flex max-w-3xl flex-col items-center text-center">
        <BrandLogo
          brandName={defaultTenantTheme.brandName}
          className="w-56 max-w-full"
          variant="full"
        />
        <h1 className="mt-6 text-2xl font-semibold tracking-normal text-foreground md:text-3xl">
          {redirectingPlanId
            ? subscriptionOnboardingCopy.pageTitleRedirecting
            : subscriptionOnboardingCopy.pageTitle}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          {redirectingPlanId
            ? subscriptionOnboardingCopy.pageDescriptionRedirecting
            : subscriptionOnboardingCopy.pageDescription}
        </p>
        {!redirectingPlanId && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {subscriptionOnboardingCopy.trustItems.map((item, index) => {
              const Icon = trustItemIcons[index]

              return (
                <div
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-xs"
                  key={item}
                >
                  <Icon className="size-3.5 text-primary" />
                  {item}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="w-full">{renderSubscriptionContent()}</div>
    </PageContainer>
  )
}

export { SubscriptionOnboardingClient }
