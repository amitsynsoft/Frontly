"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import * as React from "react"
import { FormProvider, useForm } from "react-hook-form"

import { FormFileUpload } from "@/components/forms/form-file-upload"
import { FormInput } from "@/components/forms/form-input"
import { FormSelect } from "@/components/forms/form-select"
import { FormTextarea } from "@/components/forms/form-textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import { ROLES } from "@/lib/permissions/roles"
import { useGetDesignationsQuery } from "@/store/api/designation.api"
import { useGetRolesQuery } from "@/store/api/roles.api"
import { useGetTenantUserLevelsQuery } from "@/store/api/tenant-user-level.api"
import { useGetCompaniesQuery } from "@/store/api/tenent.api"
import type { UserDTO } from "@/types/dtos/user.dto"

import { getApiList } from "@/hooks/useApiListData"

import {
  getUserDefaultValues,
  toUserPayload,
  userFormSchema,
  type UserFormValues,
} from "./user-form.config"

interface UserFormProps {
  onSubmit: (payload: any) => Promise<void> | void
  user?: UserDTO
  defaultTenantId?: string
  isSubmitting?: boolean
  onCancel: () => void
}

const statusOptions = [
  { label: "Active", value: "Active" },
  { label: "InActive", value: "InActive" },
]

type SelectOption = {
  label: string
  value: string
}

export function UserForm({
  onSubmit,
  user,
  defaultTenantId = "",
  isSubmitting = false,
  onCancel,
}: UserFormProps) {
  const isEdit = !!user
  const { user: currentUser, roles } = useAuth()
  const isOrgAdmin = roles.includes(ROLES.ORGANIZATION_ADMIN)

  const effectiveDefaultTenantId =
    isOrgAdmin && currentUser?.tenantId
      ? String(currentUser.tenantId)
      : defaultTenantId

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema) as any,
    defaultValues: getUserDefaultValues(user, effectiveDefaultTenantId),
  })
  const editUserLevelHydrationKeyRef = React.useRef<string | null>(null)
  const lastLoadedTenantIdRef = React.useRef<string | null>(null)

  // Queries
  const { data: companiesData, isLoading: isLoadingCompanies } =
    useGetCompaniesQuery({ all: true })

  const { data: rolesData, isLoading: isLoadingRoles } = useGetRolesQuery()

  const { data: designationsData, isLoading: isLoadingDesignations } =
    useGetDesignationsQuery({ all: true })

  const selectedTenantId = form.watch("tenantId")
  const selectedRoleId = form.watch("roleId")
  const selectedTenantUserLevelId = form.watch("tenantUserLevelId")
  const hasSelectedTenantId = Boolean(
    selectedTenantId && selectedTenantId !== "null"
  )

  const {
    data: tenantUserLevelsData,
    isFetching: isFetchingLevels,
    isLoading: isLoadingTenantUserLevels,
  } = useGetTenantUserLevelsQuery(
    { tenantId: Number(selectedTenantId), all: true },
    { skip: !hasSelectedTenantId }
  )
  const isLoadingLevels = isLoadingTenantUserLevels || isFetchingLevels

  // Memos / Lists
  const companiesList = React.useMemo(() => {
    return getApiList<any>(companiesData)
  }, [companiesData])

  const companyOptions = React.useMemo(() => {
    return companiesList.map((c: any) => ({
      label: c.name,
      value: String(c.id),
    }))
  }, [companiesList])

  const designationsList = React.useMemo(() => {
    return getApiList<any>(designationsData)
  }, [designationsData])

  const designationOptions = React.useMemo(() => {
    return designationsList.map((d: any) => ({
      label: d.name,
      value: String(d.id),
    }))
  }, [designationsList])

  const rolesList = React.useMemo(() => {
    return getApiList<any>(rolesData)
  }, [rolesData])

  const roleOptions = React.useMemo(() => {
    return rolesList
      .filter((r: any) => {
        const name = (r.name || "").trim().toLowerCase()
        const isSuper =
          name === "super_admin" ||
          name === "superadmin" ||
          name.includes("super")
        if (isSuper) return false

        if (isOrgAdmin) {
          const isTenantAdmin =
            name === "tenant_admin" ||
            name === "tenantadmin" ||
            name === "organization_admin" ||
            name === "organizationadmin" ||
            name === "admin"
          if (isTenantAdmin) return false
        }

        return true
      })
      .map((r: any) => ({
        label: r.name,
        value: String(r.id),
      }))
  }, [rolesList, isOrgAdmin])

  const staffRole = React.useMemo(() => {
    return rolesList.find((r: any) => {
      const name = (r.name || "").trim().toLowerCase()
      return name === "staff"
    })
  }, [rolesList])

  const selectedRole = React.useMemo(() => {
    return rolesList.find((r: any) => String(r.id) === selectedRoleId)
  }, [rolesList, selectedRoleId])

  const isSelectedRoleLoading =
    Boolean(selectedRoleId) && isLoadingRoles && !selectedRole

  const selectedRoleName = React.useMemo(() => {
    return selectedRole ? (selectedRole.name || "").trim().toUpperCase() : ""
  }, [selectedRole])

  const isStaff = selectedRoleName === "STAFF"

  const tenantUserLevelsList = React.useMemo(() => {
    return getApiList<any>(tenantUserLevelsData)
  }, [tenantUserLevelsData])

  const levelOptions = React.useMemo<SelectOption[]>(() => {
    return tenantUserLevelsList.map((lvl: any) => ({
      label: lvl.level,
      value: String(lvl.id),
    }))
  }, [tenantUserLevelsList])

  const levelOptionsWithSelectedValue = React.useMemo<SelectOption[]>(() => {
    if (!selectedTenantUserLevelId) return levelOptions

    const hasSelectedOption = levelOptions.some(
      (option) => String(option.value) === String(selectedTenantUserLevelId)
    )

    if (hasSelectedOption) return levelOptions

    return [
      {
        label: isLoadingLevels
          ? "Loading selected level..."
          : "Selected level unavailable",
        value: String(selectedTenantUserLevelId),
      },
      ...levelOptions,
    ]
  }, [isLoadingLevels, levelOptions, selectedTenantUserLevelId])

  const shouldShowUserLevelField =
    isStaff ||
    (isEdit && Boolean(user?.tenantUserLevelId) && isSelectedRoleLoading)

  const userLevelPlaceholder = React.useMemo(() => {
    if (!hasSelectedTenantId) return "Select tenant first"
    if (isSelectedRoleLoading) return "Loading role..."
    if (isLoadingLevels) return "Loading levels..."
    if (levelOptions.length === 0) return "No levels found"
    return "Select level"
  }, [
    hasSelectedTenantId,
    isLoadingLevels,
    isSelectedRoleLoading,
    levelOptions.length,
  ])

  const isUserLevelDisabled =
    !hasSelectedTenantId ||
    isSelectedRoleLoading ||
    isLoadingLevels ||
    levelOptions.length === 0

  const isWaitingForUserLevel =
    shouldShowUserLevelField && (isSelectedRoleLoading || isLoadingLevels)

  // Effects
  // Reset form when user changes
  React.useEffect(() => {
    const defaultValues = getUserDefaultValues(user, effectiveDefaultTenantId)
    editUserLevelHydrationKeyRef.current = null
    lastLoadedTenantIdRef.current = defaultValues.tenantId || null
    form.reset(defaultValues)
  }, [user, effectiveDefaultTenantId, form])

  React.useEffect(() => {
    if (isOrgAdmin && effectiveDefaultTenantId) {
      form.setValue("tenantId", effectiveDefaultTenantId)
    }
  }, [isOrgAdmin, effectiveDefaultTenantId, form])

  React.useEffect(() => {
    if (isOrgAdmin && !isEdit && staffRole && !form.getValues("roleId")) {
      form.setValue("roleId", String(staffRole.id))
    }
  }, [isOrgAdmin, isEdit, staffRole, form])

  React.useEffect(() => {
    if (
      !selectedTenantId ||
      selectedTenantId === lastLoadedTenantIdRef.current
    ) {
      return
    }

    if (!isEdit) {
      form.setValue("tenantUserLevelId", "")
    }
    lastLoadedTenantIdRef.current = selectedTenantId
  }, [selectedTenantId, isEdit, form])

  React.useEffect(() => {
    if (!selectedRoleId || !selectedRole) {
      return
    }

    if (!isStaff) {
      form.setValue("tenantUserLevelId", "")
    }
  }, [selectedRoleId, selectedRole, isStaff, form])

  React.useEffect(() => {
    if (!isEdit || !user?.tenantUserLevelId || !isStaff || isLoadingLevels) {
      return
    }

    const defaultLevelId = String(user.tenantUserLevelId)
    const hydrationKey = `${user.id}:${defaultLevelId}`

    if (editUserLevelHydrationKeyRef.current === hydrationKey) {
      return
    }

    const hasDefaultLevelOption = levelOptions.some(
      (option) => String(option.value) === defaultLevelId
    )

    if (!hasDefaultLevelOption) {
      return
    }

    form.setValue("tenantUserLevelId", defaultLevelId, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    })
    editUserLevelHydrationKeyRef.current = hydrationKey
  }, [
    form,
    isEdit,
    isLoadingLevels,
    isStaff,
    levelOptions,
    user?.id,
    user?.tenantUserLevelId,
  ])

  const handleSubmit = async (values: UserFormValues) => {
    if (isLoadingRoles || isWaitingForUserLevel) {
      return
    }

    if (isStaff && !values.tenantUserLevelId) {
      form.setError("tenantUserLevelId", {
        type: "required",
        message: "User Level is required",
      })
      return
    }
    await onSubmit(toUserPayload(values, isEdit))
  }

  return (
    <Card className="border border-border/50 bg-background/50 shadow-xl backdrop-blur-sm">
      <CardContent className="px-6 py-5">
        <FormProvider {...form}>
          <form
            id={isEdit ? "edit-user-form" : "add-user-form"}
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormSelect
                name="roleId"
                label="Role"
                required
                placeholder={
                  isLoadingRoles ? "Loading roles..." : "Select role"
                }
                disabled={isEdit || isLoadingRoles}
                options={roleOptions}
              />

              {!isOrgAdmin && (
                <FormSelect
                  name="tenantId"
                  label="Tenant"
                  required
                  placeholder={
                    isLoadingCompanies ? "Loading tenants..." : "Select tenant"
                  }
                  disabled={isEdit || isLoadingCompanies}
                  options={companyOptions}
                />
              )}
              <FormInput
                name="email"
                label="Email"
                required
                type="email"
                placeholder="user@example.com"
                autoComplete="email"
              />

              <FormInput
                name="fullName"
                label="Full Name"
                required
                placeholder="User Name"
              />

              <FormSelect
                name="tenantUserDesignationId"
                label="Designation"
                required
                placeholder={
                  isLoadingDesignations
                    ? "Loading designations..."
                    : "Select designation"
                }
                options={designationOptions}
                disabled={isLoadingDesignations}
              />

              {shouldShowUserLevelField && (
                <FormSelect
                  name="tenantUserLevelId"
                  label="User Level"
                  required
                  placeholder={userLevelPlaceholder}
                  options={levelOptionsWithSelectedValue}
                  disabled={isUserLevelDisabled}
                />
              )}

              <FormFileUpload
                name="profilePic"
                label="Profile Image"
                acceptedFileTypes={["image/*"]}
                maxSizeMB={3}
                placeholder="Upload profile image"
                uploadType="profile"
              />

              {isEdit && (
                <FormSelect
                  name="status"
                  label="User Status"
                  required
                  placeholder="Select status"
                  options={statusOptions}
                />
              )}

              <div className="col-span-full">
                <FormTextarea
                  name="bio"
                  label="Bio"
                  placeholder="A short biography of the user..."
                />
              </div>
            </div>

            {/* Actions Footer */}
            <div className="mt-6 flex items-center justify-end gap-2 border-t border-border/50 pt-5">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  isLoadingRoles ||
                  isWaitingForUserLevel ||
                  isLoadingDesignations
                }
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving...
                  </span>
                ) : isEdit ? (
                  "Update User"
                ) : (
                  "Create User"
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}
