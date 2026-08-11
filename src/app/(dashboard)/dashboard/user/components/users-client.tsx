"use client"

import { Plus, RotateCcw, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect,useMemo } from "react"

import { PageContainer } from "@/components/layouts/page-container"
import { PageHeader } from "@/components/layouts/page-header"
import { DataTable } from "@/components/tables/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getApiList, useApiListData } from "@/hooks/useApiListData"
import { useAuth } from "@/hooks/useAuth"
import { useDataTableQueryParams } from "@/hooks/useDataTableQueryParams"
import { ROLES } from "@/lib/permissions/roles"
import { useGetCompaniesQuery } from "@/store/api/tenent.api"
import { useDeleteUserMutation, useGetUsersQuery } from "@/store/api/user.api"
import type { UserDTO } from "@/types/dtos/user.dto"

import {
  getUserColumns,
  toUserTableRows,
  type UserTableRow,
} from "./user-columns"

type UserFilters = {
  tenantId: string
  status: string
}

type CompanyOption = {
  id: number | string
  name: string
}

export function UsersClient() {
  const router = useRouter()
  const { user, roles } = useAuth()
  const isSuperAdmin = roles.includes(ROLES.SUPER_ADMIN)
  const currentUserTenantId = user?.tenantId ? Number(user.tenantId) : undefined

  const {
    handlePaginationChange,
    pageIndex,
    pageSize,
    params,
    queryParams,
    searchTerm,
    setFilter,
    setSearchTerm,
    resetFilters,
  } = useDataTableQueryParams<UserFilters>({
    defaultFilters: {
      tenantId: isSuperAdmin
        ? ""
        : currentUserTenantId
          ? String(currentUserTenantId)
          : "",
      status: "",
    },
  })

  // Sync user's tenantId if they are an admin and it wasn't set yet
  useEffect(() => {
    if (
      !isSuperAdmin &&
      currentUserTenantId &&
      params.tenantId !== String(currentUserTenantId)
    ) {
      setFilter("tenantId", String(currentUserTenantId))
    }
  }, [isSuperAdmin, currentUserTenantId, params.tenantId, setFilter])

  const { data: companiesData } = useGetCompaniesQuery(
    { all: true },
    { skip: !isSuperAdmin }
  )
  const companiesList = useMemo(() => {
    return [{ id: 0, name: "All" }, ...getApiList<CompanyOption>(companiesData)]
  }, [companiesData])

  const handleStatusChange = (value: string) => {
    setFilter("status", value === "ALL" ? "" : value)
  }

  // Map tenantId filter to query parameters if selected
  const userQueryParams = useMemo(() => {
    const qParams: any = { ...queryParams }
    if (params.tenantId && params.tenantId !== "0") {
      qParams.tenantId = Number(params.tenantId)
    } else {
      delete qParams.tenantId
    }
    return qParams
  }, [queryParams, params.tenantId])

  const {
    data: users = [],
    error,
    isFetching,
    isLoading,
  } = useGetUsersQuery(userQueryParams)

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()

  const { pageCount, rows: usersList } = useApiListData<UserDTO>(users, {
    limit: params.limit,
    page: params.page,
  })

  async function handleDelete(userId: number) {
    try {
      await deleteUser(userId).unwrap()
    } catch {
      // Errors surfaced by API middleware
    }
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Users"
          description="Create, update, and manage user accounts and roles."
        />
        <Button
          type="button"
          onClick={() =>
            router.push(
              params.tenantId
                ? `/dashboard/user/add?tenantId=${params.tenantId}`
                : "/dashboard/user/add"
            )
          }
        >
          <Plus data-icon="inline-start" />
          Add user
        </Button>
      </div>

      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex max-w-xs flex-1 flex-col gap-2">
                <Label htmlFor="user-search">Search</Label>
                <div className="relative">
                  <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="user-search"
                    placeholder="Search by email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="flex max-w-xs flex-1 flex-col gap-2">
                <Label htmlFor="user-status">Status</Label>
                <Select
                  value={params.status || "ALL"}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger id="user-status" className="w-full">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent side="bottom">
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isSuperAdmin && (
                <div className="flex max-w-xs flex-1 flex-col gap-2">
                  <Label htmlFor="user-company-select">Tenant</Label>
                  <Select
                    value={params.tenantId || "0"}
                    onValueChange={(value) =>
                      setFilter("tenantId", value === "0" ? "" : value)
                    }
                  >
                    <SelectTrigger id="user-company-select" className="w-full">
                      <SelectValue placeholder="Select Tenant" />
                    </SelectTrigger>
                    <SelectContent side="bottom">
                      {companiesList.map((company) => (
                        <SelectItem key={company.id} value={String(company.id)}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <Button type="button" variant="outline" onClick={resetFilters}>
              <RotateCcw data-icon="inline-start" />
              Reset filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <UserTable
            error={error}
            isDeleting={isDeleting}
            isLoading={isLoading || (isFetching && usersList.length === 0)}
            pageIndex={pageIndex}
            pageSize={pageSize}
            rows={toUserTableRows(usersList)}
            onDelete={handleDelete}
            onEdit={(userId) => router.push(`/dashboard/user/${userId}/edit`)}
            onAssignServices={(userId) =>
              router.push(`/dashboard/user/${userId}/services`)
            }
            onPaginationChange={handlePaginationChange}
            pageCount={pageCount}
          />
        </CardContent>
      </Card>
    </PageContainer>
  )
}

function UserTable({
  error,
  isDeleting,
  isLoading,
  onDelete,
  onEdit,
  onAssignServices,
  onPaginationChange,
  pageIndex,
  pageCount,
  pageSize,
  rows,
}: {
  error: unknown
  isDeleting: boolean
  isLoading: boolean
  onDelete: (userId: number) => Promise<void>
  onEdit: (userId: number) => void
  onAssignServices: (userId: number) => void
  onPaginationChange: (pagination: {
    pageIndex: number
    pageSize: number
  }) => void
  pageIndex: number
  pageCount: number
  pageSize: number
  rows: UserTableRow[]
}) {
  const columns = useMemo(
    () => getUserColumns({ onEdit, onAssignServices, onDelete, isDeleting }),
    [onEdit, onAssignServices, onDelete, isDeleting]
  )

  return (
    <DataTable
      data={rows}
      columns={columns}
      emptyMessage="No users found."
      emptyDescription="Try adjusting your search or filters to see all users."
      error={error}
      errorMessage="Unable to load users. Check the API connection."
      isLoading={isLoading}
      onPaginationChange={onPaginationChange}
      pageCount={pageCount}
      pageIndex={pageIndex}
      pageSize={pageSize}
    />
  )
}
