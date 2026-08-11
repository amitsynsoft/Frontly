export const DAY_CODES = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"] as const
export const RECURRENCE_FREQUENCIES = ["DAILY", "WEEKLY", "MONTHLY"] as const

export type DayCode = (typeof DAY_CODES)[number]
export type RecurrenceFrequency = (typeof RECURRENCE_FREQUENCIES)[number]
export type ScheduleMode = "daily" | "weekly" | "monthly"
export type RecurrenceEndType = "never" | "until"

export interface TimeRangeValue {
  startTime: string
  endTime: string
}

export interface DayAvailabilityValue {
  dayOfWeek: number
  dayCode: DayCode
  isEnabled: boolean
  timeRanges: TimeRangeValue[]
}

export interface StaffScheduleFormValues {
  staffId: string
  branchId: string
  appointmentSettings: {
    slotDurationMinutes: number
  }
  schedulePattern: {
    mode: ScheduleMode
    startDate: string
    endsType: RecurrenceEndType
    untilDate: string
    monthlyDays: number[]
  }
  availabilityTimeRanges: TimeRangeValue[]
  weeklyAvailability: DayAvailabilityValue[]
  previewDate: string
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface PreviewSlot {
  startTime: string
  endTime: string
}
