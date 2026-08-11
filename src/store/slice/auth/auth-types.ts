import type { UserRole } from "@/lib/permissions"

export type AuthUser = {
  id: string
  name: string
  email: string
  role: UserRole
  organizationId?: string
  branchId?: string
}

export type AuthSession = {
  user: AuthUser
  organizationId?: string
  branchId?: string
}

export type AuthState = {
  session: AuthSession | null
  accessToken: string | null
  refreshToken: string | null
  status: "idle" | "authenticated" | "unauthenticated"
}

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  businessName: string
  name: string
  email: string
  password: string
}
