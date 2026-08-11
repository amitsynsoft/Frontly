import { ROLES, type UserRole } from "@/lib/permissions/roles"
import type { CurrentSubscriptionDTO } from "@/types/dtos/subscription.dto"

const subscribedStatuses = new Set(["active", "trialing"])

export function requiresSubscriptionForRoles(roles: UserRole[]) {
  return roles.includes(ROLES.ORGANIZATION_ADMIN)
}

export function isSubscriptionActive(
  subscription: CurrentSubscriptionDTO | null | undefined
) {
  if (!subscription) {
    return false
  }

  // Check standard active flags/statuses first
  if (subscription.isActive === true) {
    return true
  }

  const status = subscription.status?.trim().toLowerCase()
  if (status && subscribedStatuses.has(status)) {
    return true
  }

  // Check if current date has crossed the subscription's end date
  if (subscription.endDate) {
    const endDate = new Date(subscription.endDate)
    const now = new Date()
    if (now > endDate) {
      return false
    }
  }

  // If the end date has not been crossed and the subscription exists,
  // we treat it as active (handles cases where cancelledAt is null/active
  // or cancelledAt has a date but end date is in the future).
  if (subscription.endDate) {
    return true
  }

  return false
}

