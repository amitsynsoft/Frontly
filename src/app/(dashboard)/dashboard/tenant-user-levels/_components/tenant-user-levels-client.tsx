"use client"

import { Building2,Plus, RotateCcw, Search } from "lucide-react"
import * as React from "react"

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
import {
  useDeleteTenantUserLevelMutation,
  useGetTenantUserLevelsQuery,
} from "@/store/api/tenant-user-level.api"
import { useGetCompaniesQuery } from "@/store/api/tenent.api"
import type { TenantUserLevelDto } from "@/types/dtos/tenant-user-levels.dto"
import type { GetAllTenents } from "@/types/dtos/tenent.dto"

import { getTenantUserLevelColumns } from "./tenant-user-level-columns"
import { TenantUserLevelDialog } from "./tenant-user-level-dialog"

type TenantUserLevelFilters = {
  tenantId: string
  status: string
}

const DEFAULT_FILTERS: TenantUserLevelFilters = {
  tenantId: "",
  status: "",
}

export function TenantUserLevelsClient() {
  const { user, roles } = useAuth()
  const isSuperAdmin = roles.includes(ROLES.SUPER_ADMIN)
  const currentUserTenantId = user?.tenantId ? Number(user.tenantId) : undefined

  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingLevel, setEditingLevel] =
    React.useState<TenantUserLevelDto | null>(null)

  const {
    handlePaginationChange,
    pageIndex,
    params,
    searchTerm,
    setFilter,
    setSearchTerm,
    resetFilters,
  } = useDataTableQueryParams<TenantUserLevelFilters>({
    defaultFilters: {
      ...DEFAULT_FILTERS,
      tenantId: isSuperAdmin
        ? ""
        : currentUserTenantId
          ? String(currentUserTenantId)
          : "",
    },
  })

  // Sync user's tenantId if they are an admin and it wasn't set yet
  React.useEffect(() => {
    if (
      !isSuperAdmin &&
      currentUserTenantId &&
      params.tenantId !== String(currentUserTenantId)
    ) {
      setFilter("tenantId", String(currentUserTenantId))
    }
  }, [isSuperAdmin, currentUserTenantId, params.tenantId, setFilter])

  // Fetch companies for the selector (Super Admin only)
  const { data: companiesData, isLoading: isLoadingCompanies } =
    useGetCompaniesQuery(
      { all: true },
      { skip: !isSuperAdmin, refetchOnMountOrArgChange: true }
    )

  const companies = React.useMemo(() => {
    return getApiList<GetAllTenents>(companiesData)
  }, [companiesData])

  const effectiveTenantId = isSuperAdmin
    ? params.tenantId
    : String(currentUserTenantId || "")

  const { data, error, isFetching, isLoading } = useGetTenantUserLevelsQuery(
    {
      tenantId: effectiveTenantId ? Number(effectiveTenantId) : undefined,
      page: params.page,
      limit: params.limit,
      search: params.search || undefined,
      all: isSuperAdmin ? true : params.all,
    },
    {
      skip: !isSuperAdmin && !effectiveTenantId,
      refetchOnMountOrArgChange: true,
    }
  )

  const [deleteLevel, { isLoading: isDeleting }] =
    useDeleteTenantUserLevelMutation()

  const { pageCount, rows: tenantUserLevels } =
    useApiListData<TenantUserLevelDto>(data, {
      limit: params.limit,
      page: params.page,
    })

  const handleDelete = React.useCallback(
    async (id: number) => {
      try {
        await deleteLevel(id).unwrap()
      } catch {
        // Handled by API middleware
      }
    },
    [deleteLevel]
  )

  const columns = React.useMemo(
    () =>
      getTenantUserLevelColumns({
        onEdit: (level) => {
          setEditingLevel(level)
          setIsDialogOpen(true)
        },
        onDelete: handleDelete,
        isDeleting,
        showOrganizationColumn: isSuperAdmin,
      }),
    [handleDelete, isDeleting, isSuperAdmin]
  )

  const handleTenantChange = (val: string) => {
    setFilter("tenantId", val)
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="User Levels"
          description="Create, update, and manage user/staff levels and classification boundaries."
        />
        <Button
          type="button"
          // disabled={!effectiveTenantId}
          onClick={() => {
            setEditingLevel(null)
            setIsDialogOpen(true)
          }}
        >
          <Plus data-icon="inline-start" />
          Add User Level
        </Button>
      </div>

      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              {isSuperAdmin && (
                <div className="flex max-w-xs flex-1 flex-col gap-2">
                  <Label htmlFor="tenant-select">Tenant</Label>
                  <Select
                    value={params.tenantId}
                    onValueChange={handleTenantChange}
                    disabled={isLoadingCompanies}
                  >
                    <SelectTrigger id="tenant-select" className="w-full">
                      <SelectValue placeholder="Select Tenant" />
                    </SelectTrigger>
                    <SelectContent side="bottom">
                      {companies.map((company: GetAllTenents) => (
                        <SelectItem key={company.id} value={String(company.id)}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="relative flex max-w-xs flex-1 flex-col gap-2">
                <Label htmlFor="level-search">Search</Label>
                <div className="relative">
                  <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="level-search"
                    placeholder="Search by Level name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={!isSuperAdmin && !effectiveTenantId}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>

            <Button type="button" variant="outline" onClick={resetFilters}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Filter
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {!isSuperAdmin && !effectiveTenantId ? (
            <div className="flex h-32 flex-col items-center justify-center text-muted-foreground">
              <Building2 className="mb-2 h-8 w-8 opacity-20" />
              <p>Select an tenant to view its user levels.</p>
            </div>
          ) : (
            <DataTable
              data={tenantUserLevels}
              columns={columns}
              emptyMessage="No user levels found."
              emptyDescription="Try adjusting your search terms or filters to see all results."
              error={error}
              errorMessage="Unable to load user levels. Check the API connection and try again."
              isLoading={
                isLoading || (isFetching && tenantUserLevels.length === 0)
              }
              pageCount={pageCount}
              pageIndex={pageIndex}
              pageSize={params.limit}
              onPaginationChange={handlePaginationChange}
            />
          )}
        </CardContent>
      </Card>

      <TenantUserLevelDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingLevel={editingLevel}
        isSuperAdmin={isSuperAdmin}
        currentUserTenantId={currentUserTenantId}
      />
    </PageContainer>
  )
}
