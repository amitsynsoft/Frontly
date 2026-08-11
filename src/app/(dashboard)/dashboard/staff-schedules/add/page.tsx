"use client"

import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { toast } from "sonner"

import { PageContainer } from "@/components/layouts/page-container"
import { useCreateStaffScheduleMutation } from "@/store/api/staff-schedule-service.api"
import type { StaffScheduleRequest } from "@/types/dtos/staff-schedule.dto"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { StaffScheduleForm } from "../_components/staff-schedule-form/staff-schedule-form"

export default function AddStaffSchedulePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const branchIdParam = searchParams.get("branchId")
  const branchId =
    branchIdParam && branchIdParam !== "null" ? branchIdParam : undefined

  const [createStaffSchedule, { isLoading }] = useCreateStaffScheduleMutation()

  const handleSubmit = async (values: StaffScheduleRequest) => {
    try {
      await createStaffSchedule(values).unwrap()
      router.push("/dashboard/staff-schedules")
    } catch {
      // Surfaced by RTK Query logger/toast middleware
    }
  }

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
        <div className="min-w-0">
          <h1 className="text-3xl font-bold tracking-tight">
            Create Staff Schedule
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Set recurring working hours and define bookable appointment times.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <StaffScheduleForm
          defaultBranchId={branchId}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onCancel={() => router.push("/dashboard/staff-schedules")}
        />
      </div>
    </PageContainer>
  )
}
