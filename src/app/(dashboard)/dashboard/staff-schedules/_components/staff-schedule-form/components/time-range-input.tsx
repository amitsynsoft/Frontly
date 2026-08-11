import { Trash2 } from "lucide-react"
import * as React from "react" // trigger rebuild
import {
  type Control,
  Controller,
  type FieldError,
  type FieldPath,
  useFormContext,
} from "react-hook-form"

import { Button } from "@/components/ui/button"
import { TimePicker } from "@/components/ui/time-picker"
import { cn } from "@/lib/utils/cn.utils"

import type { StaffScheduleFormValues } from "../staff-schedule-form.types"

interface TimeRangeInputProps {
  idPrefix: string
  startName: FieldPath<StaffScheduleFormValues>
  endName: FieldPath<StaffScheduleFormValues>
  control: Control<StaffScheduleFormValues>
  startError?: FieldError
  endError?: FieldError
  label?: string
  onRemove: () => void
  min?: string
  max?: string
}

function TimeField({
  ariaDescribedBy,
  ariaLabel,
  error,
  id,
  label,
  name,
  control,
  min,
  max,
}: {
  ariaDescribedBy?: string
  ariaLabel: string
  error?: FieldError
  id: string
  label: string
  name: FieldPath<StaffScheduleFormValues>
  control: Control<StaffScheduleFormValues>
  min?: string
  max?: string
}) {
  const { trigger, formState } = useFormContext<StaffScheduleFormValues>()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const hasError = Boolean(error || fieldState.error)

        return (
          <div className="space-y-1.5">
            <label
              htmlFor={id}
              className="text-xs font-medium text-muted-foreground"
            >
              {label}
            </label>
            <TimePicker
              id={id}
              ref={field.ref}
              disabled={false}
              step={1800} // 30-minute intervals
              value={typeof field.value === "string" ? field.value : ""}
              onChange={(val) => {
                field.onChange(val)
                if (Object.keys(formState.errors).length > 0) {
                  trigger()
                }
              }}
              onBlur={field.onBlur}
              min={min}
              max={max}
              className={cn(
                "h-12 w-full bg-background shadow-xs transition-colors hover:bg-background/80 focus-within:border-primary focus-within:ring-primary/15",
                hasError &&
                  "border-destructive focus-within:border-destructive focus-within:ring-destructive/15"
              )}
            />
          </div>
        )
      }}
    />
  )
}

export function TimeRangeInput({
  idPrefix,
  startName,
  endName,
  control,
  startError,
  endError,
  label,
  onRemove,
  min,
  max,
}: TimeRangeInputProps) {
  const startId = `${idPrefix}-start`
  const endId = `${idPrefix}-end`
  const errorId = `${idPrefix}-error`
  const errorMessage = startError?.message ?? endError?.message

  return (
    <div className="rounded-xl border border-border/60 bg-muted/15 p-3 transition-colors duration-300 hover:border-border/80 sm:p-4">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
        <TimeField
          id={startId}
          label="Start time"
          name={startName}
          control={control}
          error={startError}
          ariaLabel={label ? `${label} start time` : "Start time"}
          ariaDescribedBy={errorMessage ? errorId : undefined}
          min={min}
          max={max}
        />

        <TimeField
          id={endId}
          label="End time"
          name={endName}
          control={control}
          error={endError}
          ariaLabel={label ? `${label} end time` : "End time"}
          ariaDescribedBy={errorMessage ? errorId : undefined}
          min={min}
          max={max}
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-12 justify-self-end rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive sm:justify-self-auto"
          aria-label={
            label ? `Remove ${label.toLowerCase()}` : "Remove time range"
          }
          onClick={onRemove}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      {errorMessage ? (
        <p
          id={errorId}
          className="mt-2 text-xs font-medium text-destructive"
          role="alert"
        >
          {errorMessage}
        </p>
      ) : null}
    </div>
  )
}
