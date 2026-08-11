"use client"

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import type { DataTableColumn } from "@/components/tables/data-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ResourceTypeResponse } from "@/types/dtos/resource-master.dto"

export type ResourceType = ResourceTypeResponse

interface GetResourceTypeColumnsProps {
  onEdit: (resourceType: ResourceType) => void
  onDelete: (id: string) => void
  isDeleting: boolean
}

export const getResourceTypeColumns = ({
  onEdit,
  onDelete,
  isDeleting,
}: GetResourceTypeColumnsProps): DataTableColumn<ResourceType>[] => [
  {
    key: "name",
    header: "Name",
    cell: (_value, row) => (
      <div className="font-medium text-foreground">{row.name}</div>
    ),
  },
  {
    key: "createdAt",
    header: "Created At",
    type: "date",
  },
  {
    key: "actions",
    header: "Actions",
    enableSorting: false,
    cell: (_value, row) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            onClick={() => onEdit(row)}
            className="h-8 gap-2 px-2 text-sm"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <ConfirmDialog
            title="Delete resource type?"
            description={`This will permanently delete "${row.name}".`}
            confirmLabel="Delete"
            variant="destructive"
            onConfirm={() => onDelete(String(row.id))}
          >
            <DropdownMenuItem
              variant="destructive"
              onSelect={(e) => e.preventDefault()}
              disabled={isDeleting}
              className="h-8 gap-2 px-2 text-sm"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </ConfirmDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]
