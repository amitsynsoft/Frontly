import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { serializeRoles } from "@/lib/permissions/role-normalization"
import type { ProfileResponse } from "@/types/dtos/auth.dto"
import { getCookie, removeCookie, setCookie } from "@/lib/utils/cookie.util"

export type StoredUser = {
  id?: number | string
  email?: string
  fullName?: string
  name?: string
  profilePic?: string | null
  role?: unknown
  roles?: unknown
  tenant?: ProfileResponse["tenant"] | null
  tenantId?: number | string
  tenantLogo?: string | null
  tenantName?: string
  tenantUserLevelId?: number | string | null
  organizationId?: string
  branchId?: string
  [key: string]: unknown
}

interface UserState {
  user: StoredUser | null
  token: string | null
  isAuthenticated: boolean
}

const getUserFromStorage = (): StoredUser | null => {
  if (typeof window !== "undefined") {
    try {
      const userStr = localStorage.getItem("user")
      const parsed: unknown = userStr ? JSON.parse(userStr) : null

      return parsed && typeof parsed === "object"
        ? (parsed as StoredUser)
        : null
    } catch {
      localStorage.removeItem("user")
      return null
    }
  }
  return null
}

const getTokenFromCookie = (): string | null => {
  if (typeof window !== "undefined") {
    return getCookie("token") || null
  }
  return null
}

const readString = (
  source: Record<string, unknown>,
  ...keys: string[]
): string | undefined => {
  for (const key of keys) {
    const value = source[key]

    if (typeof value === "string" && value.trim()) {
      return value
    }
  }

  return undefined
}

const toStringId = (value: number | string | null | undefined) =>
  value === null || value === undefined ? undefined : String(value)

const hasOwnKey = (source: Record<string, unknown>, key: string) =>
  Object.prototype.hasOwnProperty.call(source, key)

const normalizeProfilePic = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null
  }

  const trimmed = value.trim()

  if (!trimmed || trimmed === "null" || trimmed === "undefined") {
    return null
  }

  return trimmed
}

const persistUser = (user: StoredUser) => {
  localStorage.setItem("user", JSON.stringify(user))

  const roleCookieValue = serializeRoles(user.roles, user.role)

  if (roleCookieValue) {
    setCookie("user_role", roleCookieValue, 7)
  } else {
    removeCookie("user_role")
  }
}

const normalizeStoredUser = (user: StoredUser): StoredUser => ({
  ...user,
  profilePic: normalizeProfilePic(user.profilePic),
})

const mergeProfileIntoUser = (
  profile: ProfileResponse,
  currentUser: StoredUser | null
): StoredUser => {
  const profileRecord = profile as unknown as Record<string, unknown>
  const tenant = profile.tenant ?? currentUser?.tenant ?? null
  const tenantId = profile.tenantId ?? tenant?.id ?? currentUser?.tenantId
  const tenantName =
    readString(profileRecord, "tenantName") ??
    tenant?.name ??
    currentUser?.tenantName
  const tenantLogo = tenant?.logo ?? currentUser?.tenantLogo ?? null
  const fullName =
    readString(profileRecord, "fullName", "name", "username") ??
    currentUser?.fullName ??
    currentUser?.name
  const profilePic = hasOwnKey(profileRecord, "profilePic")
    ? normalizeProfilePic(profile.profilePic)
    : (normalizeProfilePic(readString(profileRecord, "avatarUrl", "avatar")) ??
      normalizeProfilePic(currentUser?.profilePic))
  const roles = profile.roles?.length ? profile.roles : currentUser?.roles

  return {
    ...currentUser,
    ...profile,
    id: profile.id ?? currentUser?.id,
    email: profile.email ?? currentUser?.email,
    fullName,
    name: fullName ?? currentUser?.name,
    organizationId: toStringId(tenantId) ?? currentUser?.organizationId,
    profilePic,
    role: roles ?? currentUser?.role,
    roles,
    tenant,
    tenantId,
    tenantLogo,
    tenantName,
  }
}

const initialState: UserState = {
  user: getUserFromStorage(),
  token: getTokenFromCookie(),
  isAuthenticated: !!getTokenFromCookie(),
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ user: StoredUser; token: string }>
    ) => {
      const user = normalizeStoredUser(action.payload.user)

      state.user = user
      state.token = action.payload.token
      state.isAuthenticated = true

      setCookie("token", action.payload.token, 7)
      persistUser(user)
    },
    setProfile: (state, action: PayloadAction<ProfileResponse>) => {
      if (!state.token) {
        return
      }

      const profileUser = mergeProfileIntoUser(action.payload, state.user)

      state.user = profileUser
      state.isAuthenticated = !!state.token

      persistUser(profileUser)
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false

      removeCookie("token")
      removeCookie("user_role")
      localStorage.removeItem("user")
    },
  },
})

export const { logout, setProfile, setUser } = userSlice.actions
export default userSlice.reducer
