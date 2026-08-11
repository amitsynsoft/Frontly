import * as React from "react"

import type { ApiMeta } from "@/types/dtos/api.dto"

type UseApiListDataOptions = {
  limit: number
  page: number
}

type ApiPaginationInfo = {
  currentPage: number
  meta?: ApiMeta
  pageCount: number
  totalItems?: number
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function getNumberValue(value: unknown) {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : undefined
}

function getPositiveNumberValue(...values: unknown[]) {
  for (const value of values) {
    const numberValue = getNumberValue(value)

    if (numberValue !== undefined && numberValue > 0) {
      return numberValue
    }
  }

  return undefined
}

function getNonNegativeNumberValue(...values: unknown[]) {
  for (const value of values) {
    const numberValue = getNumberValue(value)

    if (numberValue !== undefined && numberValue >= 0) {
      return numberValue
    }
  }

  return undefined
}

export function getApiList<TItem>(response: unknown): TItem[] {
  if (Array.isArray(response)) {
    return response as TItem[]
  }

  if (!isRecord(response)) {
    return []
  }

  if (Array.isArray(response.result)) {
    return response.result as TItem[]
  }

  if (Array.isArray(response.data)) {
    return response.data as TItem[]
  }

  return []
}

export function getApiMeta(response: unknown): ApiMeta | undefined {
  if (!isRecord(response) || !isRecord(response.meta)) {
    return undefined
  }

  return response.meta as ApiMeta
}

export function getApiPageCount(
  response: unknown,
  { limit, page }: UseApiListDataOptions,
  rowCount: number
) {
  return getApiPaginationInfo(response, { limit, page }, rowCount).pageCount
}

export function getApiPaginationInfo(
  response: unknown,
  { limit, page }: UseApiListDataOptions,
  rowCount: number
): ApiPaginationInfo {
  const meta = getApiMeta(response)
  const currentPage =
    getPositiveNumberValue(meta?.currentPage, meta?.page) ?? page
  const totalPages = getPositiveNumberValue(meta?.totalPages)

  if (totalPages !== undefined) {
    return {
      currentPage,
      meta,
      pageCount: Math.max(1, totalPages),
      totalItems: getNonNegativeNumberValue(meta?.totalItems, meta?.total),
    }
  }

  const totalItems = getNonNegativeNumberValue(
    meta?.totalItems,
    meta?.total,
    meta?.totalCount
  )

  if (totalItems !== undefined) {
    return {
      currentPage,
      meta,
      pageCount: Math.max(1, Math.ceil(totalItems / limit)),
      totalItems,
    }
  }

  if (rowCount >= limit) {
    return {
      currentPage,
      meta,
      pageCount: page + 1,
      totalItems,
    }
  }

  return {
    currentPage,
    meta,
    pageCount: Math.max(1, page),
    totalItems,
  }
}

export function useApiListData<TItem>(
  response: unknown,
  { limit, page }: UseApiListDataOptions
) {
  const rows = React.useMemo(() => getApiList<TItem>(response), [response])
  const pagination = React.useMemo(
    () => getApiPaginationInfo(response, { limit, page }, rows.length),
    [limit, page, response, rows.length]
  )

  return {
    ...pagination,
    rows,
  }
}
