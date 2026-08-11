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
import { DASHBOARD_ROUTES } from "@/constants/routes"
import { useApiListData } from "@/hooks/useApiListData"
import { useDataTableQueryParams } from "@/hooks/useDataTableQueryParams"
import {
  useDeleteResourceMutation,
  useGetResourcesQuery,
} from "@/store/api/resource.api"

import { getResourceColumns, Resource } from "./resource-columns"

export function ResourcesClient() {
  const router = useRouter()

  const {
    handlePaginationChange,
    pageIndex,
    pageSize,
    params,
    queryParams,
    searchTerm,
    setSearchTerm,
    resetFilters,
  } = useDataTableQueryParams()

  const { data, error, isFetching, isLoading, refetch } = useGetResourcesQuery(
    queryParams,
    {
      refetchOnMountOrArgChange: true,
    }
  )

  const [deleteResource, { isLoading: isDeleting }] =
    useDeleteResourceMutation()

  const { pageCount, rows: resources } = useApiListData<Resource>(data, {
    limit: params.limit,
    page: params.page,
  })

  const handleDelete = async (id: string) => {
    try {
      await deleteResource(id).unwrap()
    } catch {
      // Errors are surfaced by RTK query logger middleware
    }
  }

  const columns = getResourceColumns({
    onEdit: (resource) => {
      router.push(`${DASHBOARD_ROUTES.resources}/${resource.id}/edit`)
    },
    onDelete: handleDelete,
    isDeleting,
  })

  return (
    <PageContainer>
      <PageHeader
        title="Resources"
        description="Manage the resources assigned to different branches."
        actionLabel="Add Resource"
        actionIcon={<Plus />}
        onAction={() => {
          router.push(`${DASHBOARD_ROUTES.resources}/add`)
        }}
      />

      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex max-w-xs flex-1 flex-col gap-2">
                <Label htmlFor="resource-search">Search</Label>
                <div className="relative">
                  <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="resource-search"
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
            data={resources}
            columns={columns}
            emptyMessage="No resources found."
            emptyDescription="Try adjusting your search or filters."
            error={error}
            errorMessage="Unable to load resources. Check the API connection and try again."
            isLoading={isLoading || (isFetching && resources.length === 0)}
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
