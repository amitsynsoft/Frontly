import { baseApi } from "@/store/api/base-api"
import type {
  CreateRoleRequestDto,
  GetRoleQueryDto,
  RoleDto,
} from "@/types/dtos/role.dto"

// function getRolesQueryParams(params: GetRoleQueryDto | void) {
//   if (!params) {
//     return undefined
//   }

//   return {
//     ...(params.page ? { page: params.page } : {}),
//     ...(params.limit ? { limit: params.limit } : {}),
//     ...(params.search ? { search: params.search } : {}),
//     ...(params.status ? { status: params.status } : {}),
//     ...(params.all !== undefined ? { all: params.all } : {}),
//   }
// }

export const rolesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<RoleDto[], GetRoleQueryDto | void>({
      query: () => ({
        url: "/v1/roles",
        // params: getSpecialitiesQueryParams(params),
      }),
      providesTags: [{ type: "Role", id: "LIST" }],
    }),

    createRole: builder.mutation<RoleDto, CreateRoleRequestDto>({
      query: (body) => ({
        url: "/v1/roles",
        method: "POST",
        body,
        headers: { hideSuccessToast: "true" },
      }),
      invalidatesTags: [{ type: "Role", id: "LIST" }],
    }),
  }),
})

export const { useCreateRoleMutation, useGetRolesQuery } = rolesApi
