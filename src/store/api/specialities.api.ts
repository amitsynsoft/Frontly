import { baseApi } from "@/store/api/base-api"
import type {
  CreateSpecialityRequestDto,
  GetSpecialityQueryDto,
  SpecialityDto,
} from "@/types/dtos/speciality.dto"

function getSpecialitiesQueryParams(params: GetSpecialityQueryDto | void) {
  if (!params) {
    return undefined
  }

  return {
    ...(params.page ? { page: params.page } : {}),
    ...(params.limit ? { limit: params.limit } : {}),
    ...(params.search ? { search: params.search } : {}),
    ...(params.status ? { status: params.status } : {}),
    ...(params.all !== undefined ? { all: params.all } : {}),
  }
}

export const specialityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSpecialities: builder.query<
      SpecialityDto[],
      GetSpecialityQueryDto | void
    >({
      query: (params) => ({
        url: "/v1/specialities",
        params: getSpecialitiesQueryParams(params),
      }),
      providesTags: (result) => {
        const specialitiesList = Array.isArray(result)
          ? result
          : Array.isArray((result as any)?.result)
            ? (result as any).result
            : Array.isArray((result as any)?.data)
              ? (result as any).data
              : []

        return [
          { type: "Speciality", id: "LIST" },
          ...specialitiesList.map((speciality: any) => ({
            type: "Speciality" as const,
            id: speciality.id,
          })),
        ]
      },
    }),

    getSpecialityById: builder.query<SpecialityDto, number | string>({
      query: (id) => `/v1/specialities/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Speciality", id }],
    }),

    createSpeciality: builder.mutation<
      SpecialityDto,
      CreateSpecialityRequestDto
    >({
      query: (body) => ({
        url: "/v1/specialities",
        method: "POST",
        body,
        headers: { hideSuccessToast: "true" },
      }),
      invalidatesTags: [{ type: "Speciality", id: "LIST" }],
    }),

    updateSpeciality: builder.mutation<
      SpecialityDto,
      { id: number | string; body: CreateSpecialityRequestDto }
    >({
      query: ({ body, id }) => ({
        url: `/v1/specialities/${id}`,
        method: "PUT",
        body,
        headers: { hideSuccessToast: "true" },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Speciality", id },
        { type: "Speciality", id: "LIST" },
      ],
    }),
    deleteSpeciality: builder.mutation<void, number | string>({
      query: (id) => ({
        url: `/v1/specialities/${id}`,
        method: "DELETE",
        headers: { hideSuccessToast: "true" },
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Speciality", id },
        { type: "Speciality", id: "LIST" },
      ],
    }),
  }),
})

export const {
  useCreateSpecialityMutation,
  useDeleteSpecialityMutation,
  useGetSpecialityByIdQuery,
  useGetSpecialitiesQuery,
  useUpdateSpecialityMutation,
} = specialityApi
