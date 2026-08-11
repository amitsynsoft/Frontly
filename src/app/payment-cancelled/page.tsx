import { Suspense } from "react"

import AuthGuard from "@/components/auth/AuthGuard"
import { PaymentCancelledPage } from "@/app/(dashboard)/dashboard/settings/_components/tabs/_components/payment-cancelled-page"

export default function PaymentCancelledRoute() {
  return (
    <AuthGuard>
      <Suspense fallback={null}>
        <PaymentCancelledPage />
      </Suspense>
    </AuthGuard>
  )
}
