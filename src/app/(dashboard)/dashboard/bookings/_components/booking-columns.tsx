"use client"

import dayjs from "dayjs"
import { Eye, MoreHorizontal, XCircle } from "lucide-react"

import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { StatusBadge } from "@/components/shared/status-badge"
import type { DataTableColumn } from "@/components/tables/data-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatTime } from "@/lib/utils/formatters"
import type { CustomerBookingDto } from "@/types/dtos/booking.dto"

export type BookingRow = CustomerBookingDto

export interface BookingsTableMeta {
  onView: (booking: BookingRow) => void
  onCancel: (id: number | string) => void
  isCancelling?: boolean
}

function getFirstAppointmentDate(booking: BookingRow): string {
  const services = booking.bookingServices || booking.services || []
  const first = services[0]
  if (!first?.appointmentDate) return "August 27, 2026"
  return dayjs(first.appointmentDate).format("MMMM D, YYYY")
}

function getFirstStartTime(booking: BookingRow): string {
  const services = booking.bookingServices || booking.services || []
  const first = services[0]
  if (!first?.startTime) return "3:00 PM"
  return formatTime(first.startTime)
}

export const getBookingColumns = (
  meta: BookingsTableMeta
): DataTableColumn<BookingRow>[] => [
  {
    key: "id",
    header: "Booking ID",
    cell: (value: unknown) => (
      <span className="font-semibold">#{String(value)}</span>
    ),
  },

  {
    key: "appointmentDate",
    header: "Appointment Date",
    enableSorting: false,
    cell: (_value: unknown, row: BookingRow) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">
          {/* {getFirstAppointmentDate(row)} */}
          August 12, 2026
        </span>
        <span className="text-xs text-muted-foreground">
          {getFirstStartTime(row)}
        </span>
      </div>
    ),
  },

  {
    key: "customer",
    header: "Customer",
    cell: (_value: unknown, row: BookingRow) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">
          {row.customer?.fullName || "David Miller"}
        </span>
        <span className="text-xs text-muted-foreground">
          {row.customer?.phone || "—"}
        </span>
      </div>
    ),
  },

  {
    key: "branch",
    header: "Branch",
    cell: (_value: unknown, row: BookingRow) => (
      <span className="text-sm font-medium">
        {row.branch?.name || `Branch #${row.branchId}`}
      </span>
    ),
  },

  {
    key: "services",
    header: "Services",
    enableSorting: false,
    cell: (_value: unknown, row: BookingRow) => {
      const services = row.bookingServices || []
      const count = services.length || row.services?.length || 0

      if (count === 0) {
        return <span className="text-xs text-muted-foreground">—</span>
      }

      if (services.length > 0) {
        const names = services.map((s) => s.serviceName).join(", ")
        return (
          <div className="flex max-w-[200px] flex-col gap-0.5">
            <span className="truncate text-sm font-medium" title={names}>
              {names}
            </span>
            <span className="text-xs text-muted-foreground">
              {count} service{count !== 1 ? "s" : ""}
            </span>
          </div>
        )
      }

      return (
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
          {count} service{count !== 1 ? "s" : ""}
        </span>
      )
    },
  },

  {
    key: "payment",
    header: "Amount",
    cell: (_value: unknown, row: BookingRow) => {
      // const symbol = row.currency?.symbol || "$"
      const amount = row.finalAmount || "0.00"
      const method = row?.payments?.[0]?.paymentMethod || ""

      return (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">
            {/* {symbol} */}${amount}
          </span>
          <span className="text-xs text-green-700 capitalize">{method}</span>
        </div>
      )
    },
  },

  {
    key: "status",
    header: "Payment Status",
    cell: (_value: unknown, row: BookingRow) => (
      <StatusBadge
        status={String(
          row.payments?.[0]?.transactionStatus || "-"
        ).toLowerCase()}
      />
    ),
  },

  {
    key: "createdAt",
    header: "Created",
    cell: (value: unknown) =>
      value ? dayjs(String(value)).format("MMM D, YYYY") : "—",
  },

  {
    key: "actions",
    header: "Actions",
    enableSorting: false,
    cell: (_value: unknown, row: BookingRow) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="h-8 w-8"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            onClick={() => meta.onView(row)}
            className="h-8 gap-2 px-2 text-sm"
          >
            <Eye className="h-4 w-4" />
            View Details
          </DropdownMenuItem>

          {row.status !== "cancelled" && row.status !== "Cancelled" && (
            <>
              <DropdownMenuSeparator />

              <ConfirmDialog
                title="Cancel booking?"
                description={`This will cancel booking #${row.id}. The customer will be notified.`}
                confirmLabel="Cancel Booking"
                variant="destructive"
                onConfirm={() => meta.onCancel(row.id)}
              >
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={(e) => e.preventDefault()}
                  disabled={meta.isCancelling}
                  className="h-8 gap-2 px-2 text-sm"
                >
                  <XCircle className="h-4 w-4" />
                  Cancel Booking
                </DropdownMenuItem>
              </ConfirmDialog>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]
