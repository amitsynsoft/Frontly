"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import * as React from "react"
import { FormProvider, useForm } from "react-hook-form"

import { FormFileUpload } from "@/components/forms/form-file-upload"
import { FormInput } from "@/components/forms/form-input"
import { FormMultiSelect } from "@/components/forms/form-multi-select"
import { FormSelect } from "@/components/forms/form-select"
import { FormSwitch } from "@/components/forms/form-switch"
import { FormTagsInput } from "@/components/forms/form-tags-input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useGetCurrenciesQuery } from "@/store/api/currency.api"
import { useGetLocationsQuery } from "@/store/api/location.api"
import { useGetResourcesQuery } from "@/store/api/resource.api"
import { useGetServicesQuery } from "@/store/api/service.api"
import { useGetTenantUserLevelsQuery } from "@/store/api/tenant-user-level.api"
import { useGetCompaniesQuery } from "@/store/api/tenent.api"
import type { BranchServiceDTO } from "@/types/dtos/branchservices.dto"
import type { TenantUserLevelDto } from "@/types/dtos/tenant-user-levels.dto"
import { UserLevelPricingTable } from "./user-level-pricing-table"

import {
  bookingModeOptions,
  defaultValues,
  type LevelCostPayload,
  type ServiceFormValues,
  serviceSchema,
} from "./service-form.config"

import { getApiList } from "@/hooks/useApiListData"

// ── Helpers ────────────────────────────────────────────────────────────────────

const mapInitialDataToFormValues = (
  initialData: BranchServiceDTO | null | undefined,
  userLevelOptions: Array<{ id: string; name: string; description: string }> = []
): ServiceFormValues => {
  const data = initialData
    ? (initialData as any).result || (initialData as any).data || initialData
    : null

  const savedLevels = Array.isArray(data?.levelCosts) ? data.levelCosts : []

  let levelCosts: ServiceFormValues["levelCosts"] = []
  if (userLevelOptions.length > 0) {
    levelCosts = userLevelOptions.map((opt) => {
      const saved = savedLevels.find(
        (s: any) => String(s.branchLevelId ?? s.id) === String(opt.id)
      )
      return {
        branchLevelId: String(opt.id),
        name: opt.name,
        description: opt.description,
        isChecked: !!saved,
        cost: saved ? String(saved.cost ?? "") : "",
      }
    })
  } else if (savedLevels.length > 0) {
    levelCosts = savedLevels.map((s: any) => ({
      branchLevelId: String(s.branchLevelId ?? s.id ?? ""),
      name: s.name ?? "",
      description: s.description ?? "",
      isChecked: true,
      cost: String(s.cost ?? ""),
    }))
  }

  if (!data) {
    return {
      ...defaultValues,
      levelCosts,
    }
  }

  return {
    tenantId: String(data?.tenantId ?? ""),
    branchId: String(data?.branchId ?? ""),
    serviceId: String(data?.serviceId ?? ""),
    durationMinutes: data?.durationMinutes ?? 60,
    cost: data ? Number(data.cost) : 0,
    currencyId: String(data?.currencyId ?? ""),
    bookingMode: String(data?.bookingMode ?? "1"),
    maxCapacity: data?.maxCapacity ?? 10,
    minAdvanceBookingDays: data?.minAdvanceBookingDays ?? 1,
    images: Array.isArray(data?.images) ? data.images : [],
    tags: Array.isArray(data?.tags) ? data.tags : [],
    isActive: data?.isActive ?? true,
    allowSendingReminder: data?.allowSendingReminder ?? true,
    resourceIds: Array.isArray(data?.resourceIds)
      ? data.resourceIds.map(String)
      : Array.isArray(data?.resources)
        ? data.resources.map((r: any) => String(r.id || r))
        : [],
    levelCosts,
  }
}

// ── Props ──────────────────────────────────────────────────────────────────────


interface ServiceFormProps {
  onSubmit: (values: any) => Promise<void> | void
  initialData?: BranchServiceDTO | null
  isLoading?: boolean
  onCancel: () => void
  isSuperAdmin: boolean
  currentUserTenantId?: number
}

// ── Component ──────────────────────────────────────────────────────────────────

export function ServiceForm({
  onSubmit,
  initialData,
  isLoading = false,
  onCancel,
  isSuperAdmin,
  currentUserTenantId,
}: ServiceFormProps) {
  const isEdit = !!initialData

  // ── Companies ──────────────────────────────────────────────────────────────
  const { data: companiesData, isLoading: isLoadingCompanies } =
    useGetCompaniesQuery({ all: true }, { skip: !isSuperAdmin })

  const companyOptions = React.useMemo(() => {
    const list = Array.isArray(companiesData) ? companiesData : []
    return list.map((c: any) => ({ label: c.name, value: String(c.id) }))
  }, [companiesData])

  // ── Master Services ────────────────────────────────────────────────────────
  const { data: masterServicesData, isLoading: isLoadingMasterServices } =
    useGetServicesQuery({ all: true })

  const masterServiceOptions = React.useMemo(() => {
    return getApiList(masterServicesData).map((s: any) => ({
      label: s.name,
      value: String(s.id),
    }))
  }, [masterServicesData])

  // ── User Levels ────────────────────────────────────────────────────────────
  // Determine tenantId to use: superadmin uses whatever is selected in form,
  // regular admin always uses their own tenantId.
  const [tempTenantId, setTempTenantId] = React.useState<string>("")

  const tenantIdForQuery = isSuperAdmin ? tempTenantId : currentUserTenantId

  const { data: userLevelsData, isLoading: isLoadingUserLevels } =
    useGetTenantUserLevelsQuery(
      { all: true, tenantId: Number(tenantIdForQuery) },
      { skip: !tenantIdForQuery, refetchOnMountOrArgChange: true }
    )

  const userLevelOptions = React.useMemo(() => {
    const list = Array.isArray(userLevelsData) ? userLevelsData : []
    return list.map((u: TenantUserLevelDto) => ({
      id: String(u.id),
      name: u.level,
      description: u.description ?? "",
    }))
  }, [userLevelsData])

  // ── Form ───────────────────────────────────────────────────────────────────
  const computedDefaultValues = React.useMemo(() => {
    return mapInitialDataToFormValues(initialData, userLevelOptions)
  }, [initialData, userLevelOptions])

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: computedDefaultValues,
  })

  const selectedTenantId = form.watch("tenantId")
  const selectedBranchId = form.watch("branchId")

  React.useEffect(() => {
    if (selectedTenantId !== tempTenantId) {
      setTempTenantId(selectedTenantId)
    }
  }, [selectedTenantId, tempTenantId])

  // ── Branches (Locations) ───────────────────────────────────────────────────
  const { data: locationsData, isLoading: isLoadingLocations } =
    useGetLocationsQuery(
      { tenantId: selectedTenantId, all: true },
      { skip: !selectedTenantId || selectedTenantId === "null" }
    )

  const branchOptions = React.useMemo(() => {
    return getApiList(locationsData).map((b: any) => ({
      label: b.name,
      value: String(b.id),
    }))
  }, [locationsData])

  // ── Resources ──────────────────────────────────────────────────────────────
  const { data: resourcesData, isLoading: isLoadingResources } =
    useGetResourcesQuery(
      { tenantId: selectedTenantId, branchId: selectedBranchId, all: true },
      { skip: !selectedBranchId || selectedBranchId === "null" }
    )

  const resourceOptions = React.useMemo(() => {
    return getApiList(resourcesData)
      .filter(
        (r: any) =>
          String(r.tenantId) === String(selectedTenantId) &&
          String(r.branchId) === String(selectedBranchId)
      )
      .map((r: any) => ({ label: r.name, value: String(r.id) }))
  }, [resourcesData, selectedTenantId, selectedBranchId])

  // ── Currencies ─────────────────────────────────────────────────────────────
  const { data: currenciesData, isLoading: isLoadingCurrencies } =
    useGetCurrenciesQuery({ all: true }, { refetchOnMountOrArgChange: true })

  const currencyOptions = React.useMemo(() => {
    const list = Array.isArray(currenciesData) ? currenciesData : []
    return list.map((c: any) => ({
      label: `${c.name} (${c.symbol})`,
      value: String(c.id),
    }))
  }, [currenciesData])

  // Set tenantId for non-super-admin on mount
  React.useEffect(() => {
    if (!isSuperAdmin && currentUserTenantId) {
      form.setValue("tenantId", String(currentUserTenantId))
      setTempTenantId(String(currentUserTenantId))
    }
  }, [isSuperAdmin, currentUserTenantId, form])

  // ── Sync form data when initialData or userLevelOptions change ───────────────
  const loadedKeyRef = React.useRef<string | null>(null)

  React.useEffect(() => {
    const data = initialData
      ? (initialData as any).result || (initialData as any).data || initialData
      : null
    const serviceIdStr = data?.id ? String(data.id) : "new"
    const currentKey = `${serviceIdStr}_${userLevelOptions.map((u) => u.id).join(",")}`

    if (loadedKeyRef.current !== currentKey) {
      form.reset(mapInitialDataToFormValues(initialData, userLevelOptions))
      loadedKeyRef.current = currentKey
    }
  }, [initialData, userLevelOptions, form])

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (values: ServiceFormValues) => {
    const payload = {
      tenantId: Number(values.tenantId),
      branchId: Number(values.branchId),
      serviceId: Number(values.serviceId),
      durationMinutes: Number(values.durationMinutes),
      cost: Number(values.cost),
      currencyId: Number(values.currencyId),
      bookingMode: Number(values.bookingMode),
      maxCapacity: Number(values.maxCapacity),
      images: values.images,
      tags: values.tags,
      minAdvanceBookingDays: Number(values.minAdvanceBookingDays),
      isActive: values.isActive,
      allowSendingReminder: values.allowSendingReminder,
      resourceIds: Array.isArray(values.resourceIds)
        ? values.resourceIds.map(Number)
        : [],
      levelCosts: Array.isArray(values.levelCosts)
        ? values.levelCosts
            .filter((item: any) => item.isChecked)
            .map((item: any) => ({
              branchLevelId: Number(item.branchLevelId),
              cost: Number(item.cost),
            }))
        : undefined,
    }

    await onSubmit(payload)
  }

  // ── Derived UI state ───────────────────────────────────────────────────────
  const isBranchDisabled =
    !selectedTenantId ||
    selectedTenantId === "null" ||
    isLoadingLocations ||
    branchOptions.length === 0

  const branchPlaceholder = React.useMemo(() => {
    if (!selectedTenantId || selectedTenantId === "null")
      return "Select a tenant first"
    if (isLoadingLocations) return "Loading branches…"
    if (branchOptions.length === 0) return "No branches found for this tenant"
    return "Select branch"
  }, [selectedTenantId, isLoadingLocations, branchOptions])

  const isResourceDisabled =
    !selectedBranchId || selectedBranchId === "null" || isLoadingResources

  const resourcePlaceholder = React.useMemo(() => {
    if (!selectedBranchId || selectedBranchId === "null")
      return "Select branch first"
    if (isLoadingResources) return "Loading resources…"
    if (resourceOptions.length === 0)
      return "No resources found for this branch"
    return "Select resources"
  }, [selectedBranchId, isLoadingResources, resourceOptions])

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Card className="border border-border/50 bg-background/50 shadow-xl backdrop-blur-sm">
      <CardContent className="px-6 py-5">
        <FormProvider {...form}>
          <form
            id="service-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            {/* ── Basic Info ──────────────────────────────────────────────── */}
            <Section title="Basic Information">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {isSuperAdmin && (
                  <FormSelect
                    name="tenantId"
                    label="Tenant"
                    required
                    disabled={isEdit || isLoadingCompanies}
                    placeholder={
                      isLoadingCompanies ? "Loading tenants…" : "Select tenant"
                    }
                    options={companyOptions}
                    onChange={() => {
                      form.setValue("branchId", "")
                      form.setValue("resourceIds", [])
                    }}
                  />
                )}

                <FormSelect
                  name="branchId"
                  label="Branch"
                  required
                  disabled={isEdit || isBranchDisabled}
                  placeholder={branchPlaceholder}
                  options={branchOptions}
                  onChange={() => {
                    form.setValue("resourceIds", [])
                  }}
                />

                <FormSelect
                  name="serviceId"
                  label="Master Service"
                  required
                  disabled={isEdit || isLoadingMasterServices}
                  placeholder={
                    isLoadingMasterServices
                      ? "Loading services…"
                      : "Select master service"
                  }
                  options={masterServiceOptions}
                />
              </div>
            </Section>

            {/* ── Pricing & Duration ──────────────────────────────────────── */}
            <Section title="Pricing & Duration">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormInput
                  name="durationMinutes"
                  label="Duration (Minutes)"
                  required
                  type="number"
                  placeholder="60"
                />

                <FormInput
                  name="cost"
                  label="Base Price / Cost"
                  required
                  type="number"
                  placeholder="100.00"
                />

                <FormSelect
                  name="currencyId"
                  label="Currency"
                  required
                  disabled={isLoadingCurrencies}
                  placeholder={
                    isLoadingCurrencies
                      ? "Loading currencies…"
                      : "Select currency"
                  }
                  options={currencyOptions}
                />

                <FormSelect
                  name="bookingMode"
                  label="Booking Mode"
                  required
                  placeholder="Select booking mode"
                  options={bookingModeOptions}
                />
              </div>
            </Section>

            {/* ── Capacity & Scheduling ───────────────────────────────────── */}
            <Section title="Capacity & Scheduling">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormInput
                  name="maxCapacity"
                  label="Max Capacity (Per Slot)"
                  required
                  type="number"
                  placeholder="10"
                />

                <FormInput
                  name="minAdvanceBookingDays"
                  label="Min Advance Booking Days"
                  required
                  type="number"
                  placeholder="1"
                />

                <div className="sm:col-span-2">
                  <FormMultiSelect
                    name="resourceIds"
                    label="Resources"
                    placeholder={resourcePlaceholder}
                    disabled={isResourceDisabled}
                    options={resourceOptions}
                  />
                </div>
              </div>
            </Section>

            {/* ── Media & Tags ────────────────────────────────────────────── */}
            <Section title="Media & Tags">
              <div className="grid grid-cols-1 gap-5">
                <FormFileUpload
                  name="images"
                  label="Service Images"
                  acceptedFileTypes={["image/*"]}
                  maxFiles={8}
                  maxSizeMB={5}
                  multiple
                  placeholder="Upload service images"
                  uploadType="service"
                />

                <FormTagsInput
                  name="tags"
                  label="Tags"
                  placeholder="Add tag and press Enter"
                />
              </div>
            </Section>
            {/* ── User Level Pricing ──────────────────────────────────────── */}
            <Section title="User Level Pricing">
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Check a level to set a custom price for that user group. Only
                  checked levels are included in the request.
                </p>

                <UserLevelPricingTable
                  isLoadingUserLevels={isLoadingUserLevels}
                  userLevelOptions={userLevelOptions}
                />
              </div>
            </Section>
            {/* ── Service Settings ────────────────────────────────────────── */}
            <Section title="Service Settings">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormSwitch
                  name="isActive"
                  label="Is Active"
                  description="Enable or disable this service in the public catalog."
                />
                <FormSwitch
                  name="allowSendingReminder"
                  label="Send Booking Reminders"
                  description="Send automated notifications to clients before their appointment."
                />
              </div>
            </Section>

            {/* ── Actions Footer ──────────────────────────────────────────── */}
            <div className="flex items-center justify-end gap-2 border-t border-border/50 pt-5">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving…
                  </span>
                ) : isEdit ? (
                  "Update Service"
                ) : (
                  "Create Service"
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}

// ── Section helper ─────────────────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <div className="h-px flex-1 bg-border/50" />
      </div>
      {children}
    </div>
  )
}
