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
  useDeleteDesignationMutation,
  useGetDesignationsQuery,
} from "@/store/api/designation.api"
import type { DesignationResponse } from "@/types/dtos/designation.dto"

import { getDesignationColumns } from "./designation-columns"
import { DesignationDialog } from "./designation-dialog"

export function DesignationsClient() {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingDesignation, setEditingDesignation] =
    React.useState<DesignationResponse | null>(null)

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

  const { data, error, isFetching, isLoading } = useGetDesignationsQuery(
    queryParams,
    {
      refetchOnMountOrArgChange: true,
    }
  )

  const [deleteDesignation, { isLoading: isDeleting }] =
    useDeleteDesignationMutation()

  const { pageCount, rows: designations } = useApiListData<DesignationResponse>(
    data,
    {
      limit: params.limit,
      page: params.page,
    }
  )

  const handleDelete = async (id: string | number) => {
    try {
      await deleteDesignation(id).unwrap()
    } catch {
      // Errors are surfaced by RTK query logger middleware
    }
  }

  const columns = React.useMemo(
    () =>
      getDesignationColumns({
        onEdit: (designation) => {
          setEditingDesignation(designation)
          setDialogOpen(true)
        },
        onDelete: handleDelete,
        isDeleting,
      }),
    [isDeleting]
  )

  return (
    <PageContainer>
      <PageHeader
        title="Designations"
        description="Manage system-wide staff designations."
        actionLabel="Add Designation"
        actionIcon={<Plus />}
        onAction={() => {
          setEditingDesignation(null)
          setDialogOpen(true)
        }}
      />

      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex max-w-xs flex-1 flex-col gap-2">
                <Label htmlFor="designation-search">Search</Label>
                <div className="relative">
                  <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="designation-search"
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
            data={designations}
            columns={columns}
            emptyMessage="No designations found."
            emptyDescription="Try adjusting your search or filters."
            error={error}
            errorMessage="Unable to load designations. Check the API connection and try again."
            isLoading={isLoading || (isFetching && designations.length === 0)}
            pageCount={pageCount}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPaginationChange={handlePaginationChange}
          />
        </CardContent>
      </Card>

      <DesignationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingDesignation={editingDesignation}
      />
    </PageContainer>
  )
}
