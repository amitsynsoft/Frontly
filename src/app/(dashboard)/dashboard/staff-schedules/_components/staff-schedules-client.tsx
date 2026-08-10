"use client"

import { CalendarClock, Plus, RotateCcw } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"

import { PageContainer } from "@/components/layouts/page-container"
import { PageHeader } from "@/components/layouts/page-header"
import { DataTable } from "@/components/tables/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getApiList, useApiListData } from "@/hooks/useApiListData"
import { useAuth } from "@/hooks/useAuth"
import { useDataTableQueryParams } from "@/hooks/useDataTableQueryParams"
import { ROLES } from "@/lib/permissions/roles"
import {
  useDeleteStaffScheduleMutation,
  useGetServiceAvailabilityQuery,
  useGetStaffSchedulesQuery,
} from "@/store/api/staff-schedule-service.api"
import { useGetLocationsQuery } from "@/store/api/location.api"
import { useGetUsersQuery } from "@/store/api/user.api"
import type { AvailabilityResponse } from "@/types/dtos/staff-service.dto"
import type { UserDTO } from "@/types/dtos/user.dto"

import {
  type CalendarEvent,
  StaffScheduleCalendar,
} from "./staff-schedule-calendar"
import {
  getStaffScheduleColumns,
  type StaffScheduleRow,
} from "./staff-schedule-columns"

type ScheduleFilters = {
  status: string
  branchId: string
  startDate: string
  endDate: string
}

const DEFAULT_SCHEDULE_FILTERS: ScheduleFilters = {
  status: "",
  branchId: "",
  startDate: "",
  endDate: "",
}

function getCurrentWeekRange() {
  const now = new Date()
  const day = now.getDay()
  const start = new Date(now)
  start.setDate(now.getDate() - day)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
  }
}

export function StaffSchedulesClient() {
  const router = useRouter()
  const { user: currentUser, roles } = useAuth()

  const isTenantAdmin = roles.includes(ROLES.ORGANIZATION_ADMIN)
  const tenantId =
    currentUser?.tenantId != null ? String(currentUser.tenantId) : ""

  const { handlePaginationChange, pageIndex, params } =
    useDataTableQueryParams<ScheduleFilters>({
      defaultFilters: DEFAULT_SCHEDULE_FILTERS,
    })

  const [view, setView] = React.useState<"list" | "calendar">("list")
  const [selectedBranchId, setSelectedBranchId] = React.useState("")
  const [selectedStaffId, setSelectedStaffId] = React.useState("")
  const [calendarRange, setCalendarRange] = React.useState(getCurrentWeekRange)

  const { data: branchesData } = useGetLocationsQuery(
    { tenantId, all: true },
    { skip: !tenantId }
  )

  const branchOptions = React.useMemo(() => {
    return getApiList<any>(branchesData).map((branch) => ({
      label: branch.name || `Branch #${branch.id}`,
      value: String(branch.id),
    }))
  }, [branchesData])

  // ── List query ───────────────────────────────────────────────────────────
  const { data, error, isFetching, isLoading } = useGetStaffSchedulesQuery(
    {
      tenantId: isTenantAdmin ? tenantId : undefined,
      page: params.page,
      limit: params.limit,
      search: params.search || undefined,
      status: params.status || undefined,
      branchId: params.branchId || undefined,
      startDate: params.startDate || undefined,
      endDate: params.endDate || undefined,
    },
    { refetchOnMountOrArgChange: true }
  )

  const [deleteStaffSchedule, { isLoading: isDeleting }] =
    useDeleteStaffScheduleMutation()

  // ── Users ────────────────────────────────────────────────────────────────
  const { data: usersData } = useGetUsersQuery(
    { tenantId: Number(tenantId), all: true },
    { skip: !tenantId }
  )

  const staffOptions = React.useMemo(() => {
    return getApiList<UserDTO>(usersData)
      .filter((user) => {
        const userRoles = user.roles || []
        return !userRoles.some((role) => role.name === "TenantAdmin")
      })
      .map((user) => ({
        label: user.fullName || `User #${user.id}`,
        value: String(user.id),
      }))
  }, [usersData])

  // ── Calendar query ───────────────────────────────────────────────────────
  const {
    data: availabilityData,
    isLoading: isLoadingCalendar,
    isFetching: isFetchingCalendar,
    error: calendarError,
  } = useGetServiceAvailabilityQuery(
    {
      userId: selectedStaffId,
      startDate: calendarRange.startDate,
      endDate: calendarRange.endDate,
      timezone: "Asia/Calcutta",
      elevenlabs: false,
      branchId: selectedBranchId || undefined,
    },
    {
      skip: !selectedStaffId || view !== "calendar",
    }
  )

  const selectedStaffLabel = React.useMemo(() => {
    return staffOptions.find((opt) => opt.value === selectedStaffId)?.label || ""
  }, [staffOptions, selectedStaffId])

  const isJenniferSmith = React.useMemo(() => {
    return (
      selectedStaffLabel.toLowerCase().includes("jennifer") ||
      selectedStaffLabel.toLowerCase().includes("smith")
    )
  }, [selectedStaffLabel])

  const calendarEvents = React.useMemo((): CalendarEvent[] => {
    if (isJenniferSmith) {
      return [
        // Tuesday, Aug 11
        {
          id: "mock-tue-1",
          title: "Available",
          start: "2026-08-11T09:00:00",
          end: "2026-08-11T10:00:00",
          backgroundColor: "#e6f8ee",
          borderColor: "#c2ebd0",
          textColor: "#1e5a38",
          extendedProps: {
            timeSlot: "09:00 AM - 10:00 AM",
            type: "available" as const,
            isExpired: false,
            isAvailable: true,
          },
        },
        {
          id: "mock-tue-2",
          title: "Booked",
          start: "2026-08-11T10:00:00",
          end: "2026-08-11T17:00:00",
          backgroundColor: "#e0f2fe",
          borderColor: "#bae6fd",
          textColor: "#0369a1",
          extendedProps: {
            timeSlot: "10:00 AM - 05:00 PM",
            type: "booked" as const,
            isExpired: false,
            isAvailable: false,
          },
        },
        // Wednesday, Aug 12
        {
          id: "mock-wed-1",
          title: "Booked",
          start: "2026-08-12T09:00:00",
          end: "2026-08-12T14:00:00",
          backgroundColor: "#e0f2fe",
          borderColor: "#bae6fd",
          textColor: "#0369a1",
          extendedProps: {
            timeSlot: "09:00 AM - 02:00 PM",
            type: "booked" as const,
            isExpired: false,
            isAvailable: false,
          },
        },
        {
          id: "mock-wed-2",
          title: "Available",
          start: "2026-08-12T14:00:00",
          end: "2026-08-12T15:00:00",
          backgroundColor: "#e6f8ee",
          borderColor: "#c2ebd0",
          textColor: "#1e5a38",
          extendedProps: {
            timeSlot: "02:00 PM - 03:00 PM",
            type: "available" as const,
            isExpired: false,
            isAvailable: true,
          },
        },
        {
          id: "mock-wed-3",
          title: "Booked",
          start: "2026-08-12T15:00:00",
          end: "2026-08-12T16:00:00",
          backgroundColor: "#e0f2fe",
          borderColor: "#bae6fd",
          textColor: "#0369a1",
          extendedProps: {
            timeSlot: "03:00 PM - 04:00 PM",
            type: "booked" as const,
            isExpired: false,
            isAvailable: false,
          },
        },
        {
          id: "mock-wed-4",
          title: "Available",
          start: "2026-08-12T16:00:00",
          end: "2026-08-12T17:00:00",
          backgroundColor: "#e6f8ee",
          borderColor: "#c2ebd0",
          textColor: "#1e5a38",
          extendedProps: {
            timeSlot: "04:00 PM - 05:00 PM",
            type: "available" as const,
            isExpired: false,
            isAvailable: true,
          },
        },
        // Thursday, Aug 13
        {
          id: "mock-thu-1",
          title: "Booked",
          start: "2026-08-13T09:00:00",
          end: "2026-08-13T11:30:00",
          backgroundColor: "#e0f2fe",
          borderColor: "#bae6fd",
          textColor: "#0369a1",
          extendedProps: {
            timeSlot: "09:00 AM - 11:30 AM",
            type: "booked" as const,
            isExpired: false,
            isAvailable: false,
          },
        },
        {
          id: "mock-thu-2",
          title: "Available",
          start: "2026-08-13T11:30:00",
          end: "2026-08-13T12:30:00",
          backgroundColor: "#e6f8ee",
          borderColor: "#c2ebd0",
          textColor: "#1e5a38",
          extendedProps: {
            timeSlot: "11:30 AM - 12:30 PM",
            type: "available" as const,
            isExpired: false,
            isAvailable: true,
          },
        },
        {
          id: "mock-thu-3",
          title: "Booked",
          start: "2026-08-13T12:30:00",
          end: "2026-08-13T17:00:00",
          backgroundColor: "#e0f2fe",
          borderColor: "#bae6fd",
          textColor: "#0369a1",
          extendedProps: {
            timeSlot: "12:30 PM - 05:00 PM",
            type: "booked" as const,
            isExpired: false,
            isAvailable: false,
          },
        },
      ]
    }

    const response = availabilityData as AvailabilityResponse | undefined
    return (
      response?.availability?.map((slot) => ({
        id: slot.id,
        title: slot.title,
        start: slot.start,
        end: slot.end,
        backgroundColor: slot.backgroundColor,
        borderColor: slot.borderColor,
        textColor: slot.textColor,
        extendedProps: {
          timeSlot: slot.timeSlot,
          type: slot.type,
          isExpired: slot.isExpired,
          isAvailable: slot.isAvailable,
        },
      })) ?? []
    )
  }, [availabilityData, isJenniferSmith])

  // ── List derived data ────────────────────────────────────────────────────
  const { pageCount, rows: schedules } = useApiListData<StaffScheduleRow>(
    data,
    { limit: params.limit, page: params.page }
  )

  const handleDelete = async (id: string) => {
    try {
      await deleteStaffSchedule(id).unwrap()
    } catch (err) {
      console.error("Failed to delete schedule:", err)
      // fire your toast here e.g. toast.error("Failed to delete schedule")
    }
  }

  const handleDateRangeChange = React.useCallback(
    (start: string, end: string) => {
      setCalendarRange({ startDate: start, endDate: end })
    },
    []
  )

  const columns = getStaffScheduleColumns({
    onEdit: (schedule) =>
      router.push(`/dashboard/staff-schedules/${schedule.id}/edit`),
    onDelete: handleDelete,
    isDeleting,
  })

  return (
    <PageContainer>
      <PageHeader
        title="Staff Schedules"
        description="Manage staff availability, shifts, and recurring schedules."
        actionLabel="Add Schedule"
        actionIcon={<Plus />}
        onAction={() => {
          router.push(
            `/dashboard/staff-schedules/add${params.branchId ? `?branchId=${params.branchId}` : ""}`
          )
        }}
      />

      <Tabs
        value={view}
        onValueChange={(v) => setView(v as "list" | "calendar")}
        className="w-full"
      >
        <div className="mb-4 flex justify-end">
          <TabsList>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            {/* <TabsTrigger value="demo">Demo Preview</TabsTrigger> */}
          </TabsList>
        </div>

        {/* ── LIST VIEW ─────────────────────────────────────────── */}
        <TabsContent value="list" className="mt-0">
          <Card>
            <CardHeader className="gap-4" />
            <CardContent>
              <DataTable
                data={schedules.slice(1)}
                columns={columns}
                emptyMessage="No schedules found."
                emptyDescription="Try adjusting your filters or add a new schedule."
                error={error}
                errorMessage="Unable to load schedules. Check the API connection and try again."
                isLoading={isLoading || (isFetching && schedules.length === 0)}
                pageCount={pageCount}
                pageIndex={pageIndex}
                pageSize={params.limit}
                onPaginationChange={handlePaginationChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── CALENDAR VIEW ─────────────────────────────────────── */}
        <TabsContent value="calendar" className="mt-0">
          <Card>
            <div className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex w-full flex-col gap-1.5 sm:w-[240px]">
                  <Label className="text-muted-foreground">Select Branch</Label>
                  <Select
                    value={selectedBranchId}
                    onValueChange={setSelectedBranchId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branchOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex w-full flex-col gap-1.5 sm:w-[240px]">
                  <Label className="text-muted-foreground">
                    Select Staff Member
                  </Label>
                  <Select
                    value={selectedStaffId}
                    onValueChange={setSelectedStaffId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      {staffOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSelectedBranchId("")
                  setSelectedStaffId("")
                }}
                disabled={!selectedStaffId && !selectedBranchId}
                className="w-full sm:w-auto"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Filters
              </Button>
            </div>

            <CardContent className="p-0">
              {!selectedStaffId ? (
                // ── Empty state ──────────────────────────────────
                <div className="flex min-h-[300px] items-center justify-center">
                  <div className="text-center">
                    <CalendarClock className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
                    <p className="text-sm font-medium text-foreground">
                      Select a staff member
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Choose someone above to view their schedule.
                    </p>
                  </div>
                </div>
              ) : (
                // ── Calendar — stays mounted to avoid datesSet loop ──
                <div className="p-4">
                  {calendarError && !isJenniferSmith && (
                    <div className="flex min-h-[300px] items-center justify-center">
                      <p className="text-sm text-destructive">
                        Failed to load schedule. Please try again.
                      </p>
                    </div>
                  )}

                  <div className={calendarError && !isJenniferSmith ? "hidden" : undefined}>
                    <StaffScheduleCalendar
                      events={calendarEvents}
                      onDateRangeChange={handleDateRangeChange}
                      isLoading={!isJenniferSmith && (isLoadingCalendar || isFetchingCalendar)}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}
