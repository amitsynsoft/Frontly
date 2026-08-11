"use client"

import { Building2,Plus, RotateCcw, Search } from "lucide-react"
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
  useDeleteBranchServiceMutation,
  useGetBranchServicesQuery,
  useUpdateBranchServiceStatusMutation,
} from "@/store/api/branchservices.api"
import { useGetCompaniesQuery } from "@/store/api/tenent.api"
import type { BranchServiceDTO } from "@/types/dtos/branchservices.dto"
import type { GetAllTenents } from "@/types/dtos/tenent.dto"

import { getServiceColumns } from "./service-columns"

type ServiceFilters = {
  tenantId: string
}

export function ServicesClient() {
  const router = useRouter()
  const { user, roles } = useAuth()
  const isSuperAdmin = roles.includes(ROLES.SUPER_ADMIN)
  const currentUserTenantId = user?.tenantId ? Number(user.tenantId) : undefined

  const {
    handlePaginationChange,
    pageIndex,
    pageSize,
    params,
    searchTerm,
    setFilter,
    setSearchTerm,
    resetFilters,
  } = useDataTableQueryParams<ServiceFilters>({
    defaultFilters: {
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

  const { data, error, isFetching, isLoading } = useGetBranchServicesQuery(
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

  const [updateServiceStatus] = useUpdateBranchServiceStatusMutation()
  const [deleteService, { isLoading: isDeleting }] =
    useDeleteBranchServiceMutation()

  const { pageCount, rows: services } = useApiListData<BranchServiceDTO>(data, {
    limit: params.limit,
    page: params.page,
  })

  const handleDelete = React.useCallback(
    async (id: string | number) => {
      try {
        await deleteService(id).unwrap()
      } catch {
        // Handled by API middleware
      }
    },
    [deleteService]
  )

  const handleToggleStatus = React.useCallback(
    async (serviceId: string | number, currentStatus: boolean) => {
      try {
        await updateServiceStatus({
          serviceId: String(serviceId),
          isActive: !currentStatus,
        }).unwrap()
      } catch {
        // Handled by API middleware
      }
    },
    [updateServiceStatus]
  )

  const columns = React.useMemo(
    () =>
      getServiceColumns({
        onEdit: (service) => {
          router.push(`/dashboard/services/${service.id}/edit`)
        },
        onDelete: handleDelete,
        onToggleStatus: handleToggleStatus,
        isDeleting,
      }),
    [handleDelete, handleToggleStatus, isDeleting, router]
  )

  const handleTenantChange = (val: string) => {
    setFilter("tenantId", val)
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Services"
          description="Configurable service catalog shared across tenant and branch workflows."
        />
        <Button
          type="button"
          onClick={() => router.push("/dashboard/services/add")}
        >
          <Plus data-icon="inline-start" />
          Add service
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
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={String(company.id)}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="relative flex max-w-xs flex-1 flex-col gap-2">
                <Label htmlFor="service-search">Search</Label>
                <div className="relative">
                  <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="service-search"
                    placeholder="Search by Service name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={!isSuperAdmin && !effectiveTenantId}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>

            <Button type="button" variant="outline" onClick={resetFilters}>
              <RotateCcw data-icon="inline-start" />
              Reset filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!isSuperAdmin && !effectiveTenantId ? (
            <div className="flex h-32 flex-col items-center justify-center text-muted-foreground">
              <Building2 className="mb-2 h-8 w-8 opacity-20" />
              <p>Select an tenant to view its services.</p>
            </div>
          ) : (
            <DataTable
              data={services}
              columns={columns}
              emptyMessage="No services found."
              emptyDescription="Try adjusting your search terms or filters to see all services."
              error={error}
              errorMessage="Unable to load services. Check the API connection."
              isLoading={isLoading || (isFetching && services.length === 0)}
              pageCount={pageCount}
              pageIndex={pageIndex}
              pageSize={pageSize}
              onPaginationChange={handlePaginationChange}
            />
          )}
        </CardContent>
      </Card>
    </PageContainer>
  )
}
