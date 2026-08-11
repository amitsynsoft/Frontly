"use client"

import { Loader2 } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useSyncExternalStore } from "react"

import { SUBSCRIPTION_ROUTES } from "@/constants/routes"
import { useSubscriptionAccess } from "@/hooks/subscription-hooks/use-subscription-access"
import { useAuth } from "@/hooks/useAuth"

const subscribeToHydration = () => () => {}
const getHydratedSnapshot = () => true
const getServerSnapshot = () => false

interface AuthGuardProps {
  children: React.ReactNode
  publicPage?: boolean
  redirectAuthenticatedTo?: string
}

export default function AuthGuard({
  children,
  publicPage = false,
  redirectAuthenticatedTo = "/dashboard",
}: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()

  const { isAuthenticated, user } = useAuth()
  const subscriptionAccess = useSubscriptionAccess({ enabled: publicPage })
  const hasHydrated = useSyncExternalStore(
    subscribeToHydration,
    getHydratedSnapshot,
    getServerSnapshot
  )
  const isPasswordNotSet =
    isAuthenticated && user && user.isPasswordSet === false
  const isAuthenticatedRedirectPending =
    hasHydrated &&
    publicPage &&
    isAuthenticated &&
    !isPasswordNotSet &&
    subscriptionAccess.isPending
  const authenticatedRedirectPath =
    subscriptionAccess.requiresSubscription &&
    !subscriptionAccess.hasCompletedSubscription
      ? SUBSCRIPTION_ROUTES.onboarding
      : redirectAuthenticatedTo

  const shouldRedirectAuthenticated =
    hasHydrated &&
    publicPage &&
    isAuthenticated &&
    !isPasswordNotSet &&
    !isAuthenticatedRedirectPending
  const shouldRedirectUnauthenticated =
    hasHydrated && !publicPage && !isAuthenticated
  const shouldRedirectToResetPassword =
    hasHydrated &&
    !publicPage &&
    isPasswordNotSet &&
    pathname !== "/reset-password"

  useEffect(() => {
    if (shouldRedirectAuthenticated) {
      router.replace(authenticatedRedirectPath)
      return
    }

    if (shouldRedirectUnauthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
      return
    }

    if (shouldRedirectToResetPassword) {
      router.replace("/reset-password")
    }
  }, [
    authenticatedRedirectPath,
    pathname,
    router,
    shouldRedirectAuthenticated,
    shouldRedirectUnauthenticated,
    shouldRedirectToResetPassword,
  ])

  if (
    !hasHydrated ||
    isAuthenticatedRedirectPending ||
    shouldRedirectAuthenticated ||
    shouldRedirectUnauthenticated ||
    shouldRedirectToResetPassword
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}
