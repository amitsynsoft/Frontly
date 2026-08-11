import { Suspense } from "react"

import AuthGuard from "@/components/auth/AuthGuard"
import { PaymentSuccessPage } from "@/app/(dashboard)/dashboard/settings/_components/tabs/_components/payment-success-page"

export default function PaymentSuccessRoute() {
  return (
    <AuthGuard>
      <Suspense fallback={null}>
        <PaymentSuccessPage />
      </Suspense>
    </AuthGuard>
  )
}
