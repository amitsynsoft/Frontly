"use client"

import { endOfMonth, format, startOfMonth } from "date-fns"
import { CalendarIcon, RotateCcw, Search, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"

import { PageContainer } from "@/components/layouts/page-container"
import { PageHeader } from "@/components/layouts/page-header"
import { DataTable } from "@/components/tables/data-table"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getApiList, useApiListData } from "@/hooks/useApiListData"
import { useAuth } from "@/hooks/useAuth"
import { useDataTableQueryParams } from "@/hooks/useDataTableQueryParams"
import { ROLES } from "@/lib/permissions/roles"
import { cn } from "@/lib/utils/cn.utils"
import { parseLocalDate } from "@/lib/utils/formatters"
import {
  useCancelCustomerBookingMutation,
  useGetCustomerBookingsQuery,
} from "@/store/api/booking.api"
import { useGetLocationsQuery } from "@/store/api/location.api"
import { useGetCompaniesQuery } from "@/store/api/tenent.api"
import { useGetUsersQuery } from "@/store/api/user.api"
import type { CustomerBookingDto } from "@/types/dtos/booking.dto"
import type { GetAllTenents } from "@/types/dtos/tenent.dto"
import type { UserDTO } from "@/types/dtos/user.dto"

import { type BookingRow, getBookingColumns } from "./booking-columns"

// ── Helpers ───────────────────────────────────────────────────────────────────

function getMonthDefaults() {
  const now = new Date()
  return {
    startDate: format(startOfMonth(now), "yyyy-MM-dd"),
    endDate: format(endOfMonth(now), "yyyy-MM-dd"),
  }
}

// ── Standalone date picker for filter (no react-hook-form dependency) ─────────

interface FilterDatePickerProps {
  id: string
  label: string
  value: string // "yyyy-MM-dd" or ""
  onChange: (val: string) => void
  allowPastDates?: boolean
}

function FilterDatePicker({
  id,
  label,
  value,
  onChange,
  allowPastDates = true,
}: FilterDatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const selected = value ? parseLocalDate(value) : undefined

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="flex items-center gap-1.5">
        <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            className={cn(
              "h-9 w-full justify-start pl-3 text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            {value
              ? format(parseLocalDate(value)!, "MMM d, yyyy")
              : "Pick a date"}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            captionLayout="dropdown"
            startMonth={new Date(2020, 0)}
            endMonth={new Date(new Date().getFullYear() + 2, 11)}
            selected={selected}
            onSelect={(date) => {
              if (date) onChange(format(date, "yyyy-MM-dd"))
              setOpen(false)
            }}
            disabled={(date) => {
              if (allowPastDates) return false
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              return date < today
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

// ── Filter shape ─────────────────────────────────────────────────────────────

type BookingFilters = {
  tenantId: string
  branchId: string
  tenantUserId: string
  startDate: string
  endDate: string
}

// Default to current month's full date range
const { startDate: DEFAULT_START, endDate: DEFAULT_END } = getMonthDefaults()

const DEFAULT_BOOKING_FILTERS: BookingFilters = {
  tenantId: "",
  branchId: "",
  tenantUserId: "",
  startDate: DEFAULT_START,
  endDate: DEFAULT_END,
}

// ── Component ─────────────────────────────────────────────────────────────────

export function BookingsClient() {
  const router = useRouter()
  const { user, roles } = useAuth()

  // ── Role guards ─────────────────────────────────────────────────────────────
  const isSuperAdmin = roles.includes(ROLES.SUPER_ADMIN)
  const isOrgAdmin = roles.includes(ROLES.ORGANIZATION_ADMIN)
  const isBranchManager = roles.includes(ROLES.BRANCH_MANAGER)
  const isStaff = roles.includes(ROLES.STAFF)

  // Admins and branch managers can filter by staff; pure staff see only theirs
  const canFilterByStaff = isSuperAdmin || isOrgAdmin || isBranchManager

  const currentUserTenantId = user?.tenantId ? Number(user.tenantId) : undefined
  // Staff always get their own bookings — id is locked, cannot be changed via URL
  const staffSelfId =
    isStaff && !canFilterByStaff
      ? user?.id
        ? Number(user.id)
        : undefined
      : undefined

  // ── URL query params ────────────────────────────────────────────────────────
  const {
    handlePaginationChange,
    pageIndex,
    params,
    searchTerm,
    setFilter,
    setFilters,
    setSearchTerm,
    resetFilters,
  } = useDataTableQueryParams<BookingFilters>({
    defaultFilters: {
      tenantId: isSuperAdmin
        ? ""
        : currentUserTenantId
          ? String(currentUserTenantId)
          : "",
      branchId: "",
      tenantUserId: "",
      startDate: DEFAULT_START,
      endDate: DEFAULT_END,
    },
  })

  // Sync user's tenantId if they are not a super admin and it wasn't set yet
  React.useEffect(() => {
    if (
      !isSuperAdmin &&
      currentUserTenantId &&
      params.tenantId !== String(currentUserTenantId)
    ) {
      setFilter("tenantId", String(currentUserTenantId))
    }
  }, [isSuperAdmin, currentUserTenantId, params.tenantId, setFilter])

  const effectiveTenantId = isSuperAdmin
    ? params.tenantId
    : String(currentUserTenantId || "")

  const effectiveTenantIdNum = effectiveTenantId
    ? Number(effectiveTenantId)
    : undefined

  // Fetch companies for the selector (Super Admin only)
  const { data: companiesData, isLoading: isLoadingCompanies } =
    useGetCompaniesQuery(
      { all: true },
      { skip: !isSuperAdmin, refetchOnMountOrArgChange: true }
    )

  const companies = React.useMemo(() => {
    return getApiList<GetAllTenents>(companiesData)
  }, [companiesData])

  // ── Branch options ──────────────────────────────────────────────────────────
  const { data: branchesData, isLoading: isLoadingBranches } =
    useGetLocationsQuery(
      { tenantId: effectiveTenantId, all: true },
      { skip: !effectiveTenantId }
    )

  const branchOptions = React.useMemo(
    () =>
      getApiList<any>(branchesData).map((b) => ({
        label: b.name || `Branch #${b.id}`,
        value: String(b.id),
      })),
    [branchesData]
  )

  // ── Staff options (admins / managers only) ──────────────────────────────────
  const { data: usersData, isLoading: isLoadingUsers } = useGetUsersQuery(
    { tenantId: effectiveTenantIdNum, all: true },
    { skip: !canFilterByStaff || !effectiveTenantIdNum }
  )

  const staffOptions = React.useMemo(() => {
    return getApiList<UserDTO>(usersData)
      .filter((u) => {
        const userRoles = (u.roles as Array<{ name?: string }>) || []
        return !userRoles.some(
          (r) =>
            r.name === "TenantAdmin" ||
            r.name === "ORGANIZATION_ADMIN" ||
            r.name === "COMPANYADMIN"
        )
      })
      .map((u) => ({
        label: u.fullName || `User #${u.id}`,
        value: String(u.id),
      }))
  }, [usersData])

  // ── Bookings query (Skipped to show only David Miller's booking) ────────────
  const { data, error, isFetching, isLoading } = useGetCustomerBookingsQuery(
    {
      tenantId: effectiveTenantIdNum,
      branchId: params.branchId ? Number(params.branchId) : undefined,
      tenantUserId:
        staffSelfId ??
        (params.tenantUserId ? Number(params.tenantUserId) : undefined),
      startDate: params.startDate || undefined,
      endDate: params.endDate || undefined,
      page: params.page,
      limit: params.limit,
      search: params.search || undefined,
      status: params.status || undefined,
    },
    { skip: true }
  )

  const [cancelBooking, { isLoading: isCancelling }] =
    useCancelCustomerBookingMutation()

  const displayBookings = React.useMemo(() => {
    return [
      {
        id: 21,
        tenantId: 1,
        branchId: 101,
        customerId: 1001,
        bookingTypeId: 1,
        currencyId: 1,
        status: "pending",
        notes:
          "Routine dental checkup and cleaning scheduled via Ava Virtual Receptionist. Preferred phone number updated on patient account.",
        paymentMethod: "Cash",
        createdAt: "2026-08-18T10:15:00.000Z",
        updatedAt: "2026-08-18T10:15:00.000Z",
        bookingNumber: "BK-2026-0827",
        finalAmount: "50.00",
        customer: {
          id: 1001,
          tenantId: 1,
          fullName: "David Miller",
          phone: "713-555-0198",
          isActive: true,
          createdAt: "2024-03-18",
          updatedAt: "2026-08-18",
        },
        branch: {
          id: 101,
          tenantId: 1,
          name: "Arlington Dental Branch",
          address: "123 Healthcare Ave, Suite 400",
          city: "Arlington",
          state: "TX",
          country: "USA",
          postalCode: "77024",
          isActive: true,
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        },
        bookingServices: [
          {
            id: 501,
            tenantId: 1,
            branchId: 101,
            customerBookingId: 21,
            branchServicesId: 1,
            serviceName: "Dental Cleaning and Exam",
            tenantUserId: 23,
            appointmentDate: "2026-08-27",
            durationInMinutes: 30,
            startTime: "15:00",
            endTime: "15:30",
            cost: "50.00",
            discountAmount: "0.00",
            finalCost: "50.00",
            status: "confirmed",
            currencyId: 1,
            createdAt: "2026-08-18",
            updatedAt: "2026-08-18",
            tenantUser: {
              id: 23,
              tenantId: 1,
              email: "ecarter@smilesdental.com",
              fullName: "Dr. Emily Carter",
              profilePic: "",
              status: "Active",
              bio: "Senior General Dentist",
            },
          },
        ],
        payments: [
          {
            id: 901,
            customerBookingId: 21,
            amount: "50.00",
            currencyId: 1,
            transactionDate: "2026-08-18",
            paymentMethod: "Cash",
            transactionStatus: "Pending",
          },
        ],
      },
    ] as BookingRow[]
  }, [])

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleTenantChange = (val: string) => {
    setFilters({
      tenantId: val === "ALL" ? "" : val,
      branchId: "",
      tenantUserId: "",
    })
  }

  const handleCancel = async (id: number | string) => {
    try {
      await cancelBooking({
        id,
        body: {
          cancellationReason: "Cancelled by admin",
          cancelledUsing: "dashboard",
          cancelledBy: String(user?.id ?? "admin"),
        },
      }).unwrap()
    } catch {
      // Surfaced by RTK Query logger middleware
    }
  }

  const columns = getBookingColumns({
    onView: (booking) => router.push(`/dashboard/bookings/${booking.id}`),
    onCancel: handleCancel,
    isCancelling,
  })

  {
    /* ── Render ────────────────────────────────────────────────────────── */
  }
  return (
    <PageContainer>
      <PageHeader
        title="Bookings"
        description={
          isStaff && !canFilterByStaff
            ? "Your upcoming and past appointments."
            : "Manage customer bookings across branches and staff members."
        }
      />

      <Card>
        <CardHeader className="border-b bg-muted/30 pb-6">
          <div className="flex flex-col gap-4">
            {/* Row 1: Search + Reset — always identical across roles */}
            <div className="flex items-end gap-4">
              <div className="flex flex-1 flex-col gap-2">
                <Label htmlFor="booking-search">Search</Label>
                <div className="relative">
                  <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="booking-search"
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-9 pl-9"
                  />
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="h-9 shrink-0 gap-2"
                title="Reset Filters"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>

            {/* Row 2: Conditional filters — grid keeps everything aligned regardless of which ones show */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {isSuperAdmin && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="booking-tenant">Tenant</Label>
                  <Select
                    value={params.tenantId || "ALL"}
                    onValueChange={handleTenantChange}
                    disabled={isLoadingCompanies}
                  >
                    <SelectTrigger id="booking-tenant" className="h-9 w-full">
                      <SelectValue
                        className="truncate"
                        placeholder={
                          isLoadingCompanies ? "Loading..." : "All Tenants"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent
                      side="bottom"
                      className="max-w-[--radix-select-trigger-width]"
                    >
                      <SelectItem value="ALL">All Tenants</SelectItem>
                      {companies.map((company) => (
                        <SelectItem
                          key={company.id}
                          value={String(company.id)}
                          className="truncate"
                          title={company.name}
                        >
                          <span className="block max-w-[220px] truncate">
                            {company.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Label htmlFor="booking-status">Status</Label>
                <Select
                  value={params.status || "ALL"}
                  onValueChange={(val) =>
                    setFilter("status", val === "ALL" ? "" : val)
                  }
                >
                  <SelectTrigger id="booking-status" className="h-9 w-full">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent side="bottom">
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {effectiveTenantId &&
                !isLoadingBranches &&
                branchOptions.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="booking-branch">Branch</Label>
                    <Select
                      value={params.branchId || "ALL"}
                      onValueChange={(val) =>
                        setFilter("branchId", val === "ALL" ? "" : val)
                      }
                    >
                      <SelectTrigger id="booking-branch" className="h-9 w-full">
                        <SelectValue placeholder="All Branches" />
                      </SelectTrigger>
                      <SelectContent side="bottom">
                        <SelectItem value="ALL">All Branches</SelectItem>
                        {branchOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

              {effectiveTenantId && canFilterByStaff && (
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="booking-staff"
                    className="flex items-center gap-1.5"
                  >
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    Staff Member
                  </Label>
                  <Select
                    value={params.tenantUserId || "ALL"}
                    onValueChange={(val) =>
                      setFilter("tenantUserId", val === "ALL" ? "" : val)
                    }
                    disabled={isLoadingUsers}
                  >
                    <SelectTrigger id="booking-staff" className="h-9 w-full">
                      <SelectValue
                        placeholder={
                          isLoadingUsers ? "Loading..." : "All Staff"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent side="bottom">
                      <SelectItem value="ALL">All Staff</SelectItem>
                      {staffOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <FilterDatePicker
                id="booking-start-date"
                label="From"
                value={params.startDate || ""}
                onChange={(val) => setFilter("startDate", val)}
                allowPastDates
              />

              <FilterDatePicker
                id="booking-end-date"
                label="To"
                value={params.endDate || ""}
                onChange={(val) => setFilter("endDate", val)}
                allowPastDates
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <DataTable
            data={
              displayBookings?.filter(
                (booking) => booking.status !== "Cancelled"
              ) as CustomerBookingDto[]
            }
            columns={columns}
            emptyMessage="No bookings found."
            emptyDescription="Try adjusting your filters or date range to see bookings."
            error={undefined}
            errorMessage="Unable to load bookings."
            isLoading={false}
            pageCount={1}
            pageIndex={pageIndex}
            pageSize={params.limit}
            onPaginationChange={handlePaginationChange}
          />
        </CardContent>
      </Card>
    </PageContainer>
  )
}
