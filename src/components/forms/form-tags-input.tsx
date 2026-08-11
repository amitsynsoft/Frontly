"use client"

import { X } from "lucide-react"
import * as React from "react"
import { Controller, useFormContext } from "react-hook-form"

import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils/cn.utils"

type FormTagsInputProps = {
  name: string
  label: string
  placeholder?: string
  required?: boolean
}

export function FormTagsInput({
  name,
  label,
  placeholder,
  required,
}: FormTagsInputProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  const error = errors[name]?.message
  const [inputValue, setInputValue] = React.useState("")
  const [isFocused, setIsFocused] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>

      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const tags: string[] = Array.isArray(field.value)
            ? field.value
            : typeof field.value === "string" && field.value
              ? field.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
              : []

          const addTag = (tagToAdd: string) => {
            const trimmed = tagToAdd.trim()
            if (trimmed && !tags.includes(trimmed)) {
              const updated = [...tags, trimmed]
              field.onChange(updated)
            }
            setInputValue("")
          }

          const removeTag = (tagToRemove: string) => {
            const updated = tags.filter((t) => t !== tagToRemove)
            field.onChange(updated)
          }

          const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault()
              addTag(inputValue)
            } else if (
              e.key === "Backspace" &&
              !inputValue &&
              tags.length > 0
            ) {
              e.preventDefault()
              removeTag(tags[tags.length - 1])
            }
          }

          return (
            <div
              className={cn(
                "flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-xs transition-colors dark:bg-input/30",
                isFocused && "border-ring ring-[3px] ring-ring/35",
                Boolean(error) && "border-destructive ring-destructive/20"
              )}
              onClick={() => inputRef.current?.focus()}
            >
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-md flex h-8 items-center gap-1 border border-border/40 bg-secondary px-1.5 font-medium text-secondary-foreground"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeTag(tag)
                    }}
                    className="rounded-full p-0.5 font-medium text-primary"
                  >
                    <X className="size-4" />
                  </button>
                </Badge>
              ))}
              <input
                ref={inputRef}
                type="text"
                placeholder={tags.length === 0 ? placeholder : ""}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={(e) => {
                  setIsFocused(false)
                  if (inputValue.trim()) {
                    addTag(inputValue)
                  }
                  field.onBlur()
                }}
                onFocus={() => setIsFocused(true)}
                className="min-w-[80px] flex-1 bg-transparent py-0.5 text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          )
        }}
      />

      {typeof error === "string" ? (
        <p className="mt-0.5 text-xs text-destructive">{error}</p>
      ) : null}
    </div>
  )
}
