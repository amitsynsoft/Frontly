"use client"

import { ArrowLeft, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"
import { toast } from "sonner"

import { PageContainer } from "@/components/layouts/page-container"
import { Button } from "@/components/ui/button"
import {
  useGetStaffScheduleByIdQuery,
  useUpdateStaffScheduleMutation,
} from "@/store/api/staff-schedule-service.api"
import type { StaffScheduleRequest } from "@/types/dtos/staff-schedule.dto"
import { StaffScheduleForm } from "../../_components/staff-schedule-form/staff-schedule-form"
import { mapScheduleToFormValues } from "@/lib/utils/staff-schedule-utils/staff-schedule-form.utils"

interface EditStaffSchedulePageProps {
  params: Promise<{ id: string }>
}

export default function EditStaffSchedulePage({
  params,
}: EditStaffSchedulePageProps) {
  const router = useRouter()
  const { id } = React.use(params)

  const {
    data: scheduleData,
    isLoading: isLoadingData,
    error,
  } = useGetStaffScheduleByIdQuery(id)

  const [updateStaffSchedule, { isLoading: isUpdating }] =
    useUpdateStaffScheduleMutation()

  const handleSubmit = async (values: StaffScheduleRequest) => {
    try {
      await updateStaffSchedule({ id, data: values }).unwrap()
      // toast.success("Schedule successfully updated.")
      router.push("/dashboard/staff-schedules")
    } catch {
      // Surfaced by RTK Query logger/toast middleware
    }
  }

  const schedule =
    (scheduleData as any)?.result || (scheduleData as any)?.data || scheduleData

  return (
    <PageContainer>
      <div className="flex flex-col gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit gap-1.5 pl-0 text-muted-foreground hover:text-foreground"
          onClick={() => router.push("/dashboard/staff-schedules")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to schedules
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          Edit Staff Schedule
        </h1>
        <p className="text-sm text-muted-foreground">
          Update staff schedule details and availability.
        </p>
      </div>

      <div className="mt-6">
        {isLoadingData ? (
          <div className="flex h-64 items-center justify-center rounded-lg border border-border/50 bg-background/50">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive">
            <p className="font-semibold">Failed to load schedule details</p>
            <p className="text-xs text-muted-foreground">
              Please check the ID and try again.
            </p>
          </div>
        ) : (
          <StaffScheduleForm
            initialData={mapScheduleToFormValues(schedule)}
            onSubmit={handleSubmit}
            isLoading={isUpdating}
            isEdit
            onCancel={() => router.push("/dashboard/staff-schedules")}
          />
        )}
      </div>
    </PageContainer>
  )
}
