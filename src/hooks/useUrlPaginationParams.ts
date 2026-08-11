"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import * as React from "react"

import {
  DEFAULT_PAGINATION_PARAMS,
  type PaginationParams,
} from "@/types/dtos/api.dto"

function readNumberParam(
  searchParams: { get: (key: string) => string | null },
  key: string,
  fallback: number
) {
  const value = Number(searchParams.get(key))
  return Number.isFinite(value) && value > 0 ? value : fallback
}

export function readPaginationParamsFromSearch(searchParams: {
  get: (key: string) => string | null
}) {
  return {
    page: readNumberParam(searchParams, "page", DEFAULT_PAGINATION_PARAMS.page),
    limit: readNumberParam(
      searchParams,
      "limit",
      DEFAULT_PAGINATION_PARAMS.limit
    ),
    search: searchParams.get("search") ?? DEFAULT_PAGINATION_PARAMS.search,
    status: searchParams.get("status") ?? DEFAULT_PAGINATION_PARAMS.status,
    all: searchParams.get("all")?.toLowerCase() === "true",
  } satisfies PaginationParams
}

export function useUrlPaginationParams() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const params = React.useMemo(() => {
    return readPaginationParamsFromSearch(searchParams)
  }, [searchParams])

  const setParams = React.useCallback(
    (
      updater:
        | Partial<PaginationParams>
        | ((current: PaginationParams) => Partial<PaginationParams>)
    ) => {
      const nextParams =
        typeof updater === "function" ? updater(params) : updater
      const newParams = { ...params, ...nextParams }

      const current = new URLSearchParams(Array.from(searchParams.entries()))

      Object.entries(newParams).forEach(([key, value]) => {
        if (
          value === undefined ||
          value === null ||
          value === "" ||
          (key === "all" && !value)
        ) {
          current.delete(key)
        } else {
          current.set(key, String(value))
        }
      })

      const search = current.toString()
      const query = search ? `?${search}` : ""
      router.push(`${pathname}${query}`)
    },
    [router, pathname, searchParams, params]
  )

  return [params, setParams] as const
}
