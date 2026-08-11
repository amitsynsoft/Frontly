import type { CalendarEvent } from "../../../app/(dashboard)/dashboard/staff-schedules/_components/staff-schedule-calendar"
import { DAY_LABELS } from "../../../app/(dashboard)/dashboard/staff-schedules/_components/staff-schedule-form/staff-schedule-form.config"
import {
  DAY_CODES,
  type DayCode,
  type PreviewSlot,
  type RecurrenceFrequency,
  type StaffScheduleFormValues,
  type TimeRangeValue,
} from "../../../app/(dashboard)/dashboard/staff-schedules/_components/staff-schedule-form/staff-schedule-form.types"

function compactDate(date: string) {
  return date.replaceAll("-", "")
}

function compactDateTime(date: string, time: string) {
  const [hours = "00", minutes = "00"] = time.split(":")
  return `${compactDate(date)}T${hours}${minutes}00`
}

function compactEndOfDate(date: string) {
  return `${compactDate(date)}T235959`
}

function parseDate(dateValue: string) {
  const [year, month, day] = dateValue.split("-").map(Number)
  return new Date(year, month - 1, day, 12)
}

function toMinutes(time: string) {
  const [hours = 0, minutes = 0] = time.split(":").map(Number)
  return hours * 60 + minutes
}

function fromMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
}

export function getEffectiveFrequency(
  values: StaffScheduleFormValues
): RecurrenceFrequency {
  return values.schedulePattern.mode.toUpperCase() as RecurrenceFrequency
}

function getRRuleUntil(values: StaffScheduleFormValues) {
  return values.schedulePattern.endsType === "until"
    ? values.schedulePattern.untilDate
    : ""
}

function minutesToDuration(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`
}

export function matchesScheduleDate(
  values: StaffScheduleFormValues,
  dateValue: string
) {
  if (!dateValue || dateValue < values.schedulePattern.startDate) return false

  if (
    values.schedulePattern.endsType === "until" &&
    values.schedulePattern.untilDate &&
    dateValue > values.schedulePattern.untilDate
  ) {
    return false
  }

  const frequency = getEffectiveFrequency(values)
  const date = parseDate(dateValue)

  if (frequency === "DAILY") {
    return true
  }

  if (frequency === "WEEKLY") {
    const dayIsEnabled = values.weeklyAvailability.some(
      (day) => day.dayOfWeek === date.getDay() && day.isEnabled
    )
    if (!dayIsEnabled) return false
    return true
  }

  return values.schedulePattern.monthlyDays.includes(date.getDate())
}

export function getTimeRangesForDate(
  values: StaffScheduleFormValues,
  dateValue: string
): TimeRangeValue[] {
  if (getEffectiveFrequency(values) !== "WEEKLY") {
    return values.availabilityTimeRanges
  }

  const dayOfWeek = parseDate(dateValue).getDay()
  return (
    values.weeklyAvailability.find(
      (day) => day.dayOfWeek === dayOfWeek && day.isEnabled
    )?.timeRanges ?? []
  )
}

export function generatePreviewSlots(
  values: StaffScheduleFormValues
): PreviewSlot[] {
  if (!values.previewDate || !matchesScheduleDate(values, values.previewDate)) {
    return []
  }

  const ranges = getTimeRangesForDate(values, values.previewDate)
  const { slotDurationMinutes } = values.appointmentSettings
  const slots: PreviewSlot[] = []

  for (const range of ranges) {
    let cursor = toMinutes(range.startTime)
    const rangeEnd = toMinutes(range.endTime)

    while (cursor + slotDurationMinutes <= rangeEnd) {
      slots.push({
        startTime: fromMinutes(cursor),
        endTime: fromMinutes(cursor + slotDurationMinutes),
      })
      cursor += slotDurationMinutes
    }
  }

  return slots
}

export function buildStaffSchedulePayload(values: StaffScheduleFormValues) {
  return {
    tenantUserId: values.staffId,
    branchId: values.branchId,
    scheduleDate: values.schedulePattern.startDate,
    rruleUntil: getRRuleUntil(values),
    rrule: generateStaffScheduleRRules(values),
  }
}

function getSlotStartTimes(
  ranges: TimeRangeValue[],
  slotDurationMinutes: number
) {
  if (slotDurationMinutes <= 0) return []

  const slots = new Set<string>()

  for (const range of ranges) {
    let cursor = toMinutes(range.startTime)
    const rangeEnd = toMinutes(range.endTime)

    while (cursor + slotDurationMinutes <= rangeEnd) {
      slots.add(fromMinutes(cursor))
      cursor += slotDurationMinutes
    }
  }

  return [...slots].sort()
}

function toSortedNumbers(values: Iterable<number>) {
  return [...values].sort((left, right) => left - right)
}

// Fixed function parameters alignment with types
function createSlotGroupKey(byhour: number[], byminute: number[]) {
  return `${byhour.join(",")}|${byminute.join(",")}`
}

function getDaySortValue(dayCode: DayCode) {
  const order: Record<DayCode, number> = {
    SU: 0,
    MO: 1,
    TU: 2,
    WE: 3,
    TH: 4,
    FR: 5,
    SA: 6,
  }

  return order[dayCode]
}

function createSlotStartTime(byhour: number[], byminute: number[]) {
  return `${String(Math.min(...byhour)).padStart(2, "0")}:${String(
    Math.min(...byminute)
  ).padStart(2, "0")}`
}

function getGroupedSlotStarts(
  slotStartTimes: string[],
  primaryPart: "hour" | "minute"
) {
  const grouped = new Map<string, Set<number>>()

  for (const startTime of slotStartTimes) {
    const [hour = 0, minute = 0] = startTime.split(":").map(Number)
    const primary = primaryPart === "hour" ? hour : minute
    const secondary = primaryPart === "hour" ? minute : hour
    const secondaryValues = grouped.get(String(primary)) ?? new Set<number>()

    secondaryValues.add(secondary)
    grouped.set(String(primary), secondaryValues)
  }

  const groupedByPattern = new Map<
    string,
    {
      primaryValues: Set<number>
      secondaryValues: number[]
    }
  >()

  for (const [primary, secondaryValues] of grouped.entries()) {
    const sortedSecondaryValues = toSortedNumbers(secondaryValues)
    const key = sortedSecondaryValues.join(",")
    const existingGroup = groupedByPattern.get(key) ?? {
      primaryValues: new Set<number>(),
      secondaryValues: sortedSecondaryValues,
    }

    existingGroup.primaryValues.add(Number(primary))
    groupedByPattern.set(key, existingGroup)
  }

  return [...groupedByPattern.values()]
    .map(({ primaryValues, secondaryValues }) => {
      const sortedPrimaryValues = toSortedNumbers(primaryValues)
      const byhour =
        primaryPart === "hour" ? sortedPrimaryValues : secondaryValues
      const byminute =
        primaryPart === "hour" ? secondaryValues : sortedPrimaryValues

      return {
        byhour,
        byminute,
        startTime: createSlotStartTime(byhour, byminute),
      }
    })
    .sort(
      (left, right) => toMinutes(left.startTime) - toMinutes(right.startTime)
    )
}

function compressSlotStartTimes(slotStartTimes: string[]) {
  const hourFirstGroups = getGroupedSlotStarts(slotStartTimes, "hour")
  const minuteFirstGroups = getGroupedSlotStarts(slotStartTimes, "minute")

  return hourFirstGroups.length <= minuteFirstGroups.length
    ? hourFirstGroups
    : minuteFirstGroups
}

function buildSlotRRule({
  byday,
  byhour,
  byminute,
  bymonthday,
  frequency,
  startDate,
  startTime,
  untilDate,
}: {
  byday?: DayCode | DayCode[]
  byhour?: number[]
  byminute?: number | number[]
  bymonthday?: number | number[]
  frequency: RecurrenceFrequency
  startDate: string
  startTime: string
  untilDate: string
}) {
  const parts = [`FREQ=${frequency}`, "INTERVAL=1"]

  if (frequency === "WEEKLY" && byday) {
    parts.push(`BYDAY=${(Array.isArray(byday) ? byday : [byday]).join(",")}`)
  }

  if (
    frequency === "MONTHLY" &&
    bymonthday &&
    (Array.isArray(bymonthday) ? bymonthday.length : true)
  ) {
    parts.push(
      `BYMONTHDAY=${(Array.isArray(bymonthday) ? bymonthday : [bymonthday]).join(",")}`
    )
  }

  if (byhour?.length) {
    parts.push(`BYHOUR=${byhour.join(",")}`)
  }

  if (byminute !== undefined) {
    parts.push(
      `BYMINUTE=${(Array.isArray(byminute) ? byminute : [byminute]).join(",")}`
    )
  }

  if (untilDate) {
    parts.push(`UNTIL=${compactEndOfDate(untilDate)}`)
  }

  return `DTSTART:${compactDateTime(startDate, startTime)}\nRRULE:${parts.join(";")}`
}

export function generateStaffScheduleRRules(values: StaffScheduleFormValues) {
  const frequency = getEffectiveFrequency(values)
  const slotDurationMinutes = values.appointmentSettings.slotDurationMinutes
  const startDate = values.schedulePattern.startDate
  const untilDate = getRRuleUntil(values)

  if (frequency === "WEEKLY") {
    const groupedWeeklySlots = new Map<
      string,
      {
        byday: DayCode[]
        byhour: number[]
        byminute: number[]
        startTime: string
      }
    >()

    for (const day of values.weeklyAvailability) {
      if (!day.isEnabled) continue

      for (const range of day.timeRanges) {
        const slotGroups = compressSlotStartTimes(
          getSlotStartTimes([range], slotDurationMinutes)
        )

        for (const slotGroup of slotGroups) {
          const key = `${slotGroup.startTime}|${createSlotGroupKey(
            slotGroup.byhour,
            slotGroup.byminute
          )}`
          const existingGroup = groupedWeeklySlots.get(key) ?? {
            byday: [],
            byhour: slotGroup.byhour,
            byminute: slotGroup.byminute,
            startTime: slotGroup.startTime,
          }

          if (!existingGroup.byday.includes(day.dayCode)) {
            existingGroup.byday.push(day.dayCode)
          }
          groupedWeeklySlots.set(key, existingGroup)
        }
      }
    }

    return [...groupedWeeklySlots.values()]
      .sort(
        (left, right) =>
          toMinutes(left.startTime) - toMinutes(right.startTime) ||
          getDaySortValue(left.byday[0]) - getDaySortValue(right.byday[0])
      )
      .map(({ byday, byhour, byminute, startTime }) =>
        buildSlotRRule({
          byday,
          byhour,
          byminute,
          frequency,
          startDate,
          startTime,
          untilDate,
        })
      )
  }

  if (frequency === "MONTHLY") {
    const monthlyDays = [...values.schedulePattern.monthlyDays].sort(
      (left, right) => left - right
    )
    const rrules: string[] = []

    for (const range of values.availabilityTimeRanges) {
      const slotStartTimes = getSlotStartTimes([range], slotDurationMinutes)
      const slotGroups = compressSlotStartTimes(slotStartTimes)

      for (const { byhour, byminute, startTime } of slotGroups) {
        rrules.push(
          buildSlotRRule({
            byhour,
            byminute,
            bymonthday: monthlyDays,
            frequency,
            startDate,
            startTime,
            untilDate,
          })
        )
      }
    }

    return rrules
  }

  // DAILY frequency
  const rrules: string[] = []
  for (const range of values.availabilityTimeRanges) {
    const slotStartTimes = getSlotStartTimes([range], slotDurationMinutes)
    const slotGroups = compressSlotStartTimes(slotStartTimes)

    for (const { byhour, byminute, startTime } of slotGroups) {
      rrules.push(
        buildSlotRRule({
          byhour,
          byminute,
          frequency,
          startDate,
          startTime,
          untilDate,
        })
      )
    }
  }

  return rrules
}

export function generateCalendarEvents(
  values: StaffScheduleFormValues
): CalendarEvent[] {
  const slotDurationMinutes = values.appointmentSettings.slotDurationMinutes
  const duration = minutesToDuration(slotDurationMinutes)

  return buildStaffSchedulePayload(values).rrule.map((rrule, index) => ({
    id: `preview-rrule-${index}`,
    title: "Available",
    rrule,
    duration,
    backgroundColor: "#763aee",
    borderColor: "#763aee",
    textColor: "#ffffff",
    extendedProps: {
      isAvailable: true,
    },
  }))
}

// Extracted parse helper
function parseRRuleString(rruleStr: string) {
  const lines = rruleStr.split("\n")
  let dtstartStr = ""
  let rrulePart = ""
  for (const line of lines) {
    if (line.startsWith("DTSTART:")) {
      dtstartStr = line.slice(8)
    } else if (line.startsWith("RRULE:")) {
      rrulePart = line.slice(6)
    }
  }

  let startDate = ""
  if (dtstartStr) {
    const match = dtstartStr.match(/^(\d{4})(\d{2})(\d{2})/)
    if (match) {
      startDate = `${match[1]}-${match[2]}-${match[3]}`
    }
  }

  const params: Record<string, string> = {}
  if (rrulePart) {
    const parts = rrulePart.split(";")
    for (const part of parts) {
      const [key, val] = part.split("=")
      if (key && val) {
        params[key.toUpperCase()] = val
      }
    }
  }

  const freq = params.FREQ
  const untilStr = params.UNTIL
  let untilDate = ""
  if (untilStr) {
    const match = untilStr.match(/^(\d{4})(\d{2})(\d{2})/)
    if (match) {
      untilDate = `${match[1]}-${match[2]}-${match[3]}`
    }
  }

  const byday = params.BYDAY ? params.BYDAY.split(",") : []
  const bymonthday = params.BYMONTHDAY
    ? params.BYMONTHDAY.split(",").map(Number)
    : []
  const byhour = params.BYHOUR ? params.BYHOUR.split(",").map(Number) : []
  const byminute = params.BYMINUTE
    ? params.BYMINUTE.split(",").map(Number)
    : [0]

  return {
    startDate,
    frequency: freq as "DAILY" | "WEEKLY" | "MONTHLY" | undefined,
    untilDate,
    byday,
    bymonthday,
    byhour,
    byminute,
  }
}

export function mapScheduleToFormValues(
  schedule: any
): StaffScheduleFormValues {
  const rrules = schedule?.rrule ?? []
  const todayStr = new Date().toISOString().split("T")[0]

  const defaultWeeklyAvailability = DAY_LABELS.map((_, dayOfWeek) => ({
    dayOfWeek,
    dayCode: DAY_CODES[dayOfWeek],
    isEnabled: false,
    timeRanges: [] as TimeRangeValue[],
  }))

  const formValues: StaffScheduleFormValues = {
    staffId: schedule?.tenantUserId ? String(schedule.tenantUserId) : "",
    branchId: schedule?.branchId ? String(schedule.branchId) : "",
    appointmentSettings: {
      slotDurationMinutes: 30, // 30 min default
    },
    schedulePattern: {
      mode: "weekly",
      startDate: schedule?.scheduleDate ?? todayStr,
      endsType: schedule?.rruleUntil ? "until" : "never",
      untilDate: schedule?.rruleUntil ? schedule.rruleUntil.split("T")[0] : "",
      monthlyDays: [],
    },
    availabilityTimeRanges: [],
    weeklyAvailability: defaultWeeklyAvailability,
    previewDate: todayStr,
  }

  if (rrules.length === 0) {
    return formValues
  }

  const parsedRules = rrules.map(parseRRuleString)
  const firstRule = parsedRules[0]

  if (firstRule.startDate) {
    formValues.schedulePattern.startDate = firstRule.startDate
  }
  if (firstRule.untilDate) {
    formValues.schedulePattern.endsType = "until"
    formValues.schedulePattern.untilDate = firstRule.untilDate
  } else {
    formValues.schedulePattern.endsType = "never"
    formValues.schedulePattern.untilDate = ""
  }

  const modeMap = {
    DAILY: "daily" as const,
    WEEKLY: "weekly" as const,
    MONTHLY: "monthly" as const,
  }
  const mode =
    firstRule.frequency && firstRule.frequency in modeMap
      ? modeMap[firstRule.frequency as keyof typeof modeMap]
      : "weekly"
  formValues.schedulePattern.mode = mode

  const slotsByDayCode: Record<string, Set<number>> = {}
  const sharedSlots = new Set<number>()

  for (const rule of parsedRules) {
    const slotTimes: number[] = []
    for (const h of rule.byhour) {
      for (const m of rule.byminute) {
        slotTimes.push(h * 60 + m)
      }
    }

    if (mode === "weekly") {
      for (const day of rule.byday) {
        if (!slotsByDayCode[day]) {
          slotsByDayCode[day] = new Set<number>()
        }
        for (const slot of slotTimes) {
          slotsByDayCode[day].add(slot)
        }
      }
    } else {
      for (const slot of slotTimes) {
        sharedSlots.add(slot)
      }
      if (mode === "monthly") {
        for (const day of rule.bymonthday) {
          if (!formValues.schedulePattern.monthlyDays.includes(day)) {
            formValues.schedulePattern.monthlyDays.push(day)
          }
        }
      }
    }
  }

  const mergeSlotsToRanges = (
    startMinutesSet: Set<number>
  ): TimeRangeValue[] => {
    const sortedStarts = Array.from(startMinutesSet).sort((a, b) => a - b)
    if (sortedStarts.length === 0) return []

    const ranges: TimeRangeValue[] = []
    let currentStart = sortedStarts[0]
    let currentEnd = currentStart + 30

    for (let i = 1; i < sortedStarts.length; i++) {
      const nextStart = sortedStarts[i]
      if (nextStart === currentEnd) {
        currentEnd = nextStart + 30
      } else {
        ranges.push({
          startTime: fromMinutes(currentStart),
          endTime: fromMinutes(currentEnd),
        })
        currentStart = nextStart
        currentEnd = nextStart + 30
      }
    }
    ranges.push({
      startTime: fromMinutes(currentStart),
      endTime: fromMinutes(currentEnd),
    })

    return ranges
  }

  if (mode === "weekly") {
    formValues.weeklyAvailability = defaultWeeklyAvailability.map((day) => {
      const daySlots = slotsByDayCode[day.dayCode]
      if (daySlots && daySlots.size > 0) {
        return {
          ...day,
          isEnabled: true,
          timeRanges: mergeSlotsToRanges(daySlots),
        }
      }
      return day
    })
  } else {
    formValues.availabilityTimeRanges = mergeSlotsToRanges(sharedSlots)
  }

  formValues.schedulePattern.monthlyDays.sort((a, b) => a - b)
  formValues.previewDate = formValues.schedulePattern.startDate

  return formValues
}
