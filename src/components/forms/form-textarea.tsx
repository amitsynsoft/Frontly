"use client"

import { Controller,useFormContext } from "react-hook-form"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type FormTextareaProps = {
  name: string
  label: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
}

function FormTextarea({
  label,
  name,
  placeholder,
  required,
  disabled,
}: FormTextareaProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  const error = errors[name]?.message

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name} className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Textarea
            id={name}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            className="px-3.5 py-2.5 text-sm md:text-base"
            {...field}
          />
        )}
      />
      {typeof error === "string" ? (
        <p className="mt-0.5 text-xs text-destructive">{error}</p>
      ) : null}
    </div>
  )
}

export { FormTextarea }
