import * as React from "react"
import { Clock3, Plus } from "lucide-react"
import { useFieldArray, type UseFormReturn, useWatch } from "react-hook-form"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { SCHEDULE_TEXT } from "../staff-schedule-form.config"
import type { StaffScheduleFormValues } from "../staff-schedule-form.types"
import { getNextTimeRange } from "../../../../../../../lib/utils/staff-schedule-utils/time-range.utils"
import { TimeRangeInput } from "./time-range-input"

interface SharedTimeRangesEditorProps {
  form: UseFormReturn<StaffScheduleFormValues>
  title?: string
  description?: string
  selectedBranch?: any
}

export function SharedTimeRangesEditor({
  form,
  title = "Available hours",
  description = "These hours apply to every date matched by this pattern.",
  selectedBranch,
}: SharedTimeRangesEditorProps) {
  const ranges = useWatch({
    control: form.control,
    name: "availabilityTimeRanges",
  })
  const { append, fields, remove } = useFieldArray({
    control: form.control,
    name: "availabilityTimeRanges",
  })
  const errors = form.formState.errors.availabilityTimeRanges

  const boundingHours = React.useMemo(() => {
    if (!selectedBranch || !selectedBranch.operatingHours) return null
    let minStart: string | null = null
    let maxEnd: string | null = null
    const DAY_LABELS = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ] as const

    for (const dayName of DAY_LABELS) {
      const hours = selectedBranch.operatingHours[dayName]
      if (hours && hours.start && hours.end) {
        if (!minStart || hours.start < minStart) minStart = hours.start
        if (!maxEnd || hours.end > maxEnd) maxEnd = hours.end
      }
    }
    if (minStart && maxEnd) {
      return { start: minStart, end: maxEnd }
    }
    return null
  }, [selectedBranch])

  return (
    <fieldset className="flex min-w-0 flex-col gap-3 rounded-xl border border-border/60 bg-muted/15 p-4 shadow-xs transition-colors duration-300 hover:border-border/80">
      <legend className="sr-only">{title}</legend>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background text-primary">
            <Clock3 className="size-4" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold">{title}</p>
              <Badge
                variant="secondary"
                className="rounded-md border border-primary/25 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary"
              >
                {fields.length} window{fields.length === 1 ? "" : "s"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 w-fit rounded-xl shadow-xs"
          onClick={() => {
            append(getNextTimeRange(ranges), { shouldFocus: false })
            form.clearErrors("availabilityTimeRanges")
            if (Object.keys(form.formState.errors).length > 0) {
              setTimeout(() => form.trigger("availabilityTimeRanges"), 0)
            }
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          {SCHEDULE_TEXT.actions.addTimeRange}
        </Button>
      </div>

      <div className="grid gap-2 sm:pl-11">
        {fields.map((field, rangeIndex) => (
          <TimeRangeInput
            key={field.id}
            idPrefix={`shared-availability-${rangeIndex}`}
            startName={`availabilityTimeRanges.${rangeIndex}.startTime`}
            endName={`availabilityTimeRanges.${rangeIndex}.endTime`}
            control={form.control}
            startError={errors?.[rangeIndex]?.startTime}
            endError={errors?.[rangeIndex]?.endTime}
            label={`Window ${rangeIndex + 1}`}
            onRemove={() => {
              remove(rangeIndex)
              if (Object.keys(form.formState.errors).length > 0) {
                setTimeout(() => form.trigger("availabilityTimeRanges"), 0)
              }
            }}
            min={boundingHours?.start}
            max={boundingHours?.end}
          />
        ))}

        {typeof ((errors as any)?.root?.message || errors?.message) === "string" ? (
          <p className="text-xs text-destructive" role="alert">
            {(errors as any)?.root?.message || errors?.message}
          </p>
        ) : null}
      </div>
    </fieldset>
  )
}
