import { z } from "zod"
import { testingBookingSchema } from "./testing-booking-form.schema"

export type TestingBookingFormValues = z.infer<typeof testingBookingSchema>
