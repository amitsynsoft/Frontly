import { z } from "zod"

export const createResourceSchema = z.object({
  tenantId: z.string().min(1, "Company is required"),
  branchId: z.string().min(1, "Branch  is required"),
  resourceTypeId: z.string().min(1, "Resource Type is required"),
  name: z
    .string()
    .trim()
    .min(2, "Resource name must be at least 2 characters")
    .max(120, "Resource name cannot exceed 120 characters"),
  maxCapacity: z
    .union([z.number(), z.string()])
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Max capacity must be a positive number",
    }),
})

export type CreateResourceFormValues = z.infer<typeof createResourceSchema>
export function getResourceDefaultValues(
  defaultTenantId = ""
): CreateResourceFormValues {
  return {
    tenantId: defaultTenantId,
    branchId: "",
    resourceTypeId: "",
    name: "",
    maxCapacity: 1,
  }
}
