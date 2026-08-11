import { ROLES, type UserRole } from "@/lib/permissions/roles"

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

export function normalizeRole(value: unknown): UserRole | null {
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

export function getRolesFromSources(...sources: unknown[]): UserRole[] {
  const rawRoles = sources.flatMap((source) =>
    Array.isArray(source) ? source : [source]
  )

  return Array.from(
    new Set(
      rawRoles.map(normalizeRole).filter((role): role is UserRole => !!role)
    )
  )
}

export function hasSuperAdminRole(...sources: unknown[]) {
  return getRolesFromSources(...sources).includes(ROLES.SUPER_ADMIN)
}

export function serializeRoles(...sources: unknown[]) {
  return getRolesFromSources(...sources).join(",")
}
