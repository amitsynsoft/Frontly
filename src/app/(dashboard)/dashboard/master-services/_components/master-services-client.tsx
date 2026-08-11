"use client"

import { Plus, RotateCcw, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"

import { PageContainer } from "@/components/layouts/page-container"
import { PageHeader } from "@/components/layouts/page-header"
import { DataTable } from "@/components/tables/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useApiListData } from "@/hooks/useApiListData"
import { useDataTableQueryParams } from "@/hooks/useDataTableQueryParams"
import {
  useDeleteServiceMutation,
  useGetServicesQuery,
} from "@/store/api/service.api"
import type { ServiceDTO } from "@/types/dtos/services.dto"

import { getMasterServiceColumns } from "./master-service-columns"

type MasterServiceFilters = {
  // Add filters if any
}

export function MasterServicesClient() {
  const router = useRouter()

  const {
    handlePaginationChange,
    pageIndex,
    pageSize,
    params,
    searchTerm,
    setSearchTerm,
    resetFilters,
  } = useDataTableQueryParams<MasterServiceFilters>({
    defaultFilters: {},
  })

  const { data, error, isFetching, isLoading } = useGetServicesQuery(
    {
      page: params.page,
      limit: params.limit,
      search: params.search || undefined,
      all: params.all,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  )

  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation()

  const { pageCount, rows: masterServices } = useApiListData<ServiceDTO>(data, {
    limit: params.limit,
    page: params.page,
  })

  const handleDelete = async (id: string | number) => {
    try {
      await deleteService(id).unwrap()
    } catch {
      // Handled by API middleware
    }
  }

  const columns = React.useMemo(
    () =>
      getMasterServiceColumns({
        onEdit: (service) => {
          router.push(`/dashboard/master-services/${service.id}/edit`)
        },
        onDelete: handleDelete,
        isDeleting,
      }),
    [isDeleting, router]
  )

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Master Services"
          description="Manage the global service catalog templates that organizations configure for their branches."
        />
        <Button
          type="button"
          onClick={() => router.push("/dashboard/master-services/add")}
        >
          <Plus data-icon="inline-start" />
          Add Master Service
        </Button>
      </div>

      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex max-w-xs flex-1 flex-col gap-2">
                <Label htmlFor="master-service-search">Search</Label>
                <div className="relative">
                  <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="master-service-search"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
          <DataTable
            data={masterServices}
            columns={columns}
            emptyMessage="No master services found."
            emptyDescription="Try adjusting your search terms or filters to see all templates."
            error={error}
            errorMessage="Unable to load master services. Check the API connection."
            isLoading={isLoading || (isFetching && masterServices.length === 0)}
            pageCount={pageCount}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPaginationChange={handlePaginationChange}
          />
        </CardContent>
      </Card>
    </PageContainer>
  )
}
