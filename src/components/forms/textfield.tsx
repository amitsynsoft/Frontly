"use client"

import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/forms/form"

import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"

interface TextFieldProps {
  form: any
  name: string
  icon?: React.ComponentType<{ className?: string }>
  label: string
  type?: string // text | password | textarea | email ...
  placeholder?: string
  required?: boolean
  disabled?: boolean
  uppercase?: boolean
  rows?: number // textarea only
}

export default function TextField({
  form,
  name,
  icon: Icon,
  label,
  type = "text",
  placeholder,
  required = false,
  disabled = false,
  uppercase = false,
  rows = 4,
}: TextFieldProps) {
  const [showPassword, setShowPassword] = useState(false)

  const isPasswordField = type === "password"
  const isTextarea = type === "textarea"

  const currentType = isPasswordField
    ? showPassword
      ? "text"
      : "password"
    : type

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="-ml-1 text-red-500">*</span>}
          </FormLabel>

          <FormControl>
            <div className="relative">
              {/* ICON (only for input usually) */}
              {Icon && !isTextarea && (
                <Icon className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
              )}

              {isTextarea ? (
                <Textarea
                  {...field}
                  onChange={(e) => {
                    if (uppercase && typeof e.target.value === "string") {
                      e.target.value = e.target.value.toUpperCase()
                    }
                    field.onChange(e)
                  }}
                  value={field.value ?? ""}
                  placeholder={placeholder}
                  disabled={disabled}
                  rows={rows}
                  className="max-h-[70px] resize-none overflow-y-auto"
                />
              ) : (
                <>
                  <Input
                    {...field}
                    onChange={(e) => {
                      if (uppercase && typeof e.target.value === "string") {
                        e.target.value = e.target.value.toUpperCase()
                      }
                      field.onChange(e)
                    }}
                    value={field.value ?? ""}
                    type={currentType}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={Icon ? "pr-10 pl-9" : "pr-10"}
                  />

                  {isPasswordField && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-2.5 right-3"
                      disabled={disabled}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
