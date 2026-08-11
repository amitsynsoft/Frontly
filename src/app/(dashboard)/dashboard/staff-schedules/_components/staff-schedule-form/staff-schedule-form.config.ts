import {
  DAY_CODES,
  type DayAvailabilityValue,
  type ScheduleMode,
  type StaffScheduleFormValues,
} from "./staff-schedule-form.types"

export const SLOT_DURATION_OPTIONS = [15, 30, 45, 60] as const
export const MONTH_DAYS = Array.from({ length: 31 }, (_, index) => index + 1)

export const DAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const

export const SCHEDULE_MODE_OPTIONS: Array<{
  value: ScheduleMode
  label: string
  description: string
}> = [
  {
    value: "daily",
    label: "Daily",
    description: "The same hours every day",
  },
  {
    value: "weekly",
    label: "Weekly",
    description: "Different hours by weekday",
  },
  {
    value: "monthly",
    label: "Monthly",
    description: "Selected dates each month",
  },
]

export const SCHEDULE_TEXT = {
  sections: {
    basicTitle: "Schedule setup",
    basicDescription:
      "Choose the staff member and location for this availability.",
    patternTitle: "Schedule pattern",
    patternDescription:
      "Choose how availability repeats, when it starts, and when it ends.",
  },
  appointment: {
    title: "Appointment length",
    description: "Choose how long each bookable time slot should be.",
  },
  preview: {
    title: "Schedule review",
    description: "Check the availability customers will see before saving.",
    staff: "Staff member",
    branch: "Location",
    repeat: "Repeats",
    dateRange: "Date range",
    duration: "Appointment length",
    availability: "Working hours",
    noSlots: "This date is outside the current schedule pattern.",
    noFittingSlots: "No appointment times fit inside the configured hours.",
    slotsLimited: "Showing the first 12 appointment times.",
  },
  actions: {
    addTimeRange: "Add time range",
    copyHours: "Copy hours",
    cancel: "Cancel",
    submit: "Create Schedule",
    update: "Update Schedule",
  },
  footer: {
    title: "Ready to create the schedule?",
    description: "Review the summary and example appointments before saving.",
  },
  feedback: {
    success: "Schedule successfully created.",
  },
} as const

function toDateInputValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function createWeeklyAvailability(): DayAvailabilityValue[] {
  return DAY_LABELS.map((_, dayOfWeek) => ({
    dayOfWeek,
    dayCode: DAY_CODES[dayOfWeek],
    isEnabled: false,
    timeRanges: [],
  }))
}

export function createStaffScheduleDefaults(
  requestedBranchId?: string
): StaffScheduleFormValues {
  const today = new Date()
  const previewDate = new Date(today)
  previewDate.setDate(today.getDate() + ((1 - today.getDay() + 7) % 7))

  return {
    staffId: "",
    branchId: requestedBranchId ?? "",
    appointmentSettings: {
      slotDurationMinutes: 30,
    },
    schedulePattern: {
      mode: "weekly",
      startDate: toDateInputValue(today),
      endsType: "never",
      untilDate: "",
      monthlyDays: [],
    },
    availabilityTimeRanges: [],
    weeklyAvailability: createWeeklyAvailability(),
    previewDate: toDateInputValue(previewDate),
  }
}
