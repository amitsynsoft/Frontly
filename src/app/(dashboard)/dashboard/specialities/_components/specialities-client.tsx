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
  useDeleteSpecialityMutation,
  useGetSpecialitiesQuery,
} from "@/store/api/specialities.api"
import type { SpecialityDto } from "@/types/dtos/speciality.dto"

import { getSpecialityColumns } from "./speciality-columns"
import { SpecialityDialog } from "./speciality-dialog"

export function SpecialitiesClient() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingSpeciality, setEditingSpeciality] =
    React.useState<SpecialityDto | null>(null)

  const {
    handlePaginationChange,
    pageIndex,
    pageSize,
    params,
    queryParams,
    searchTerm,
    resetFilters,
    setSearchTerm,
  } = useDataTableQueryParams()

  const { data, error, isFetching, isLoading } = useGetSpecialitiesQuery(
    queryParams,
    {
      refetchOnMountOrArgChange: true,
    }
  )

  const [deleteSpeciality, { isLoading: isDeleting }] =
    useDeleteSpecialityMutation()

  const { pageCount, rows: specialities } = useApiListData<SpecialityDto>(
    data,
    {
      limit: params.limit,
      page: params.page,
    }
  )

  const handleDelete = async (id: number) => {
    try {
      await deleteSpeciality(id).unwrap()
    } catch {
      // Handled by API middleware
    }
  }

  const columns = React.useMemo(
    () =>
      getSpecialityColumns({
        onEdit: (speciality) => {
          setEditingSpeciality(speciality)
          setIsDialogOpen(true)
        },
        onDelete: handleDelete,
        isDeleting,
      }),
    [isDeleting]
  )

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Specialities"
          description="Create, update, and manage professional specialities and services categories."
        />
        <Button
          type="button"
          onClick={() => {
            setEditingSpeciality(null)
            setIsDialogOpen(true)
          }}
        >
          <Plus data-icon="inline-start" />
          Add speciality
        </Button>
      </div>

      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex max-w-xs flex-1 flex-col gap-2">
                <Label htmlFor="speciality-search">Search</Label>
                <div className="relative">
                  <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="speciality-search"
                    placeholder="Search by Speciality name..."
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
            data={specialities}
            columns={columns}
            emptyMessage="No specialities found."
            emptyDescription="Try adjusting your search terms to see all results."
            error={error}
            errorMessage="Unable to load specialities. Check the API connection."
            isLoading={isLoading || (isFetching && specialities.length === 0)}
            pageCount={pageCount}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPaginationChange={handlePaginationChange}
          />
        </CardContent>
      </Card>

      <SpecialityDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingSpeciality={editingSpeciality}
      />
    </PageContainer>
  )
}
