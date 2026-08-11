"use client"

import * as React from "react"
import { Clock3 } from "lucide-react"
import { cn } from "@/lib/utils/cn.utils"
import { Popover, PopoverContent, PopoverAnchor } from "@/components/ui/popover"

export interface TimePickerProps {
  value?: string // HH:mm format
  onChange?: (value: string) => void
  onBlur?: () => void
  disabled?: boolean
  step?: number // in seconds, e.g., 900 for 15-minute intervals
  min?: string // HH:mm
  max?: string // HH:mm
  className?: string
  id?: string
  placeholder?: string
}

function formatTimeRaw(value: string): string {
  let clean = value.replace(/[^0-9:]/g, "")
  
  // If first character typed is 3-9, auto convert to "0X:"
  if (clean.length === 1 && clean !== "0" && clean !== "1" && clean !== "2" && clean !== ":") {
    return `0${clean}:`
  }
  
  let parts = clean.split(":")
  let hours = parts[0] || ""
  let minutes = parts[1] || ""
  
  // Auto split digits if typed without colon e.g. "1230" -> hours "12", minutes "30"
  if (parts.length === 1 && clean.length > 2) {
    hours = clean.slice(0, 2)
    minutes = clean.slice(2, 4)
  }
  
  // Clamp hours to 0-23
  if (hours) {
    const h = parseInt(hours, 10)
    if (h > 23) {
      hours = "23"
    }
  }
  
  // Clamp minutes to 0-59
  if (minutes) {
    const m = parseInt(minutes, 10)
    if (m > 59) {
      minutes = "59"
    }
  }
  
  if (clean.includes(":") || clean.length > 2) {
    return `${hours}:${minutes}`.slice(0, 5)
  }
  
  return hours.slice(0, 2)
}

export const TimePicker = React.forwardRef<HTMLInputElement, TimePickerProps>(
  (
    {
      value = "",
      onChange,
      onBlur,
      disabled = false,
      step = 60,
      min,
      max,
      className,
      id,
      placeholder = "00:00",
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [displayValue, setDisplayValue] = React.useState(value || "")
    const localInputRef = React.useRef<HTMLInputElement | null>(null)

    // Synchronize parent value with local display state
    React.useEffect(() => {
      setDisplayValue(value || "")
    }, [value])

    // Parse current display value for dropdown selection
    const [hoursStr, minutesStr] = displayValue ? displayValue.split(":") : ["", ""]
    const selectedHour = hoursStr && hoursStr.length === 2 ? parseInt(hoursStr, 10) : null
    const selectedMinute = minutesStr && minutesStr.length === 2 ? parseInt(minutesStr, 10) : null

    // Generate Hour options (00 to 23)
    const hours = Array.from({ length: 24 }, (_, i) => i)

    // Generate Minute options based on step
    const stepMin = Math.max(1, Math.floor(step / 60))
    const minutes = Array.from(
      { length: Math.ceil(60 / stepMin) },
      (_, i) => i * stepMin
    ).filter((m) => m < 60)

    // Refs for scrolling selected values into view
    const hourRefs = React.useRef<Record<number, HTMLButtonElement | null>>({})
    const minuteRefs = React.useRef<Record<number, HTMLButtonElement | null>>({})

    React.useEffect(() => {
      if (isOpen) {
        const timer = setTimeout(() => {
          if (selectedHour !== null && hourRefs.current[selectedHour]) {
            hourRefs.current[selectedHour]?.scrollIntoView({
              block: "center",
              behavior: "auto",
            })
          }
          if (selectedMinute !== null && minuteRefs.current[selectedMinute]) {
            minuteRefs.current[selectedMinute]?.scrollIntoView({
              block: "center",
              behavior: "auto",
            })
          }
        }, 80)
        return () => clearTimeout(timer)
      }
    }, [isOpen])

    // Determine if hour/minute falls outside of min/max constraints
    const isTimeDisabled = (hour: number, minute?: number) => {
      const timeStr = `${hour.toString().padStart(2, "0")}:${(minute ?? 0)
        .toString()
        .padStart(2, "0")}`
      
      if (min) {
        if (minute === undefined) {
          const minHour = parseInt(min.split(":")[0], 10)
          if (hour < minHour) return true
        } else {
          if (timeStr < min) return true
        }
      }
      
      if (max) {
        if (minute === undefined) {
          const maxHour = parseInt(max.split(":")[0], 10)
          if (hour > maxHour) return true
        } else {
          if (timeStr > max) return true
        }
      }
      
      return false
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      const formatted = formatTimeRaw(val)
      setDisplayValue(formatted)
      
      // Update react-hook-form if it is a complete valid time, or empty
      if (formatted.length === 5 || formatted.length === 0) {
        onChange?.(formatted)
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        const val = e.currentTarget.value
        const selectionStart = e.currentTarget.selectionStart
        const selectionEnd = e.currentTarget.selectionEnd
        
        // If backspace is pressed when cursor is right after colon (e.g. "12:|")
        if (selectionStart === 3 && selectionEnd === 3) {
          e.preventDefault()
          const newVal = val.slice(0, 2)
          setDisplayValue(newVal)
          onChange?.(newVal)
        }
      } else if (e.key === "Enter" || e.key === "Escape") {
        setIsOpen(false)
        localInputRef.current?.blur()
      }
    }

    const handleSelectHour = (hour: number) => {
      if (isTimeDisabled(hour)) return
      const hStr = hour.toString().padStart(2, "0")
      const mStr = (selectedMinute !== null ? selectedMinute : 0)
        .toString()
        .padStart(2, "0")
      const combined = `${hStr}:${mStr}`
      setDisplayValue(combined)
      onChange?.(combined)
    }

    const handleSelectMinute = (minute: number) => {
      if (selectedHour === null || isTimeDisabled(selectedHour, minute)) return
      const hStr = selectedHour.toString().padStart(2, "0")
      const mStr = minute.toString().padStart(2, "0")
      const combined = `${hStr}:${mStr}`
      setDisplayValue(combined)
      onChange?.(combined)
      setIsOpen(false) // Close the popover when minute selection completes
    }

    const formatHour = (hour: number) => hour.toString().padStart(2, "0")
    const formatMinute = (minute: number) => minute.toString().padStart(2, "0")

    const handleOpenChange = (open: boolean) => {
      setIsOpen(open)
      if (!open) {
        onBlur?.()
      }
    }

    return (
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverAnchor asChild>
          <div
            role="presentation"
            className={cn(
              "group relative flex rounded-md border border-input bg-background shadow-xs transition-colors focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/35",
              disabled && "opacity-50 pointer-events-none cursor-not-allowed",
              className
            )}
          >
            <input
              id={id}
              ref={(node) => {
                localInputRef.current = node
                if (typeof ref === "function") {
                  ref(node)
                } else if (ref) {
                  ref.current = node
                }
              }}
              type="text"
              placeholder={placeholder}
              value={displayValue}
              onChange={handleInputChange}
              onBlur={() => {
                onBlur?.()
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsOpen(true)}
              onClick={() => setIsOpen(true)}
              disabled={disabled}
              className="h-full w-full cursor-text rounded-md border-0 bg-transparent py-1 pr-8 pl-3 text-sm font-semibold shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-hidden"
              maxLength={5}
            />
            <Clock3
              onClick={(e) => {
                e.stopPropagation()
                setIsOpen((prev) => !prev)
              }}
              className="absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary group-hover:text-primary cursor-pointer z-10"
              aria-hidden="true"
            />
          </div>
        </PopoverAnchor>
        <PopoverContent 
          className="w-[180px] p-2 bg-popover/95 backdrop-blur-md border border-border/60 shadow-lg rounded-xl z-[100]"
          onOpenAutoFocus={(e) => {
            // Prevent Radix Popover from auto-focusing elements inside the dropdown
            // so that user can keep typing inside the text field
            e.preventDefault()
          }}
        >
          <div className="grid grid-cols-2 gap-2 h-56">
            {/* Hours list */}
            <div className="flex flex-col h-full min-h-0">
              <div className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 pb-1 border-b border-border/40 shrink-0 select-none">
                Hrs
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-thin pr-1">
                <div className="flex flex-col gap-1">
                  {hours.map((hour) => {
                    const isSelected = selectedHour === hour
                    const isDisabled = isTimeDisabled(hour)
                    return (
                      <button
                        key={hour}
                        ref={(el) => {
                          hourRefs.current[hour] = el
                        }}
                        type="button"
                        onClick={() => handleSelectHour(hour)}
                        disabled={isDisabled}
                        className={cn(
                          "w-full text-center text-sm py-1.5 rounded-lg font-medium transition-colors cursor-pointer select-none shrink-0",
                          isSelected
                            ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                            : "text-foreground hover:bg-muted/70 hover:text-foreground",
                          isDisabled && "opacity-35 cursor-not-allowed hover:bg-transparent hover:text-foreground"
                        )}
                      >
                        {formatHour(hour)}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
            {/* Minutes list */}
            <div className="flex flex-col h-full min-h-0 border-l border-border/40 pl-2">
              <div className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 pb-1 border-b border-border/40 shrink-0 select-none">
                Min
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-thin pr-1">
                <div className="flex flex-col gap-1">
                  {minutes.map((minute) => {
                    const isSelected = selectedMinute === minute
                    const isDisabled = selectedHour === null || isTimeDisabled(selectedHour, minute)
                    return (
                      <button
                        key={minute}
                        ref={(el) => {
                          minuteRefs.current[minute] = el
                        }}
                        type="button"
                        onClick={() => handleSelectMinute(minute)}
                        disabled={isDisabled}
                        className={cn(
                          "w-full text-center text-sm py-1.5 rounded-lg font-medium transition-colors cursor-pointer select-none shrink-0",
                          isSelected
                            ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                            : "text-foreground hover:bg-muted/70 hover:text-foreground",
                          isDisabled && "opacity-35 cursor-not-allowed hover:bg-transparent hover:text-foreground"
                        )}
                      >
                        {formatMinute(minute)}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )
  }
)

TimePicker.displayName = "TimePicker"
