"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  CalendarCheck2,
  CalendarDays,
  Clock3,
  Eye,
  MapPin,
  Repeat2,
  UserRound,
  CalendarRange,
} from "lucide-react"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import {
  DAY_LABELS,
  SCHEDULE_TEXT,
  SCHEDULE_MODE_OPTIONS,
} from "../staff-schedule-form.config"
import type {
  StaffScheduleFormValues,
  TimeRangeValue,
  SelectOption,
} from "../staff-schedule-form.types"
import {
  generatePreviewSlots,
  getEffectiveFrequency,
} from "../../../../../../../lib/utils/staff-schedule-utils/staff-schedule-form.utils"

interface SchedulePreviewProps {
  values: StaffScheduleFormValues
  branchOptions: SelectOption[]
  staffOptions: SelectOption[]
}

function formatDate(dateValue: string) {
  if (!dateValue) return "Not selected"

  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${dateValue}T12:00:00`))
}

function formatTime(timeValue: string) {
  const [hours, minutes] = timeValue.split(":").map(Number)

  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(2000, 0, 1, hours, minutes))
}

function formatTimeRange(range: TimeRangeValue) {
  return `${formatTime(range.startTime)} - ${formatTime(range.endTime)}`
}

function formatOrdinal(value: number) {
  const remainder = value % 100

  if (remainder >= 11 && remainder <= 13) return `${value}th`
  if (value % 10 === 1) return `${value}st`
  if (value % 10 === 2) return `${value}nd`
  if (value % 10 === 3) return `${value}rd`

  return `${value}th`
}

function getRepeatSummary(values: StaffScheduleFormValues) {
  const mode = values.schedulePattern.mode

  if (mode === "daily") return "Every day"

  if (mode === "weekly") {
    const activeDays = values.weeklyAvailability
      .filter((day) => day.isEnabled)
      .map((day) => DAY_LABELS[day.dayOfWeek])

    return activeDays.length ? activeDays.join(", ") : "No weekdays selected"
  }

  const monthDays = [...values.schedulePattern.monthlyDays]
    .sort((left, right) => left - right)
    .map(formatOrdinal)

  return monthDays.length ? monthDays.join(", ") : "No dates selected"
}

function getDateRangeSummary(values: StaffScheduleFormValues) {
  const startsOn = formatDate(values.schedulePattern.startDate)

  return values.schedulePattern.endsType === "until"
    ? `${startsOn} - ${formatDate(values.schedulePattern.untilDate)}`
    : `From ${startsOn}`
}

function getWorkingHours(values: StaffScheduleFormValues) {
  const frequency = getEffectiveFrequency(values)

  if (frequency === "WEEKLY") {
    return values.weeklyAvailability
      .filter((day) => day.isEnabled)
      .map((day) => ({
        label: DAY_LABELS[day.dayOfWeek],
        value: day.timeRanges.map(formatTimeRange).join(", ") || "No hours",
      }))
  }

  return [
    {
      label: frequency === "MONTHLY" ? "Selected dates" : "Every day",
      value:
        values.availabilityTimeRanges.map(formatTimeRange).join(", ") ||
        "No hours configured",
    },
  ]
}

export function SchedulePreview({
  values,
  branchOptions,
  staffOptions,
}: SchedulePreviewProps) {
  const text = SCHEDULE_TEXT.preview
  const modeLabel =
    SCHEDULE_MODE_OPTIONS.find(
      (option) => option.value === values.schedulePattern.mode
    )?.label ?? "Schedule"
  const staffLabel =
    staffOptions.find((option) => option.value === values.staffId)?.label ??
    "Not selected"
  const branchLabel =
    branchOptions.find((option) => option.value === values.branchId)?.label ??
    "Not selected"
  const slots = generatePreviewSlots(values)
  const workingHours = getWorkingHours(values)

  const activeDaysMap = React.useMemo(() => {
    const map = new Map<
      number,
      { isEnabled: boolean; label: string; ranges: string }
    >()
    values.weeklyAvailability.forEach((day) => {
      map.set(day.dayOfWeek, {
        isEnabled: day.isEnabled,
        label: DAY_LABELS[day.dayOfWeek].slice(0, 3),
        ranges: day.timeRanges.map(formatTimeRange).join(", ") || "No hours",
      })
    })
    return map
  }, [values.weeklyAvailability])

  return (
    <Card className="group relative h-fit overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-b from-card/90 via-card/75 to-card/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-lg transition-all duration-500 hover:shadow-[0_12px_40px_rgb(0,0,0,0.09)] lg:sticky lg:top-6">
      {/* Premium Top Glow Effect */}
      <div className="absolute top-0 left-1/2 h-[2px] w-[60%] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent transition-all duration-500 group-hover:w-[85%]" />

      <CardContent className="p-0">
        {/* Sleek Header */}
        <div className="relative overflow-hidden border-b border-border/60 bg-muted/30 p-5">
          <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-primary/5 blur-2xl transition-all duration-500 group-hover:scale-110" />
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-xs transition-all duration-500 group-hover:scale-105 group-hover:bg-primary/15">
                <Eye
                  className="size-5 transition-transform duration-500 group-hover:rotate-12"
                  aria-hidden="true"
                />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold tracking-widest text-primary uppercase">
                  Live Review
                </p>
                <h3 className="text-base font-bold tracking-tight text-foreground">
                  Schedule summary
                </h3>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="rounded-lg border border-primary/20 bg-primary/8 px-2.5 py-1 text-[11px] font-semibold text-primary transition-all duration-300 group-hover:border-primary/45 group-hover:bg-primary/12"
            >
              {modeLabel}
            </Badge>
          </div>
        </div>

        {/* Info Rows in 2-Column Layout */}
        <div className="space-y-5 p-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <PreviewFact
                icon={UserRound}
                label={text.staff}
                value={staffLabel}
              />
            </div>
            <div className="col-span-1">
              <PreviewFact
                icon={MapPin}
                label={text.branch}
                value={branchLabel}
              />
            </div>
            <div className="col-span-1">
              <PreviewFact
                icon={Repeat2}
                label={text.repeat}
                value={getRepeatSummary(values)}
              />
            </div>
            <div className="col-span-2">
              <PreviewFact
                icon={CalendarRange}
                label={text.dateRange}
                value={getDateRangeSummary(values)}
              />
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Working Hours/Availability Visualization */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarCheck2 className="size-4 text-primary/70" />
                <p className="text-xs font-semibold text-foreground">
                  {text.availability}
                </p>
              </div>
              {values.schedulePattern.mode === "weekly" && (
                <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                  Weekly Tracker
                </span>
              )}
            </div>

            {values.schedulePattern.mode === "weekly" ? (
              <div className="space-y-3">
                {/* 7-day circular tracker */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 7 }).map((_, index) => {
                    const dayInfo = activeDaysMap.get(index)
                    const isEnabled = dayInfo?.isEnabled
                    return (
                      <div
                        key={index}
                        className={`flex flex-col items-center justify-center rounded-lg border py-1.5 transition-all duration-300 ${
                          isEnabled
                            ? "border-primary/25 bg-primary/10 text-primary shadow-[0_2px_8px_rgba(var(--primary),0.08)]"
                            : "border-border/30 bg-muted/10 text-muted-foreground/40"
                        }`}
                        title={
                          dayInfo
                            ? `${DAY_LABELS[index]}: ${dayInfo.ranges}`
                            : ""
                        }
                      >
                        <span className="text-[9px] font-bold tracking-wider uppercase">
                          {dayInfo?.label.slice(0, 1)}
                        </span>
                        <span className="mt-0.5 text-[10px] font-bold">
                          {dayInfo?.label.slice(1, 3)}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {/* Active items detailed list */}
                <div className="max-h-[140px] scrollbar-thin space-y-2 overflow-y-auto pr-0.5">
                  {workingHours.length ? (
                    workingHours.map((item, index) => (
                      <div
                        key={`${item.label}-${item.value}-${index}`}
                        className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/20 px-3 py-2 transition-all hover:bg-muted/30"
                      >
                        <span className="text-xs font-semibold text-foreground">
                          {item.label}
                        </span>
                        <span
                          className="max-w-[150px] truncate text-xs text-muted-foreground"
                          title={item.value}
                        >
                          {item.value}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-xl border border-dashed border-border/60 p-3 text-center text-xs text-muted-foreground">
                      No days enabled.
                    </p>
                  )}
                </div>
              </div>
            ) : values.schedulePattern.mode === "monthly" ? (
              <div className="space-y-2">
                <div className="rounded-xl border border-border/40 bg-muted/20 px-3.5 py-2.5">
                  <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    Selected Dates ({values.schedulePattern.monthlyDays.length})
                  </p>
                  <p className="mt-1 max-w-full truncate text-xs font-semibold text-foreground">
                    {getRepeatSummary(values)}
                  </p>
                </div>
                {workingHours[0] && (
                  <div className="rounded-xl border border-border/40 bg-muted/20 px-3.5 py-2.5">
                    <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                      Active Hours
                    </p>
                    <p className="mt-1 text-xs font-semibold text-foreground">
                      {workingHours[0].value}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-border/40 bg-muted/20 px-3.5 py-2.5">
                <div className="flex items-center gap-1.5">
                  <div className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-foreground">
                    Every day
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {workingHours[0]?.value || "No hours configured"}
                </p>
              </div>
            )}
          </div>

          <Separator className="bg-border/50" />

          {/* Bookable Time Slots Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock3 className="size-4 text-primary/70" />
                <p className="text-xs font-semibold text-foreground">
                  Bookable times
                </p>
              </div>
              <Badge
                variant="outline"
                className="rounded-md border-border bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {values.appointmentSettings.slotDurationMinutes} min duration
              </Badge>
            </div>

            <div className="mb-2 flex items-center justify-between rounded-lg bg-muted/20 px-2.5 py-1.5 text-[11px]">
              <span className="text-muted-foreground">Preview Date</span>
              <span className="font-semibold text-foreground">
                {formatDate(values.previewDate)}
              </span>
            </div>

            {slots.length ? (
              <div className="grid grid-cols-2 gap-2">
                <AnimatePresence mode="popLayout">
                  {slots.slice(0, 10).map((slot, index) => (
                    <motion.div
                      key={`${slot.startTime}-${slot.endTime}-${index}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25, delay: index * 0.02 }}
                      className="group/slot flex cursor-default items-center justify-center gap-1.5 rounded-xl border border-border/60 bg-background/40 px-2 py-2 text-center text-xs font-semibold text-foreground shadow-2xs transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                    >
                      <Clock3 className="size-3 text-muted-foreground/60 transition-colors group-hover/slot:text-primary" />
                      <span>{formatTime(slot.startTime)}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/5 p-5 text-center">
                <div className="flex size-9 items-center justify-center rounded-xl bg-muted/30 text-muted-foreground">
                  <Clock3 className="size-4" />
                </div>
                <p className="mt-2 text-xs font-semibold text-foreground">
                  No bookable times
                </p>
                <p className="mt-0.5 max-w-[190px] text-[10px] text-muted-foreground">
                  Configure working hours and verify the preview date is within
                  your range.
                </p>
              </div>
            )}

            {slots.length > 10 ? (
              <p className="text-center text-[10px] font-medium text-muted-foreground">
                Showing 10 of {slots.length} generated times.
              </p>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PreviewFact({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="group/fact flex gap-3 rounded-xl border border-border/60 bg-background/50 p-3 shadow-2xs transition-all duration-300 hover:-translate-y-[1px] hover:border-primary/30 hover:bg-primary/2">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-all duration-300 group-hover/fact:scale-105 group-hover/fact:bg-primary/10 group-hover/fact:text-primary">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] leading-none font-bold tracking-wider text-muted-foreground/80 uppercase">
          {label}
        </p>
        <p className="mt-1 text-xs leading-tight font-bold break-words text-foreground">
          {value}
        </p>
      </div>
    </div>
  )
}
