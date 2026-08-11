"use client"

import * as React from "react"
import { CalendarDays, AlertCircle } from "lucide-react"

import { useGetAdminDashboardQuery } from "@/store/api/dashboard.api"
import { useGetLocationsQuery } from "@/store/api/location.api"
import { useGetCurrenciesQuery } from "@/store/api/currency.api"
import { MetricCard } from "@/components/charts/metric-card"
import { RevenueChart } from "@/components/charts/revenue-chart"
import { ServiceDistributionChart } from "@/components/charts/service-distribution-chart"
import { PageContainer } from "@/components/layouts/page-container"
import { PageHeader } from "@/components/layouts/page-header"
import { Section } from "@/components/shared/section"
import { DataTable } from "@/components/tables/data-table"
import { bookingColumns } from "@/components/dashboard/booking-columns"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { Form } from "@/components/forms/form"
import DatePickerField from "@/components/forms/datepickerfield"
import { FormSelect } from "@/components/forms/form-select"
import { Skeleton } from "@/components/ui/skeleton"
import dayjs from "dayjs"
import { useAuth } from "@/hooks/useAuth"
import { getApiList } from "@/hooks/useApiListData"
import { ROLES } from "@/lib/permissions/roles"
import { parseLocalDate } from "@/lib/utils/formatters"

export function AdminDashboard() {
  const { user, roles } = useAuth()
  const isOrgAdmin = roles.includes(ROLES.ORGANIZATION_ADMIN)

  // Default date range: Last 7 days using dayjs
  const defaultDates = React.useMemo(() => {
    const today = dayjs()
    return {
      startDate: today.subtract(7, "day").format("YYYY-MM-DD"),
      endDate: today.format("YYYY-MM-DD"),
    }
  }, [])

  // Filter Form
  const filterForm = useForm({
    defaultValues: {
      branchId: "all",
      startDate: defaultDates.startDate,
      endDate: defaultDates.endDate,
    },
  })

  const watchedBranchId = filterForm.watch("branchId")
  const watchedStartDate = filterForm.watch("startDate")
  const watchedEndDate = filterForm.watch("endDate")

  const startDateObj = React.useMemo(
    () => parseLocalDate(watchedStartDate),
    [watchedStartDate]
  )

  const endDateObj = React.useMemo(
    () => parseLocalDate(watchedEndDate),
    [watchedEndDate]
  )

  // Enforce range consistency if start date exceeds end date
  React.useEffect(() => {
    if (startDateObj && endDateObj && startDateObj > endDateObj) {
      filterForm.setValue("endDate", watchedStartDate)
    }
  }, [watchedStartDate, watchedEndDate, startDateObj, endDateObj, filterForm])

  // Fetch branches for filter selection (only for Organization Admins)
  const { data: branchesResponse } = useGetLocationsQuery(
    { all: true, tenantId: user?.tenantId ? String(user.tenantId) : undefined },
    { skip: !isOrgAdmin }
  )

  const branches = React.useMemo(
    () => getApiList<any>(branchesResponse),
    [branchesResponse]
  )

  // Construct query parameters safely
  const queryParams = React.useMemo(() => {
    return {
      ...(watchedBranchId !== "all" ? { branchId: Number(watchedBranchId) } : {}),
      ...(watchedStartDate ? { startDate: watchedStartDate } : {}),
      ...(watchedEndDate ? { endDate: watchedEndDate } : {}),
      ...(user?.tenantId ? { tenantId: Number(user.tenantId) } : {}),
    }
  }, [watchedBranchId, watchedStartDate, watchedEndDate, user?.tenantId])

  const { data, isLoading, error, refetch } =
    useGetAdminDashboardQuery(queryParams)
  const { data: currencies } = useGetCurrenciesQuery({ all: true })

  const tenantCurrency =
    data?.currencyId ?? data?.currency ?? user?.tenant?.currencyId ?? (user?.tenant as any)?.currencyId

  const performanceTrend = React.useMemo(() => {
    return (data?.performanceTrend || []).map((p) => ({
      label: p.label || "",
      bookings: p.bookings || 0,
      revenue: p.revenue || 0,
    }))
  }, [data?.performanceTrend])

  const serviceBreakdown = React.useMemo(() => {
    return (data?.serviceBreakdown || []).map((s) => ({
      name: s.name || "Unknown",
      value: s.value || 0,
      color: s.color || "var(--primary)",
    }))
  }, [data?.serviceBreakdown])

  // Quick range helper functions using dayjs
  const setToday = () => {
    const todayStr = dayjs().format("YYYY-MM-DD")
    filterForm.setValue("startDate", todayStr)
    filterForm.setValue("endDate", todayStr)
  }

  const setLast7Days = () => {
    filterForm.setValue("startDate", defaultDates.startDate)
    filterForm.setValue("endDate", defaultDates.endDate)
  }

  const setThisMonth = () => {
    const today = dayjs()
    filterForm.setValue("startDate", today.startOf("month").format("YYYY-MM-DD"))
    filterForm.setValue("endDate", today.format("YYYY-MM-DD"))
  }

  const clearFilters = () => {
    filterForm.reset({
      branchId: "all",
      startDate: defaultDates.startDate,
      endDate: defaultDates.endDate,
    })
  }

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader
          title="Operations Dashboard"
          description="Loading operations dashboard and analytics..."
        />
        <Section className="pb-0">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="h-32 border-border/50 bg-card/60">
                <CardContent className="p-5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="mt-2 h-8 w-20" />
                  <Skeleton className="mt-4 h-4 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <Card className="h-96 border-border/80 lg:col-span-2">
              <CardContent className="p-5">
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
            <Card className="h-96 border-border/80">
              <CardContent className="p-5">
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
        </Section>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader
          title="Operations Dashboard"
          description="Unified operating view for bookings, revenue, branch load, and customer activity."
        />
        <Section>
          <div className="flex min-h-96 flex-col items-center justify-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertCircle className="size-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-foreground">
              Failed to load operations dashboard
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              We encountered an issue retrieving the dashboard data. Please
              verify your connection or try adjusting filters.
            </p>
            <div className="mt-4 flex gap-2">
              <Button onClick={clearFilters} variant="outline" size="sm">
                Reset Filters
              </Button>
              <Button onClick={() => refetch()} size="sm">
                Retry
              </Button>
            </div>
          </div>
        </Section>
      </PageContainer>
    )
  }

  // Safe destructuring of dashboard data
  const metrics = data?.metrics || []
  const todayBookings = data?.todayBookings || []

  return (
    <PageContainer>
      <PageHeader
        title="Operations Dashboard"
        description="Unified operating view for bookings, revenue, branch load, and customer activity."
      />

      {/* Filters Bar */}
      <Section className="pt-2 pb-0">
        <Card className="border-border/50 bg-card/60 backdrop-blur-md">
          <CardContent className="p-4">
            <Form {...filterForm}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex flex-1 flex-wrap items-end gap-4">
                  {isOrgAdmin && (
                    <div className="min-w-[220px] flex-1 sm:flex-initial">
                      <FormSelect
                        name="branchId"
                        label="Branch Filter"
                        options={[
                          { label: "All Branches", value: "all" },
                          ...branches.map((b) => ({
                            label: b.name || `Branch #${b.id}`,
                            value: String(b.id),
                          })),
                        ]}
                      />
                    </div>
                  )}

                  <div className="min-w-[200px] flex-1 sm:flex-initial">
                    <DatePickerField
                      form={filterForm}
                      name="startDate"
                      label="Start Date"
                      placeholder="Pick start date"
                      allowPastDates={true}
                      maxDate={endDateObj}
                    />
                  </div>

                  <div className="min-w-[200px] flex-1 sm:flex-initial">
                    <DatePickerField
                      form={filterForm}
                      name="endDate"
                      label="End Date"
                      placeholder="Pick end date"
                      allowPastDates={true}
                      minDate={startDateObj}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 border-t border-border/50 pt-4 lg:border-t-0 lg:pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={setToday}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={setLast7Days}
                  >
                    Last 7 Days
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={setThisMonth}
                  >
                    This Month
                  </Button>
                  {(watchedBranchId !== "all" ||
                    watchedStartDate !== defaultDates.startDate ||
                    watchedEndDate !== defaultDates.endDate) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={clearFilters}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      Reset Filters
                    </Button>
                  )}
                </div>
              </div>
            </Form>
          </CardContent>
        </Card>
      </Section>

      <Section className="pt-4 pb-0">
        {/* Metrics Row */}
        {metrics.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric, index) => (
              <MetricCard
                key={index}
                label={metric?.label || `Metric ${index + 1}`}
                value={metric?.value || "-"}
                delta={metric?.delta || ""}
                tone={(metric?.tone as any) || "neutral"}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-muted/80 bg-card/45 p-8 text-center text-muted-foreground">
            No metrics available for the selected filters.
          </div>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <RevenueChart
            data={performanceTrend}
            currency={tenantCurrency}
            currencies={currencies}
          />
          <ServiceDistributionChart data={serviceBreakdown} />
        </div>
      </Section>

      {/* Bookings Section */}
      <Section title="Today's bookings" className="pt-0">
        <DataTable
          data={todayBookings}
          columns={bookingColumns}
          emptyMessage="No bookings found"
          emptyDescription="There are no scheduled appointments matching the current filters."
        />
      </Section>
    </PageContainer>
  )
}
