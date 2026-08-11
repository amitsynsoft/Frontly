import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import { getCookie } from "@/lib/utils/cookie.util"

import { RootState } from "../store"

export const api = createApi({
  reducerPath: "apis",
  tagTypes: [
    "Orders",
    "Users",
    "Roles",
    "Permissions",
    "Tariffs",
    "Zones",
    "Routes",
    "Dashboard",
    "Template",
    "Bookings",
    "Branches",
    "Customers",
    "Organizations",
    "Services",
    "BranchServices",
    "Settings",
    "Staff",
    "Subscriptions",
    "Auth",
    "Analytics",
    "Speciality",
    "Locations",
    "Currencies",
    "Role",
    "TenantUserLevel",
    "Resources",
    "ResourceTypes",
    "StaffServices",
    "StaffSchedule",
    "Designations",
    "CustomerBookings",
  ],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState

      if (getCookie("token"))
        headers.set("Authorization", `Bearer ${getCookie("token")}`)
      headers.set("accept", "application/json")
      return headers
    },
  }),
  endpoints: () => ({}),
})
