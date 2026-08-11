import { baseApi } from "@/store/api/base-api"
import type {
  CreateUserRequestDto,
  GetUserQueryDto,
  UpdateUserRequestDto,
  UserDTO,
} from "@/types/dtos/user.dto"

function getUserQueryParams(params: GetUserQueryDto | void) {
  if (!params) {
    return undefined
  }

  return {
    ...(params.page ? { page: params.page } : {}),
    ...(params.limit ? { limit: params.limit } : {}),
    ...(params.search ? { search: params.search } : {}),
    ...(params.status ? { status: params.status } : {}),
    ...(params.all !== undefined ? { all: params.all } : {}),
    ...(params.tenantId ? { tenantId: params.tenantId } : {}),
  }
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UserDTO[], GetUserQueryDto | void>({
      query: (params) => ({
        url: "/v1/tenant-users/getAll",
        params: getUserQueryParams(params),
      }),
      providesTags: (result) => {
        const usersList = Array.isArray(result)
          ? result
          : Array.isArray((result as any)?.result)
            ? (result as any).result
            : Array.isArray((result as any)?.data)
              ? (result as any).data
              : []

        return [
          { type: "Users", id: "LIST" },
          ...usersList.map((user: any) => ({
            type: "Users" as const,
            id: user.id,
          })),
        ]
      },
    }),
    getUserById: builder.query<UserDTO, number | string>({
      query: (id) => `/v1/tenant-users/getById/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Users", id }],
    }),
    createUser: builder.mutation<UserDTO, CreateUserRequestDto>({
      query: (body) => ({
        url: "/v1/tenant-users/create",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    updateUser: builder.mutation<
      UserDTO,
      { id: number | string; body: UpdateUserRequestDto }
    >({
      query: ({ body, id }) => ({
        url: `/v1/tenant-users/edit/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),

    updateUserStatus: builder.mutation<
      UserDTO,
      { userId: string; status: "Active" | "Inactive" }
    >({
      query: ({ userId, status }) => ({
        url: `/v1/tenant-users/update-status/${userId}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: "Users", id: userId },
        { type: "Users", id: "LIST" },
      ],
    }),

    deleteUser: builder.mutation<void, number | string>({
      query: (id) => ({
        url: `/v1/tenant-users/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
} = userApi
