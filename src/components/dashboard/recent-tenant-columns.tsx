import { DataTableColumn } from "@/components/tables/data-table"
import { RecentTenant } from "@/types/dtos/dashboard.dto"

export const recentTenantColumns = [
  {
    key: "name",
    header: "Tenant Name",
    className: "font-semibold",
  },
  {
    key: "subscriptionPlan",
    header: "Subscription Plan",
    cell: (value) => String(value || "Free"),
  },
  {
    key: "amount",
    header: "Monthly Revenue",
    cell: (value) => {
      if (value === undefined || value === null) return "-"
      const num = Number(value)
      if (isNaN(num)) return String(value)
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(num)
    },
  },
  {
    key: "status",
    header: "Status",
    type: "status",
  },
  {
    key: "createdAt",
    header: "Created Date",
    type: "date",
  },
] satisfies DataTableColumn<RecentTenant>[]
