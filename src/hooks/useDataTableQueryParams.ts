"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import * as React from "react"

import {
  DEFAULT_PAGINATION_PARAMS,
  type PaginationParams,
} from "@/types/dtos/api.dto"

export type DataTableFilterValue = string | number | boolean | null | undefined
export type DataTableFilters = Record<string, DataTableFilterValue>
export type DataTableQueryParams<
  TFilters extends DataTableFilters = Record<string, never>,
> = PaginationParams & TFilters
export type DataTableQueryParamPatch = Partial<PaginationParams> &
  Record<string, DataTableFilterValue>

type DataTableParamsUpdater<TFilters extends DataTableFilters> =
  | DataTableQueryParamPatch
  | ((current: DataTableQueryParams<TFilters>) => DataTableQueryParamPatch)

type SetFilterOptions = {
  resetPage?: boolean
}

type UseDataTableQueryParamsOptions<TFilters extends DataTableFilters> = {
  defaultFilters?: TFilters
  searchDebounceMs?: number
}

const DEFAULT_SEARCH_DEBOUNCE_MS = 400

function readNumberParam(
  searchParams: { get: (key: string) => string | null },
  key: string,
  fallback: number
) {
  const value = Number(searchParams.get(key))
  return Number.isFinite(value) && value > 0 ? value : fallback
}

function readFilterValue(
  rawValue: string | null,
  fallback: DataTableFilterValue
) {
  if (typeof fallback === "number") {
    const value = Number(rawValue)
    return Number.isFinite(value) ? value : fallback
  }

  if (typeof fallback === "boolean") {
    return rawValue?.toLowerCase() === "true"
  }

  return rawValue ?? fallback ?? ""
}

function isEmptyParamValue(value: DataTableFilterValue) {
  return (
    value === undefined || value === null || value === "" || value === false
  )
}

function compactParams<TParams extends object>(params: TParams) {
  const compacted: Partial<TParams> = {}

  for (const key of Object.keys(params) as Array<keyof TParams>) {
    const value = params[key] as DataTableFilterValue

    if (!isEmptyParamValue(value)) {
      compacted[key] = value as TParams[keyof TParams]
    }
  }

  return compacted
}

export function readDataTableQueryParamsFromSearch<
  TFilters extends DataTableFilters = Record<string, never>,
>(
  searchParams: { get: (key: string) => string | null },
  defaultFilters?: TFilters
) {
  const filters = {} as TFilters
  const writableFilters = filters as Record<string, DataTableFilterValue>

  Object.entries(defaultFilters ?? {}).forEach(([key, fallback]) => {
    writableFilters[key] = readFilterValue(searchParams.get(key), fallback)
  })

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
    ...filters,
  } as DataTableQueryParams<TFilters>
}

export function useDataTableQueryParams<
  TFilters extends DataTableFilters = Record<string, never>,
>(options: UseDataTableQueryParamsOptions<TFilters> = {}) {
  const { defaultFilters, searchDebounceMs = DEFAULT_SEARCH_DEBOUNCE_MS } =
    options
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const params = React.useMemo(
    () => readDataTableQueryParamsFromSearch(searchParams, defaultFilters),
    [defaultFilters, searchParams]
  )

  const [searchTerm, setSearchTerm] = React.useState(params.search)

  React.useEffect(() => {
    // Keep the input in sync with browser back/forward URL changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchTerm(params.search)
  }, [params.search])

  const setParams = React.useCallback(
    (updater: DataTableParamsUpdater<TFilters>) => {
      const nextParams =
        typeof updater === "function" ? updater(params) : updater
      const mergedParams = { ...params, ...nextParams }
      const current = new URLSearchParams(Array.from(searchParams.entries()))

      Object.entries(mergedParams).forEach(([key, value]) => {
        if (isEmptyParamValue(value)) {
          current.delete(key)
        } else {
          current.set(key, String(value))
        }
      })

      const search = current.toString()
      router.push(`${pathname}${search ? `?${search}` : ""}`, {
        scroll: false,
      })
    },
    [params, pathname, router, searchParams]
  )

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (searchTerm !== params.search) {
        setParams(() => ({
          page: 1,
          search: searchTerm,
        }))
      }
    }, searchDebounceMs)

    return () => window.clearTimeout(timeout)
  }, [params.search, searchDebounceMs, searchTerm, setParams])

  const setFilters = React.useCallback(
    (
      filters: Partial<DataTableQueryParams<TFilters>>,
      options?: SetFilterOptions
    ) => {
      const resetPage = options?.resetPage ?? true

      setParams((current) => ({
        ...(filters as DataTableQueryParamPatch),
        page: resetPage ? 1 : current.page,
      }))
    },
    [setParams]
  )

  const setFilter = React.useCallback(
    <TKey extends keyof DataTableQueryParams<TFilters>>(
      key: TKey,
      value: DataTableQueryParams<TFilters>[TKey],
      options?: SetFilterOptions
    ) => {
      setFilters(
        {
          [key]: value,
        } as unknown as Partial<DataTableQueryParams<TFilters>>,
        options
      )
    },
    [setFilters]
  )

  const handlePaginationChange = React.useCallback(
    (pagination: { pageIndex: number; pageSize: number }) => {
      setParams((current) => ({
        limit: pagination.pageSize,
        page:
          pagination.pageSize === current.limit ? pagination.pageIndex + 1 : 1,
      }))
    },
    [setParams]
  )

  const queryParams = React.useMemo(
    () => compactParams(params),
    [params]
  ) as Partial<DataTableQueryParams<TFilters>>

  const resetFilters = React.useCallback(() => {
    setSearchTerm("")
    const cleared: Record<string, DataTableFilterValue> = {
      page: 1,
      search: "",
      status: "",
    }
    if (defaultFilters) {
      Object.keys(defaultFilters).forEach((key) => {
        cleared[key] = defaultFilters[key]
      })
    }
    setParams(cleared)
  }, [defaultFilters, setParams])

  return {
    handlePaginationChange,
    pageIndex: Math.max(params.page - 1, 0),
    pageSize: params.limit,
    params,
    queryParams,
    searchTerm,
    setFilter,
    setFilters,
    setParams,
    setSearchTerm,
    resetFilters,
  }
}
