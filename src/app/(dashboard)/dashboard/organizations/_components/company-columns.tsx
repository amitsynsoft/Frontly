"use client"

import { MoreHorizontal, Pencil, RefreshCcw, Trash2 } from "lucide-react"

import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { StatusBadge } from "@/components/shared/status-badge"
import { ThemedAvatar } from "@/components/shared/themed-avatar"
import type { DataTableColumn } from "@/components/tables/data-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface Company {
  id: number
  name: string
  currencyId: number
  logo: string | null
  description: string | null
  languagesSupported: string[] | null
  website: string | null
  status: "Active" | "InActive"
  createdAt?: string
}

export interface CompaniesTableMeta {
  onEdit: (company: Company) => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string, currentStatus: "Active" | "InActive") => void
  isDeleting?: boolean
}

function getCompanyInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)

  if (words.length <= 1) {
    return (words[0] || "CO").slice(0, 2).toUpperCase()
  }

  return words
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}
export const getCompanyColumns = (
  meta: CompaniesTableMeta
): DataTableColumn<Company>[] => [
  {
    key: "name",
    header: "Tenant",
    cell: (_value, row) => (
      <div className="flex min-w-60 items-center gap-3.5">
        <ThemedAvatar
          src={row.logo || ""}
          alt={row.name}
          fallbackText={getCompanyInitials(row.name)}
        />

        <div className="flex min-w-0 flex-col gap-1">
          <span className="truncate text-sm font-semibold text-foreground">
            {row.name}
          </span>

          <span className="max-w-70 truncate text-xs text-muted-foreground">
            {row.description || row.website || "Tenant"}
          </span>
        </div>
      </div>
    ),
  },

  {
    key: "website",
    header: "Website",
    cell: (_value, row) => row.website || "-",
  },
  {
    key: "languagesSupported",
    header: "Languages",
    cell: (_value, row) => {
      const languages = row.languagesSupported

      if (!languages?.length) return "-"

      return (
        <div className="flex flex-wrap gap-1">
          {languages.map((lang) => (
            <span
              key={lang}
              className="rounded-md border bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              {lang}
            </span>
          ))}
        </div>
      )
    },
  },

  {
    key: "status",
    header: "Status",
    cell: (_value, row) => (
      <StatusBadge status={(row.status || "inactive").toLowerCase()} />
    ),
  },

  {
    key: "createdAt",
    header: "Created",
    type: "date",
  },

  {
    key: "actions",
    header: "Actions",
    enableSorting: false,
    cell: (_value, row) => (
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
            onClick={() => meta.onToggleStatus(row.id.toString(), row.status)}
            className="h-8 gap-2 px-2 text-sm"
          >
            <RefreshCcw className="h-4 w-4" />
            {row.status === "Active" ? "Set Inactive" : "Set Active"}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <ConfirmDialog
            title="Delete tenant?"
            description={`This will permanently delete "${row.name}" and all related data.`}
            confirmLabel="Delete"
            variant="destructive"
            onConfirm={() => meta.onDelete(row.id.toString())}
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
