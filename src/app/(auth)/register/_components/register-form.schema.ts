import { z } from "zod"

import { passwordComplexity, phoneSchema } from "@/lib/utils/zodValidation"

export const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: passwordComplexity(),
  phone: phoneSchema("Invalid phone number"),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be in YYYY-MM-DD format"),
  gender: z.enum(["male", "female", "other"] as const),
})

export type RegisterFormValues = z.infer<typeof registerSchema>
