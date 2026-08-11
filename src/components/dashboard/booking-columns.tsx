import { DataTableColumn } from "@/components/tables/data-table"
import { ApiBooking, ApiBookingService } from "./dashboard.types"

export const bookingColumns = [
  {
    key: "customer.fullName",
    header: "Customer",
  },
  {
    key: "bookingServices",
    header: "Service",
    cell: (value: any) => {
      const services = value as ApiBookingService[]
      return services?.[0]?.serviceName || "-"
    },
  },
  {
    key: "branch.name",
    header: "Branch",
    className: "hidden lg:table-cell",
    headerClassName: "hidden lg:table-cell",
  },
  {
    key: "bookingDate",
    header: "Booking Date",
    className: "hidden md:table-cell",
    headerClassName: "hidden md:table-cell",
    cell: (_value: any, row: ApiBooking) => {
      const service = row.bookingServices?.[0]
      if (!service) return "-"
      const dateStr = `${service.appointmentDate}T${service.startTime}`
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return dateStr
      return date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    },
  },
  {
    key: "status",
    header: "Status",
    type: "status",
    className: "hidden sm:table-cell",
    headerClassName: "hidden sm:table-cell",
  },
  {
    key: "finalAmount",
    header: "Amount",
    cell: (value: any, row: any) => {
      const num = Number(value)
      const symbol = row.currency?.symbol || ""
      if (isNaN(num)) return `${symbol}${value}`
      return `${symbol}${num.toFixed(2)}`
    },
  },
] satisfies DataTableColumn<ApiBooking>[]
