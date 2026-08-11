"use client"

import { Building2, Plus, RotateCcw, Search } from "lucide-react"
import { useRouter } from "next/navigation"
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
  useDeleteLocationMutation,
  useGetLocationsQuery,
  useUpdateLocationStatusMutation,
} from "@/store/api/location.api"
import { useGetCompaniesQuery } from "@/store/api/tenent.api"
import { GetAllTenents } from "@/types/dtos/tenent.dto"

import { getLocationColumns, type Location } from "./location-columns"

type LocationFilters = {
  tenantId: string
}

export function LocationsClient() {
  const router = useRouter()
  const { user, roles } = useAuth()
  const isSuperAdmin = roles.includes(ROLES.SUPER_ADMIN)
  const currentUserTenantId = user?.tenantId ? Number(user.tenantId) : undefined
  const {
    handlePaginationChange,
    pageIndex,
    params,
    searchTerm,
    setFilter,
    setSearchTerm,
    resetFilters,
  } = useDataTableQueryParams<LocationFilters>({
    defaultFilters: {
      tenantId: isSuperAdmin
        ? ""
        : currentUserTenantId
          ? String(currentUserTenantId)
          : "",
    },
  })

  // Sync user's companyId if they are an admin and it wasn't set yet
  React.useEffect(() => {
    if (
      !isSuperAdmin &&
      currentUserTenantId &&
      params.tenantId !== String(currentUserTenantId)
    ) {
      setFilter("tenantId", String(currentUserTenantId))
    }
  }, [isSuperAdmin, currentUserTenantId, params.tenantId, setFilter])

  const handleStatusChange = (value: string) => {
    setFilter("status", value === "ALL" ? "" : value)
  }

  // Fetch companies for the selector (Super Admin only)
  const { data: companiesData, isLoading: isLoadingCompanies } =
    useGetCompaniesQuery(
      { all: true },
      { skip: !isSuperAdmin, refetchOnMountOrArgChange: true }
    )

  const companies = React.useMemo(() => {
    return getApiList<GetAllTenents>(companiesData)
  }, [companiesData])

  const { data, error, isFetching, isLoading } = useGetLocationsQuery(
    {
      tenantId: params.tenantId || undefined,
      page: params.page,
      limit: params.limit,
      search: params.search || undefined,
      status: params.status || undefined,
      all: params.all,
    },
    {
      skip: !isSuperAdmin && !params.tenantId,
      refetchOnMountOrArgChange: true,
    }
  )

  const [updateLocationStatus] = useUpdateLocationStatusMutation()
  const [deleteLocation, { isLoading: isDeleting }] =
    useDeleteLocationMutation()

  const { pageCount, rows: locations } = useApiListData<Location>(data, {
    limit: params.limit,
    page: params.page,
  })

  const handleToggleStatus = async (
    locationId: string,
    currentStatus: "Active" | "InActive"
  ) => {
    await updateLocationStatus({
      locationId,
      isActive: currentStatus !== "Active",
    }).unwrap()
  }

  const handleDelete = async (id: string) => {
    await deleteLocation(id).unwrap()
  }

  const columns = getLocationColumns({
    onEdit: (location) => {
      router.push(`/dashboard/branches/${location.id}/edit`)
    },
    onDelete: handleDelete,
    onToggleStatus: handleToggleStatus,
    isDeleting,
  })

  return (
    <PageContainer>
      <PageHeader
        title="Branches"
        description="Manage tenant branches, and their details."
        actionLabel="Add branch"
        actionIcon={<Plus />}
        onAction={() => {
          router.push(
            `/dashboard/branches/add${
              params.tenantId && params.tenantId !== "null"
                ? `?tenantId=${params.tenantId}`
                : ""
            }`
          )
        }}
      />

      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              {isSuperAdmin && (
                <div className="flex max-w-xs flex-1 flex-col gap-2">
                  <Label htmlFor="company-select">Tenant</Label>
                  <Select
                    value={params.tenantId || "all"}
                    onValueChange={(val) =>
                      setFilter("tenantId", val === "all" ? "" : val)
                    }
                    disabled={isLoadingCompanies}
                  >
                    <SelectTrigger id="company-select" className="w-full">
                      <SelectValue placeholder="Select Tenant" />
                    </SelectTrigger>

                    <SelectContent side="bottom">
                      <SelectItem value="all">All</SelectItem>
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
                <Label htmlFor="loc-search">Search</Label>
                <div className="relative">
                  <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="loc-search"
                    placeholder="Search by Branch, City name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="flex max-w-xs flex-1 flex-col gap-2">
                <Label htmlFor="loc-status">Status</Label>
                <Select
                  value={params.status || "ALL"}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger id="loc-status" className="w-full">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent side="bottom">
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="InActive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="button" variant="outline" onClick={resetFilters}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!isSuperAdmin && !params.tenantId ? (
            <div className="flex h-32 flex-col items-center justify-center text-muted-foreground">
              <Building2 className="mb-2 h-8 w-8 opacity-20" />
              <p>Select a tenant to view its branches.</p>
            </div>
          ) : (
            <DataTable
              data={locations}
              columns={columns}
              emptyMessage="No branches found."
              emptyDescription="Try adjusting your search or filters to see all branches."
              error={error}
              errorMessage="Unable to load branches. Check the API connection and try again."
              isLoading={isLoading || (isFetching && locations.length === 0)}
              pageCount={pageCount}
              pageIndex={pageIndex}
              pageSize={params.limit}
              onPaginationChange={handlePaginationChange}
            />
          )}
        </CardContent>
      </Card>
    </PageContainer>
  )
}
