"use client"

import { Plus, RotateCcw, Search } from "lucide-react"
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
  useDeleteResourceTypeMutation,
  useGetResourceTypesQuery,
} from "@/store/api/resource-master.api"

import { ResourceTypeDialog } from "./resource-type-dialog"
import {
  getResourceTypeColumns,
  type ResourceType,
} from "./resource-types-columns"

export function ResourceTypesClient() {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingResourceType, setEditingResourceType] = React.useState<ResourceType | null>(null)

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

  const { data, error, isFetching, isLoading } =
    useGetResourceTypesQuery(queryParams, {
      refetchOnMountOrArgChange: true,
    })

  const [deleteResourceType, { isLoading: isDeleting }] =
    useDeleteResourceTypeMutation()

  const { pageCount, rows: resourceTypes } = useApiListData<ResourceType>(
    data,
    {
      limit: params.limit,
      page: params.page,
    }
  )

  const handleDelete = async (id: string) => {
    try {
      await deleteResourceType(id).unwrap()
    } catch {
      // Errors are surfaced by RTK query logger middleware
    }
  }

  const columns = getResourceTypeColumns({
    onEdit: (resourceType) => {
      setEditingResourceType(resourceType)
      setDialogOpen(true)
    },
    onDelete: handleDelete,
    isDeleting,
  })

  return (
    <PageContainer>
      <PageHeader
        title="Resource Types"
        description="Manage the different types of resources available."
        actionLabel="Add Resource Type"
        actionIcon={<Plus />}
        onAction={() => {
          setEditingResourceType(null)
          setDialogOpen(true)
        }}
      />

      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex max-w-xs flex-1 flex-col gap-2">
                <Label htmlFor="resource-type-search">Search</Label>
                <div className="relative">
                  <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="resource-type-search"
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
            data={resourceTypes}
            columns={columns}
            emptyMessage="No resource types found."
            emptyDescription="Try adjusting your search or filters."
            error={error}
            errorMessage="Unable to load resource types. Check the API connection and try again."
            isLoading={isLoading || (isFetching && resourceTypes.length === 0)}
            pageCount={pageCount}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPaginationChange={handlePaginationChange}
          />
        </CardContent>
      </Card>

      <ResourceTypeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingResourceType={editingResourceType}
      />
    </PageContainer>
  )
}
