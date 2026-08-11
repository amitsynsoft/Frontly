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
import type { BranchServiceDTO } from "@/types/dtos/branchservices.dto"

export interface ServiceTableMeta {
  onEdit: (service: BranchServiceDTO) => void
  onDelete: (id: string | number) => void
  onToggleStatus?: (id: string | number, currentStatus: boolean) => void
  isDeleting?: boolean
}

export const getServiceColumns = (
  meta: ServiceTableMeta
): DataTableColumn<BranchServiceDTO>[] => [
  {
    key: "serviceMaster",
    header: "Service",
    truncate: false,
    cell: (_value: unknown, row: BranchServiceDTO) => (
      <div className="flex max-w-[250px] min-w-48 flex-col gap-0.5">
        <span
          className="truncate text-sm font-semibold text-foreground"
          title={row.serviceMaster?.name}
        >
          {row.serviceMaster?.name || "Unnamed Service"}
        </span>
        <span
          className="truncate text-xs text-muted-foreground"
          title={row.serviceMaster?.description || undefined}
        >
          {row.serviceMaster?.description || "No description"}
        </span>
      </div>
    ),
  },
  {
    key: "branch",
    header: "Branch",
    cell: (_value: unknown, row: BranchServiceDTO) => (
      <span className="text-sm font-medium">{row.branch?.name || "-"}</span>
    ),
  },
  {
    key: "durationMinutes",
    header: "Duration",
    cell: (_value: unknown, row: BranchServiceDTO) => (
      <span className="text-sm font-medium">{row.durationMinutes} mins</span>
    ),
  },
  {
    key: "cost",
    header: "Price",
    className: "w-[100px] min-w-[100px]",
    headerClassName: "w-[100px] min-w-[100px]",
    cell: (_value: unknown, row: BranchServiceDTO) => {
      const price = Number(row.cost)
      const symbol = row.currency?.symbol ?? "$"
      return (
        <span className="whitespace-nowrap text-sm font-semibold text-foreground">
          {symbol} {price.toFixed(2)}
        </span>
      )
    },
  },
  {
    key: "levelCosts",
    header: "Level Pricing",
    enableSorting: false,
    cell: (_value: unknown, row: BranchServiceDTO) => {
      if (!row.levelCosts?.length) {
        return <span className="text-xs text-muted-foreground">—</span>
      }

      const symbol = row.currency?.symbol ?? "$"

      return (
        <div className="flex max-w-[220px] flex-wrap gap-1.5">
          {row.levelCosts.map((lc) => (
            <span
              key={lc.id}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/50 px-2 py-0.5 text-xs"
            >
              <span className="font-medium text-foreground">
                {lc.branchLevel?.level}
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="text-foreground">
                {symbol}
                {Number(lc.cost).toFixed(2)}
              </span>
            </span>
          ))}
        </div>
      )
    },
  },
  {
    key: "isActive",
    header: "Status",
    cell: (_value: unknown, row: BranchServiceDTO) => (
      <StatusBadge status={row.isActive ? "active" : "inactive"} />
    ),
  },
  {
    key: "id",
    header: "Actions",
    align: "right",
    enableSorting: false,
    cell: (_value: unknown, row: BranchServiceDTO) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="h-8 w-8"
            aria-label={`Actions for ${row.serviceMaster?.name || "Service"}`}
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

          {meta.onToggleStatus && (
            <DropdownMenuItem
              onClick={() => meta.onToggleStatus?.(row.id, row.isActive)}
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
          )}

          <DropdownMenuSeparator />

          <ConfirmDialog
            title="Delete Service?"
            description={`This will permanently delete the service "${row.serviceMaster?.name || "Service"}".`}
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
