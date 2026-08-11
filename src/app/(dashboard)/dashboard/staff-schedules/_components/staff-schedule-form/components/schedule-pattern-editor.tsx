import { Calendar, CalendarDays, CalendarRange } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"

import { FormField, FormItem } from "@/components/forms/form"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils/cn.utils"

import { SCHEDULE_MODE_OPTIONS } from "../staff-schedule-form.config"
import type {
  ScheduleMode,
  StaffScheduleFormValues,
} from "../staff-schedule-form.types"

interface SchedulePatternEditorProps {
  form: UseFormReturn<StaffScheduleFormValues>
}

export function SchedulePatternEditor({ form }: SchedulePatternEditorProps) {
  return (
    <FormField
      control={form.control}
      name="schedulePattern.mode"
      render={({ field }) => (
        <FormItem>
          <Tabs
            value={field.value}
            onValueChange={(value) => field.onChange(value as ScheduleMode)}
          >
            <TabsList className="grid h-auto w-full grid-cols-1 gap-3 rounded-xl bg-transparent p-0 sm:grid-cols-3">
              {SCHEDULE_MODE_OPTIONS.map((option) => {
                const isActive = field.value === option.value

                // Determine icon based on mode
                let Icon = CalendarDays
                if (option.value === "daily") Icon = Calendar
                if (option.value === "monthly") Icon = CalendarRange

                return (
                  <TabsTrigger
                    key={option.value}
                    value={option.value}
                    className={cn(
                      "group h-24 flex-col items-center justify-center gap-2 rounded-xl border border-border/60 bg-card/50 px-4 py-3 text-center shadow-xs transition-all duration-300 hover:border-primary/45 hover:bg-primary/5 hover:shadow-xs",
                      "data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-md"
                    )}
                  >
                    <span
                      className={cn(
                        "flex w-8 min-h-8 items-center justify-center rounded-full border border-border/70 bg-muted text-muted-foreground transition-all duration-300 group-hover:scale-110",
                        isActive &&
                          "border-primary/30 bg-primary/15 text-primary shadow-xs"
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary/95">
                      {option.label}
                    </span>
                    <span className="text-xs font-normal text-muted-foreground transition-colors group-hover:text-muted-foreground/90">
                      {option.value === "daily"
                        ? "Every day"
                        : option.value === "weekly"
                          ? "Every week"
                          : "Every month"}
                    </span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </Tabs>
        </FormItem>
      )}
    />
  )
}
