// Types based on Swagger documentation

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: number
    email: string
    fullName: string
    role?: unknown
    roles?: unknown
  }
}

export interface SignupRequest {
  email: string
  password: string
  fullName: string
  phone: string
  dateOfBirth: string
  gender: "male" | "female" | "other"
  roleType: string
  signupType: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface ProfileResponse {
  id: string
  tenantId: string
  email: string
  isPasswordSet: boolean
  tenantUserLevelId: string | null
  profilePic: string | null
  status: string
  bio: string | null
  subscription?: {
    id?: number
    status?: string
    planName?: string
    endDate?: string
    isSubscriptionCancelled?: boolean
  }
  tenant: {
    id: number | string
    name: string
    logo: string | null
    description: string | null
    currencyId: number | string
    languagesSupported: string | null
    website: string | null
    status: string
    createdAt: string
    updatedAt: string
  }
  roles: Array<{
    id: number | string
    name: string
    description: string
    permissions: {
      all: boolean
    }
    createdAt: string
    updatedAt: string
  }>
  tenantName: string
  paymentUrl: string
}
