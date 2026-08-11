"use client"

import { Controller, useFormContext } from "react-hook-form"

import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils/cn.utils"

type FormCheckboxProps = {
  name: string
  label: string
  description?: string
  disabled?: boolean
  required?: boolean
}

export function FormCheckbox({
  name,
  label,
  description,
  disabled,
  required,
}: FormCheckboxProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const error = errors[name]?.message

  return (
    <div className="flex flex-col gap-1">
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange, onBlur } }) => (
          <label
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-lg border border-border/50 bg-card/30 p-3 shadow-xs transition-all select-none hover:bg-card/50",
              disabled && "pointer-events-none opacity-50",
              error && "border-destructive/50"
            )}
          >
            <div className="flex h-5 items-center">
              <Checkbox
                id={name}
                checked={!!value}
                onCheckedChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm leading-5 font-medium text-foreground">
                {label}{" "}
                {required && <span className="text-destructive">*</span>}
              </span>
              {description && (
                <span className="text-xs leading-relaxed text-muted-foreground">
                  {description}
                </span>
              )}
            </div>
          </label>
        )}
      />
      {typeof error === "string" ? (
        <p className="mt-0.5 text-xs text-destructive">{error}</p>
      ) : null}
    </div>
  )
}
