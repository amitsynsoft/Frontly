import { z } from "zod"
import { DAY_LABELS } from "./staff-schedule-form.config"
import { DAY_CODES, type TimeRangeValue } from "./staff-schedule-form.types"

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/

const timeRangeSchema = z.object({
  startTime: z.string().regex(timePattern, "Enter a valid start time."),
  endTime: z.string().regex(timePattern, "Enter a valid end time."),
})

const dayAvailabilitySchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  dayCode: z.enum(DAY_CODES),
  isEnabled: z.boolean(),
  timeRanges: z.array(timeRangeSchema),
})

function validateTimeRanges(
  ranges: TimeRangeValue[],
  path: Array<string | number>,
  context: z.RefinementCtx
) {
  if (ranges.length === 0) {
    context.addIssue({
      code: "custom",
      path,
      message: "Add at least one time range.",
    })
    return
  }

  ranges.forEach((range, rangeIndex) => {
    if (range.startTime && range.endTime && range.startTime >= range.endTime) {
      context.addIssue({
        code: "custom",
        path: [...path, rangeIndex, "startTime"],
        message: "Start time must be earlier than end time.",
      })
      context.addIssue({
        code: "custom",
        path: [...path, rangeIndex, "endTime"],
        message: "End time must be later than start time.",
      })
    }
  })

  const sortedRanges = ranges
    .map((range, rangeIndex) => ({ ...range, rangeIndex }))
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  for (let index = 1; index < sortedRanges.length; index += 1) {
    const previous = sortedRanges[index - 1]
    const current = sortedRanges[index]

    if (current.startTime < previous.endTime) {
      context.addIssue({
        code: "custom",
        path: [...path, current.rangeIndex, "startTime"],
        message: "Time ranges cannot overlap.",
      })
      context.addIssue({
        code: "custom",
        path: [...path, previous.rangeIndex, "endTime"],
        message: "Time ranges cannot overlap.",
      })
    }
  }
}

export const staffScheduleSchema = z
  .object({
    staffId: z.string().min(1, "Choose a staff member."),
    branchId: z.string().min(1, "Choose a branch."),
    appointmentSettings: z.object({
      slotDurationMinutes: z.number().refine((value) => value === 30, {
        message: "Only 30-minute slot duration is supported currently.",
      }),
    }),
    schedulePattern: z.object({
      mode: z.enum(["daily", "weekly", "monthly"]),
      startDate: z.string().min(1, "Choose a schedule start date."),
      endsType: z.enum(["never", "until"]),
      untilDate: z.string(),
      monthlyDays: z.array(z.number().int().min(1).max(31)),
    }),
    availabilityTimeRanges: z.array(timeRangeSchema),
    weeklyAvailability: z.array(dayAvailabilitySchema).length(7),
    previewDate: z.string().min(1),
  })
  .superRefine((values, context) => {
    const frequency = values.schedulePattern.mode.toUpperCase()

    if (frequency === "WEEKLY") {
      const enabledDays = values.weeklyAvailability.filter(
        (day) => day.isEnabled
      )

      if (enabledDays.length === 0) {
        context.addIssue({
          code: "custom",
          path: ["weeklyAvailability"],
          message: "Enable at least one weekday.",
        })
      }

      values.weeklyAvailability.forEach((day, dayIndex) => {
        if (day.isEnabled) {
          validateTimeRanges(
            day.timeRanges,
            ["weeklyAvailability", dayIndex, "timeRanges"],
            context
          )
        }
      })
    } else {
      validateTimeRanges(
        values.availabilityTimeRanges,
        ["availabilityTimeRanges"],
        context
      )
    }

    if (
      frequency === "MONTHLY" &&
      values.schedulePattern.monthlyDays.length === 0
    ) {
      context.addIssue({
        code: "custom",
        path: ["schedulePattern", "monthlyDays"],
        message: "Choose at least one day of the month.",
      })
    }

    if (
      values.schedulePattern.endsType === "until" &&
      (!values.schedulePattern.untilDate ||
        values.schedulePattern.untilDate <= values.schedulePattern.startDate)
    ) {
      context.addIssue({
        code: "custom",
        path: ["schedulePattern", "untilDate"],
        message: "End date must be after the start date.",
      })
    }
  })

export const getStaffScheduleSchema = (selectedBranch?: any) => {
  return staffScheduleSchema.superRefine((values, context) => {
    if (!selectedBranch || !selectedBranch.operatingHours) return

    const frequency = values.schedulePattern.mode.toUpperCase()

    if (frequency === "WEEKLY") {
      values.weeklyAvailability.forEach((day, dayIndex) => {
        if (day.isEnabled) {
          const dayName = DAY_LABELS[dayIndex]
          const branchHours = selectedBranch.operatingHours[dayName]
          const isOpen = !!(branchHours && branchHours.start && branchHours.end)

          if (!isOpen) {
            context.addIssue({
              code: "custom",
              path: ["weeklyAvailability", dayIndex, "isEnabled"],
              message: `Branch is closed on ${dayName}.`,
            })
          } else {
            day.timeRanges.forEach((range, rangeIndex) => {
              if (range.startTime < branchHours.start) {
                context.addIssue({
                  code: "custom",
                  path: [
                    "weeklyAvailability",
                    dayIndex,
                    "timeRanges",
                    rangeIndex,
                    "startTime",
                  ],
                  message: `Cannot start before branch opens (${branchHours.start}).`,
                })
              }
              if (range.endTime > branchHours.end) {
                context.addIssue({
                  code: "custom",
                  path: [
                    "weeklyAvailability",
                    dayIndex,
                    "timeRanges",
                    rangeIndex,
                    "endTime",
                  ],
                  message: `Cannot end after branch closes (${branchHours.end}).`,
                })
              }
            })
          }
        }
      })
    } else {
      let minStart: string | null = null
      let maxEnd: string | null = null
      for (const dayName of DAY_LABELS) {
        const hours = selectedBranch.operatingHours[dayName]
        if (hours && hours.start && hours.end) {
          if (!minStart || hours.start < minStart) minStart = hours.start
          if (!maxEnd || hours.end > maxEnd) maxEnd = hours.end
        }
      }

      if (minStart && maxEnd) {
        values.availabilityTimeRanges.forEach((range, rangeIndex) => {
          if (range.startTime < minStart!) {
            context.addIssue({
              code: "custom",
              path: ["availabilityTimeRanges", rangeIndex, "startTime"],
              message: `Cannot start before branch opens (${minStart}).`,
            })
          }
          if (range.endTime > maxEnd!) {
            context.addIssue({
              code: "custom",
              path: ["availabilityTimeRanges", rangeIndex, "endTime"],
              message: `Cannot end after branch closes (${maxEnd}).`,
            })
          }
        })
      }
    }
  })
}

export type StaffScheduleSchema = z.infer<typeof staffScheduleSchema>
