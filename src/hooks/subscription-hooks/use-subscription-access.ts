"use client"

import { skipToken } from "@reduxjs/toolkit/query"
import * as React from "react"

import { useAuth } from "@/hooks/useAuth"
import { getRolesFromSources } from "@/lib/permissions/role-normalization"
import type { UserRole } from "@/lib/permissions/roles"
import { useGetProfileQuery } from "@/store/api/auth.api"
import { useGetCurrentSubscriptionQuery } from "@/store/api/subscription.api"

import {
  isSubscriptionActive,
  requiresSubscriptionForRoles,
} from "../../lib/utils/subscription-utils/subscription-access"

function haveSameRoles(left: UserRole[], right: UserRole[]) {
  if (left.length !== right.length) {
    return false
  }

  const rightRoles = new Set(right)

  return left.every((role) => rightRoles.has(role))
}

function useSubscriptionAccess({ enabled = true }: { enabled?: boolean } = {}) {
  const { isAuthenticated, roles, token, user } = useAuth()
  const profileQuery = useGetProfileQuery(
    enabled && isAuthenticated && token ? token : skipToken,
    {
      refetchOnMountOrArgChange: true,
    }
  )
  const profile = profileQuery.currentData
  const profileRoles = React.useMemo(
    () => getRolesFromSources(profile?.roles),
    [profile?.roles]
  )
  const resolvedRoles = profileRoles.length ? profileRoles : roles
  const isProfilePending =
    enabled &&
    isAuthenticated &&
    Boolean(token) &&
    !profile &&
    !profileQuery.isError &&
    (profileQuery.isUninitialized ||
      profileQuery.isLoading ||
      profileQuery.isFetching)
  const isProfileRoleSyncPending =
    enabled &&
    isAuthenticated &&
    Boolean(profile) &&
    profileRoles.length > 0 &&
    !haveSameRoles(profileRoles, roles)
  const isProfileDecisionPending = isProfilePending || isProfileRoleSyncPending
  const requiresSubscription =
    enabled &&
    !isProfileDecisionPending &&
    isAuthenticated &&
    requiresSubscriptionForRoles(resolvedRoles)
  const currentSubscriptionQuery = useGetCurrentSubscriptionQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: !requiresSubscription,
  })
  const currentSubscription = currentSubscriptionQuery.currentData
  const isSubscriptionPending =
    requiresSubscription &&
    !currentSubscription &&
    !currentSubscriptionQuery.isError &&
    (currentSubscriptionQuery.isUninitialized ||
      currentSubscriptionQuery.isLoading ||
      currentSubscriptionQuery.isFetching)
  const isPending = isProfileDecisionPending || isSubscriptionPending
  const hasCompletedSubscription =
    !requiresSubscription || isSubscriptionActive(currentSubscription)

  return {
    currentSubscription,
    hasCompletedSubscription,
    isPending,
    profile,
    requiresSubscription,
    roles: resolvedRoles,
    token,
    user,
  }
}

export { useSubscriptionAccess }
