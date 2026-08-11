import { z } from "zod"

export const serviceSchema = z.object({
  tenantId: z.string().min(1, "Tenant is required"),
  branchId: z.string().min(1, "Branch is required"),
  serviceId: z.string().min(1, "Master service is required"),
  durationMinutes: z
    .union([z.number(), z.string()])
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Duration must be a positive number",
    }),
  cost: z
    .union([z.number(), z.string()])
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Price must be a non-negative number",
    }),
  currencyId: z.string().min(1, "Currency is required"),
  bookingMode: z.string().min(1, "Booking mode is required"),
  maxCapacity: z
    .union([z.number(), z.string()])
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Max capacity must be a positive number",
    }),
  images: z.array(z.string()),
  tags: z.array(z.string()).optional(),
  minAdvanceBookingDays: z
    .union([z.number(), z.string()])
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Min advance booking days must be a non-negative number",
    }),
  isActive: z.boolean(),
  allowSendingReminder: z.boolean(),
  resourceIds: z.array(z.union([z.string(), z.number()])).optional(),

  /**
   * Internal UI state for the user-level pricing table.
   * On submit, only rows where `isChecked === true` are serialised
   * as `levelCosts: [{ branchLevelId, cost }]`.
   * The whole field is optional — omitted from the payload when nothing is checked.
   */
  levelCosts: z
    .array(
      z.object({
        branchLevelId: z.string(),
        name: z.string(),
        description: z.string(),
        isChecked: z.boolean(),
        cost: z.union([z.number(), z.string()]).optional(),
      })
    )
    .optional()
    .superRefine((data, ctx) => {
      if (!data) return
      data.forEach((item, index) => {
        if (item.isChecked) {
          const costVal = item.cost
          if (
            costVal === undefined ||
            costVal === null ||
            costVal === "" ||
            isNaN(Number(costVal)) ||
            Number(costVal) < 0
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Price must be a non-negative number",
              path: [index, "cost"],
            })
          }
        }
      })
    }),
})

export type ServiceFormValues = z.infer<typeof serviceSchema>

/** Exact shape the API expects per user level */
export interface LevelCostPayload {
  branchLevelId: number
  cost: number
}

export const bookingModeOptions = [
  { label: "Single Booking", value: "1" },
  { label: "Group Booking", value: "2" },
]

export const defaultValues: ServiceFormValues = {
  tenantId: "",
  branchId: "",
  serviceId: "",
  durationMinutes: 60,
  cost: 0,
  currencyId: "",
  bookingMode: "1",
  maxCapacity: 10,
  minAdvanceBookingDays: 1,
  images: [],
  tags: [],
  isActive: true,
  allowSendingReminder: true,
  resourceIds: [],
  levelCosts: [],
}
