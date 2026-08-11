import { z } from "zod"

import { phoneSchema } from "@/lib/utils/zodValidation"

export const LOCATION_STATUS = {
  ACTIVE: "Active",
  INACTIVE: "InActive",
} as const

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const
export const FACILITY_OPTIONS = [
  "waiting_area",
  "wifi",
  "cafeteria",
  "atm",
  "meeting_room",
  "reception",
] as const
export type DayOfWeek = (typeof DAYS_OF_WEEK)[number]

// Single day operating hour
const operatingHourSchema = z.object({
  start: z
    .string()
    .regex(/^\d{2}:\d{2}$/, { message: "Time must be in HH:MM format" }),
  end: z
    .string()
    .regex(/^\d{2}:\d{2}$/, { message: "Time must be in HH:MM format" }),
})

// Per-day entry used in the form: includes an `enabled` toggle
const dayScheduleSchema = z.object({
  enabled: z.boolean().default(false),
  start: z.string().default("09:00"),
  end: z.string().default("18:00"),
})

// Full week schedule (all 7 days present in the form, toggled on/off)
const weekScheduleSchema = z.object({
  Monday: dayScheduleSchema,
  Tuesday: dayScheduleSchema,
  Wednesday: dayScheduleSchema,
  Thursday: dayScheduleSchema,
  Friday: dayScheduleSchema,
  Saturday: dayScheduleSchema,
  Sunday: dayScheduleSchema,
})

export const createLocationSchema = z.object({
  // ── Organisation ──────────────────────────────────────────────────────────
  tenantId: z.preprocess(
    (val) =>
      val === "" || val === undefined || val === null ? undefined : Number(val),
    z
      .number({ message: "Tenant is required" })
      .min(1, { message: "Tenant is required" })
  ),

  // ── Basic Info ────────────────────────────────────────────────────────────
  name: z
    .string()
    .trim()
    .min(2, { message: "Branch name must be at least 2 characters" })
    .max(120, { message: "Branch name cannot exceed 120 characters" }),

  email: z.string().trim().email({ message: "Invalid email address" }),

  description: z
    .string()
    .trim()
    .max(500, { message: "Description cannot exceed 500 characters" })
    .default(""),

  // ── Contact Numbers ───────────────────────────────────────────────────────
  mobileNumber: z.string().trim().default(""),
  frontdeskNumber: phoneSchema(),
  tollFreeNumber: z
    .string()
    .trim()
    .min(5, {
      message: "Toll-free number is required",
    })
    .max(30, {
      message: "Toll-free number is too long",
    })
    .regex(/^[0-9+\-\s()]+$/, {
      message: "Invalid toll-free number format",
    }),
  // ── Address ───────────────────────────────────────────────────────────────
  address: z.string().trim().min(5, { message: "Address is required" }),
  city: z.string().trim().min(2, { message: "City is required" }),
  state: z.string().trim().min(2, { message: "State is required" }),
  country: z.string().trim().min(2, { message: "Country is required" }),
  postalCode: z.string().trim().min(2, { message: "Postal Code is required" }),

  // ── Geo & Timezone ────────────────────────────────────────────────────────
  latitude: z.preprocess(
    (val) =>
      val === "" || val === undefined || val === null ? undefined : Number(val),
    z
      .number()
      .min(-90, { message: "Latitude must be between -90 and 90" })
      .max(90, { message: "Latitude must be between -90 and 90" })
      .optional()
  ),

  longitude: z.preprocess(
    (val) =>
      val === "" || val === undefined || val === null ? undefined : Number(val),
    z
      .number()
      .min(-180, { message: "Longitude must be between -180 and 180" })
      .max(180, { message: "Longitude must be between -180 and 180" })
      .optional()
  ),

  timezone: z.string().trim().min(2, { message: "Timezone is required" }),

  // ── Operating Hours (structured per-day) ──────────────────────────────────
  operatingHours: weekScheduleSchema,

  // ── Status & Metadata ─────────────────────────────────────────────────────
  isActive: z.boolean().default(true),

  metadata: z
    .object({
      parking: z.boolean().default(false),
      wheelchairAccessible: z.boolean().default(false),
      facilities: z.array(z.enum(FACILITY_OPTIONS)).default([]),
    })
    .default({
      parking: false,
      wheelchairAccessible: false,
      facilities: [],
    }),
})

export type CreateLocationFormValues = z.input<typeof createLocationSchema>
export type CreateLocationFormOutput = z.output<typeof createLocationSchema>

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Convert the form's flat week-schedule into the API's `OperatingHours` shape
 * (only enabled days are included, the `enabled` flag is stripped out).
 */
export function getLocationDefaultValues(
  defaultTenantId = ""
): CreateLocationFormValues {
  const defaultOperatingHours: CreateLocationFormValues["operatingHours"] =
    Object.fromEntries(
      DAYS_OF_WEEK.map((day) => [
        day,
        {
          enabled: !["Saturday", "Sunday"].includes(day),
          start: "09:00",
          end: "18:00",
        },
      ])
    ) as CreateLocationFormValues["operatingHours"]

  return {
    tenantId: defaultTenantId ? Number(defaultTenantId) : undefined,

    name: "",
    email: "",
    description: "",

    mobileNumber: "",
    frontdeskNumber: "",
    tollFreeNumber: "",

    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",

    latitude: undefined,
    longitude: undefined,
    timezone: "",

    operatingHours: defaultOperatingHours,

    isActive: true,

    metadata: {
      parking: false,
      wheelchairAccessible: false,
      facilities: [],
    },
  }
}
export function formScheduleToApiOperatingHours(
  schedule: CreateLocationFormValues["operatingHours"]
): Partial<Record<DayOfWeek, { start: string; end: string }>> {
  const result: Partial<Record<DayOfWeek, { start: string; end: string }>> = {}
  for (const day of DAYS_OF_WEEK) {
    const entry = schedule[day]
    if (entry?.enabled) {
      result[day] = {
        start: entry.start ?? "09:00",
        end: entry.end ?? "18:00",
      }
    }
  }
  return result
}

/**
 * Convert the API's `OperatingHours` back into the form's week-schedule shape.
 */
export function apiOperatingHoursToFormSchedule(
  hours: Partial<Record<DayOfWeek, { start: string; end: string }>> = {}
): CreateLocationFormValues["operatingHours"] {
  const result = {} as CreateLocationFormValues["operatingHours"]
  for (const day of DAYS_OF_WEEK) {
    const entry = hours[day]
    result[day] = entry
      ? { enabled: true, start: entry.start, end: entry.end }
      : { enabled: false, start: "09:00", end: "18:00" }
  }
  return result
}

export const statusOptions = [
  { label: "Active", value: LOCATION_STATUS.ACTIVE },
  { label: "Inactive", value: LOCATION_STATUS.INACTIVE },
] as const
