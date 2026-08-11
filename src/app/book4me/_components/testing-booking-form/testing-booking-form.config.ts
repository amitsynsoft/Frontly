import { TestingBookingFormValues } from "./testing-booking-form.type"

export const defaultTestingBookingValues: TestingBookingFormValues = {
  tenantId: "" as any,
  branchId: "" as any,
  customerId: "" as any, // Left empty for user manual input
  bookingTypeId: "" as any, // Left empty for user manual input
  currencyId: "" as any, // Left empty for user manual input
  services: [
    {
      branchServicesId: "" as any,
      tenantUserId: "" as any,
      branchResourceId: "" as any,
      appointmentDate: "",
      startTime: "",
    },
  ],
  notes: "",
}
