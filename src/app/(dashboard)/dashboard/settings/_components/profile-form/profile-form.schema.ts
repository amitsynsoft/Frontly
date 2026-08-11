import { z } from "zod"

export const profileFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .max(100, "Name must be at most 100 characters"),
  email: z.string().email("Invalid email address"),
  profilePic: z.string().optional().or(z.literal("")),
  bio: z.string().trim().optional().or(z.literal("")),
})
