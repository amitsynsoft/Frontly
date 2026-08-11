import { z } from "zod"

import { passwordComplexity } from "@/lib/utils/zodValidation"

export const resetPasswordSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    newPassword: passwordComplexity(),
    confirmNewPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  })

export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .length(6, "Verification code must be exactly 6 digits")
    .regex(/^\d+$/, "Verification code must contain only numbers"),
})
