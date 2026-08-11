"use client"

import { Controller, useFormContext } from "react-hook-form"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type FormSelectOption = {
  label: string
  value: string | number
}

type FormSelectProps = {
  name: string
  label: string
  placeholder?: string
  required?: boolean
  options?: FormSelectOption[]
  disabled?: boolean
  onChange?: (value: any) => void
}

function FormSelect({
  label,
  name,
  options = [],
  placeholder,
  disabled,
  required,
  onChange,
}: FormSelectProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const error = errors[name]?.message
  const contentId = `${name.replaceAll(".", "-")}-select-content`

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>

      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            key={
              options.length
                ? `${name}_${options.length}_${field.value}`
                : name
            }
            disabled={disabled}
            value={
              field.value !== undefined && field.value !== null
                ? String(field.value)
                : ""
            }
            onValueChange={(val) => {
              if (disabled) return

              const matchedOption = options.find(
                (opt) => String(opt.value) === val
              )

              const convertedValue =
                matchedOption && typeof matchedOption.value === "number"
                  ? Number(val)
                  : val

              field.onChange(convertedValue)
              if (onChange) {
                onChange(convertedValue)
              }
            }}
          >
            <SelectTrigger
              aria-controls={contentId}
              aria-invalid={Boolean(error)}
              className="h-10 w-full text-sm md:text-base"
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent id={contentId}>
              {options.length > 0 ? (
                options.map((option) => (
                  <SelectItem
                    key={String(option.value)}
                    value={String(option.value)}
                    className="text-sm"
                  >
                    {option.label}
                  </SelectItem>
                ))
              ) : (
                <div className="px-2 py-2 text-sm text-muted-foreground">
                  No options available
                </div>
              )}
            </SelectContent>
          </Select>
        )}
      />

      {typeof error === "string" && (
        <p className="mt-0.5 text-xs text-destructive">{error}</p>
      )}
    </div>
  )
}

export { FormSelect }
