import { type UseFormReturn, useWatch } from "react-hook-form"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils/cn.utils"

import { DayAvailabilityRow } from "./day-availability-row"
import { DAY_LABELS } from "../staff-schedule-form.config"
import type { StaffScheduleFormValues } from "../staff-schedule-form.types"

interface WeeklyAvailabilityEditorProps {
  form: UseFormReturn<StaffScheduleFormValues>
  selectedBranch?: any
}

export function WeeklyAvailabilityEditor({
  form,
  selectedBranch,
}: WeeklyAvailabilityEditorProps) {
  const days = useWatch({
    control: form.control,
    name: "weeklyAvailability",
  })
  const enabledDaysCount = days.filter((day) => day.isEnabled).length
  const [expandedDayIndex, setExpandedDayIndex] = React.useState(1)
  const orderedDayIndexes = [1, 2, 3, 4, 5, 6, 0]

  const copyDaySchedule = (
    sourceDayIndex: number,
    targetDayIndexes: number[]
  ) => {
    const sourceRanges = form
        .getValues(`weeklyAvailability.${sourceDayIndex}.timeRanges`)
        .map((range) => ({ ...range }))

    targetDayIndexes.forEach((targetDayIndex) => {
      form.setValue(
        `weeklyAvailability.${targetDayIndex}.timeRanges`,
        sourceRanges.map((range) => ({ ...range })),
        { shouldDirty: true }
      )
      form.setValue(`weeklyAvailability.${targetDayIndex}.isEnabled`, true, {
        shouldDirty: true,
      })
      form.clearErrors(`weeklyAvailability.${targetDayIndex}`)
    })
    form.clearErrors("weeklyAvailability")
    if (Object.keys(form.formState.errors).length > 0) {
      setTimeout(() => form.trigger("weeklyAvailability"), 0)
    }
  }

  const rootError =
    (form.formState.errors.weeklyAvailability as any)?.root?.message ||
    form.formState.errors.weeklyAvailability?.message

  return (
    <fieldset className="flex min-w-0 flex-col gap-3">
      <legend className="sr-only">Weekly availability editor</legend>
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">Weekly booking windows</p>
          <p className="text-xs text-muted-foreground">
            Enable days, add multiple ranges, then copy hours to matching days.
          </p>
        </div>
        <Badge
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-semibold select-none",
            enabledDaysCount > 0
              ? "border border-primary/20 bg-primary/10 text-primary"
              : "border border-border bg-muted text-muted-foreground"
          )}
        >
          {enabledDaysCount} active day{enabledDaysCount === 1 ? "" : "s"}
        </Badge>
      </div>

      <div className="flex flex-col gap-3.5">
        {orderedDayIndexes.map((dayIndex) => {
          const day = days[dayIndex]
          const dayName = DAY_LABELS[dayIndex]
          const branchHours = selectedBranch?.operatingHours?.[dayName]
          const isClosedByBranch = selectedBranch ? !branchHours || !branchHours.start || !branchHours.end : false

          return (
            <DayAvailabilityRow
              key={day.dayCode}
              day={day}
              dayIndex={dayIndex}
              dayLabel={DAY_LABELS[dayIndex]}
              form={form}
              isExpanded={expandedDayIndex === dayIndex}
              onCopy={copyDaySchedule}
              onToggleExpanded={() =>
                setExpandedDayIndex((current) =>
                  current === dayIndex ? -1 : dayIndex
                )
              }
              isClosedByBranch={isClosedByBranch}
              branchHours={branchHours}
              selectedBranch={selectedBranch}
            />
          )
        })}
      </div>
      {typeof rootError === "string" ? (
        <p className="text-sm text-destructive" role="alert">
          {rootError}
        </p>
      ) : null}
    </fieldset>
  )
}
