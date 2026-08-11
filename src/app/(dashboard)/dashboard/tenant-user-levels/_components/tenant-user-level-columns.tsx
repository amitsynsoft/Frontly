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
import type { TenantUserLevelDto } from "@/types/dtos/tenant-user-levels.dto"

export interface TenantUserLevelTableMeta {
  onEdit: (level: TenantUserLevelDto) => void
  onDelete: (id: number) => void
  isDeleting?: boolean
  showOrganizationColumn?: boolean
}

export const getTenantUserLevelColumns = (
  meta: TenantUserLevelTableMeta
): DataTableColumn<TenantUserLevelDto>[] => {
  const columns: DataTableColumn<TenantUserLevelDto>[] = [
    {
      key: "level",
      header: "Level Name",
      truncate: true,
      className: "font-semibold text-foreground",
    },
    {
      key: "description",
      header: "Description",
      truncate: true,
      className: "max-w-[250px] min-w-[200px]",
      headerClassName: "w-[250px]",
    },
  ]

  if (meta.showOrganizationColumn) {
    columns.push({
      key: "tenant.name",
      header: "Tenant",
      truncate: true,
      cell: (_value: unknown, row: TenantUserLevelDto) => {
        return row.tenant?.name || `Tenant ${row.tenantId}`
      },
    })
  }

  columns.push(
    {
      key: "createdAt",
      header: "Created At",
      type: "date",
    },
    {
      key: "updatedAt",
      header: "Updated At",
      type: "date",
    },
    {
      key: "id",
      header: "Actions",
      align: "right",

      enableSorting: false,
      cell: (_value: unknown, row: TenantUserLevelDto) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8"
              aria-label={`Actions for user level ${row.level}`}
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
              title="Delete User Level?"
              description={`This will permanently delete the user level "${row.level}".`}
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
    }
  )

  return columns
}
