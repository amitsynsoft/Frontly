import { z } from "zod"

export const designationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, {
      message: "Designation name must be at least 2 characters",
    })
    .max(100, {
      message: "Designation name cannot exceed 100 characters",
    }),
  description: z
    .string()
    .trim()
    .max(500, {
      message: "Description cannot exceed 500 characters",
    })
    .optional()
    .or(z.literal("")),
})

export type DesignationFormValues = z.infer<typeof designationSchema>
