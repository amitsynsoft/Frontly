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

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const

interface CopyOperatingHoursPopoverProps {
  sourceDay: string
  onCopy: (targetDays: string[]) => void
}

export function CopyOperatingHoursPopover({
  sourceDay,
  onCopy,
}: CopyOperatingHoursPopoverProps) {
  const [open, setOpen] = React.useState(false)
  const [targetDays, setTargetDays] = React.useState<string[]>([])

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
          aria-label={`Copy hours from ${sourceDay}`}
          className="size-8 p-0 rounded-lg hover:bg-muted"
        >
          <Copy className="h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <PopoverHeader>
          <PopoverTitle>Copy {sourceDay} hours</PopoverTitle>
          <PopoverDescription>
            Replace operating hours on the selected days with these times.
          </PopoverDescription>
        </PopoverHeader>

        <fieldset className="grid grid-cols-2 gap-2 my-4">
          <legend className="sr-only">Select target days</legend>
          {DAYS_OF_WEEK.map((day) => {
            if (day === sourceDay) return null

            const checked = targetDays.includes(day)
            const inputId = `copy-${sourceDay}-to-${day}`

            return (
              <label
                key={day}
                htmlFor={inputId}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg border p-2.5 text-sm font-medium transition-all duration-200 select-none cursor-pointer",
                  checked
                    ? "border-primary/30 bg-primary/5 text-foreground"
                    : "border-border bg-background hover:bg-muted/40 hover:border-primary/20 text-muted-foreground hover:text-foreground"
                )}
              >
                <Checkbox
                  id={inputId}
                  checked={checked}
                  onCheckedChange={(isChecked) =>
                    setTargetDays((current) =>
                      isChecked
                        ? [...current, day]
                        : current.filter((value) => value !== day)
                    )
                  }
                />
                <div className="flex flex-col">
                  <span>{day}</span>
                </div>
              </label>
            )
          })}
        </fieldset>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
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
