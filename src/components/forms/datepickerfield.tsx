"use client"

import { format, startOfDay } from "date-fns"
import { parseLocalDate } from "@/lib/utils/formatters"
import { Calendar as CalendarIcon } from "lucide-react"
import * as React from "react"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/forms/form"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils/cn.utils"

interface DatePickerFieldProps {
  form: any
  name: string
  label: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  lang?: string
  minDate?: Date
  maxDate?: Date
  description?: string
  /**
   * Allow selecting past dates.
   * Useful for DOB, billing, reports etc.
   */
  allowPastDates?: boolean

  /**
   * Minimum selectable year
   */
  fromYear?: number

  /**
   * Maximum selectable year
   */
  toYear?: number
}

export default function DatePickerField({
  form,
  name,
  label,
  placeholder = "Pick a date",
  disabled = false,
  required = false,
  allowPastDates = false,
  fromYear = 1900,
  toYear = new Date().getFullYear() + 10, // Extend maximum year out for end dates
  minDate,
  maxDate,
  description,
}: DatePickerFieldProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-1 flex-col">
          <FormLabel>
            {label}

            {required && <span className="ml-1 text-red-500">*</span>}
          </FormLabel>

          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  type="button"
                  variant="outline"
                  disabled={disabled}
                  className={cn(
                    "h-9 w-full justify-start border border-input bg-background pl-3 text-left font-normal text-foreground transition-all duration-200",
                    "hover:bg-muted/10 hover:border-primary/40",
                    "focus:border-primary focus:ring-2 focus:ring-primary/20",
                    !field.value && "text-muted-foreground",
                    disabled && "cursor-not-allowed opacity-50"
                  )}
                >
                  {field.value ? (
                    format(parseLocalDate(field.value)!, "PPP")
                  ) : (
                    <span>{placeholder}</span>
                  )}

                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                captionLayout="dropdown"
                startMonth={new Date(fromYear, 0)}
                endMonth={new Date(toYear, 11)}
                selected={field.value ? parseLocalDate(field.value) : undefined}
                onSelect={(date) => {
                  if (date) {
                    field.onChange(format(date, "yyyy-MM-dd"))
                  }

                  setIsOpen(false)
                }}
                disabled={(date) => {
                  if (disabled) {
                    return true
                  }

                  // prevent past dates unless explicitly allowed
                  if (!allowPastDates) {
                    if (date < startOfDay(new Date())) {
                      return true
                    }
                  }

                  if (minDate) {
                    if (date < startOfDay(minDate)) {
                      return true
                    }
                  }

                  if (maxDate) {
                    if (date > startOfDay(maxDate)) {
                      return true
                    }
                  }

                  return false
                }}
              />
            </PopoverContent>
          </Popover>

          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

