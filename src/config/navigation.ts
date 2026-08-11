import {
  Building2,
  CalendarCheck2,
  Layers,
  LayoutDashboard,
  MapPin,
  Scissors,
  Settings,
  Store,
  UserPlus,
  WalletCards,
  BriefcaseBusiness,
  BookUser,
} from "lucide-react"

import { DASHBOARD_ROUTES } from "@/constants/routes"
import { ROLES, type UserRole } from "@/lib/permissions"
import type { NavigationItem } from "@/types/dtos/navigation.dto"

const operationsRoles = [
  // ROLES.ORGANIZATION_ADMIN,
  ROLES.BRANCH_MANAGER,
  ROLES.STAFF,
]

export const dashboardNavigation: NavigationItem[] = [
  {
    title: "Dashboard",
    href: DASHBOARD_ROUTES.dashboard,
    icon: LayoutDashboard,
  },
  {
    title: "Tenants",
    href: DASHBOARD_ROUTES.organizations,
    icon: Building2,
    roles: [ROLES.SUPER_ADMIN],
  },
  {
    title: "User Levels",
    href: DASHBOARD_ROUTES.tenantUserLevels,
    icon: Layers,
    roles: [ROLES.ORGANIZATION_ADMIN],
  },
  {
    title: "Users",
    href: DASHBOARD_ROUTES.user,
    icon: UserPlus,
    roles: [ROLES.SUPER_ADMIN, ROLES.ORGANIZATION_ADMIN],
  },
  {
    title: "Branches",
    href: DASHBOARD_ROUTES.branchManagement,
    icon: MapPin,
    roles: [ROLES.ORGANIZATION_ADMIN],
  },
  {
    title: "Resources",
    href: DASHBOARD_ROUTES.resources,
    icon: Store,
    roles: [ROLES.ORGANIZATION_ADMIN, ROLES.BRANCH_MANAGER],
  },
  {
    title: "Branch Services",
    href: DASHBOARD_ROUTES.services,
    icon: Scissors,
    roles: [ROLES.ORGANIZATION_ADMIN, ROLES.BRANCH_MANAGER],
  },
  {
    title: "Master Services",
    href: DASHBOARD_ROUTES.masterServices,
    icon: Scissors,
    roles: [ROLES.SUPER_ADMIN],
  },

  {
    title: "Resource Types",
    href: DASHBOARD_ROUTES.resourceTypes,
    icon: Layers,
    roles: [ROLES.SUPER_ADMIN],
  },
  {
    title: "Designations",
    href: DASHBOARD_ROUTES.designations,
    icon: BriefcaseBusiness,
    roles: [ROLES.SUPER_ADMIN],
  },

  {
    title: "Staff Schedules",
    href: DASHBOARD_ROUTES.staffSchedules,
    icon: CalendarCheck2,
    roles: [ROLES.ORGANIZATION_ADMIN, ROLES.BRANCH_MANAGER],
  },
    {
    title: "Customers",
    href: DASHBOARD_ROUTES.customers,
    icon: WalletCards,
    roles: [ROLES.SUPER_ADMIN, ROLES.ORGANIZATION_ADMIN, ROLES.BRANCH_MANAGER, ROLES.STAFF],
  },
  {
    title: "Bookings",
    href: DASHBOARD_ROUTES.bookings,
    icon: BookUser,
    // roles: [ROLES.ORGANIZATION_ADMIN, ROLES.STAFF]
  },
  {
    title: "Settings",
    href: DASHBOARD_ROUTES.settings,
    icon: Settings,
    roles: [ROLES.ORGANIZATION_ADMIN, ROLES.SUPER_ADMIN, ROLES.BRANCH_MANAGER],
  },
]

export function getNavigationForRoles(roles: UserRole[]) {
  return dashboardNavigation.filter((item) => {
    if (!item.roles?.length) {
      return true
    }

    return item.roles.some((role) => roles.includes(role))
  })
}

export function getNavigationForRole(role: UserRole) {
  return getNavigationForRoles([role])
}
