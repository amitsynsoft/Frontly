"use client"

import * as React from "react"
import { useAuth } from "@/hooks/useAuth"
import { hasSuperAdminRole } from "@/lib/permissions/role-normalization"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"
import { SuperAdminDashboard } from "@/components/dashboard/super-admin-dashboard"

export default function DashboardPage() {
  const { roles } = useAuth()
  const isSuperAdmin = React.useMemo(() => hasSuperAdminRole(roles), [roles])

  if (isSuperAdmin) {
    return <SuperAdminDashboard />
  }

  return <AdminDashboard />
}
