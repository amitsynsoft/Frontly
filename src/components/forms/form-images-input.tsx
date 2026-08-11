"use client"

import { Plus, Trash2 } from "lucide-react"
import * as React from "react"
import { Controller, useFormContext } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type FormImagesInputProps = {
  name: string
  label: string
  placeholder?: string
  required?: boolean
}

export function FormImagesInput({
  name,
  label,
  placeholder,
  required,
}: FormImagesInputProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  const error = errors[name]?.message
  const [newUrl, setNewUrl] = React.useState("")

  return (
    <div className="flex flex-col gap-1.5 sm:col-span-2">
      <Label className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>

      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const images: string[] = Array.isArray(field.value)
            ? field.value
            : typeof field.value === "string" && field.value
              ? field.value
                  .split(",")
                  .map((i) => i.trim())
                  .filter(Boolean)
              : []

          const addImage = () => {
            const trimmed = newUrl.trim()
            if (trimmed) {
              const updated = [...images, trimmed]
              field.onChange(updated)
              setNewUrl("")
            }
          }

          const removeImage = (indexToRemove: number) => {
            const updated = images.filter((_, idx) => idx !== indexToRemove)
            field.onChange(updated)
          }

          const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              e.preventDefault()
              addImage()
            }
          }

          return (
            <div className="space-y-3">
              {/* Input for adding new URL */}
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder={placeholder || "Enter image URL..."}
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-9 flex-1 text-sm"
                />
                <Button
                  type="button"
                  onClick={addImage}
                  size="sm"
                  className="h-9 shrink-0 px-3"
                >
                  <Plus className="mr-1.5 size-4" />
                  Add
                </Button>
              </div>

              {/* Preview Grid */}
              {images.length > 0 ? (
                <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {images.map((url, index) => (
                    <div
                      key={index}
                      className="group relative aspect-video w-full overflow-hidden rounded-md border border-border bg-muted/20"
                    >
                      {/* Image Preview */}
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                          const fallback = e.currentTarget
                            .nextElementSibling as HTMLDivElement
                          if (fallback) fallback.style.display = "flex"
                        }}
                      />
                      {/* Fallback for broken/invalid images */}
                      <div className="absolute inset-0 hidden flex-col items-center justify-center bg-muted p-2 text-center text-xs text-muted-foreground">
                        <svg
                          className="mb-1 size-5 text-muted-foreground/60"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect
                            width="18"
                            height="18"
                            x="3"
                            y="3"
                            rx="2"
                            ry="2"
                          />
                          <circle cx="9" cy="9" r="2" />
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                        Broken Link
                      </div>

                      {/* Delete Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="text-destructive-foreground rounded-lg bg-destructive p-1.5 transition-transform duration-200 hover:scale-105"
                          title="Remove Image"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-2 flex h-[80px] flex-col items-center justify-center rounded-md border border-dashed border-border/60 bg-muted/5 p-4 text-center">
                  <span className="text-xs text-muted-foreground">
                    No images added yet
                  </span>
                </div>
              )}
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
