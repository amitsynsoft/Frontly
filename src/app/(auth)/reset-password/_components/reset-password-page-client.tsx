"use client"

import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { AuthShell } from "@/components/layouts/auth-shell"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { useGetProfileQuery } from "@/store/api/auth.api"

import { ResetPasswordForm } from "./ResetPasswordForm/ResetPasswordForm"

export default function ResetPasswordPageClient() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const router = useRouter()
  const { setUser } = useAuth()

  const [step, setStep] = useState<"otp" | "reset">("otp")
  const [otpSent, setOtpSent] = useState(false)

  const {
    data: profile,
    isLoading: isFetchingProfile,
    isError: isFetchError,
    error: fetchError,
  } = useGetProfileQuery(token || "", {
    skip: !token,
    refetchOnMountOrArgChange: true,
  })
  // NOTE: for now, for the sake of forget-password flow
  // useEffect(() => {
  //   if (!profile || !token) return

  //   if (profile.isPasswordSet) {
  //     setUser(profile as any, token)
  //     toast.success("Welcome back! Your password is already configured.")
  //     router.replace("/dashboard")
  //     router.refresh()
  //   }
  // }, [profile, token, setUser, router])

  if (!token) {
    return (
      <AuthShell
        title="Invalid Request"
        description="The password reset link is invalid or incomplete."
      >
        <div className="animate-fade-in flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <h5 className="mb-1 leading-none font-semibold tracking-tight">
              Invalid Request
            </h5>
            <p className="text-sm text-destructive/90">
              No reset token was found in the link. Please request a new
              password reset link.
            </p>
          </div>
        </div>
      </AuthShell>
    )
  }

  if (isFetchingProfile) {
    return (
      <AuthShell
        title="Verifying link"
        description="Please wait while we check your password reset request."
      >
        <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Loader2 className="size-6 animate-spin" />
          </div>
          <p className="animate-pulse text-sm text-muted-foreground">
            Verifying secure link & fetching profile...
          </p>
        </div>
      </AuthShell>
    )
  }

  if (isFetchError || !profile) {
    const errorMessage =
      (fetchError as any)?.data?.message ||
      "The reset link is invalid or has expired. Please request a new link."

    return (
      <AuthShell
        title="Verification failed"
        description="There was an issue processing your password reset request."
      >
        <div className="space-y-5">
          <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-destructive">
            <AlertCircle className="mt-0.5 size-5 shrink-0" />
            <div className="space-y-1">
              <h5 className="font-semibold tracking-tight">
                Verification failed
              </h5>
              <p className="text-sm leading-relaxed text-destructive/90">
                {errorMessage}
              </p>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => router.push("/login")}
            className="w-full gap-2"
            variant="outline"
            size="lg"
          >
            <ArrowLeft className="size-4" />
            Return to login
          </Button>
        </div>
      </AuthShell>
    )
  }

  let title = "Verify OTP"
  let description =
    "Please enter the 6-digit verification code to verify your identity."

  if (step === "otp") {
    if (!otpSent) {
      title = "Confirm Identity"
      description =
        "Please verify your profile information below before requesting the verification code."
    } else {
      title = "Verify OTP"
      description =
        "Please enter the 6-digit verification code sent to your email."
    }
  } else {
    title = "Set new password"
    description = "Choose a strong password to secure your account."
  }

  return (
    <AuthShell title={title} description={description}>
      <ResetPasswordForm
        token={token}
        step={step}
        onStepChange={setStep}
        profile={profile}
        otpSent={otpSent}
        onOtpSentChange={setOtpSent}
      />
    </AuthShell>
  )
}
