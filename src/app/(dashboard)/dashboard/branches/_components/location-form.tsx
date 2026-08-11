"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Clock, Loader2 } from "lucide-react"
import { useEffect, useMemo } from "react"
import { Controller, FormProvider, useForm } from "react-hook-form"

import { FormCheckbox } from "@/components/forms/form-checkbox"
import { FormInput } from "@/components/forms/form-input"
import { FormMultiSelect } from "@/components/forms/form-multi-select"
import { FormOperatingHours } from "@/components/forms/form-operating-hours"
import { FormSelect } from "@/components/forms/form-select"
import { FormTextarea } from "@/components/forms/form-textarea"
import { PhoneField } from "@/components/forms/phonefield"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/hooks/useAuth"
import { ROLES } from "@/lib/permissions/roles"
import { useGetCompaniesQuery } from "@/store/api/tenent.api"
import { timezones } from "@/constants/timezoneData"
import type { LocationRequest } from "@/types/dtos/location.dto"

import {
  apiOperatingHoursToFormSchedule,
  type CreateLocationFormValues,
  createLocationSchema,
  DAYS_OF_WEEK,
  formScheduleToApiOperatingHours,
  getLocationDefaultValues,
} from "./location-schema"

// ── Props ──────────────────────────────────────────────────────────────────────

interface LocationFormProps {
  onSubmit: (values: LocationRequest) => Promise<void> | void
  initialData?: (LocationRequest & { id?: string | number }) | null
  isLoading?: boolean
  onCancel: () => void
  defaultTenantId?: string
}

// ── Component ──────────────────────────────────────────────────────────────────

export function LocationForm({
  onSubmit,
  initialData,
  isLoading = false,
  onCancel,
  defaultTenantId,
}: LocationFormProps) {
  const isEdit = !!initialData
  const { user: currentUser, roles } = useAuth()

  const isOrgAdmin = roles.includes(ROLES.ORGANIZATION_ADMIN)

  const effectiveDefaultTenantId =
    isOrgAdmin && currentUser?.tenantId
      ? String(currentUser.tenantId)
      : defaultTenantId
  const { data: tenantsData, isLoading: isLoadingTenants } =
    useGetCompaniesQuery({ all: true })
  const facilityOptions = useMemo(
    () => [
      {
        label: "Waiting Area",
        value: "waiting_area",
      },
      {
        label: "WiFi",
        value: "wifi",
      },
      {
        label: "Cafeteria",
        value: "cafeteria",
      },
      {
        label: "Meeting Room",
        value: "meeting_room",
      },
      {
        label: "Reception",
        value: "reception",
      },
    ],
    []
  )
  const timezoneOptions = useMemo(
    () =>
      timezones.map((tz) => ({
        label: `${tz.id} (${tz.utc_offset})`,
        value: tz.id,
      })),
    []
  )
  // GetAllTenents[] is returned directly from the API
  const tenants = Array.isArray(tenantsData) ? tenantsData : []

  const form = useForm<CreateLocationFormValues>({
    resolver: zodResolver(createLocationSchema),
    defaultValues: getLocationDefaultValues(effectiveDefaultTenantId),
  })

  // ── Populate form when editing ─────────────────────────────────────────────

  useEffect(() => {
    if (initialData) {
      const data =
        (initialData as any).result || (initialData as any).data || initialData
      form.reset({
        ...data,
        latitude: data.latitude ?? undefined,
        longitude: data.longitude ?? undefined,
        // Convert API operating hours → form schedule
        operatingHours: apiOperatingHoursToFormSchedule(data.operatingHours),
      })
    } else {
      form.reset(getLocationDefaultValues(effectiveDefaultTenantId))
    }
  }, [initialData, effectiveDefaultTenantId, form])
  useEffect(() => {
    if (isOrgAdmin && effectiveDefaultTenantId) {
      form.setValue("tenantId", Number(effectiveDefaultTenantId))
    }
  }, [isOrgAdmin, effectiveDefaultTenantId, form])
  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (values: CreateLocationFormValues) => {
    const payload: LocationRequest = {
      ...(values as any),
      operatingHours: formScheduleToApiOperatingHours(values.operatingHours),
    }
    await onSubmit(payload)
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <Card className="border border-border/50 bg-background/50 shadow-xl backdrop-blur-sm">
      <CardContent className="px-6 py-5">
        <FormProvider {...form}>
          <form
            id="location-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            {/* ── Organisation & Basic Info ─────────────────────────────── */}
            <Section title="Basic Information">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {!isOrgAdmin && (
                  <FormSelect
                    name="tenantId"
                    label="Tenant"
                    required
                    disabled={isEdit || isLoadingTenants}
                    placeholder={
                      isLoadingTenants ? "Loading tenants..." : "Select tenant"
                    }
                    options={tenants.map((t: any) => ({
                      label: t.name,
                      value: String(t.id),
                    }))}
                  />
                )}

                <FormInput
                  name="name"
                  label="Branch Name"
                  required
                  placeholder="HQ Office"
                />

                <FormInput
                  name="email"
                  label="Email"
                  required
                  placeholder="location@acme.com"
                />

                <div className="sm:col-span-2">
                  <FormTextarea
                    name="description"
                    label="Description"
                    placeholder="A brief description of this location"
                  />
                </div>
              </div>
            </Section>

            {/* ── Contact Numbers ───────────────────────────────────────── */}
            <Section title="Contact Numbers">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <PhoneField
                  form={form}
                  name="frontdeskNumber"
                  label="Front Desk Number"
                  placeholder="Enter front desk number"
                  required
                  defaultCountry="in"
                  preferredCountries={["in"]}
                />

                <FormInput
                  name="tollFreeNumber"
                  label="Toll-Free Number"
                  placeholder="1800-123-456"
                  required
                />
                <PhoneField
                  form={form}
                  name="mobileNumber"
                  label="Mobile Number"
                  placeholder="Enter mobile number"
                  defaultCountry="in"
                  preferredCountries={["in"]}
                />
              </div>
            </Section>

            {/* ── Address ───────────────────────────────────────────────── */}
            <Section title="Address">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <FormInput
                    name="address"
                    label="Street Address"
                    required
                    placeholder="Enter Street Address"
                  />
                </div>

                <FormInput
                  name="city"
                  label="City"
                  required
                  placeholder="Enter City"
                />
                <FormInput
                  name="state"
                  label="State"
                  required
                  placeholder="Enter State"
                />
                <FormInput
                  name="country"
                  label="Country"
                  required
                  placeholder="Enter Country Name"
                />
                <FormInput
                  name="postalCode"
                  label="Postal Code"
                  required
                  placeholder="Enter Postal Code"
                />
              </div>
            </Section>

            {/* ── Geo & Timezone ────────────────────────────────────────── */}
            <Section title="Geo & Timezone">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormInput
                  name="latitude"
                  label="Latitude"
                  type="number"
                  placeholder="28.6139"
                />
                <FormInput
                  name="longitude"
                  label="Longitude"
                  type="number"
                  placeholder="77.2090"
                />
                <FormSelect
                  name="timezone"
                  label="Timezone"
                  required
                  disabled={isEdit}
                  placeholder="Select timezone"
                  options={timezoneOptions}
                />
              </div>
            </Section>

            {/* ── Operating Hours ───────────────────────────────────────── */}
            <Section
              title="Operating Hours"
              icon={<Clock className="h-4 w-4 text-muted-foreground" />}
            >
              <FormOperatingHours />
            </Section>

            {/* ── Metadata ─────────────────────────────────────────────── */}
            <Section title="Facilities & Accessibility">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormCheckbox
                  name="metadata.parking"
                  label="Parking Available"
                  description="This location has on-site parking"
                />
                <FormCheckbox
                  name="metadata.wheelchairAccessible"
                  label="Wheelchair Accessible"
                  description="This location is wheelchair accessible"
                />
                <div className="sm:col-span-2">
                  <FormMultiSelect
                    name="metadata.facilities"
                    label="Facilities"
                    placeholder="Select facilities"
                    options={facilityOptions}
                  />
                </div>
              </div>
            </Section>

            {/* ── Actions Footer ────────────────────────────────────────── */}
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
                  "Update Branch"
                ) : (
                  "Create Branch"
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function Section({
  title,
  icon,
  children,
}: {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <div className="h-px flex-1 bg-border/50" />
      </div>
      {children}
    </div>
  )
}
