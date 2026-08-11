"use client"

import "react-phone-input-2/lib/style.css"

import { Control, FieldPath, FieldValues, UseFormReturn } from "react-hook-form"
import PhoneInput from "react-phone-input-2"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/forms/form"

type PhoneFieldProps<T extends FieldValues> = {
  name: FieldPath<T>
  control?: Control<T>
  form?: UseFormReturn<T>
  label?: string
  required?: boolean
  defaultCountry?: string
  onlyCountries?: string[]
  preferredCountries?: string[]
  placeholder?: string
  disabled?: boolean
}

export function PhoneField<T extends FieldValues>({
  name,
  control,
  form,
  label,
  required,
  defaultCountry = "in",
  onlyCountries,
  preferredCountries,
  placeholder,
  disabled,
}: PhoneFieldProps<T>) {
  const effectiveControl = control || form?.control

  if (!effectiveControl) {
    throw new Error("PhoneField requires either 'control' or 'form' prop")
  }

  return (
    <FormField
      control={effectiveControl}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel>
              {label}
              {required && (
                <span className="mb-1 ml-1 text-destructive">*</span>
              )}
            </FormLabel>
          )}

          <FormControl>
            <div
              className={
                "w-full " +
                "[&_.react-tel-input]:!h-10.5 " +
                "[&_.react-tel-input]:!w-full " +
                "[&_.react-tel-input]:!rounded-md " +
                "[&_.react-tel-input]:!border " +
                "[&_.react-tel-input]:!border-input " +
                "[&_.react-tel-input]:!bg-background " +
                "[&_.react-tel-input]:dark:!bg-input/30 " +
                "[&_.react-tel-input]:!text-sm [&_.react-tel-input]:md:!text-base " +
                "[&_.react-tel-input]:!shadow-xs " +
                "[&_.react-tel-input]:!transition-colors " +
                "[&_.react-tel-input]:!font-sans " +
                (disabled
                  ? "[&_.react-tel-input]:!pointer-events-none [&_.react-tel-input]:!cursor-not-allowed [&_.react-tel-input]:!opacity-50 "
                  : "[&_.react-tel-input]:focus-within:!border-ring [&_.react-tel-input]:focus-within:!ring-[3px] [&_.react-tel-input]:focus-within:!ring-ring/35 ") +
                "aria-invalid:[&_.react-tel-input]:!border-destructive " +
                "aria-invalid:[&_.react-tel-input]:focus-within:!ring-destructive/20 " +
                "[&_.react-tel-input_.form-control]:!border-none " +
                "[&_.react-tel-input_.form-control]:!bg-transparent " +
                "[&_.react-tel-input_.form-control]:!h-full " +
                "[&_.react-tel-input_.form-control]:!w-full " +
                "[&_.react-tel-input_.form-control]:!text-foreground " +
                "[&_.react-tel-input_.form-control]:!shadow-none " +
                "[&_.react-tel-input_.form-control]:!outline-none " +
                "[&_.react-tel-input_.form-control]:!text-sm [&_.react-tel-input_.form-control]:md:!text-base " +
                "[&_.react-tel-input_.form-control]:!font-sans " +
                "[&_.react-tel-input_.flag-dropdown]:!border-none " +
                "[&_.react-tel-input_.flag-dropdown]:!bg-transparent " +
                "[&_.react-tel-input_.flag-dropdown]:!h-full " +
                "[&_.react-tel-input_.flag-dropdown]:!rounded-l-md " +
                "[&_.react-tel-input_.selected-flag:hover]:!bg-accent " +
                "[&_.react-tel-input_.selected-flag:focus]:!bg-accent " +
                "[&_.react-tel-input_.selected-flag.open]:!bg-accent " +
                "[&_.react-tel-input_.selected-flag]:!rounded-l-md " +
                "[&_.react-tel-input_.selected-flag]:!pl-3 " +
                "[&_.react-tel-input_.country-list]:!bg-popover " +
                "[&_.react-tel-input_.country-list]:!border " +
                "[&_.react-tel-input_.country-list]:!border-border/60 " +
                "[&_.react-tel-input_.country-list]:!rounded-xl " +
                "[&_.react-tel-input_.country-list]:!shadow-lg " +
                "[&_.react-tel-input_.country-list]:!p-1 " +
                "[&_.react-tel-input_.country-list]:!text-popover-foreground " +
                "[&_.react-tel-input_.country-list_.country]:!rounded-lg " +
                "[&_.react-tel-input_.country-list_.country]:!px-3 " +
                "[&_.react-tel-input_.country-list_.country]:!py-2.5 " +
                "[&_.react-tel-input_.country-list_.country]:!text-sm " +
                "[&_.react-tel-input_.country-list_.country:hover]:!bg-accent " +
                "[&_.react-tel-input_.country-list_.country:hover]:!text-accent-foreground " +
                "[&_.react-tel-input_.country-list_.country.highlight]:!bg-accent " +
                "[&_.react-tel-input_.country-list_.country.highlight]:!text-accent-foreground " +
                "[&_.react-tel-input_.search]:!bg-popover " +
                "[&_.react-tel-input_.search]:!p-2 " +
                "[&_.react-tel-input_.search]:!sticky " +
                "[&_.react-tel-input_.search]:!top-0 " +
                "[&_.react-tel-input_.search]:!z-10 " +
                "[&_.react-tel-input_.search]:!border-b " +
                "[&_.react-tel-input_.search]:!border-border/40 " +
                "[&_.react-tel-input_.search-box]:!bg-background " +
                "[&_.react-tel-input_.search-box]:!text-foreground " +
                "[&_.react-tel-input_.search-box]:!border-input " +
                "[&_.react-tel-input_.search-box]:!rounded-lg " +
                "[&_.react-tel-input_.search-box]:!w-[calc(100%-16px)] " +
                "[&_.react-tel-input_.search-box]:!mx-2 " +
                "[&_.react-tel-input_.search-box]:!my-1 " +
                "[&_.react-tel-input_.search-box]:!px-3 " +
                "[&_.react-tel-input_.search-box]:!text-sm " +
                "[&_.react-tel-input_.search-box]:!transition-colors " +
                "[&_.react-tel-input_.search-box:focus]:!border-ring " +
                "[&_.react-tel-input_.search-box:focus]:!ring-2 " +
                "[&_.react-tel-input_.search-box:focus]:!ring-ring/25"
              }
            >
              <PhoneInput
                country={defaultCountry}
                enableSearch
                disableSearchIcon
                searchPlaceholder="Search country..."
                onlyCountries={onlyCountries}
                preferredCountries={preferredCountries}
                placeholder={placeholder}
                disabled={disabled}
                value={field.value}
                onChange={(value) => field.onChange(value)}
                containerStyle={{
                  width: "100%",
                  position: "relative",
                }}
                inputStyle={{
                  width: "100%",
                  height: "100%",
                  fontSize: "inherit",
                  fontFamily: "inherit",
                  background: "transparent",
                  border: "none",
                  paddingLeft: "48px",
                }}
                buttonStyle={{
                  background: "transparent",
                  border: "none",
                }}
                dropdownStyle={{
                  width: "300px",
                  maxHeight: "250px",
                  borderRadius: "0.75rem",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                  zIndex: 9999,
                }}
                searchStyle={{
                  width: "100%",
                  fontSize: "14px",
                  padding: "8px 10px",
                  borderRadius: "0.375rem",
                  margin: "0",
                }}
              />
            </div>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
