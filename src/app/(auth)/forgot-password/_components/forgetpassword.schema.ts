import { z } from "zod"

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required." })
    .max(50, { message: "Email must be at most 50 characters long." })
    .email({ message: "Please enter a valid email address." }),
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
