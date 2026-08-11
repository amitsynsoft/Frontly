import { z } from "zod"

/* -------------------------------------------------------------------------- */
/*                                   ENUMS                                    */
/* -------------------------------------------------------------------------- */

export const COMPANY_STATUS = {
  ACTIVE: "Active",
  INACTIVE: "InActive",
} as const

/* -------------------------------------------------------------------------- */
/*                                   SCHEMA                                   */
/* -------------------------------------------------------------------------- */

export const createCompanySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, {
      message: "Tenant name must be at least 2 characters",
    })
    .max(120, {
      message: "Tenant name cannot exceed 120 characters",
    }),

  currencyId: z.number().min(1, {
    message: "Currency is required",
  }),

  logo: z
    .string()
    .trim()
    .min(1, {
      message: "Logo is required",
    })
    .url({
      message: "Please enter a valid logo URL",
    }),

  description: z
    .string()
    .trim()
    .max(1000, {
      message: "Description cannot exceed 1000 characters",
    })
    .or(z.literal("")),

  languagesSupported: z.array(z.string()).min(1, {
    message: "At least one language is required",
  }),

  website: z.string().trim().url({
    message: "Please enter a valid website URL",
  }),

  status: z.enum([COMPANY_STATUS.ACTIVE, COMPANY_STATUS.INACTIVE]),
})

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

export type CreateCompanyFormValues = z.infer<typeof createCompanySchema>

/* -------------------------------------------------------------------------- */
/*                                   OPTIONS                                  */
/* -------------------------------------------------------------------------- */

export const statusOptions = [
  {
    label: "Active",
    value: COMPANY_STATUS.ACTIVE,
  },
  {
    label: "InActive",
    value: COMPANY_STATUS.INACTIVE,
  },
] as const
