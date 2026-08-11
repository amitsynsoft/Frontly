import { Loader2 } from "lucide-react"
import { Suspense } from "react"

import ResetPasswordPageClient from "./_components/reset-password-page-client"

export const metadata = {
  title: "Set New Password - Scheduler System",
  description: "Set a new secure password for your account.",
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh flex-col items-center justify-center gap-3 py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="animate-pulse text-sm text-muted-foreground">
            Loading reset form...
          </p>
        </div>
      }
    >
      <ResetPasswordPageClient />
    </Suspense>
  )
}
