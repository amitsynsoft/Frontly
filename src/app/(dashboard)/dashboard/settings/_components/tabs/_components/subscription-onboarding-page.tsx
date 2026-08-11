"use client"

import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"

import { DASHBOARD_ROUTES } from "@/constants/routes"

import { useSubscriptionAccess } from "../../../../../../../hooks/subscription-hooks/use-subscription-access"
import { SubscriptionOnboardingClient } from "./subscription-onboarding-client"

function SubscriptionOnboardingPage() {
  const router = useRouter()
  const { hasCompletedSubscription, isPending, requiresSubscription } =
    useSubscriptionAccess()
  const shouldRedirectToDashboard =
    !isPending && (!requiresSubscription || hasCompletedSubscription)

  React.useEffect(() => {
    if (shouldRedirectToDashboard) {
      router.replace(DASHBOARD_ROUTES.dashboard)
    }
  }, [router, shouldRedirectToDashboard])

  if (isPending || shouldRedirectToDashboard) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </main>
    )
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/25 px-4 py-8 sm:px-6 lg:px-8">
      <SubscriptionOnboardingClient />
    </main>
  )
}

export { SubscriptionOnboardingPage }
