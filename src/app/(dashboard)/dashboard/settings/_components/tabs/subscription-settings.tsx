"use client"

import {
  Award,
  CalendarDays,
  Clock,
  CreditCard,
  Crown,
  Loader2,
  Lock,
  ShieldCheck,
} from "lucide-react"
import { useState } from "react"

import { SubscriptionPlanCard } from "@/app/(dashboard)/dashboard/settings/_components/tabs/_components/subscription-plan-card"
import {
  useCancelSubscriptionMutation,
  useChangeSubscriptionMutation,
  useGetCurrentSubscriptionQuery,
  useGetSubscriptionPlansQuery,
  useReactivateSubscriptionMutation,
  useSubscribeTenantMutation,
} from "@/store/api/subscription.api"
import { cn } from "@/lib/utils/cn.utils"
import dayjs from "dayjs"
import { mapSubscriptionPlans } from "@/lib/utils/subscription-utils/subscription-plan.mapper"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function SubscriptionSettings() {
  const {
    data: currentSub,
    isLoading: isSubLoading,
    isError: isSubError,
    refetch: refetchSub,
  } = useGetCurrentSubscriptionQuery()

  const {
    data: plansData,
    isLoading: isPlansLoading,
    isError: isPlansError,
    refetch: refetchPlans,
  } = useGetSubscriptionPlansQuery()

  const [subscribeTenant, { isLoading: isSubscribing }] =
    useSubscribeTenantMutation()
  const [changeSubscription, { isLoading: isChanging }] =
    useChangeSubscriptionMutation()
  const [cancelSubscription, { isLoading: isCancelling }] =
    useCancelSubscriptionMutation()
  const [reactivateSubscription, { isLoading: isReactivating }] =
    useReactivateSubscriptionMutation()

  const [redirectingPlanId, setRedirectingPlanId] = useState<number | null>(
    null
  )

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    type: "change" | "cancel" | "reactivate" | null
    planId?: number
    planName?: string
  }>({
    isOpen: false,
    type: null,
  })

  const plans = mapSubscriptionPlans(plansData ?? [])

  const subscription =
    (currentSub as any)?.result || (currentSub as any)?.data || currentSub
  const isSubActive = subscription && subscription.isActive

  const handlePlanSelect = async (planId: number, planName: string) => {
    if (isSubActive) {
      setConfirmDialog({
        isOpen: true,
        type: "change",
        planId,
        planName,
      })
    } else {
      setRedirectingPlanId(planId)
      try {
        const response = await subscribeTenant({ planId }).unwrap()
        const checkoutUrl = response?.checkoutUrl?.trim()

        if (!checkoutUrl) {
          throw new Error(
            "Stripe checkout link was not returned. Please try again."
          )
        }

        window.location.assign(checkoutUrl)
      } catch (error: any) {
        setRedirectingPlanId(null)
        const msg =
          error?.data?.message ||
          error?.message ||
          "Could not start checkout. Please try again."
        console.log(msg)
      }
    }
  }

  const handleCancel = async () => {
    setConfirmDialog({
      isOpen: true,
      type: "cancel",
    })
  }

  const handleReactivate = async () => {
    setConfirmDialog({
      isOpen: true,
      type: "reactivate",
    })
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A"
    return dayjs(dateStr).format("MMMM D, YYYY")
  }

  if (isSubLoading || isPlansLoading) {
    return (
      <div className="mt-6 flex flex-col gap-6">
        <Card className="border border-border/50 bg-background/50">
          <CardContent className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isSubError || isPlansError) {
    return (
      <div className="mt-6 flex max-w-4xl flex-col gap-6">
        <Card className="border border-destructive/20 bg-destructive/5 text-destructive">
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            <p className="font-semibold">Failed to load subscription details</p>
            <p className="text-sm text-muted-foreground">
              Please refresh or check your internet connection and try again.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                refetchSub()
                refetchPlans()
              }}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isAnyActionPending =
    isSubscribing || isChanging || isCancelling || isReactivating

  return (
    <div className="mt-6 max-w-4xl space-y-8">
      {/* Current Subscription Card */}
      {isSubActive ? (
        <Card className="relative overflow-hidden rounded-3xl border border-zinc-200/50 bg-background/60 p-6 shadow-xl shadow-zinc-200/20 backdrop-blur-md transition-all duration-300 hover:border-zinc-300 dark:border-zinc-800/50 dark:bg-zinc-950/40 dark:shadow-none dark:hover:border-zinc-700">
          {/* Spotlight Background Effects */}
          <div className="pointer-events-none absolute -top-16 -right-16 size-72 rounded-full bg-primary/10 blur-3xl dark:bg-primary/15" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 size-72 rounded-full bg-blue-500/5 blur-3xl dark:bg-blue-500/10" />

          {/* Grid Pattern Background */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(120,119,198,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,119,198,0.04)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:24px_24px]" />

          <div className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-primary to-blue-600 text-white shadow-lg ring-4 shadow-primary/25 ring-primary/10">
                <Crown className="h-6 w-6 fill-current drop-shadow-xs" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold tracking-tight text-foreground">
                    Current Subscription
                  </h3>
                  {subscription.isSubscriptionCancelled ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-destructive uppercase dark:bg-destructive/20">
                      <span className="size-1.5 rounded-full bg-destructive" />
                      Cancelled
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-emerald-700 uppercase dark:bg-emerald-500/20 dark:text-emerald-400">
                      <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                      Active
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  You are currently subscribed to{" "}
                  <span className="font-semibold text-foreground">
                    {subscription.subscriptionPlan?.title || "our premium plan"}
                  </span>
                  .
                </p>
              </div>
            </div>

            {/* Action buttons for subscription lifecycle */}
            <div className="flex items-center gap-2">
              {subscription.isSubscriptionCancelled ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-primary/20 bg-background/50 px-4 py-2 text-xs font-semibold text-primary shadow-xs transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 active:scale-95"
                  onClick={handleReactivate}
                  disabled={isReactivating}
                >
                  {isReactivating ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Crown className="mr-1.5 h-3.5 w-3.5 fill-current" />
                  )}
                  Reactivate Subscription
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-2 text-xs font-semibold text-destructive shadow-2xs transition-all duration-200 hover:scale-[1.02] hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive active:scale-[0.98]"
                  onClick={handleCancel}
                  disabled={isCancelling}
                >
                  {isCancelling && (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  )}
                  Cancel Subscription
                </Button>
              )}
            </div>
          </div>

          <CardContent className="relative z-10 grid gap-4 border-t border-zinc-200/50 p-0 pt-6 md:grid-cols-3 dark:border-zinc-800/50">
            {/* Box 1: Plan & Price */}
            <div className="group flex items-center gap-4 rounded-2xl border border-zinc-200/50 bg-background/60 p-4 shadow-2xs backdrop-blur-xs transition-all duration-300 dark:border-zinc-800/50 dark:bg-zinc-950/20 dark:hover:bg-zinc-900/30">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-primary/5 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary">
                <CreditCard className="h-5 w-5" strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold tracking-wider text-muted-foreground/80 uppercase">
                  Plan & Price
                </p>
                <p className="mt-0.5 text-sm font-bold text-foreground">
                  {subscription.subscriptionPlan?.title}
                </p>
                <p className="mt-1 flex items-baseline text-base font-extrabold text-primary">
                  {subscription.subscriptionPlan?.currency?.symbol || "$"}
                  {subscription.subscriptionPlan?.amount}
                  <span className="ml-1 text-[10px] font-medium text-muted-foreground">
                    / {subscription.subscriptionPlan?.type || "month"}
                  </span>
                </p>
              </div>
            </div>

            {/* Box 2: Billing Period */}
            <div className="group flex items-center gap-4 rounded-2xl border border-zinc-200/50 bg-background/60 p-4 shadow-2xs backdrop-blur-xs transition-all duration-300 dark:border-zinc-800/50 dark:bg-zinc-950/20 dark:hover:bg-zinc-900/30">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-primary/5 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary">
                <CalendarDays className="h-5 w-5" strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold tracking-wider text-muted-foreground/80 uppercase">
                  Billing Period
                </p>
                <p className="mt-0.5 text-sm font-bold text-foreground">
                  {formatDate(subscription.startDate)}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  to {formatDate(subscription.endDate)}
                </p>
              </div>
            </div>

            {/* Box 3: Next Billing Date */}
            <div className="group flex items-center gap-4 rounded-2xl border border-zinc-200/50 bg-background/60 p-4 shadow-2xs backdrop-blur-xs transition-all duration-300 dark:border-zinc-800/50 dark:bg-zinc-950/20 dark:hover:bg-zinc-900/30">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-primary/5 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary">
                <Clock className="h-5 w-5" strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold tracking-wider text-muted-foreground/80 uppercase">
                  {subscription.isSubscriptionCancelled
                    ? "Expires On"
                    : "Next Billing Date"}
                </p>
                <p className="mt-0.5 text-sm font-bold text-foreground">
                  {formatDate(
                    subscription.nextBillingDate || subscription.endDate
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-border/50 bg-background/50 shadow-lg">
          <CardHeader className="pb-6 text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              No Active Subscription
            </CardTitle>
            <CardDescription className="mx-auto max-w-md">
              Choose one of our professional plans below to get started and
              manage your team schedules seamlessly.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Available Plans Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-foreground">
            {isSubActive ? "Change Plan" : "Choose a Plan"}
          </h3>
          <p className="mb-8 text-sm text-muted-foreground">
            Select a plan below to upgrade, downgrade, or restart your
            subscription process.
          </p>
        </div>

        {isAnyActionPending && redirectingPlanId !== null ? (
          <div className="flex min-h-60 flex-col items-center justify-center gap-4 rounded-lg border border-border bg-card p-8 text-center shadow-xs">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div>
              <h4 className="text-base font-semibold text-foreground">
                Processing Request
              </h4>
              <p className="text-sm text-muted-foreground">
                Please wait while we update your subscription plan details.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => {
                const isCurrentPlan =
                  isSubActive && subscription.subscriptionPlanId === plan.id
                return (
                  <div key={plan.id} className="relative">
                    {isCurrentPlan && (
                      <div className="absolute -top-2.5 left-1/2 z-10 -translate-x-1/2">
                        <div className="rounded-xs border border-zinc-800 bg-zinc-950 px-3 py-1 text-[9px] font-extrabold tracking-widest text-white uppercase shadow-md dark:bg-zinc-800">
                          Current Plan
                        </div>
                      </div>
                    )}
                    <SubscriptionPlanCard
                      disabled={isAnyActionPending || isCurrentPlan}
                      onSelect={(planId) => handlePlanSelect(planId, plan.name)}
                      plan={plan}
                      selected={isCurrentPlan}
                      isCurrent={isCurrentPlan}
                    />
                  </div>
                )
              })}
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 border-t border-border/20 pt-6 text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              <span>
                Your payment information is secure and encrypted. You can cancel
                or change your plan at any time.
              </span>
            </div>
          </>
        )}
      </div>

      <AlertDialog
        open={confirmDialog.isOpen}
        onOpenChange={(open) =>
          setConfirmDialog((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog.type === "change" && "Confirm Plan Change"}
              {confirmDialog.type === "cancel" && "Cancel Subscription"}
              {confirmDialog.type === "reactivate" && "Reactivate Subscription"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.type === "change" && (
                <span>
                  Are you sure you want to change your plan to{" "}
                  <strong>{confirmDialog.planName}</strong>? Your billing and
                  features will adjust to the new plan.
                </span>
              )}
              {confirmDialog.type === "cancel" && (
                <span>
                  Are you sure you want to cancel your subscription? Your access
                  will continue until the end of your current billing period (
                  <strong>{formatDate(subscription?.endDate)}</strong>).
                </span>
              )}
              {confirmDialog.type === "reactivate" && (
                <span>
                  Are you sure you want to reactivate your subscription? This
                  will resume your automatic billing cycle and ensure
                  uninterrupted service.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isAnyActionPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className={cn(
                confirmDialog.type === "cancel" &&
                  "text-destructive-foreground bg-destructive hover:bg-destructive/90"
              )}
              disabled={isAnyActionPending}
              onClick={async (e) => {
                e.preventDefault()
                try {
                  if (
                    confirmDialog.type === "change" &&
                    confirmDialog.planId !== undefined
                  ) {
                    await changeSubscription({
                      newPlanId: confirmDialog.planId,
                    }).unwrap()
                  } else if (confirmDialog.type === "cancel") {
                    await cancelSubscription().unwrap()
                  } else if (confirmDialog.type === "reactivate") {
                    await reactivateSubscription().unwrap()
                  }
                  refetchSub()
                  setConfirmDialog({ isOpen: false, type: null })
                } catch (error: any) {
                  const msg =
                    error?.data?.message ||
                    error?.message ||
                    "Operation failed. Please try again."
                  console.log(msg)
                }
              }}
            >
              {isAnyActionPending && (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              )}
              {confirmDialog.type === "cancel"
                ? "Cancel Subscription"
                : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
