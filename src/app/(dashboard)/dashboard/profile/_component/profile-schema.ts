import * as z from "zod"

import { passwordComplexity } from "@/lib/utils/zodValidation"

export const profileSchema = z.object({
  fullName: z.string().min(1),
  email: z.email(),
  mobileNumber: z.string().min(1),
})

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),

    newPassword: passwordComplexity(),

    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type ProfileFormValues = z.infer<typeof profileSchema>

export type PasswordFormValues = z.infer<typeof passwordSchema>
