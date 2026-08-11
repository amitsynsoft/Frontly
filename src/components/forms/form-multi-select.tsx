"use client"

import { Check, ChevronDown, X } from "lucide-react"
import * as React from "react"
import { Controller, useFormContext } from "react-hook-form"

import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils/cn.utils"

type ComboboxChipProps = {
  label: string
  onRemove: () => void
  disabled?: boolean
}

function ComboboxChip({ label, onRemove, disabled }: ComboboxChipProps) {
  return (
    <Badge
      variant="secondary"
      className="flex h-6 max-w-[14rem] min-w-0 items-center gap-1 rounded-md border border-primary/15 bg-primary/10 px-2.5 py-0 text-xs font-medium text-primary shadow-none"
    >
      <span className="min-w-0 truncate">{label}</span>
      <button
        type="button"
        disabled={disabled}
        aria-label={`Remove ${label}`}
        onMouseDown={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className="inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-full text-primary/70 outline-hidden transition-colors hover:bg-primary/15 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50"
      >
        <X className="size-3" />
      </button>
    </Badge>
  )
}

type FormMultiSelectProps = {
  name: string
  label: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  options: {
    label: string
    value: string | number
  }[]
}

type SelectValue = string | number

function toSelectValue(value: unknown): SelectValue {
  return typeof value === "string" || typeof value === "number"
    ? value
    : String(value)
}

function FormMultiSelect({
  name,
  label,
  placeholder = "Select options...",
  required,
  disabled,
  options = [],
}: FormMultiSelectProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const error = errors[name]?.message

  const [isOpen, setIsOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [highlightedIndex, setHighlightedIndex] = React.useState(0)

  const inputRef = React.useRef<HTMLInputElement>(null)
  const listboxId = React.useId()

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!search.trim()) return options
    const cleanSearch = search.toLowerCase().trim()
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(cleanSearch)
    )
  }, [search, options])

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const valueArray: SelectValue[] = Array.isArray(field.value)
            ? field.value.map(toSelectValue)
            : []

          const isSelected = (val: SelectValue) => {
            return valueArray.some((v) => String(v) === String(val))
          }

          const toggleSelect = (optVal: SelectValue) => {
            const optValStr = String(optVal)
            const exists = valueArray.some((v) => String(v) === optValStr)

            let nextValue: SelectValue[]
            if (exists) {
              nextValue = valueArray.filter((v) => String(v) !== optValStr)
            } else {
              const matched = options.find(
                (opt) => String(opt.value) === optValStr
              )
              const valToAdd = matched ? matched.value : optVal
              nextValue = [...valueArray, valToAdd]
            }
            field.onChange(nextValue)
          }

          // Map selected IDs back to option labels for displaying in chips
          const selectedChips = valueArray.map((val) => {
            const matched = options.find(
              (opt) => String(opt.value) === String(val)
            )
            return {
              value: val,
              label: matched ? matched.label : String(val),
            }
          })

          const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (disabled) return
            if (e.key === "ArrowDown") {
              e.preventDefault()
              if (!isOpen) {
                setIsOpen(true)
              } else if (filteredOptions.length > 0) {
                setHighlightedIndex(
                  (prev) => (prev + 1) % filteredOptions.length
                )
              }
            } else if (e.key === "ArrowUp") {
              e.preventDefault()
              if (!isOpen) {
                setIsOpen(true)
              } else if (filteredOptions.length > 0) {
                setHighlightedIndex(
                  (prev) =>
                    (prev - 1 + filteredOptions.length) % filteredOptions.length
                )
              }
            } else if (e.key === "Enter") {
              e.preventDefault()
              if (isOpen) {
                if (
                  filteredOptions.length > 0 &&
                  highlightedIndex >= 0 &&
                  highlightedIndex < filteredOptions.length
                ) {
                  toggleSelect(filteredOptions[highlightedIndex].value)
                  setSearch("")
                }
              } else {
                setIsOpen(true)
              }
            } else if (e.key === "Escape") {
              setIsOpen(false)
            } else if (e.key === "Backspace") {
              if (search === "" && selectedChips.length > 0) {
                const lastItem = selectedChips[selectedChips.length - 1]
                toggleSelect(lastItem.value)
              }
            }
          }

          const handleContainerClick = () => {
            if (disabled) return
            inputRef.current?.focus()
            if (!isOpen) setIsOpen(true)
          }

          return (
            <Popover
              open={isOpen && !disabled}
              onOpenChange={(open) => {
                if (disabled) return
                setIsOpen(open)
                if (!open) setSearch("")
              }}
            >
              <PopoverTrigger asChild>
                <div
                  onClick={handleContainerClick}
                  className={cn(
                    "group flex min-h-10 w-full cursor-text items-start gap-1.5 rounded-md border border-input bg-background px-2.5 py-1.5 text-sm shadow-xs transition-colors focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/35 md:text-base dark:bg-input/30",
                    disabled && "cursor-not-allowed bg-muted/50 opacity-50",
                    error &&
                      "border-destructive focus-within:border-destructive focus-within:ring-destructive/20"
                  )}
                >
                  <div className="flex max-h-28 min-w-0 flex-1 scrollbar-thin flex-wrap items-center gap-1.5 overflow-y-auto overscroll-contain pr-1">
                    {selectedChips.map((item) => (
                      <ComboboxChip
                        key={String(item.value)}
                        label={item.label}
                        disabled={disabled}
                        onRemove={() => {
                          if (disabled) return
                          toggleSelect(item.value)
                        }}
                      />
                    ))}

                    <input
                      ref={inputRef}
                      type="text"
                      role="combobox"
                      aria-autocomplete="list"
                      aria-controls={listboxId}
                      aria-expanded={isOpen}
                      disabled={disabled}
                      value={search}
                      onChange={(e) => {
                        if (disabled) return
                        setSearch(e.target.value)
                        setHighlightedIndex(0)
                        if (!isOpen) setIsOpen(true)
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        selectedChips.length === 0 ? placeholder : ""
                      }
                      className="h-6 min-w-20 flex-[1_0_7rem] border-0 bg-transparent px-0 py-0 text-sm leading-6 text-foreground outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed md:text-base"
                    />
                  </div>

                  <div className="mt-0.5 flex h-6 shrink-0 items-center gap-0.5 border-l border-border/70 pl-1.5 text-muted-foreground">
                    {selectedChips.length > 0 && !disabled && (
                      <button
                        type="button"
                        aria-label="Clear selected options"
                        onMouseDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onClick={(e) => {
                          if (disabled) return
                          e.stopPropagation()
                          field.onChange([])
                          setSearch("")
                          inputRef.current?.focus()
                        }}
                        className="inline-flex size-5 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
                      >
                        <X className="size-3.5" />
                      </button>
                    )}
                    <ChevronDown
                      className={cn(
                        "size-4 shrink-0 transition-transform",
                        isOpen && "rotate-180"
                      )}
                    />
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                sideOffset={4}
                collisionPadding={12}
                onOpenAutoFocus={(e) => e.preventDefault()}
                onWheelCapture={(e) => e.stopPropagation()}
                onTouchMoveCapture={(e) => e.stopPropagation()}
                className="flex w-[var(--radix-popover-trigger-width)] min-w-[var(--radix-popover-trigger-width)] flex-col gap-0 overflow-hidden rounded-lg border-border/70 p-1 shadow-lg ring-0"
              >
                <div
                  id={listboxId}
                  role="listbox"
                  aria-multiselectable="true"
                  onWheelCapture={(e) => e.stopPropagation()}
                  onTouchMoveCapture={(e) => e.stopPropagation()}
                  className="max-h-[min(17rem,var(--radix-popover-content-available-height))] scrollbar-thin overflow-y-auto overscroll-contain py-0.5"
                >
                  {filteredOptions.length === 0 ? (
                    <div className="px-3 py-2.5 text-center text-sm text-muted-foreground">
                      No options found
                    </div>
                  ) : (
                    filteredOptions.map((option, idx) => {
                      const isSel = isSelected(option.value)
                      const isHighlighted = idx === highlightedIndex

                      return (
                        <div
                          key={String(option.value)}
                          role="option"
                          aria-selected={isSel}
                          onMouseDown={(e) => {
                            e.preventDefault() // prevent input blur
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleSelect(option.value)
                            setSearch("")
                            setHighlightedIndex(0)
                            inputRef.current?.focus()
                          }}
                          onMouseEnter={() => setHighlightedIndex(idx)}
                          className={cn(
                            "flex min-h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-md px-2.5 py-2 text-sm transition-colors select-none",
                            isHighlighted && "bg-accent",
                            isSel
                              ? "!text-primary hover:!text-primary"
                              : "text-popover-foreground hover:text-accent-foreground " +
                                  (isHighlighted
                                    ? "text-accent-foreground"
                                    : "")
                          )}
                        >
                          <span className="min-w-0 truncate">
                            {option.label}
                          </span>
                          <Check
                            className={cn(
                              "size-4 shrink-0 transition-opacity",
                              isSel ? "opacity-100" : "opacity-0",
                              "!text-primary"
                            )}
                          />
                        </div>
                      )
                    })
                  )}
                </div>
              </PopoverContent>
            </Popover>
          )
        }}
      />
      {typeof error === "string" ? (
        <p className="mt-0.5 text-xs text-destructive">{error}</p>
      ) : null}
    </div>
  )
}

export { FormMultiSelect }
