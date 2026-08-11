import type { PaginationQueryParams } from "@/types/dtos/api.dto"

export type AdminDashboardDTO = {
  metrics?: Metric[]
  performanceTrend?: PerformanceTrend[]
  serviceBreakdown?: ServiceBreakdown[]
  todayBookings?: any[]
  currency?: string | any
  currencyId?: number
}

export type SuperAdminDashboardDTO = {
  metrics?: Metric[]
  subscriptionPlans?: SubscriptionPlan[]
  tenantGrowthTrend?: TenantGrowthTrend[]
  recentTenants?: RecentTenant[]
  currency?: string | any
  currencyId?: number
}

export type RecentTenant = {
  id?: number
  name?: string
  status?: string
  createdAt?: string
  subscriptionPlan?: string
  amount?: number
  currency?: string | any
  currencyId?: number
}

export type TenantGrowthTrend = {
  month: string
  tenants: number
}

export type SubscriptionPlan = {
  name?: string
  count?: number
  revenue?: number
  currency?: string | any
  currencyId?: number
}

export interface Metric {
  label?: string
  value?: string
  delta?: string
  tone?: string
  trend?: number[]
}

export interface PerformanceTrend {
  label?: string
  bookings?: number
  revenue?: number
  currency?: string | any
  currencyId?: number
}

export interface ServiceBreakdown {
  name?: string
  value?: number
  color?: string
}
//======================================================================================
export type GetAdminDashboardQueryDto = {
  tenantId?: number
  branchId?: number
  startDate?: string
  endDate?: string
}
