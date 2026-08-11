import type { UseFormReturn } from "react-hook-form"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/forms/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type {
  StaffScheduleFormValues,
  SelectOption,
} from "../staff-schedule-form.types"

interface BasicScheduleDetailsProps {
  form: UseFormReturn<StaffScheduleFormValues>
  branchOptions: SelectOption[]
  staffOptions: SelectOption[]
  isLoadingBranches?: boolean
  isLoadingUsers?: boolean
  isEdit?: boolean
}

export function BasicScheduleDetails({
  form,
  branchOptions,
  staffOptions,
  isLoadingBranches = false,
  isLoadingUsers = false,
  isEdit = false,
}: BasicScheduleDetailsProps) {
  return (
    <div className="contents">
      <FormField
        control={form.control}
        name="staffId"
        render={({ field }) => (
          <FormItem className="min-w-0">
            <FormLabel>Staff member</FormLabel>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={isEdit || isLoadingUsers}
            >
              <FormControl>
                <SelectTrigger className="h-12 w-full overflow-hidden rounded-xl border-border/60 bg-background shadow-xs transition-colors hover:border-primary/35 [&>span]:truncate">
                  <SelectValue
                    placeholder={
                      isLoadingUsers ? "Loading staff..." : "Choose staff"
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  {staffOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormDescription>
              Staff member assigned to this schedule.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="branchId"
        render={({ field }) => (
          <FormItem className="min-w-0">
            <FormLabel>Branch</FormLabel>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={isEdit || isLoadingBranches}
            >
              <FormControl>
                <SelectTrigger className="h-12 w-full overflow-hidden rounded-xl border-border/60 bg-background shadow-xs transition-colors hover:border-primary/35 [&>span]:truncate">
                  <SelectValue
                    placeholder={
                      isLoadingBranches
                        ? "Loading branches..."
                        : "Choose branch"
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  {branchOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormDescription>
              Branch where this staff schedule applies.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
