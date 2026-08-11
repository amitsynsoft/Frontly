import { ChevronDown, ChevronUp, Plus } from "lucide-react"
import { useFieldArray, type UseFormReturn } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils/cn.utils"

import { CopyDaySchedulePopover } from "./copy-day-schedule-popover"
import { SCHEDULE_TEXT } from "../staff-schedule-form.config"
import type {
  DayAvailabilityValue,
  StaffScheduleFormValues,
} from "../staff-schedule-form.types"
import { getNextTimeRange } from "../../../../../../../lib/utils/staff-schedule-utils/time-range.utils"
import { TimeRangeInput } from "./time-range-input" // trigger rebuild

interface DayAvailabilityRowProps {
  day: DayAvailabilityValue
  dayIndex: number
  dayLabel: string
  form: UseFormReturn<StaffScheduleFormValues>
  isExpanded: boolean
  onCopy: (sourceDayIndex: number, targetDayIndexes: number[]) => void
  onToggleExpanded: () => void
  isClosedByBranch?: boolean
  branchHours?: { start: string; end: string } | null
  selectedBranch?: any
}

export function DayAvailabilityRow({
  day,
  dayIndex,
  dayLabel,
  form,
  isExpanded,
  onCopy,
  onToggleExpanded,
  isClosedByBranch = false,
  branchHours,
  selectedBranch,
}: DayAvailabilityRowProps) {
  const dayErrors = form.formState.errors.weeklyAvailability?.[dayIndex]
  const rangesError = dayErrors?.timeRanges
  const {
    append: appendRange,
    fields: timeRangeFields,
    remove: removeRange,
    replace: replaceRanges,
  } = useFieldArray({
    control: form.control,
    name: `weeklyAvailability.${dayIndex}.timeRanges`,
  })

  const toggleDay = (isEnabled: boolean) => {
    form.setValue(`weeklyAvailability.${dayIndex}.isEnabled`, isEnabled, {
      shouldDirty: true,
    })

    if (isEnabled && day.timeRanges.length === 0) {
      const defaultStart = branchHours?.start || "09:00"
      const defaultEnd = branchHours?.end || "17:00"
      replaceRanges([{ startTime: defaultStart, endTime: defaultEnd }])
    }

    if (!isEnabled) {
      form.clearErrors(`weeklyAvailability.${dayIndex}`)
    }
    if (Object.keys(form.formState.errors).length > 0) {
      setTimeout(() => form.trigger("weeklyAvailability"), 0)
    }
  }

  const rootRangeErrorMessage =
    (rangesError as any)?.root?.message || rangesError?.message

  return (
    <article
      className={cn(
        "rounded-xl border p-4 shadow-xs transition-all duration-300 hover:shadow-sm",
        day.isEnabled
          ? "border-border/70 bg-background"
          : isClosedByBranch
            ? "border-destructive/20 bg-destructive/5 opacity-80"
            : "border-border/50 bg-muted/30 opacity-85 hover:opacity-100"
      )}
    >
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div className="flex min-w-0 items-center gap-3">
          <Switch
            checked={day.isEnabled}
            onCheckedChange={toggleDay}
            disabled={isClosedByBranch}
            aria-label={`${day.isEnabled ? "Disable" : "Enable"} ${dayLabel}`}
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-semibold text-foreground">
                {dayLabel}
              </h4>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase transition-all duration-300",
                  day.isEnabled
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : isClosedByBranch
                      ? "dark:text-destructive-foreground border-destructive/30 bg-destructive/10 text-destructive"
                      : "border-border/70 bg-muted text-muted-foreground"
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    day.isEnabled
                      ? "bg-emerald-500"
                      : isClosedByBranch
                        ? "bg-destructive"
                        : "bg-muted-foreground/60"
                  )}
                />
                {day.isEnabled
                  ? "Open"
                  : isClosedByBranch
                    ? "Branch Closed"
                    : "Closed"}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {day.isEnabled
                ? `${day.timeRanges.length} booking window${day.timeRanges.length === 1 ? "" : "s"}`
                : isClosedByBranch
                  ? `Branch is closed on ${dayLabel}.`
                  : "No appointments on this day."}
            </p>
          </div>
        </div>

        {day.isEnabled ? (
          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            <span className="text-xs text-muted-foreground">
              {day.timeRanges.length} time block
              {day.timeRanges.length === 1 ? "" : "s"}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-lg"
              onClick={onToggleExpanded}
              aria-label={`${isExpanded ? "Collapse" : "Expand"} ${dayLabel}`}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-2">
            <span className="text-xs text-muted-foreground">Closed</span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-lg"
              onClick={onToggleExpanded}
              aria-label={`${isExpanded ? "Collapse" : "Expand"} ${dayLabel}`}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </div>

      {day.isEnabled && isExpanded ? (
        <div className="mt-4 grid min-w-0 gap-3 border-t border-border/60 pt-4">
          {timeRangeFields.map((timeRangeField, rangeIndex) => (
            <TimeRangeInput
              key={timeRangeField.id}
              idPrefix={`availability-${dayIndex}-${rangeIndex}`}
              startName={`weeklyAvailability.${dayIndex}.timeRanges.${rangeIndex}.startTime`}
              endName={`weeklyAvailability.${dayIndex}.timeRanges.${rangeIndex}.endTime`}
              control={form.control}
              startError={rangesError?.[rangeIndex]?.startTime}
              endError={rangesError?.[rangeIndex]?.endTime}
              label={`Window ${rangeIndex + 1}`}
              onRemove={() => {
                removeRange(rangeIndex)
                if (Object.keys(form.formState.errors).length > 0) {
                  setTimeout(() => form.trigger(`weeklyAvailability.${dayIndex}`), 0)
                }
              }}
              min={branchHours?.start}
              max={branchHours?.end}
            />
          ))}

          <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl border-dashed text-primary transition-all duration-200 hover:text-primary"
              onClick={() => {
                appendRange(getNextTimeRange(day.timeRanges), {
                  shouldFocus: false,
                })
                form.clearErrors(`weeklyAvailability.${dayIndex}.timeRanges`)
                form.clearErrors(`weeklyAvailability.${dayIndex}`)
                if (Object.keys(form.formState.errors).length > 0) {
                  setTimeout(() => form.trigger(`weeklyAvailability.${dayIndex}`), 0)
                }
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              {SCHEDULE_TEXT.actions.addTimeRange}
            </Button>
            <CopyDaySchedulePopover
              sourceDayIndex={dayIndex}
              sourceDayLabel={dayLabel}
              onCopy={(targetDayIndexes) => onCopy(dayIndex, targetDayIndexes)}
              selectedBranch={selectedBranch}
            />
          </div>

          {typeof rootRangeErrorMessage === "string" ? (
            <p className="text-xs text-destructive" role="alert">
              {rootRangeErrorMessage}
            </p>
          ) : null}
        </div>
      ) : !day.isEnabled && isExpanded ? (
        <div className="mt-4 rounded-xl border border-dashed border-border/80 bg-background/50 p-3 text-xs text-muted-foreground">
          {isClosedByBranch
            ? `Appointments cannot be booked because the branch is closed on ${dayLabel}.`
            : "Appointments cannot be booked on this day."}
        </div>
      ) : null}
    </article>
  )
}
