"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  Building2,
  IdCard,
  KeyRound,
  Loader2,
  Mail,
  Send,
  Shield,
  User,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"

import { FormInput } from "@/components/forms/form-input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import {
  useResetPasswordMutation,
  useSendOTPByTokenMutation,
} from "@/store/api/auth.api"
import { ProfileResponse } from "@/types/dtos/auth.dto"

import { defaultValues, labels, placeholders } from "./ResetPasswordForm.config"
import { resetPasswordSchema } from "./ResetPasswordForm.schema"
import { ResetPasswordFormValues } from "./ResetPasswordForm.type"
import { VerifyOtpForm } from "./VerifyOtpForm"

interface ResetPasswordFormProps {
  token: string
  step: "otp" | "reset"
  onStepChange: (step: "otp" | "reset") => void
  profile: ProfileResponse
  otpSent: boolean
  onOtpSentChange: (sent: boolean) => void
}

export function ResetPasswordForm({
  token,
  step,
  onStepChange,
  profile,
  otpSent,
  onOtpSentChange,
}: ResetPasswordFormProps) {
  const router = useRouter()
  const { setUser } = useAuth()
  const [verifiedToken, setVerifiedToken] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)

  const [sendOTPByToken, { isLoading: isSendingOTP }] =
    useSendOTPByTokenMutation()
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation()

  const resetForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues,
  })

  useEffect(() => {
    if (profile?.email) {
      resetForm.setValue("email", profile.email)
    }
  }, [profile, resetForm])

  const onResetSubmit = async (values: ResetPasswordFormValues) => {
    try {
      await resetPassword({
        token: verifiedToken || token,
        newPassword: values.newPassword,
      }).unwrap()

      router.replace("/dashboard")
      router.refresh()
    } catch {
      // Error toast handled by API layer.
    }
  }

  const handleSendOTP = async () => {
    try {
      await sendOTPByToken({ token }).unwrap()
      toast.success("Verification code sent to your email.")
      onOtpSentChange(true)
    } catch (err: any) {
      toast.error(
        err?.data?.message ||
          "Failed to send verification code. Please try again."
      )
    }
  }

  const getDisplayName = () => {
    if ((profile as any).fullName) return (profile as any).fullName
    if ((profile as any).name) return (profile as any).name

    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      if (payload.fullName) return payload.fullName
    } catch {}

    return "User"
  }

  const getDisplayEmail = () => {
    if (profile?.email) return profile.email
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      if (payload.email) return payload.email
    } catch {}
    return ""
  }

  const getDisplayRole = () => {
    if (profile?.roles && profile.roles.length > 0) {
      return profile.roles.map((r) => r.name).join(", ")
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      if (payload.roles && Array.isArray(payload.roles)) {
        return payload.roles.join(", ")
      }
    } catch {}
    return "User"
  }

  const getDisplayTenant = () => {
    if (profile?.tenantName) return profile.tenantName
    if (profile?.tenant?.name) return profile.tenant.name
    return ""
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6 rounded-2xl border bg-card p-4 shadow-sm sm:p-6">
        {step === "otp" ? (
          <>
            {/* User Profile Card */}
            <div className="relative space-y-5 overflow-hidden rounded-xl border border-l-4 border-border border-l-primary bg-muted/10 p-4 shadow-sm transition-all sm:p-6">
              <div className="flex items-center gap-4">
                {profile?.profilePic && !imageError ? (
                  <img
                    src={profile.profilePic}
                    alt={getDisplayName()}
                    className="h-14 w-14 shrink-0 rounded-xl border border-border/50 bg-background object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <User className="h-7 w-7" />
                  </div>
                )}
                <div className="space-y-1">
                  <h3 className="text-xl font-bold tracking-tight text-foreground">
                    {getDisplayName()}
                  </h3>
                </div>
              </div>

              <div className="space-y-3.5 border-t border-border/60 pt-4">
                <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                  <Mail className="h-5 w-5 shrink-0 text-muted-foreground/75" />
                  <span className="break-all">{getDisplayEmail()}</span>
                </div>

                {getDisplayTenant() && (
                  <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                    <Building2 className="h-5 w-5 shrink-0 text-muted-foreground/75" />
                    <span>{getDisplayTenant()}</span>
                  </div>
                )}
              </div>

              {getDisplayRole() && (
                <div className="flex items-center gap-3 border-t border-border/60 pt-4 text-sm">
                  <IdCard className="h-5 w-5 shrink-0 text-primary" />
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-muted-foreground">
                      Role:
                    </span>
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-bold tracking-wide text-primary">
                      {getDisplayRole()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* OTP Sending State / Form */}
            {!otpSent ? (
              <div className="space-y-6">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  We need to send a secure verification code (OTP) to your
                  registered email address to verify your request.
                </p>

                <Button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={isSendingOTP}
                  className="w-full gap-2"
                  size="lg"
                >
                  {isSendingOTP ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending verification code...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Verification Code
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <VerifyOtpForm
                token={token}
                onSuccess={(newToken) => {
                  setVerifiedToken(newToken)
                  onStepChange("reset")
                }}
                onResend={handleSendOTP}
                isResending={isSendingOTP}
              />
            )}
          </>
        ) : (
          <FormProvider {...resetForm}>
            <form
              onSubmit={resetForm.handleSubmit(onResetSubmit)}
              className="space-y-6"
            >
              <div className="space-y-4">
                <FormInput
                  name="email"
                  label={labels.email}
                  type="email"
                  placeholder={placeholders.email}
                  disabled
                />

                <FormInput
                  name="newPassword"
                  label={labels.newPassword}
                  required
                  type="password"
                  placeholder={placeholders.newPassword}
                />

                <FormInput
                  name="confirmNewPassword"
                  label={labels.confirmNewPassword}
                  required
                  type="password"
                  placeholder={placeholders.confirmNewPassword}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full gap-2"
                disabled={isResetting}
              >
                {isResetting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Setting password...
                  </>
                ) : (
                  <>
                    <KeyRound className="size-4" />
                    Set password
                  </>
                )}
              </Button>
            </form>
          </FormProvider>
        )}
      </div>
    </div>
  )
}
