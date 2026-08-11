"use client"

import { Loader2 } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import * as React from "react"

import { SUBSCRIPTION_ROUTES } from "@/constants/routes"

import { useSubscriptionAccess } from "../../../../../../../hooks/subscription-hooks/use-subscription-access"

function SubscriptionRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { hasCompletedSubscription, isPending, requiresSubscription } =
    useSubscriptionAccess()

  const isSubscriptionRoute =
    pathname === SUBSCRIPTION_ROUTES.onboarding ||
    pathname.startsWith(`${SUBSCRIPTION_ROUTES.onboarding}/`) ||
    pathname === SUBSCRIPTION_ROUTES.paymentSuccess ||
    pathname.startsWith(`${SUBSCRIPTION_ROUTES.paymentSuccess}/`) ||
    pathname === SUBSCRIPTION_ROUTES.paymentCancelled ||
    pathname.startsWith(`${SUBSCRIPTION_ROUTES.paymentCancelled}/`)
  const shouldRedirect =
    requiresSubscription && !hasCompletedSubscription && !isSubscriptionRoute

  React.useEffect(() => {
    if (!isPending && shouldRedirect) {
      router.replace(SUBSCRIPTION_ROUTES.onboarding)
    }
  }, [isPending, router, shouldRedirect])

  if (isPending || shouldRedirect) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}

export { SubscriptionRouteGuard }
