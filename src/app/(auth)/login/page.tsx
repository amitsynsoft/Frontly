import Link from "next/link"
import Script from "next/script"
import * as React from "react"

import { AuthShell } from "@/components/layouts/auth-shell"
import { LoginForm } from "@/app/(auth)/login/_components/login-form"

export default function LoginPage() {
  return (
    <>
      <Script
        src="https://unpkg.com/@elevenlabs/convai-widget-embed"
        strategy="afterInteractive"
      />
      <AuthShell
        title="Sign in"
        description="Access the operating system for your service business."
      >
        <LoginForm />
        {/* <p className="mt-4 text-center text-sm text-muted-foreground">
          New Tenant?{" "}
          <Link href="/register" className="font-medium text-primary">
            Create an account
          </Link>
        </p> */}
        {React.createElement("elevenlabs-convai", {
          "agent-id": "agent_5001kx04pxkffyw89x7c2b6j5rtx",
        })}
      </AuthShell>
    </>
  )
}
