"use client"

import { Controller, useFormContext } from "react-hook-form"

import { cn } from "@/lib/utils/cn.utils"

type FormSwitchProps = {
  name: string
  label: string
  description?: string
  disabled?: boolean
}

export function FormSwitch({
  name,
  label,
  description,
  disabled,
}: FormSwitchProps) {
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur } }) => (
        <label
          className={cn(
            "flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-border/50 bg-card/30 p-3 shadow-xs transition-all select-none hover:bg-card/50",
            disabled && "pointer-events-none opacity-50"
          )}
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground">{label}</span>
            {description && (
              <span className="text-sm text-muted-foreground">
                {description}
              </span>
            )}
          </div>
          <div className="relative inline-flex items-center">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => onChange(e.target.checked)}
              onBlur={onBlur}
              disabled={disabled}
              className="peer sr-only"
              id={name}
            />
            <div className="h-5 w-9 rounded-full bg-muted transition-colors duration-200 peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2" />
            <div className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-background shadow-xs transition-transform duration-200 peer-checked:translate-x-4" />
          </div>
        </label>
      )}
    />
  )
}
