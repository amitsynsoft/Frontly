"use client"

import { MoreHorizontal, Pencil, RefreshCcw, Trash2 } from "lucide-react"

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
import { LocationRequest } from "@/types/dtos/location.dto"

export type Location = LocationRequest & {
  id: string
  status?: string // Since api has updateStatus that takes "Active" | "InActive"
  createdAt?: string
}

export interface LocationsTableMeta {
  onEdit: (location: Location) => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string, currentStatus: "Active" | "InActive") => void
  isDeleting?: boolean
}

export const getLocationColumns = (
  meta: LocationsTableMeta
): DataTableColumn<Location>[] => [
  {
    key: "name",
    header: "Branch Name",
  },

  {
    key: "city",
    header: "City",
  },

  {
    key: "state",
    header: "State",
  },

  {
    key: "email",
    header: "Email",
  },

  {
    key: "isActive",
    header: "Status",
    cell: (_value: unknown, row: Location) => (
      <StatusBadge status={row.isActive ? "active" : "inactive"} />
    ),
  },

  {
    key: "actions",
    header: "Actions",
    enableSorting: false,
    cell: (_value: unknown, row: Location) => (
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
            onClick={() => meta.onEdit(row)}
            className="h-8 gap-2 px-2 text-sm"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              meta.onToggleStatus(row.id, row.isActive ? "Active" : "InActive")
            }
            className="h-8 gap-2 px-2 text-sm"
          >
            {row.isActive ? (
              <>
                <RefreshCcw className="h-4 w-4" />
                <span>Set Inactive</span>
              </>
            ) : (
              <>
                <RefreshCcw className="h-4 w-4" />
                <span>Set Active</span>
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <ConfirmDialog
            title="Delete location?"
            description={`This will permanently delete the location "${row.name}" and all related data.`}
            confirmLabel="Delete"
            variant="destructive"
            onConfirm={() => {
              meta.onDelete(row.id)
            }}
          >
            <DropdownMenuItem
              variant="destructive"
              onSelect={(e) => e.preventDefault()}
              disabled={meta.isDeleting}
              className="h-8 gap-2 px-2 text-sm"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </ConfirmDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]
