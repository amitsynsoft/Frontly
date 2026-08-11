"use client"

import { skipToken } from "@reduxjs/toolkit/query"
import * as React from "react"

import { defaultTenantTheme, normalizeTenantLogo } from "@/config/theme"
import { hasSuperAdminRole } from "@/lib/permissions/role-normalization"
import { useTenantTheme } from "@/providers/theme-provider"
import { useGetProfileQuery } from "@/store/api/auth.api"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
  logout as logoutAction,
  setProfile,
} from "@/store/slice/user/user.slice"

function getErrorStatus(error: unknown) {
  if (!error || typeof error !== "object" || !("status" in error)) {
    return null
  }

  return String((error as { status: unknown }).status)
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const token = useAppSelector((state) => state.user.token)
  const currentUser = useAppSelector((state) => state.user.user)
  const { resetTenantTheme, tenantTheme, updateTenantTheme } = useTenantTheme()
  const {
    currentData: profile,
    error,
    isError,
  } = useGetProfileQuery(token ?? skipToken, {
    refetchOnMountOrArgChange: true,
  })

  React.useEffect(() => {
    if (!token) {
      resetTenantTheme()
    }
  }, [resetTenantTheme, token])

  React.useEffect(() => {
    if (!profile || !token) {
      return
    }

    dispatch(setProfile(profile))
  }, [dispatch, profile, token])

  React.useEffect(() => {
    if (!profile || !token) {
      return
    }

    const isSuperAdmin = hasSuperAdminRole(
      profile.roles,
      currentUser?.roles,
      currentUser?.role
    )

    if (isSuperAdmin) {
      const themeUpdate: Parameters<typeof updateTenantTheme>[0] = {}

      if (tenantTheme.brandName !== defaultTenantTheme.brandName) {
        themeUpdate.brandName = defaultTenantTheme.brandName
      }

      if (tenantTheme.logo !== defaultTenantTheme.logo) {
        themeUpdate.logo = defaultTenantTheme.logo
      }

      if (Object.keys(themeUpdate).length) {
        updateTenantTheme(themeUpdate)
      }

      return
    }

    const brandName = profile.tenant?.name || profile.tenantName
    const logo = normalizeTenantLogo(profile.tenant?.logo)
    const themeUpdate: Parameters<typeof updateTenantTheme>[0] = {}

    if (brandName && brandName !== tenantTheme.brandName) {
      themeUpdate.brandName = brandName
    }

    if (logo !== tenantTheme.logo) {
      themeUpdate.logo = logo
    }

    if (Object.keys(themeUpdate).length) {
      updateTenantTheme(themeUpdate)
    }
  }, [
    currentUser?.role,
    currentUser?.roles,
    profile,
    tenantTheme.brandName,
    tenantTheme.logo,
    token,
    updateTenantTheme,
  ])

  React.useEffect(() => {
    const status = getErrorStatus(error)

    if (isError && (status === "401" || status === "403")) {
      dispatch(logoutAction())
      resetTenantTheme()
    }
  }, [dispatch, error, isError, resetTenantTheme])

  return <>{children}</>
}

export { AuthProvider }
