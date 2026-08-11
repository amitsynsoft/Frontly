"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { parseLocalDate } from "@/lib/utils/formatters"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type StaffScheduleRow = {
  id: string
  tenantUserId: string
  branchId: string
  scheduleDate: string
  startTime: string
  endTime: string
  isRepeat: boolean
  repeatDayOfWeek?: string
  rruleUntil?: string
  rrule?: string
  status?: string
  staffName?: string
  branchName?: string
  createdAt?: string
  tenantUser?: {
    fullName?: string
    email?: string
  }
  branch?: {
    name?: string
  }
}

interface ColumnOptions {
  onEdit: (schedule: StaffScheduleRow) => void
  onDelete: (id: string) => Promise<void>
  isDeleting: boolean
}

export function getStaffScheduleColumns({
  onEdit,
  onDelete,
  isDeleting,
}: ColumnOptions): ColumnDef<StaffScheduleRow>[] {
  return [
    {
      accessorKey: "staffName",
      header: "Staff Member",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.tenantUser?.fullName}</span>
      ),
    },
    {
      accessorKey: "branchName",
      header: "Branch",
      cell: ({ row }) =>
        row.original.branch?.name || row.original.branchId || "—",
    },
    {
      accessorKey: "scheduleDate",
      header: "Schedule Date",
      cell: ({ row }) => {
        const start = row.original.scheduleDate
        const end = row.original.rruleUntil

        try {
          if (!start && !end) return "—"

          const startDate = start ? parseLocalDate(start) : null
          const endDate = end ? parseLocalDate(end) : null

          if (startDate && endDate) {
            return `${format(startDate, "dd MMM yyyy")} - ${format(
              endDate,
              "dd MMM yyyy"
            )}`
          }

          if (startDate) {
            return format(startDate, "dd MMM yyyy")
          }

          return "—"
        } catch {
          return "—"
        }
      },
    },
    {
      accessorKey: "isRepeat",
      header: "Recurring",
      cell: ({ row }) =>
        row.original.isRepeat ? (
          <Badge variant="secondary">Recurring</Badge>
        ) : (
          <Badge variant="outline">One-time</Badge>
        ),
    },

    {
      id: "actions",
      header: () => <span className="">Actions</span>,
      cell: ({ row }) => {
        const schedule = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="h-8 w-8"
                aria-label={`Actions for schedule ${schedule.id}`}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                onClick={() => onEdit(schedule)}
                className="h-8 gap-2 px-2 text-sm"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <ConfirmDialog
                title="Delete schedule?"
                description="This will permanently delete this schedule record. This action cannot be undone."
                confirmLabel="Delete"
                variant="destructive"
                onConfirm={() => {
                  void onDelete(schedule.id)
                }}
              >
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={(e) => e.preventDefault()}
                  disabled={isDeleting}
                  className="h-8 gap-2 px-2 text-sm"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </ConfirmDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
