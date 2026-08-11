import { z } from "zod"

export const testingBookingSchema = z.object({
  tenantId: z.coerce
    .number()
    .positive("Tenant ID must be a positive number"),
  branchId: z.coerce
    .number()
    .positive("Branch ID must be a positive number"),
  customerId: z.coerce
    .number()
    .positive("Customer ID must be a positive number"),
  bookingTypeId: z.coerce
    .number()
    .positive("Booking Type ID must be a positive number"),
  currencyId: z.coerce
    .number()
    .positive("Currency ID must be a positive number"),
  services: z
    .array(
      z.object({
        branchServicesId: z.coerce
          .number()
          .positive("Branch Service ID must be a positive number"),
        tenantUserId: z.coerce
          .number()
          .positive("Tenant User ID must be a positive number"),
        branchResourceId: z.coerce
          .number()
          .positive("Branch Resource ID must be a positive number"),
        appointmentDate: z.string().min(1, "Appointment date is required"),
        startTime: z.string().min(1, "Start time is required"),
      })
    )
    .min(1, "At least one service is required"),
  notes: z.string().optional(),
})
