import Link from "next/link"

import { AuthShell } from "@/components/layouts/auth-shell"
import { ForgotPasswordForm } from "@/app/(auth)/forgot-password/_components/forgetpassword-form"

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Forgot password"
      description="Enter your email and we'll send you a reset link."
    >
      <ForgotPasswordForm />

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Back to login
        </Link>
      </p>
    </AuthShell>
  )
}
