"use client"

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import type { DataTableColumn } from "@/components/tables/data-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ServiceDTO } from "@/types/dtos/services.dto"

export interface MasterServiceTableMeta {
  onEdit: (service: ServiceDTO) => void
  onDelete: (id: string | number) => void
  isDeleting?: boolean
}

export const getMasterServiceColumns = (
  meta: MasterServiceTableMeta
): DataTableColumn<ServiceDTO>[] => [
  {
    key: "name",
    header: "Service Name",
    truncate: false,
    cell: (_value: unknown, row: ServiceDTO) => (
      <div className="flex max-w-[300px] min-w-48 flex-col gap-0.5">
        <span
          className="truncate text-sm font-semibold text-foreground"
          title={row.name}
        >
          {row.name || "Unnamed Service"}
        </span>
      </div>
    ),
  },
  {
    key: "description",
    header: "Description",
    truncate: true,
    cell: (_value: unknown, row: ServiceDTO) => (
      <span className="text-sm text-muted-foreground">
        {row.description || "No description provided"}
      </span>
    ),
  },
  {
    key: "id",
    header: "Actions",
    align: "right",
    enableSorting: false,
    cell: (_value: unknown, row: ServiceDTO) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="h-8 w-8"
            aria-label={`Actions for ${row.name || "Service"}`}
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

          <DropdownMenuSeparator />

          <ConfirmDialog
            title="Delete Master Service?"
            description={`This will permanently delete the master service "${row.name || "Service"}". Branch services referencing this master service may be affected.`}
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
