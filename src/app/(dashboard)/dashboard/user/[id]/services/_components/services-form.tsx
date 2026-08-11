import { zodResolver } from "@hookform/resolvers/zod"
import {
  Check,
  CheckCircle2,
  List,
  Loader2,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react"
import * as React from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useDataTableQueryParams } from "@/hooks/useDataTableQueryParams"
import type { BranchServiceDTO } from "@/types/dtos/branchservices.dto"
import type { StaffServiceResponse } from "@/types/dtos/staff-service.dto"

import { ServiceRowItem } from "./service-row-item"
import { ServicesFilter } from "./services-filter"
import { UserInfoSection } from "./user-info-section"

const serviceAssignmentSchema = z.object({
  branchServiceIds: z.array(z.number()),
})

type ServiceAssignmentValues = z.infer<typeof serviceAssignmentSchema>

interface ServicesFormProps {
  userData: {
    email: string
    fullName?: string | null
    roles?: { id: number; name: string }[]
    profilePic?: string | null
    designation?: string | { name: string }
    status?: string
    bio?: string
    createdAt?: string
  }
  availableServices: BranchServiceDTO[]
  assignmentsList: StaffServiceResponse[]
  branchesList: { id: number | string; name: string }[]
  onSave: (branchServiceIds: number[]) => Promise<void>
  isSaving: boolean
  onCancel: () => void
  size?: "sm" | "lg"
}

type ServiceAssignmentFilters = {
  branchId: string
}

export function ServicesForm({
  userData,
  availableServices,
  assignmentsList,
  branchesList,
  onSave,
  isSaving,
  onCancel,
  size = "sm",
}: ServicesFormProps) {
  // React Hook Form
  const form = useForm<ServiceAssignmentValues>({
    resolver: zodResolver(serviceAssignmentSchema),
    defaultValues: {
      branchServiceIds: [],
    },
  })

  const assignedIds = React.useMemo(() => {
    return assignmentsList
      .map((item) => Number(item.branchServiceId))
      .filter((id) => Number.isFinite(id))
  }, [assignmentsList])

  // Sync initially assigned services when they load
  React.useEffect(() => {
    form.reset({ branchServiceIds: assignedIds })
  }, [assignedIds, form])

  // Filters from URL query params (standardized like other lists)
  const { params, searchTerm, setSearchTerm, setFilter, resetFilters } =
    useDataTableQueryParams<ServiceAssignmentFilters>({
      defaultFilters: {
        branchId: "all",
      },
    })

  // Map branches from locations API
  const branches = React.useMemo(() => {
    return branchesList.map((b) => ({
      id: String(b.id),
      name: b.name,
    }))
  }, [branchesList])

  // Filter available services based on URL query params
  const filteredServices = React.useMemo(() => {
    return availableServices.filter((s) => {
      const searchValue = params.search?.trim().toLowerCase()
      const matchesSearch =
        !searchValue ||
        s.serviceMaster?.name?.toLowerCase().includes(searchValue) ||
        s.serviceMaster?.description?.toLowerCase().includes(searchValue)

      const serviceBranchId = s.branchId || s.branch?.id
      const matchesBranch =
        params.branchId === "all" ||
        (serviceBranchId !== undefined &&
          serviceBranchId !== null &&
          String(serviceBranchId) === params.branchId)

      return matchesSearch && matchesBranch
    })
  }, [availableServices, params.search, params.branchId])

  // Watch selectedIds for displaying count
  const watchedSelectedIds = useWatch({
    control: form.control,
    name: "branchServiceIds",
  })
  const selectedIds = React.useMemo(
    () => watchedSelectedIds ?? [],
    [watchedSelectedIds]
  )
  const selectedSet = React.useMemo(() => {
    return new Set(selectedIds.map((id) => Number(id)))
  }, [selectedIds])

  const assignedSet = React.useMemo(() => {
    return new Set(assignedIds)
  }, [assignedIds])

  const selectedFilteredCount = React.useMemo(() => {
    return filteredServices.reduce((count, service) => {
      return selectedSet.has(Number(service.id)) ? count + 1 : count
    }, 0)
  }, [filteredServices, selectedSet])

  const addedCount = React.useMemo(() => {
    return selectedIds.filter((id) => !assignedSet.has(Number(id))).length
  }, [assignedSet, selectedIds])

  const removedCount = React.useMemo(() => {
    return assignedIds.filter((id) => !selectedSet.has(id)).length
  }, [assignedIds, selectedSet])

  const totalServicesCount = availableServices.length
  const visibleServicesCount = filteredServices.length
  const hasFilteredServices = visibleServicesCount > 0
  const allFilteredSelected =
    hasFilteredServices && selectedFilteredCount === visibleServicesCount
  const hasSelectedFilteredServices = selectedFilteredCount > 0
  const hasChanges = addedCount > 0 || removedCount > 0

  // Select/Deselect All Handlers
  const handleSelectAllFiltered = () => {
    const currentValues = form.getValues("branchServiceIds") || []
    const nextValues = new Set([...currentValues])
    filteredServices.forEach((s) => nextValues.add(Number(s.id)))
    form.setValue("branchServiceIds", Array.from(nextValues), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
  }

  const handleDeselectAllFiltered = () => {
    const currentValues = form.getValues("branchServiceIds") || []
    const nextValues = new Set(currentValues)
    filteredServices.forEach((s) => nextValues.delete(Number(s.id)))
    form.setValue("branchServiceIds", Array.from(nextValues), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
  }

  const handleReset = () => {
    form.reset({ branchServiceIds: assignedIds })
    resetFilters()
    toast.success("Selections reset to original values.")
  }

  const handleSubmit = async (values: ServiceAssignmentValues) => {
    await onSave(values.branchServiceIds)
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <CardContent className="flex flex-col gap-6 px-4 py-5 sm:px-6">
          <UserInfoSection
            email={userData.email}
            fullName={userData.fullName}
            roles={userData.roles}
            profilePic={userData.profilePic}
            designation={
              typeof userData.designation === "string"
                ? userData.designation
                : userData.designation?.name
            }
            status={userData.status}
            bio={userData.bio}
            createdAt={userData.createdAt}
            size={size}
          />

          {/* Service Coverage Section */}
          <div className="flex flex-col gap-6 rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-full bg-primary/10 text-primary shrink-0">
                <ShieldCheck className="size-5" />
              </span>
              <h3 className="text-base font-bold text-foreground">
                Service Coverage
              </h3>
            </div>

            <Separator className="bg-border/60" />

            {/* Content area */}
            <div className="flex flex-col lg:flex-row justify-between gap-6 lg:items-center">
              {/* Left Statistics info */}
              <div className="flex flex-col gap-3 min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-foreground tracking-tight leading-none">
                    {selectedIds.length}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground pb-1">
                    of {totalServicesCount} services selected
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {/* Total services badge */}
                  <div className="rounded-lg bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5">
                    <List className="size-3.5" />
                    <span>Total services: {visibleServicesCount}</span>
                  </div>

                  {/* Changes/Saved status badge */}
                  <div className="rounded-lg bg-muted text-muted-foreground border border-border px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5" />
                    <span>
                      {hasChanges
                        ? `${addedCount} added / ${removedCount} removed`
                        : "No unsaved changes"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Cards */}
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center shrink-0 w-full lg:w-auto lg:min-w-[420px]">
                {/* Card 1: Total Services */}
                <div className="flex-1 border border-primary/10 rounded-xl bg-primary/[0.02] p-4 flex items-center gap-4">
                  <span className="p-2 rounded-full bg-primary/10 text-primary shrink-0 size-10 flex items-center justify-center">
                    <List className="size-5" />
                  </span>
                  <div className="flex-1 flex flex-col min-w-0">
                    <span className="text-[10px] font-bold tracking-wider text-muted-foreground/80 uppercase">
                      Total Services
                    </span>
                    <div className="h-px bg-border/40 my-1.5 w-full" />
                    <span className="text-3xl font-extrabold text-foreground leading-none">
                      {totalServicesCount}
                    </span>
                  </div>
                </div>

                {/* Card 2: Selected Services */}
                <div className="flex-1 border border-primary/10 rounded-xl bg-primary/[0.02] p-4 flex items-center gap-4">
                  <span className="p-2 rounded-full bg-primary/10 text-primary shrink-0 size-10 flex items-center justify-center">
                    <Check className="size-5" />
                  </span>
                  <div className="flex-1 flex flex-col min-w-0">
                    <span className="text-[10px] font-bold tracking-wider text-muted-foreground/80 uppercase">
                      Selected Services
                    </span>
                    <div className="h-px bg-border/40 my-1.5 w-full" />
                    <span className="text-3xl font-extrabold text-foreground leading-none">
                      {selectedIds.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Bar (Standardized using URL Search Params) */}
          <ServicesFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedBranchId={params.branchId || "all"}
            onBranchChange={(val) => setFilter("branchId", val)}
            branches={branches}
          />

          {/* Service items list */}
          <div className="flex flex-col gap-3 rounded-md border border-border/60 bg-background/80 p-3 sm:p-4">
            <div className="flex flex-col gap-3 border-b border-border/30 pb-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-1">
                <Label className="text-md text-foreground">
                  Available Services
                </Label>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAllFiltered}
                  disabled={!hasFilteredServices || allFilteredSelected}
                >
                  Select All
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleDeselectAllFiltered}
                  disabled={!hasSelectedFilteredServices}
                  className="text-muted-foreground"
                >
                  Clear All
                </Button>
              </div>
            </div>

            {filteredServices.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center text-muted-foreground">
                <SlidersHorizontal className="mb-3 h-8 w-8 opacity-30" />
                <p className="text-sm font-medium">No services found</p>
                <p className="mt-0.5 text-xs">
                  Adjust your search keyword or branch filter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
                {filteredServices.map((service) => (
                  <ServiceRowItem key={service.id} service={service} />
                ))}
              </div>
            )}
          </div>

          {/* Standard Form Actions Footer */}
          <div className="flex flex-col gap-3 border-t border-border/50 pt-5 sm:flex-row sm:items-center sm:justify-end">
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isSaving || !hasChanges}
                className="w-full sm:w-auto"
              >
                <RotateCcw data-icon="inline-start" />
                Reset
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSaving}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto"
              >
                {isSaving ? (
                  <>
                    <Loader2
                      data-icon="inline-start"
                      className="animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  `Assign Service`
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </form>
    </FormProvider>
  )
}
