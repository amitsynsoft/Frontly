import { Currency } from "@/types/dtos/currency.dto"

import { api } from "./api.config"

type GetCurrenciesParams = {
  page?: number
  limit?: number
  search?: string
  all?: boolean
}

export const currencyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCurrencies: builder.query<Currency[], GetCurrenciesParams | void>({
      query: (params) => ({
        url: `/v1/currencies`,
        method: "GET",
        params: {
          ...(params?.page ? { page: params.page } : {}),
          ...(params?.limit ? { limit: params.limit } : {}),
          ...(params?.search ? { search: params.search } : {}),
          ...(params?.all !== undefined ? { all: params.all } : {}),
        },
      }),
      providesTags: ["Currencies"],
    }),
  }),
})

export const { useGetCurrenciesQuery } = currencyApi
