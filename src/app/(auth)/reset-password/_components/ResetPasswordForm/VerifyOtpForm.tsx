"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { KeyRound, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Controller, FormProvider, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils/cn.utils"
import { useVerifyOTPMutation } from "@/store/api/auth.api"

import { OtpInput } from "./OtpInput"
import { otpDefaultValues } from "./ResetPasswordForm.config"
import { verifyOtpSchema } from "./ResetPasswordForm.schema"
import { VerifyOtpFormValues } from "./ResetPasswordForm.type"

interface VerifyOtpFormProps {
  token: string
  onSuccess: (newToken: string) => void
  onResend: () => Promise<void>
  isResending: boolean
}

export function VerifyOtpForm({
  token,
  onSuccess,
  onResend,
  isResending,
}: VerifyOtpFormProps) {
  const [verifyOTP, { isLoading }] = useVerifyOTPMutation()
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes in seconds

  const form = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: otpDefaultValues,
    mode: "onSubmit",
  })

  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const onSubmit = async (values: VerifyOtpFormValues) => {
    try {
      const res = await verifyOTP({
        token,
        otp: values.otp,
      }).unwrap()

      onSuccess(res.token)
    } catch (err: any) {
      const errMsg =
        err?.data?.message || "Invalid or expired OTP. Please try again."

      form.setError("otp", { message: errMsg })
    }
  }

  const handleResend = async () => {
    try {
      await onResend()
      setTimeLeft(120)
    } catch {
      // Error handled by parent / toast
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Controller
          control={form.control}
          name="otp"
          render={({ field, fieldState }) => (
            <div className="space-y-3">
              <div
                className={cn(
                  "flex justify-center rounded-xl border bg-muted/30 p-2 sm:p-4 transition-colors",
                  fieldState.error && "border-destructive/40 bg-destructive/5"
                )}
              >
                <OtpInput
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isLoading}
                  error={!!fieldState.error}
                />
              </div>

              {fieldState.error && (
                <p className="text-center text-sm font-medium text-destructive">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        <div className="space-y-4">
          <Button
            type="submit"
            size="lg"
            className="w-full gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Verifying OTP...
              </>
            ) : (
              <>
                <KeyRound className="size-4" />
                Verify OTP
              </>
            )}
          </Button>

          <div className="flex flex-col items-center justify-center gap-2 pt-1 text-center">
            {timeLeft > 0 ? (
              <p className="text-xs text-muted-foreground font-medium">
                Didn't receive the code? Resend in{" "}
                <span className="text-primary font-semibold">
                  {formatTime(timeLeft)}
                </span>
              </p>
            ) : (
              <Button
                type="button"
                variant="link"
                onClick={handleResend}
                disabled={isResending}
                className="h-auto p-0 text-xs font-semibold text-primary hover:underline"
              >
                {isResending ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1.5 inline-block" />
                ) : null}
                Resend Verification Code
              </Button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
