"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import * as React from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"

import { FormInput } from "@/components/forms/form-input"
import { FormSelect } from "@/components/forms/form-select"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import { ROLES } from "@/lib/permissions/roles"
import { useGetLocationsQuery } from "@/store/api/location.api"
import { useGetResourceTypesQuery } from "@/store/api/resource-master.api"
import { useGetCompaniesQuery } from "@/store/api/tenent.api"
import type { BranchResourceResponse } from "@/types/dtos/resource.dto"

import { getApiList } from "@/hooks/useApiListData"
import {
  type CreateResourceFormValues,
  createResourceSchema,
  getResourceDefaultValues,
} from "./resource-schema"

const mapInitialResourceDataToFormValues = (
  initialResourceData: UnknownRecord | null,
  effectiveDefaultTenantId: string
): CreateResourceFormValues => {
  if (!initialResourceData) {
    return getResourceDefaultValues(effectiveDefaultTenantId)
  }

  return {
    tenantId: getStringValue(initialResourceData, "tenantId"),
    branchId: getStringValue(initialResourceData, "branchId"),
    resourceTypeId: getResourceTypeId(initialResourceData),
    name: getStringValue(initialResourceData, "name"),
    maxCapacity: Number(initialResourceData.maxCapacity ?? 1),
  }
}

interface ResourceFormProps {
  onSubmit: (values: CreateResourcePayload) => Promise<void> | void
  initialData?: BranchResourceResponse | ResourceResponseEnvelope | null
  isLoading?: boolean
  onCancel: () => void
}

type CreateResourcePayload = {
  tenantId: number
  branchId: number
  resourceTypeId: number
  name: string
  maxCapacity: number
}

type ResourceResponseEnvelope = {
  data?: BranchResourceResponse
  result?: BranchResourceResponse
}

type UnknownRecord = Record<string, unknown>

type SelectOption = {
  label: string
  value: string
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null
}



function getStringValue(source: UnknownRecord | null, ...keys: string[]) {
  if (!source) {
    return ""
  }

  for (const key of keys) {
    const value = source[key]

    if (value !== null && value !== undefined && String(value).trim()) {
      return String(value)
    }
  }

  return ""
}

function unwrapResourceData(
  initialData: ResourceFormProps["initialData"]
): UnknownRecord | null {
  if (!isRecord(initialData)) {
    return null
  }

  const response = initialData as UnknownRecord
  const data = response.result ?? response.data ?? response

  return isRecord(data) ? data : null
}

function getNestedRecord(source: UnknownRecord | null, key: string) {
  if (!source) {
    return null
  }

  const value = source[key]

  return isRecord(value) ? value : null
}

function getResourceTypeId(data: UnknownRecord | null) {
  const resourceType = getNestedRecord(data, "resourceType")

  return (
    getStringValue(
      data,
      "resourceTypeId",
      "resource_type_id",
      "resourceTypeID",
      "typeId"
    ) || getStringValue(resourceType, "id", "resourceTypeId")
  )
}

export function ResourceForm({
  onSubmit,
  initialData,
  isLoading = false,
  onCancel,
}: ResourceFormProps) {
  const isEdit = !!initialData
  const { user: currentUser, roles } = useAuth()

  const isOrgAdmin = roles.includes(ROLES.ORGANIZATION_ADMIN)

  const effectiveDefaultTenantId =
    isOrgAdmin && currentUser?.tenantId ? String(currentUser.tenantId) : ""
  const initialResourceData = React.useMemo(
    () => unwrapResourceData(initialData),
    [initialData]
  )

  const computedDefaultValues = React.useMemo(() => {
    return mapInitialResourceDataToFormValues(
      initialResourceData,
      effectiveDefaultTenantId
    )
  }, [initialResourceData, effectiveDefaultTenantId])

  const form = useForm<CreateResourceFormValues>({
    resolver: zodResolver(createResourceSchema),
    defaultValues: computedDefaultValues,
  })

  const tenantId = useWatch({
    control: form.control,
    name: "tenantId",
  })

  // Companies
  const { data: companiesData, isLoading: isLoadingCompanies } =
    useGetCompaniesQuery({ all: true })
  const companyOptions = React.useMemo(() => {
    const list = getApiList(companiesData)
    return list
      .map((company: any) => ({
        label: getStringValue(company, "name"),
        value: getStringValue(company, "id"),
      }))
      .filter((option) => option.value)
  }, [companiesData])

  // Locations (Branches)
  const { data: locationsData, isLoading: isLoadingLocations } =
    useGetLocationsQuery({ tenantId: tenantId, all: true }, { skip: !tenantId })
  const locationOptions = React.useMemo(() => {
    const list = getApiList(locationsData)
    return list
      .map((location: any) => ({
        label: getStringValue(location, "name"),
        value: getStringValue(location, "id"),
      }))
      .filter((option) => option.value)
  }, [locationsData])

  // Resource Types
  const { data: resourceTypesData, isLoading: isLoadingResourceTypes } =
    useGetResourceTypesQuery({ all: true })
  const resourceTypeOptions = React.useMemo(() => {
    const options = getApiList(resourceTypesData)
      .map((resourceType: any) => ({
        label: getStringValue(resourceType, "name"),
        value: getStringValue(resourceType, "id"),
      }))
      .filter((option) => option.value)
    const selectedResourceType = getNestedRecord(
      initialResourceData,
      "resourceType"
    )
    const selectedOption: SelectOption | null = selectedResourceType
      ? {
          label: getStringValue(selectedResourceType, "name") || "Current type",
          value: getStringValue(selectedResourceType, "id", "resourceTypeId"),
        }
      : null

    if (
      selectedOption?.value &&
      !options.some((option) => option.value === selectedOption.value)
    ) {
      return [selectedOption, ...options]
    }

    return options
  }, [initialResourceData, resourceTypesData])

  React.useEffect(() => {
    form.reset(
      mapInitialResourceDataToFormValues(
        initialResourceData,
        effectiveDefaultTenantId
      )
    )
  }, [initialResourceData, form, effectiveDefaultTenantId])
  React.useEffect(() => {
    if (isOrgAdmin && effectiveDefaultTenantId) {
      form.setValue("tenantId", effectiveDefaultTenantId)
    }
  }, [isOrgAdmin, effectiveDefaultTenantId, form])
  const handleSubmit = async (values: CreateResourceFormValues) => {
    const payload: CreateResourcePayload = {
      tenantId: Number(values.tenantId),
      branchId: Number(values.branchId),
      resourceTypeId: Number(values.resourceTypeId),
      name: values.name,
      maxCapacity: Number(values.maxCapacity),
    }
    await onSubmit(payload)
  }

  return (
    <Card className="border border-border/50 bg-background/50 shadow-xl backdrop-blur-sm">
      <CardContent className="px-6 py-5">
        <FormProvider {...form}>
          <form
            id="resource-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {!isOrgAdmin && (
                <FormSelect
                  name="tenantId"
                  label="Tenant"
                  required
                  disabled={isEdit || isLoadingCompanies}
                  placeholder={
                    isLoadingCompanies ? "Loading tenants..." : "Select tenant"
                  }
                  options={companyOptions}
                />
              )}
              <FormSelect
                name="branchId"
                label="Branch"
                required
                disabled={isEdit || !tenantId || isLoadingLocations}
                placeholder={
                  !tenantId
                    ? "Select tenant first"
                    : isLoadingLocations
                      ? "Loading branches..."
                      : "Select branch"
                }
                options={locationOptions}
              />

              <FormSelect
                name="resourceTypeId"
                label="Resource Type"
                required
                disabled={isLoadingResourceTypes}
                placeholder={
                  isLoadingResourceTypes
                    ? "Loading resource types..."
                    : "Select resource type"
                }
                options={resourceTypeOptions}
              />

              <FormInput
                name="name"
                label="Resource Name"
                required
                placeholder="e.g. Room A, Chair 1"
              />

              <FormInput
                name="maxCapacity"
                label="Max Capacity"
                required
                type="number"
                placeholder="1"
              />
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-border/50 pt-5">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving...
                  </span>
                ) : isEdit ? (
                  "Update Resource"
                ) : (
                  "Create Resource"
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}
