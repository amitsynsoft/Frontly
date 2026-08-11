"use client"

import { Plus, RotateCcw, Search, UserCheck, Users, UserX, CalendarCheck } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"

import { MetricCard } from "@/components/charts/metric-card"
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
import type { CustomerDTO, CustomerStatus } from "@/types/dtos/customer.dto"

import { getCustomerColumns } from "./customer-columns"
import { CustomerFormModal, ViewCustomerModal } from "./customer-dialogs"
import { INITIAL_CUSTOMERS_DATA } from "./customers.config"

export function CustomersClient() {
  const [customers, setCustomers] = useState<CustomerDTO[]>(INITIAL_CUSTOMERS_DATA)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  
  // Table pagination state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  // Modal states
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDTO | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)

  // Metrics computation
  const metrics = useMemo(() => {
    const total = customers.length
    const active = customers.filter((c) => c.status === "Active").length
    const inactive = customers.filter((c) => c.status === "Inactive").length
    const totalBookings = customers.reduce((acc, c) => acc + (c.totalBookings || 0), 0)

    return { total, active, inactive, totalBookings }
  }, [customers])

  // Filter logic
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        !searchTerm.trim() ||
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.id.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus =
        statusFilter === "ALL" || customer.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [customers, searchTerm, statusFilter])

  // Handlers
  const handleViewCustomer = (customer: CustomerDTO) => {
    setSelectedCustomer(customer)
    setIsViewModalOpen(true)
  }

  const handleEditCustomer = (customer: CustomerDTO) => {
    setSelectedCustomer(customer)
    setIsFormModalOpen(true)
  }

  const handleAddCustomer = () => {
    setSelectedCustomer(null)
    setIsFormModalOpen(true)
  }

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== customerId))
    toast.success(`Customer ${customerId} deleted successfully`)
  }

  const handleSaveCustomer = (
    data: { name: string; email: string; phone: string; status: CustomerStatus },
    id?: string
  ) => {
    if (id) {
      // Edit existing
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, ...data } : c
        )
      )
      toast.success(`Customer profile updated successfully`)
    } else {
      // Add new
      const nextNum = customers.length + 1001
      const newCustomer: CustomerDTO = {
        id: `CUST-${nextNum}`,
        ...data,
        totalBookings: 0,
        lastVisit: "N/A",
        createdAt: new Date().toISOString().split("T")[0],
      }
      setCustomers((prev) => [newCustomer, ...prev])
      toast.success(`New customer ${newCustomer.name} created successfully`)
    }
  }

  const handleResetFilters = () => {
    setSearchTerm("")
    setStatusFilter("ALL")
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  const columns = useMemo(
    () =>
      getCustomerColumns({
        onView: handleViewCustomer,
        onEdit: handleEditCustomer,
        onDelete: handleDeleteCustomer,
      }),
    []
  )

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Customers"
          description="Manage client directory, view customer information, track status, and contact info."
        />
    
      </div>

      {/* Top Metric Cards */}
     
      {/* Table Container Card */}
      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex max-w-xs flex-1 flex-col gap-2">
                <Label htmlFor="customer-search">Search Customers</Label>
                <div className="relative">
                  <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="customer-search"
                    placeholder="Search by name, email, phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="flex max-w-xs flex-1 flex-col gap-2">
                <Label htmlFor="customer-status-filter">Status</Label>
                <Select
                  value={statusFilter}
                  onValueChange={(val) => setStatusFilter(val)}
                >
                  <SelectTrigger id="customer-status-filter" className="w-full">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent side="bottom">
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleResetFilters}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset filters
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <DataTable
            data={filteredCustomers}
            columns={columns}
            emptyMessage="No customers found."
            emptyDescription="Try adjusting your search query or filters to find customers."
            isPaginationEnabled={true}
            pageIndex={pagination.pageIndex}
            pageSize={pagination.pageSize}
            onPaginationChange={setPagination}
          />
        </CardContent>
      </Card>

      {/* Dialog Modals */}
      <ViewCustomerModal
        customer={selectedCustomer}
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
      />

      <CustomerFormModal
        customer={selectedCustomer}
        open={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
        onSave={handleSaveCustomer}
      />
    </PageContainer>
  )
}
