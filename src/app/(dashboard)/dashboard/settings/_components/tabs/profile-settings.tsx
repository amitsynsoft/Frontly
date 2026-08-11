"use client"

import { skipToken } from "@reduxjs/toolkit/query"
import { toast } from "sonner"

import { CompanyForm } from "@/app/(dashboard)/dashboard/organizations/_components/company-form"
import { useAuth } from "@/hooks/useAuth"
import { ROLES } from "@/lib/permissions/roles"
import { useGetProfileQuery } from "@/store/api/auth.api"
import {
  useGetCompanyByIdQuery,
  useUpdateCompanyMutation,
} from "@/store/api/tenent.api"
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "@/store/api/user.api"
import { useAppSelector } from "@/store/hooks"
import type { TenantRequest } from "@/types/dtos/tenent.dto"

import { ProfileForm } from "../profile-form/profile-form"
import type { ProfileFormValues } from "../profile-form"

export function ProfileSettings() {
  const { user, primaryRole } = useAuth()
  const token = useAppSelector((state) => state.user.token)

  const isOrgAdmin = primaryRole === ROLES.ORGANIZATION_ADMIN
  const userId = user?.id
  const tenantId = user?.tenantId

  // Fetch full user details
  const {
    data: userDetails,
    isLoading: isUserLoading,
    refetch: refetchUser,
  } = useGetUserByIdQuery(userId ?? skipToken, {
    refetchOnMountOrArgChange: true,
  })
  const userData =
    (userDetails as any)?.result || (userDetails as any)?.data || userDetails

  // Fetch company details (only if orgAdmin)
  const {
    data: companyDetails,
    isLoading: isCompanyLoading,
    refetch: refetchCompany,
  } = useGetCompanyByIdQuery(isOrgAdmin && tenantId ? tenantId : skipToken, {
    refetchOnMountOrArgChange: true,
  })
  const companyData =
    (companyDetails as any)?.result ||
    (companyDetails as any)?.data ||
    companyDetails

  // Fetch base profile to trigger theme/state update
  const { refetch: refetchProfile } = useGetProfileQuery(token ?? skipToken)

  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation()
  const [updateCompany, { isLoading: isUpdatingCompany }] =
    useUpdateCompanyMutation()

  const handleProfileSubmit = async (values: ProfileFormValues) => {
    if (!userId || !userData) return

    try {
      const payload: any = {
        tenantId: Number(userData.tenantId),
        email: userData.email,
        fullName: values.fullName.trim(),
        profilePic: values.profilePic || "",
        bio: values.bio || "",
        roleId: userData.roles?.[0]?.id ? Number(userData.roles[0].id) : 0,
        status: userData.status ?? "Active",
      }

      if (userData.tenantUserLevelId) {
        payload.tenantUserLevelId = Number(userData.tenantUserLevelId)
      }
      if (userData.tenantUserDesignationId) {
        payload.tenantUserDesignationId = Number(
          userData.tenantUserDesignationId
        )
      }

      await updateUser({ id: userId, body: payload }).unwrap()
      refetchUser()
      refetchProfile()
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.message || "Failed to update profile"
      console.log(msg)
    }
  }

  const handleCompanySubmit = async (values: TenantRequest) => {
    if (!tenantId) return

    try {
      await updateCompany({ id: String(tenantId), body: values }).unwrap()
      refetchCompany()
      refetchProfile()
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.message ||
        "Failed to update organization settings"
      toast.error(msg)
    }
  }

  return (
    <div className="mt-6 max-w-4xl space-y-8">
      {/* Profile settings card */}
      <ProfileForm
        user={userData}
        isLoading={isUserLoading}
        isSaving={isUpdatingUser}
        onSubmit={handleProfileSubmit}
      />

      {/* Organization settings card (visible to orgAdmin only) */}
      {isOrgAdmin && (
        <div className="space-y-4">
          {isCompanyLoading ? (
            <div className="flex h-40 animate-pulse items-center justify-center rounded-lg border border-border/50 bg-background/50">
              <span className="text-sm text-muted-foreground">
                Loading organization details...
              </span>
            </div>
          ) : (
            <CompanyForm
              title="Organization Settings"
              description="Manage your organization registry profile, theme brand name, and global settings."
              initialData={companyData}
              onSubmit={handleCompanySubmit}
              isLoading={isUpdatingCompany}
              onCancel={() => refetchCompany()}
            />
          )}
        </div>
      )}
    </div>
  )
}
