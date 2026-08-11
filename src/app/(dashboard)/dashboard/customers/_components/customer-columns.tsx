"use client"

import {
  Eye,
  Mail,
  MoreHorizontal,
  Pencil,
  Phone,
  Trash2,
  UserCheck,
} from "lucide-react"

import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { StatusBadge } from "@/components/shared/status-badge"
import { ThemedAvatar } from "@/components/shared/themed-avatar"
import type { DataTableColumn } from "@/components/tables/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { CustomerDTO } from "@/types/dtos/customer.dto"

export function getCustomerInitials(name: string, email: string) {
  if (name) {
    const parts = name.trim().split(" ")
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return parts[0].slice(0, 2).toUpperCase()
  }
  return email ? email.slice(0, 2).toUpperCase() : "CU"
}

interface GetCustomerColumnsProps {
  onView: (customer: CustomerDTO) => void
  onEdit: (customer: CustomerDTO) => void
  onDelete: (customerId: string) => void
}

export function getCustomerColumns({
  onView,
  onEdit,
  onDelete,
}: GetCustomerColumnsProps): DataTableColumn<CustomerDTO>[] {
  return [
    {
      key: "id",
      header: "Customer Id",
      cell: (value: unknown, row: CustomerDTO) => (
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="font-mono text-xs font-semibold tracking-wider text-primary border-primary/20 bg-primary/5"
          >
            {row.id}
          </Badge>
        </div>
      ),
    },
    {
      key: "name",
      header: "Customer Name",
      truncate: false,
      cell: (_value: unknown, row: CustomerDTO) => (
        <div className="flex items-center gap-3">
          <ThemedAvatar
            src={row.avatarUrl || ""}
            alt={row.name}
            fallbackText={getCustomerInitials(row.name, row.email)}
            className="h-10 w-10 border border-border"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-foreground">{row.name}</p>
            {row.totalBookings !== undefined && (
              <p className="truncate text-xs text-muted-foreground">
                {row.totalBookings} bookings total
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      truncate: true,
      cell: (value: unknown, row: CustomerDTO) => (
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <a
            href={`mailto:${row.email}`}
            className="truncate hover:underline text-foreground"
          >
            {row.email}
          </a>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone Number",
      cell: (value: unknown, row: CustomerDTO) => (
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span>{row.phone}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      type: "status",
      cell: (_value: unknown, row: CustomerDTO) => (
        <StatusBadge status={row.status} />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      enableSorting: false,
      truncate: false,
      cell: (_value: unknown, row: CustomerDTO) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8"
              aria-label={`Actions for ${row.name}`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem
              onClick={() => onView(row)}
              className="h-8 gap-2 px-2 text-sm"
            >
              <Eye className="h-4 w-4 text-muted-foreground" />
              View Details
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onEdit(row)}
              className="h-8 gap-2 px-2 text-sm"
            >
              <Pencil className="h-4 w-4 text-muted-foreground" />
              Edit Customer
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <ConfirmDialog
              title="Delete customer?"
              description={`Are you sure you want to delete customer record for "${row.name}" (${row.id})?`}
              confirmLabel="Delete"
              variant="destructive"
              onConfirm={() => onDelete(row.id)}
            >
              <DropdownMenuItem
                variant="destructive"
                onSelect={(e) => e.preventDefault()}
                className="h-8 gap-2 px-2 text-sm text-destructive"
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
}
