"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarDays, CalendarRange, Clock3, UserRound } from "lucide-react"
import * as React from "react"
import { useForm, useWatch } from "react-hook-form"

import { Form } from "@/components/forms/form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import { useGetLocationsQuery } from "@/store/api/location.api"
import { useGetUsersQuery } from "@/store/api/user.api"
import type { StaffScheduleRequest } from "@/types/dtos/staff-schedule.dto"

import { getApiList } from "@/hooks/useApiListData"

import { BasicScheduleDetails } from "./components/basic-schedule-details"
import { MonthDayPicker } from "./components/month-day-picker"
import { ScheduleEndSettings } from "./components/schedule-end-settings"
import { SchedulePatternEditor } from "./components/schedule-pattern-editor"
import { SchedulePreview } from "./components/schedule-preview"
import { SharedTimeRangesEditor } from "./components/shared-time-ranges-editor"
import { WeeklyAvailabilityEditor } from "./components/weekly-availability-editor"

import {
  createStaffScheduleDefaults,
  SCHEDULE_TEXT,
  DAY_LABELS,
} from "./staff-schedule-form.config"
import { getStaffScheduleSchema } from "./staff-schedule-form.schema"
import type { StaffScheduleFormValues } from "./staff-schedule-form.types"
import { buildStaffSchedulePayload } from "../../../../../../lib/utils/staff-schedule-utils/staff-schedule-form.utils"

interface StaffScheduleFormProps {
  initialData?: Partial<StaffScheduleFormValues>
  onSubmit: (values: StaffScheduleRequest) => Promise<void>
  isLoading: boolean
  onCancel?: () => void
  defaultBranchId?: string
  isEdit?: boolean
}

type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null
}

function getStringValue(source: UnknownRecord, key: string): string {
  const value = source[key]

  if (value !== null && value !== undefined && String(value).trim()) {
    return String(value)
  }

  return ""
}

function FormSection({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string
  description: string
  icon: React.ComponentType<React.ComponentProps<"svg">>
  children: React.ReactNode
}) {
  return (
    <section className="group rounded-xl border border-border/50 bg-card/60 p-5 shadow-xs backdrop-blur-xs transition-all duration-300 hover:border-border/80 hover:shadow-md sm:p-6">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/15">
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            {title}
          </h3>
          {description ? (
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {children}
    </section>
  )
}

function getHoursSectionTitle(
  mode: StaffScheduleFormValues["schedulePattern"]["mode"]
) {
  if (mode === "weekly") return "Weekly hours"
  if (mode === "monthly") return "Monthly hours"
  return "Daily hours"
}

function getHoursSectionDescription(
  mode: StaffScheduleFormValues["schedulePattern"]["mode"]
) {
  if (mode === "weekly")
    return "Set your working hours for each day of the week."
  if (mode === "monthly")
    return "Choose month dates and the hours used on those dates."
  return "Set the working hours used on every available day."
}

export function StaffScheduleForm({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
  defaultBranchId,
  isEdit = false,
}: StaffScheduleFormProps) {
  const { user } = useAuth()
  const tenantId = user?.tenantId ? String(user.tenantId) : ""

  // ── dynamic options fetching ───────────────────────────────────────────────
  const { data: branchesData, isLoading: isLoadingBranches } =
    useGetLocationsQuery(
      {
        tenantId: tenantId,
        all: true,
      },
      {
        skip: !tenantId,
      }
    )

  const { data: usersData, isLoading: isLoadingUsers } = useGetUsersQuery(
    {
      tenantId: Number(tenantId),
      all: true,
    },
    {
      skip: !tenantId,
    }
  )

  const branchOptions = React.useMemo(() => {
    const list = getApiList(branchesData)
    return list
      .map((branch: any) => ({
        label: getStringValue(branch, "name"),
        value: getStringValue(branch, "id"),
      }))
      .filter((option) => option.value)
  }, [branchesData])

  const staffOptions = React.useMemo(() => {
    const list = getApiList(usersData)
    return list
      .filter((u: any) => {
        const roles = u.roles || []
        return !roles.some((role: any) => role.name === "TenantAdmin")
      })
      .map((u: any) => {
        const id = u.id
        return {
          label: u.fullName || `User #${id}`,
          value: String(id),
        }
      })
      .filter((x) => x.value)
  }, [usersData])

  const defaultValues = React.useMemo(
    () => createStaffScheduleDefaults(defaultBranchId),
    [defaultBranchId]
  )

  const selectedBranchRef = React.useRef<any>(null)

  const form = useForm<StaffScheduleFormValues>({
    resolver: (values, context, options) => {
      const currentSchema = getStaffScheduleSchema(selectedBranchRef.current)
      return zodResolver(currentSchema)(values, context, options)
    },
    defaultValues: { ...defaultValues, ...initialData },
    mode: "onChange",
    reValidateMode: "onChange",
  })

  const values = useWatch({
    control: form.control,
    defaultValue: { ...defaultValues, ...initialData },
  }) as StaffScheduleFormValues
  const mode = values.schedulePattern.mode

  const selectedBranch = React.useMemo(() => {
    if (!branchesData) return null
    const list = getApiList<any>(branchesData)
    return list.find((b: any) => getStringValue(b, "id") === values.branchId)
  }, [branchesData, values.branchId])

  selectedBranchRef.current = selectedBranch

  const errors = form.formState.errors
  React.useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Form validation errors:", errors)
    }
  }, [errors])

  React.useEffect(() => {
    if (initialData) {
      form.reset(initialData)
    }
  }, [initialData, form])

  // Synchronize weekdays and time range limits on branch selection
  React.useEffect(() => {
    if (!selectedBranch) return

    // 1. Weekly mode adjustments
    const weeklyAvailability = form.getValues("weeklyAvailability") || []
    let weeklyChanged = false
    const updatedWeeklyAvailability = weeklyAvailability.map((day, index) => {
      const dayName = DAY_LABELS[index]
      const branchHours = (selectedBranch as any).operatingHours?.[dayName]
      const isOpen = !!(branchHours && branchHours.start && branchHours.end)

      if (!isOpen && day.isEnabled) {
        weeklyChanged = true
        return {
          ...day,
          isEnabled: false,
          timeRanges: [],
        }
      } else if (isOpen && day.isEnabled && branchHours) {
        let rangesChanged = false
        const clampedRanges = day.timeRanges.map((range) => {
          let start = range.startTime
          let end = range.endTime
          let itemChanged = false

          if (start < branchHours.start) {
            start = branchHours.start
            itemChanged = true
          }
          if (end > branchHours.end) {
            end = branchHours.end
            itemChanged = true
          }
          if (start >= end) {
            start = branchHours.start
            end = branchHours.end
            itemChanged = true
          }

          if (itemChanged) {
            rangesChanged = true
          }
          return { startTime: start, endTime: end }
        })

        if (rangesChanged) {
          weeklyChanged = true
          return {
            ...day,
            timeRanges: clampedRanges,
          }
        }
      }
      return day
    })

    if (weeklyChanged) {
      form.setValue("weeklyAvailability", updatedWeeklyAvailability, {
        shouldDirty: true,
      })
    }

    // 2. Shared time ranges adjustments (for daily/monthly modes)
    const availabilityTimeRanges =
      form.getValues("availabilityTimeRanges") || []
    if (availabilityTimeRanges.length > 0) {
      // Find min start and max end of all open days
      let minStart: string | null = null
      let maxEnd: string | null = null
      for (const dayName of DAY_LABELS) {
        const hours = (selectedBranch as any).operatingHours?.[dayName]
        if (hours && hours.start && hours.end) {
          if (!minStart || hours.start < minStart) minStart = hours.start
          if (!maxEnd || hours.end > maxEnd) maxEnd = hours.end
        }
      }

      if (minStart && maxEnd) {
        let rangesChanged = false
        const clampedSharedRanges = availabilityTimeRanges.map((range) => {
          let start = range.startTime
          let end = range.endTime
          let itemChanged = false

          if (start < minStart!) {
            start = minStart!
            itemChanged = true
          }
          if (end > maxEnd!) {
            end = maxEnd!
            itemChanged = true
          }
          if (start >= end) {
            start = minStart!
            end = maxEnd!
            itemChanged = true
          }

          if (itemChanged) {
            rangesChanged = true
          }
          return { startTime: start, endTime: end }
        })

        if (rangesChanged) {
          form.setValue("availabilityTimeRanges", clampedSharedRanges, {
            shouldDirty: true,
          })
        }
      }
    }
  }, [selectedBranch, form])

  const handleFormSubmit = async (formValues: StaffScheduleFormValues) => {
    const payload = buildStaffSchedulePayload(formValues)
    await onSubmit(payload as any)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="grid min-w-0 grid-cols-1 items-start gap-6"
        noValidate
      >
        <div className="flex min-w-0 flex-col gap-6">
          <FormSection
            title="Staff schedule details"
            description={SCHEDULE_TEXT.sections.basicDescription}
            icon={UserRound}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <BasicScheduleDetails
                form={form}
                branchOptions={branchOptions}
                staffOptions={staffOptions}
                isLoadingBranches={isLoadingBranches}
                isLoadingUsers={isLoadingUsers}
                isEdit={isEdit}
              />
            </div>
          </FormSection>

          <FormSection
            title={SCHEDULE_TEXT.sections.patternTitle}
            description={SCHEDULE_TEXT.sections.patternDescription}
            icon={CalendarDays}
          >
            <SchedulePatternEditor form={form} />
          </FormSection>

          <FormSection
            title={getHoursSectionTitle(mode)}
            description={getHoursSectionDescription(mode)}
            icon={Clock3}
          >
            {mode === "weekly" ? (
              <WeeklyAvailabilityEditor
                form={form}
                selectedBranch={selectedBranch}
              />
            ) : mode === "monthly" ? (
              <div className="space-y-4">
                <MonthDayPicker form={form} />
                <SharedTimeRangesEditor
                  form={form}
                  selectedBranch={selectedBranch}
                />
              </div>
            ) : (
              <SharedTimeRangesEditor
                form={form}
                selectedBranch={selectedBranch}
              />
            )}
          </FormSection>

          <FormSection
            title="Effective dates"
            description="Define the date range for this availability."
            icon={CalendarRange}
          >
            <ScheduleEndSettings form={form} />
          </FormSection>

          <Card className="border-border/60 shadow-sm">
            <CardContent className="flex flex-col-reverse gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              {onCancel ? (
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-lg px-6"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  {SCHEDULE_TEXT.actions.cancel}
                </Button>
              ) : (
                <span />
              )}
              <Button
                type="submit"
                className="h-11 rounded-lg px-8 shadow-sm"
                disabled={isLoading}
              >
                {isLoading
                  ? "Saving Schedule..."
                  : isEdit
                    ? SCHEDULE_TEXT.actions.update
                    : SCHEDULE_TEXT.actions.submit}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* <SchedulePreview
          values={values}
          branchOptions={branchOptions}
          staffOptions={staffOptions}
        /> */}
      </form>
    </Form>
  )
}
