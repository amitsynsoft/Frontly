import { baseApi } from "@/store/api/base-api"
import {
  AdminDashboardDTO,
  GetAdminDashboardQueryDto,
  SuperAdminDashboardDTO,
} from "@/types/dtos/dashboard.dto"

function getDashboardQueryParams(params: GetAdminDashboardQueryDto | void) {
  if (!params) {
    return undefined
  }

  return {
    ...(params.tenantId ? { tenantId: params.tenantId } : {}),
    ...(params.branchId ? { branchId: params.branchId } : {}),
    ...(params.startDate ? { startDate: params.startDate } : {}),
    ...(params.endDate ? { endDate: params.endDate } : {}),
  }
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboard: builder.query<
      AdminDashboardDTO,
      GetAdminDashboardQueryDto | void
    >({
      query: (params) => ({
        url: "/v1/analytics/dashboard",
        params: getDashboardQueryParams(params),
      }),
    }),

    getSuperAdminDashboard: builder.query<SuperAdminDashboardDTO, void>({
      query: () => ({
        url: "/v1/analytics/superadmin/dashboard",
      }),
    }),
  }),
})

export const {
  useGetAdminDashboardQuery,
  useLazyGetAdminDashboardQuery,
  useGetSuperAdminDashboardQuery,
  useLazyGetSuperAdminDashboardQuery,
} = dashboardApi
