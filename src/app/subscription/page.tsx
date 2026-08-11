import AuthGuard from "@/components/auth/AuthGuard"
import { SubscriptionOnboardingPage } from "@/app/(dashboard)/dashboard/settings/_components/tabs/_components/subscription-onboarding-page"

export default function SubscriptionPage() {
  return (
    <AuthGuard>
      <SubscriptionOnboardingPage />
    </AuthGuard>
  )
}
