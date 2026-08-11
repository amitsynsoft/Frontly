import { Copy } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils/cn.utils"

import { DAY_LABELS, SCHEDULE_TEXT } from "../staff-schedule-form.config"

interface CopyDaySchedulePopoverProps {
  sourceDayIndex: number
  sourceDayLabel: string
  onCopy: (targetDayIndexes: number[]) => void
  selectedBranch?: any
}

export function CopyDaySchedulePopover({
  sourceDayIndex,
  sourceDayLabel,
  onCopy,
  selectedBranch,
}: CopyDaySchedulePopoverProps) {
  const [open, setOpen] = React.useState(false)
  const [targetDays, setTargetDays] = React.useState<number[]>([])

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (nextOpen) setTargetDays([])
  }

  const handleApply = () => {
    onCopy(targetDays)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`${SCHEDULE_TEXT.actions.copyHours} from ${sourceDayLabel}`}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <PopoverHeader>
          <PopoverTitle>Copy {sourceDayLabel} hours</PopoverTitle>
          <PopoverDescription>
            Replace availability on the selected days with these time ranges.
          </PopoverDescription>
        </PopoverHeader>

        <fieldset className="grid grid-cols-2 gap-2 my-4">
          <legend className="sr-only">Select target days</legend>
          {DAY_LABELS.map((dayLabel, dayIndex) => {
            if (dayIndex === sourceDayIndex) return null
            const dayName = DAY_LABELS[dayIndex]
            const branchHours = selectedBranch?.operatingHours?.[dayName]
            const isClosed = selectedBranch ? !branchHours || !branchHours.start || !branchHours.end : false

            const checked = targetDays.includes(dayIndex)
            const inputId = `copy-${sourceDayIndex}-to-${dayIndex}`

            return (
              <label
                key={dayLabel}
                htmlFor={inputId}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg border p-2.5 text-sm font-medium transition-all duration-200 select-none",
                  isClosed
                    ? "border-destructive/10 bg-destructive/5 text-muted-foreground/60 cursor-not-allowed opacity-60"
                    : "cursor-pointer",
                  !isClosed && checked
                    ? "border-primary/30 bg-primary/5 text-foreground"
                    : !isClosed && "border-border bg-background hover:bg-muted/40 hover:border-primary/20 text-muted-foreground hover:text-foreground"
                )}
              >
                <Checkbox
                  id={inputId}
                  checked={checked}
                  disabled={isClosed}
                  onCheckedChange={(isChecked) =>
                    setTargetDays((current) =>
                      isChecked
                        ? [...current, dayIndex]
                        : current.filter((value) => value !== dayIndex)
                    )
                  }
                />
                <div className="flex flex-col">
                  <span>{dayLabel}</span>
                  {isClosed && (
                    <span className="text-[10px] text-destructive font-semibold">
                      Closed
                    </span>
                  )}
                </div>
              </label>
            )
          })}
        </fieldset>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={targetDays.length === 0}
            onClick={handleApply}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy to {targetDays.length || 0} day
            {targetDays.length === 1 ? "" : "s"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
