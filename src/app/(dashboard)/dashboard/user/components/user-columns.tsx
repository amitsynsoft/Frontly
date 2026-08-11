"use client"

import {
  Briefcase,
  BriefcaseBusiness,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react"

import { ConfirmDialog } from "@/components/shared/confirm-dialog"
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
import type { UserDTO } from "@/types/dtos/user.dto"
import { Badge } from "@/components/ui/badge"

export type UserTableRow = {
  id: number
  email: string
  fullName: string
  profilePic: string
  bio: string
  role: string
  levelName: string
  designation: string
  status: "Active" | "InActive"
  user: UserDTO
}

export function toUserTableRows(users: UserDTO[]): UserTableRow[] {
  return users.map((u) => ({
    id: u.id,
    email: u.email,
    fullName: u.fullName,
    profilePic: u.profilePic,
    bio: u.bio,
    role: formatRoles(u),
    levelName: "",
    designation:
      typeof u.designation === "string"
        ? u.designation
        : u.designation?.name || "-",
    status: u.status,
    user: u,
  }))
}

export function formatRoles(user: UserDTO) {
  const roles = user.roles?.map((role) => role.name).filter(Boolean) || []
  return roles.length ? roles.join(", ") : "-"
}

export function getUserInitials(user: UserDTO) {
  const prefix =
    user.fullName
      ?.split(" ")
      ?.map((name) => name[0])
      .join("") ||
    user.email.split("@")[0] ||
    "US"
  return prefix.slice(0, 2).toUpperCase()
}

interface GetUserColumnsProps {
  onEdit: (userId: number) => void
  onAssignServices: (userId: number) => void
  onDelete: (userId: number) => Promise<void>
  isDeleting: boolean
}

export function getUserColumns({
  onEdit,
  onAssignServices,
  onDelete,
  isDeleting,
}: GetUserColumnsProps): DataTableColumn<UserTableRow>[] {
  return [
    {
      key: "fullName",
      header: "User",
      truncate: false,
      cell: (_value: unknown, row: UserTableRow) => (
        <div className="flex items-center gap-3">
          <ThemedAvatar
            src={row.profilePic}
            alt={row.id + row?.fullName || "-"}
            fallbackText={getUserInitials(row.user)}
            className="h-11 w-11"
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate font-medium text-foreground">
                {row?.fullName || "-"}
              </p>

              {row.designation && row.designation !== "-" && (
                <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                  <BriefcaseBusiness className="h-3 w-3" />
                  {row.designation}
                </div>
              )}
            </div>

            <p className="truncate text-xs text-muted-foreground">
              {row.email || "-"}
            </p>
          </div>
        </div>
      ),
    },

    {
      key: "role",
      header: "Role",
    },

    {
      key: "email",
      header: "Email",
      truncate: true,
    },
    { key: "status", header: "Status", type: "status" },
    {
      key: "id",
      header: "Actions",
      align: "right",
      enableSorting: false,
      truncate: false,
      cell: (_value: unknown, row: UserTableRow) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8"
              aria-label={`Actions for ${row.email}`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem
              onClick={() => onEdit(row.id)}
              className="h-8 gap-2 px-2 text-sm"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onAssignServices(row.id)}
              className="h-8 gap-2 px-2 text-sm"
            >
              <Briefcase className="h-4 w-4" />
              Assign Services
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <ConfirmDialog
              title="Delete user?"
              description={`This will permanently delete user record for "${row.email}".`}
              confirmLabel="Delete"
              variant="destructive"
              onConfirm={() => {
                void onDelete(row.id)
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
      ),
    },
  ]
}
