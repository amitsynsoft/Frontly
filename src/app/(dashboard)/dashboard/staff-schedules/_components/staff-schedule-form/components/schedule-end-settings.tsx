import { type UseFormReturn, useWatch } from "react-hook-form"

import DatePickerField from "@/components/forms/datepickerfield"
import { parseLocalDate } from "@/lib/utils/formatters"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/forms/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type { StaffScheduleFormValues } from "../staff-schedule-form.types"

interface ScheduleEndSettingsProps {
  form: UseFormReturn<StaffScheduleFormValues>
}

const END_OPTIONS = [
  { label: "No end date", value: "never" },
  { label: "End on a date", value: "until" },
] as const

export function ScheduleEndSettings({ form }: ScheduleEndSettingsProps) {
  const endsType = useWatch({
    control: form.control,
    name: "schedulePattern.endsType",
  })

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <DatePickerField
        form={form}
        name="schedulePattern.startDate"
        label="Starts on"
        placeholder="Select start date"
        allowPastDates={true}
      />

      <FormField
        control={form.control}
        name="schedulePattern.endsType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ends</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className="h-12 w-full rounded-xl border-border/60 bg-background shadow-xs transition-colors hover:border-primary/35">
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  {END_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormDescription>
              This pattern will repeat until the end date.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {endsType === "until" ? (
        <DatePickerField
          form={form}
          name="schedulePattern.untilDate"
          label="End date"
          placeholder="Select end date"
          allowPastDates={true}
          description="Availability includes this date."
          minDate={
            form.getValues("schedulePattern.startDate")
              ? parseLocalDate(form.getValues("schedulePattern.startDate"))
              : undefined
          }
        />
      ) : null}
    </div>
  )
}
