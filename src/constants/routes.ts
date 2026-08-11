export const AUTH_ROUTES = {
  login: "/login",
  register: "/register",
} as const

export const DASHBOARD_ROUTES = {
  dashboard: "/dashboard",
  companyCreation: "/dashboard/company-creation",
  branchCreation: "/dashboard/branch-creation",
  branchManagement: "/dashboard/branches",
  serviceCreation: "/dashboard/service-creation",
  staffCreation: "/dashboard/staff-creation",
  organizations: "/dashboard/organizations",
  user: "/dashboard/user",
  staff: "/dashboard/staff",
  services: "/dashboard/services",
  masterServices: "/dashboard/master-services",
  specialities: "/dashboard/specialities",
  bookings: "/dashboard/bookings",
  customers: "/dashboard/customers",
  analytics: "/dashboard/analytics",
  settings: "/dashboard/settings",
  tenantUserLevels: "/dashboard/tenant-user-levels",
  resourceTypes: "/dashboard/resource-types",
  resources: "/dashboard/resources",
  staffSchedules: "/dashboard/staff-schedules",
  staffScheduleCreate: "/dashboard/staff-schedules/create",
  designations: "/dashboard/designations",
} as const

export const SUBSCRIPTION_ROUTES = {
  onboarding: "/subscription",
  paymentSuccess: "/payment-success",
  paymentCancelled: "/payment-cancelled",
} as const

export const CUSTOMER_ROUTES = {
  services: "/customer/services",
  booking: "/customer/booking",
  checkout: "/customer/checkout",
  profile: "/customer/profile",
  bookings: "/customer/bookings",
} as const
