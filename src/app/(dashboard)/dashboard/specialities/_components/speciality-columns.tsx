"use client"

import { Edit, Trash2 } from "lucide-react"

import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import type { DataTableColumn } from "@/components/tables/data-table"
import { Button } from "@/components/ui/button"
import type { SpecialityDto } from "@/types/dtos/speciality.dto"

export interface SpecialityTableMeta {
  onEdit: (speciality: SpecialityDto) => void
  onDelete: (id: number) => void
  isDeleting?: boolean
}

export const getSpecialityColumns = (
  meta: SpecialityTableMeta
): DataTableColumn<SpecialityDto>[] => [
  {
    key: "name",
    header: "Speciality Name",
    truncate: true,
    className: "font-semibold text-foreground",
  },
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
    cell: (_value: unknown, row: SpecialityDto) => (
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={() => meta.onEdit(row)}
          aria-label={`Edit ${row.name}`}
        >
          <Edit className="size-4" />
        </Button>
        <ConfirmDialog
          title="Delete Speciality?"
          description={`This will permanently delete the speciality "${row.name}".`}
          confirmLabel="Delete"
          variant="destructive"
          onConfirm={() => {
            meta.onDelete(row.id)
          }}
        >
          <Button
            type="button"
            variant="destructive"
            size="icon-sm"
            disabled={meta.isDeleting}
            aria-label={`Delete ${row.name}`}
          >
            <Trash2 className="size-4" />
          </Button>
        </ConfirmDialog>
      </div>
    ),
  },
]
