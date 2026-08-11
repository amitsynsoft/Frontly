import type { TimeRangeValue } from "../../../app/(dashboard)/dashboard/staff-schedules/_components/staff-schedule-form/staff-schedule-form.types"

export function getNextTimeRange(ranges: TimeRangeValue[]): TimeRangeValue {
  const lastRange = ranges.at(-1)
  if (!lastRange || lastRange.endTime >= "23:00") {
    return { startTime: "09:00", endTime: "17:00" }
  }

  const [hours, minutes] = lastRange.endTime.split(":").map(Number)
  const endHour = Math.min(hours + 1, 23)
  return {
    startTime: lastRange.endTime,
    endTime: `${String(endHour).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`,
  }
}
