"use client"

import * as React from "react"

import { cn } from "@/lib/utils/cn.utils"

interface OtpInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  error?: boolean
}

export function OtpInput({ value = "", onChange, disabled = false, error = false }: OtpInputProps) {
  const length = 6
  const inputRefs = React.useRef<HTMLInputElement[]>([])

  // Create an array from the value, padding with empty strings to length
  const otpArray = React.useMemo(() => {
    const arr = value.split("")
    while (arr.length < length) {
      arr.push("")
    }
    return arr
  }, [value, length])

  // Handle typing inside an input box
  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (!val) return

    // Keep only the last character entered
    const char = val.slice(-1)
    if (!/^\d$/.test(char)) return // Numeric only

    const newOtpArray = [...otpArray]
    newOtpArray[index] = char

    const newValue = newOtpArray.slice(0, length).join("")
    onChange(newValue)

    // Auto-advance focus to next field
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle key down events (backspace, arrows)
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault()

      const newOtpArray = [...otpArray]
      
      // If current is filled, clear it. If current is empty, clear the previous and focus it.
      if (newOtpArray[index]) {
        newOtpArray[index] = ""
        onChange(newOtpArray.join(""))
      } else if (index > 0) {
        newOtpArray[index - 1] = ""
        onChange(newOtpArray.join(""))
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault()
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault()
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle paste events
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (disabled) return

    const pastedData = e.clipboardData.getData("text").trim()
    if (!/^\d+$/.test(pastedData)) return // Ensure only digits

    const digits = pastedData.slice(0, length).split("")
    const newValue = digits.join("")
    onChange(newValue)

    // Focus on the last filled input or the last input overall
    const focusIndex = Math.min(digits.length, length - 1)
    inputRefs.current[focusIndex]?.focus()
  }

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-3 py-2">
      {otpArray.map((digit, idx) => (
        <React.Fragment key={idx}>
          <input
            ref={(el) => {
              if (el) inputRefs.current[idx] = el
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleInputChange(idx, e)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={cn(
              "w-9 h-11 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold rounded-lg border bg-card transition-all duration-200 outline-none",
              "focus:border-primary focus:ring-2 focus:ring-primary/20",
              error
                ? "border-destructive focus:border-destructive focus:ring-destructive/20 text-destructive"
                : "border-input text-foreground",
              disabled && "opacity-50 cursor-not-allowed bg-muted"
            )}
            aria-label={`Digit ${idx + 1} of OTP`}
          />
          {/* Visual separator in the middle for improved readability */}
          {idx === 2 && <span className="text-muted-foreground font-semibold px-0.5 sm:px-1">-</span>}
        </React.Fragment>
      ))}
    </div>
  )
}
