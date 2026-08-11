"use client"

import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { Controller,useFormContext } from "react-hook-form"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type FormInputProps = {
  name: string
  label: string
  type?: string
  placeholder?: string
  inputMode?:
  | "search"
  | "text"
  | "none"
  | "tel"
  | "url"
  | "email"
  | "numeric"
  | "decimal"
  required?: boolean
  autoComplete?: string
  disabled?: boolean
}

function FormInput({
  label,
  name,
  placeholder,
  type = "text",
  inputMode,
  required,
  disabled,
  autoComplete,
}: FormInputProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  const error = errors[name]?.message
  const [showPassword, setShowPassword] = useState(false)

  const isPasswordField = type === "password"
  const inputType = isPasswordField
    ? showPassword
      ? "text"
      : "password"
    : type

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name} className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <div className="relative">
            <Input
              id={name}
              type={inputType}
              inputMode={inputMode}
              placeholder={placeholder}
              autoComplete={autoComplete}
              disabled={disabled}
              aria-invalid={Boolean(error)}
              className={`h-10 pl-3.5 text-sm md:text-base ${isPasswordField ? "pr-10" : "px-3.5"
                }`}
              {...field}
              value={field.value ?? ""}
            />
            {isPasswordField && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none disabled:opacity-50"
                disabled={disabled}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        )}
      />
      {typeof error === "string" ? (
        <p className="mt-0.5 text-xs text-destructive">{error}</p>
      ) : null}
    </div>
  )
}

export { FormInput }
