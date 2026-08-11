"use client"

import { Building2, CreditCard, Layers } from "lucide-react"
import { useGetSuperAdminDashboardQuery } from "@/store/api/dashboard.api"
import { useGetCurrenciesQuery } from "@/store/api/currency.api"
import { MetricCard } from "@/components/charts/metric-card"
import { TenantGrowthChart } from "@/components/charts/tenant-growth-chart"
import { PageContainer } from "@/components/layouts/page-container"
import { PageHeader } from "@/components/layouts/page-header"
import { Section } from "@/components/shared/section"
import { DataTable } from "@/components/tables/data-table"
import { recentTenantColumns } from "./recent-tenant-columns"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { formatCurrency } from "@/lib/utils/formatters"

export function SuperAdminDashboard() {
  const { data, isLoading, error, refetch } = useGetSuperAdminDashboardQuery()
  const { data: currencies } = useGetCurrenciesQuery({ all: true })

  // Dynamic skeleton loading for cards
  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader
          title="Platform Dashboard"
          description="Loading superadmin analytics and platform performance..."
        />
        <Section className="pb-0">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="h-32 border-border/50 bg-card/60">
                <CardHeader className="p-5 pb-3">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="mt-2 h-8 w-20" />
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <Card className="h-96 border-border/80 lg:col-span-2">
              <CardHeader className="p-5">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="mt-2 h-4 w-72" />
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
            <Card className="h-96 border-border/80">
              <CardHeader className="p-5">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="mt-2 h-4 w-72" />
              </CardHeader>
              <CardContent className="p-5 pt-0">
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
          title="Platform Dashboard"
          description="Review platform activities, subscription growth, and active tenants."
        />
        <Section>
          <div className="flex min-h-96 flex-col items-center justify-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertCircle className="size-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-foreground">
              Failed to load platform dashboard
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              We encountered an issue retrieving the latest dashboard metrics.
              Please try again.
            </p>
            <button
              onClick={() => refetch()}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/95"
            >
              Retry
            </button>
          </div>
        </Section>
      </PageContainer>
    )
  }

  // Fallbacks if data properties are missing or undefined
  const metrics = data?.metrics || []
  const subscriptionPlans = data?.subscriptionPlans || []
  const tenantGrowthTrend = data?.tenantGrowthTrend || []
  const recentTenants = data?.recentTenants || []
  const dashboardCurrency = data?.currencyId || data?.currency || "INR"

  // Calculate total subscriptions count for percentage bar
  const totalPlanTenants = subscriptionPlans.reduce(
    (acc, curr) => acc + (curr?.count || 0),
    0
  )

  return (
    <PageContainer>
      <PageHeader
        title="Platform Dashboard"
        description="Unified view of tenants, subscriptions, revenue, and growth."
      />

      <Section className="pb-0">
        {/* Metrics Grid */}
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
          <div className="rounded-xl border border-dashed border-muted/80 bg-card/40 p-8 text-center text-muted-foreground">
            No system metrics available.
          </div>
        )}

        {/* Charts and Breakdown Grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Tenant Growth Trend */}
          <div className="lg:col-span-2">
            <TenantGrowthChart data={tenantGrowthTrend} />
          </div>

          {/* Subscription Plans Breakdown */}
          <Card className="flex flex-col border-border/80 shadow-xs transition-all duration-300 hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/25">
            <CardHeader className="items-start pb-2">
              <CardTitle className="text-md font-bold tracking-tight">
                Subscription distribution
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Breakdown of tenants by active plan types.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pt-2 pb-4">
              {subscriptionPlans.length === 0 ? (
                <div className="flex h-[240px] flex-col items-center justify-center text-muted-foreground">
                  <CreditCard className="mb-2 size-8 opacity-40" />
                  <p className="text-sm font-medium">
                    No subscription data available
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {subscriptionPlans.map((plan, index) => {
                    const planName = plan?.name || "Unknown Plan"
                    const planCount = plan?.count || 0
                    const planRevenue = plan?.revenue || 0
                    const percent =
                      totalPlanTenants > 0
                        ? (planCount / totalPlanTenants) * 100
                        : 0

                    return (
                      <div key={planName || index} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-medium">
                          <span className="font-semibold text-foreground/90">
                            {planName}
                          </span>
                          <span className="text-muted-foreground">
                            {planCount} tenants ({percent.toFixed(0)}%)
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted/65">
                          <div
                            className="h-full rounded-full bg-primary transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        {/* Plan Revenue */}
                        <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
                          <span>Monthly Revenue</span>
                          <span className="font-semibold text-foreground/80">
                            {formatCurrency(planRevenue, "USD")}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Recent Tenants Table */}
      <Section title="New Tenant Registrations" className="pt-0">
        <DataTable
          data={recentTenants}
          columns={recentTenantColumns}
          meta={{ currencies } as any}
          emptyMessage="No tenants registered yet"
          emptyDescription="Newly registered companies and organizations will appear here."
        />
      </Section>
    </PageContainer>
  )
}
