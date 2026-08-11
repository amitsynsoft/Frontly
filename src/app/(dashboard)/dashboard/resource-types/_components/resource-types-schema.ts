import { z } from "zod"

export const createResourceTypeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, {
      message: "Resource name must be at least 2 characters",
    })
    .max(120, {
      message: "Resource name cannot exceed 120 characters",
    }),
})

export type CreateResourceTypeFormValues = z.infer<
  typeof createResourceTypeSchema
>
