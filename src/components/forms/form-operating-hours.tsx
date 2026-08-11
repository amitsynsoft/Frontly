"use client"

import { Controller, useFormContext } from "react-hook-form"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { TimePicker } from "@/components/ui/time-picker"
import { cn } from "@/lib/utils/cn.utils"
import { CopyOperatingHoursPopover } from "./copy-operating-hours-popover"

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const

type FormOperatingHoursProps = {
  name?: string
}

export function FormOperatingHours({
  name = "operatingHours",
}: FormOperatingHoursProps) {
  const { control, watch, setValue, getValues } = useFormContext()

  const handleCopy = (sourceDay: string, targetDays: string[]) => {
    const sourceStart = getValues(`${name}.${sourceDay}.start`)
    const sourceEnd = getValues(`${name}.${sourceDay}.end`)

    targetDays.forEach((targetDay) => {
      setValue(`${name}.${targetDay}.start`, sourceStart, {
        shouldDirty: true,
        shouldValidate: true,
      })
      setValue(`${name}.${targetDay}.end`, sourceEnd, {
        shouldDirty: true,
        shouldValidate: true,
      })
      setValue(`${name}.${targetDay}.enabled`, true, {
        shouldDirty: true,
        shouldValidate: true,
      })
    })
  }

  return (
    <div className="space-y-3">
      {DAYS_OF_WEEK.map((day) => {
        const fieldName = `${name}.${day}`
        const enabled = watch(`${fieldName}.enabled`)

        return (
          <div
            key={day}
            className={cn(
              "flex flex-col gap-3 rounded-lg border px-4 py-3.5 transition-all sm:flex-row sm:items-center sm:justify-between",
              enabled
                ? "border-primary/30 bg-primary/5 shadow-xs dark:bg-primary/10"
                : "border-border/50 bg-card/30 opacity-70"
            )}
          >
            {/* Toggle + Day Label */}
            <div className="flex w-36 shrink-0 items-center gap-3">
              <Controller
                control={control}
                name={`${fieldName}.enabled`}
                render={({ field }) => (
                  <Switch
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                    id={`${day}-enabled`}
                  />
                )}
              />
              <Label
                htmlFor={`${day}-enabled`}
                className="cursor-pointer text-sm font-semibold text-foreground select-none"
              >
                {day}
              </Label>
            </div>

            {/* Time Inputs */}
            {enabled ? (
              <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-8 shrink-0 text-xs font-medium text-muted-foreground">
                    From
                  </span>
                  <Controller
                    control={control}
                    name={`${fieldName}.start`}
                    render={({ field, fieldState }) => (
                      <div className="flex flex-col">
                        <TimePicker
                          ref={field.ref}
                          value={field.value || ""}
                          onChange={field.onChange}
                          className={cn(
                            "h-9 w-28 bg-background shadow-xs transition-colors hover:bg-background/80 focus-within:border-primary focus-within:ring-primary/20",
                            fieldState.error &&
                              "border-destructive focus-within:border-destructive focus-within:ring-destructive/20"
                          )}
                        />
                        {fieldState.error && (
                          <span className="mt-0.5 text-xs text-destructive">
                            {fieldState.error.message}
                          </span>
                        )}
                      </div>
                    )}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-8 shrink-0 text-xs font-medium text-muted-foreground">
                    To
                  </span>
                  <Controller
                    control={control}
                    name={`${fieldName}.end`}
                    render={({ field, fieldState }) => (
                      <div className="flex flex-col">
                        <TimePicker
                          ref={field.ref}
                          value={field.value || ""}
                          onChange={field.onChange}
                          className={cn(
                            "h-9 w-28 bg-background shadow-xs transition-colors hover:bg-background/80 focus-within:border-primary focus-within:ring-primary/20",
                            fieldState.error &&
                              "border-destructive focus-within:border-destructive focus-within:ring-destructive/20"
                          )}
                        />
                        {fieldState.error && (
                          <span className="mt-0.5 text-xs text-destructive">
                            {fieldState.error.message}
                          </span>
                        )}
                      </div>
                    )}
                  />
                </div>
                <CopyOperatingHoursPopover
                  sourceDay={day}
                  onCopy={(targetDays) => handleCopy(day, targetDays)}
                />
              </div>
            ) : (
              <span className="flex-1 pl-11 text-sm font-medium text-muted-foreground sm:pl-0 sm:text-right">
                Closed
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
