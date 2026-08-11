import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required." })
    .max(50, { message: "Email must be at most 50 characters long." })
    .email({ message: "Please enter a valid email address." }),

  password: z
    .string()
    .trim()
    .min(1, { message: "Password is required." })
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(50, "Password must be at most 50 characters long."),
})

export type LoginFormValues = z.infer<typeof loginSchema>
