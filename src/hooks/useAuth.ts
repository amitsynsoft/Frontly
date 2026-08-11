"use client"

import { useMemo } from "react"

import { hasSuperAdminRole } from "@/lib/permissions/role-normalization"
import { ROLES, type UserRole } from "@/lib/permissions/roles"
import { useTenantTheme } from "@/providers/theme-provider"
import { api } from "@/store/api/api.config"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import type { StoredUser } from "@/store/slice/user/user.slice"
import {
  logout as logoutAction,
  setUser as setUserAction,
} from "@/store/slice/user/user.slice"

const roleAliases: Record<string, UserRole> = {
  ADMIN: ROLES.ORGANIZATION_ADMIN,
  BRANCHMANAGER: ROLES.BRANCH_MANAGER,
  BRANCH_MANAGER: ROLES.BRANCH_MANAGER,
  COMPANYADMIN: ROLES.ORGANIZATION_ADMIN,
  COMPANY_ADMIN: ROLES.ORGANIZATION_ADMIN,
  CUSTOMER: ROLES.CUSTOMER,
  ORGANIZATIONADMIN: ROLES.ORGANIZATION_ADMIN,
  ORGANIZATION_ADMIN: ROLES.ORGANIZATION_ADMIN,
  STAFF: ROLES.STAFF,
  SUPERADMIN: ROLES.SUPER_ADMIN,
  SUPER_ADMIN: ROLES.SUPER_ADMIN,
  TENANTADMIN: ROLES.ORGANIZATION_ADMIN,
  TENANT_ADMIN: ROLES.ORGANIZATION_ADMIN,
}

function readRoleValue(value: unknown): string | null {
  if (typeof value === "string") {
    return value
  }

  if (value && typeof value === "object") {
    const roleRecord = value as Record<string, unknown>

    return (
      readRoleValue(roleRecord.roleName) ??
      readRoleValue(roleRecord.name) ??
      readRoleValue(roleRecord.role)
    )
  }

  return null
}

function normalizeRole(value: unknown): UserRole | null {
  const role = readRoleValue(value)

  if (!role) {
    return null
  }

  const normalized = role
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_")
  const compact = normalized.replace(/_/g, "")

  return roleAliases[normalized] ?? roleAliases[compact] ?? null
}

function getRolesFromUser(user: StoredUser | null): UserRole[] {
  if (!user) {
    return []
  }

  const rawRoles = [
    ...(Array.isArray(user.roles) ? user.roles : [user.roles]),
    ...(Array.isArray(user.role) ? user.role : [user.role]),
  ]

  return Array.from(
    new Set(
      rawRoles.map(normalizeRole).filter((role): role is UserRole => !!role)
    )
  )
}

function getDisplayName(user: StoredUser | null) {
  return user?.fullName ?? user?.name ?? user?.email ?? "User"
}

export function useAuth() {
  const dispatch = useAppDispatch()
  const { resetTenantTheme } = useTenantTheme()
  const { user, token, isAuthenticated } = useAppSelector((state) => state.user)
  const roles = useMemo(() => getRolesFromUser(user), [user])
  const primaryRole = roles[0] ?? null
  const displayName = useMemo(() => getDisplayName(user), [user])

  const logout = () => {
    dispatch(logoutAction())
    dispatch(api.util.resetApiState())
    resetTenantTheme()
  }

  const setUser = (user: StoredUser, token: string) => {
    dispatch(api.util.resetApiState())
    if (hasSuperAdminRole(user.roles, user.role)) {
      resetTenantTheme()
    }
    dispatch(setUserAction({ user, token }))
  }

  const hasRole = (role: UserRole) => roles.includes(role)

  return {
    displayName,
    hasRole,
    user,
    token,
    isAuthenticated,
    logout,
    primaryRole,
    roles,
    setUser,
  }
}
