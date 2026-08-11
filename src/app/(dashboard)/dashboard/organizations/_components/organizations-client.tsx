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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useApiListData } from "@/hooks/useApiListData"
import { useDataTableQueryParams } from "@/hooks/useDataTableQueryParams"
import {
  useDeleteCompanyMutation,
  useGetCompaniesQuery,
  useUpdateCompanyStatusMutation,
} from "@/store/api/tenent.api"

import { type Company, getCompanyColumns } from "./company-columns"

export function OrganizationsClient() {
  const router = useRouter()

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
  } = useDataTableQueryParams()

  const handleStatusChange = (value: string) => {
    setFilter("status", value === "ALL" ? "" : value)
  }

  const { data, error, isFetching, isLoading, refetch } = useGetCompaniesQuery(
    queryParams,
    {
      refetchOnMountOrArgChange: true,
    }
  )

  const [updateCompanyStatus] = useUpdateCompanyStatusMutation()
  const [deleteCompany, { isLoading: isDeleting }] = useDeleteCompanyMutation()

  const { pageCount, rows: companies } = useApiListData<Company>(data, {
    limit: params.limit,
    page: params.page,
  })

  const handleToggleStatus = async (
    companyId: string,
    currentStatus: "Active" | "InActive"
  ) => {
    const newStatus = currentStatus === "Active" ? "InActive" : "Active"
    await updateCompanyStatus({ companyId, status: newStatus }).unwrap()
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteCompany(id).unwrap()
    } catch {
      // Errors are surfaced by RTK query logger middleware
    }
  }

  const columns = getCompanyColumns({
    onEdit: (company) => {
      router.push(`/dashboard/organizations/${company.id}/edit`)
    },
    onDelete: handleDelete,
    onToggleStatus: handleToggleStatus,
    isDeleting,
  })

  return (
    <PageContainer>
      <PageHeader
        title="Tenants"
        description="Super admin tenant registry for tenants, subscriptions, and lifecycle status."
        actionLabel="Add tenant"
        actionIcon={<Plus />}
        onAction={() => {
          router.push("/dashboard/organizations/add")
        }}
      />

      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex max-w-xs flex-1 flex-col gap-2">
                <Label htmlFor="org-search">Search</Label>
                <div className="relative">
                  <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="org-search"
                    placeholder="Search by Tenant name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="flex max-w-xs flex-1 flex-col gap-2">
                <Label htmlFor="org-status">Status</Label>
                <Select
                  value={params.status || "ALL"}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger id="org-status" className="w-full">
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
              <RotateCcw data-icon="inline-start" />
              Reset filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={companies}
            columns={columns}
            emptyMessage="No tenants found."
            emptyDescription="Try adjusting your search or filters to see all tenants."
            error={error}
            errorMessage="Unable to load tenants. Check the API connection and try again."
            isLoading={isLoading || (isFetching && companies.length === 0)}
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
