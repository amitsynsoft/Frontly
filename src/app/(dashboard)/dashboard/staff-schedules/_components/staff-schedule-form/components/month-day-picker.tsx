import type { UseFormReturn } from "react-hook-form"

import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/forms/form"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils/cn.utils"

import { MONTH_DAYS } from "../staff-schedule-form.config"
import type { StaffScheduleFormValues } from "../staff-schedule-form.types"

interface MonthDayPickerProps {
  form: UseFormReturn<StaffScheduleFormValues>
}

export function MonthDayPicker({ form }: MonthDayPickerProps) {
  return (
    <FormField
      control={form.control}
      name="schedulePattern.monthlyDays"
      render={({ field }) => (
        <FormItem className="rounded-xl border border-border/60 bg-muted/10 p-4 transition-colors duration-300 hover:border-border/80">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div className="flex flex-col gap-1">
              <FormLabel className="text-sm font-semibold">
                Days of the month
              </FormLabel>
              <FormDescription>
                Choose every calendar date on which this schedule is available.
              </FormDescription>
            </div>
            <div className="flex gap-1.5">
              <Button
                type="button"
                variant="ghost"
                className="font-medium transition-colors hover:bg-primary/10 hover:text-primary"
                onClick={() => field.onChange(MONTH_DAYS)}
              >
                Select all
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="font-medium transition-colors hover:bg-destructive/10 hover:text-destructive"
                onClick={() => field.onChange([])}
              >
                Clear
              </Button>
            </div>
          </div>

          <fieldset className="grid grid-cols-7 gap-2 pt-3.5 sm:grid-cols-8 lg:grid-cols-11">
            <legend className="sr-only">Select days of month</legend>
            {MONTH_DAYS.map((day) => {
              const checked = field.value.includes(day)
              const inputId = `month-day-${day}`
              return (
                <label
                  key={day}
                  htmlFor={inputId}
                  className={cn(
                    "flex aspect-square cursor-pointer items-center justify-center rounded-xl border text-xs font-semibold transition-all duration-300 select-none",
                    checked
                      ? "scale-[1.02] border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                      : "border-border bg-background text-foreground hover:border-primary/45 hover:bg-muted/40"
                  )}
                >
                  <Checkbox
                    id={inputId}
                    className="sr-only"
                    checked={checked}
                    onCheckedChange={(isChecked) =>
                      field.onChange(
                        isChecked
                          ? [...field.value, day]
                          : field.value.filter((value) => value !== day)
                      )
                    }
                  />
                  {day}
                </label>
              )
            })}
          </fieldset>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
