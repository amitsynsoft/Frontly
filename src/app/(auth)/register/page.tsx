import Link from "next/link"

import { AuthShell } from "@/components/layouts/auth-shell"
import { RegisterForm } from "@/app/(auth)/register/register-form"

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create workspace"
      description="Set up the first tenant admin account."
    >
      <RegisterForm />
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have access?{" "}
        <Link href="/login" className="font-medium text-primary">
          Sign in
        </Link>
      </p>
    </AuthShell>
  )
}
