import type { Middleware } from "@reduxjs/toolkit"
import { isFulfilled, isRejectedWithValue } from "@reduxjs/toolkit"
import { toast } from "sonner"

import { isObject } from "@/lib/utils/object.util"
import { logout } from "@/store/slice/user/user.slice"
import type { ApiMeta } from "@/types/dtos/api.dto"

import { api } from "./api.config"

type HeadersLike = {
  get: (key: string) => string | null
}

type QueryActionMeta = {
  baseQueryMeta?: {
    request?: {
      headers?: HeadersLike
      method?: string
    }
    response?: {
      status?: number
    }
  }
}

export const rtkQueryLogger: Middleware = (storeApi) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const meta = getActionMeta(action)
    const status = meta?.baseQueryMeta?.response?.status

    if (status === 401 || status === 403) {
      storeApi.dispatch(logout())
      storeApi.dispatch(api.util.resetApiState())
    }

    handleRejectedAction(action)
  }
  if (isFulfilled(action)) handleFulfilledAction(action)
  return next(action)
}

const handleRejectedAction = (action: unknown) => {
  const payload = getActionPayload(action)
  const meta = getActionMeta(action)
  const payloadData = isRecord(payload) ? payload.data : undefined
  const status = meta?.baseQueryMeta?.response?.status
  const message = getErrorMessage(
    status,
    isRecord(payloadData) ? payloadData.message : undefined
  )
  const hideToast =
    meta?.baseQueryMeta?.request?.headers?.get("hideErrorToast") === "true" ||
    (isRecord(payload) && payload.status === "PARSING_ERROR") ||
    !message

  if (!hideToast) {
    toast.error(message, { duration: getToastDuration(message) })
  }
}

const handleFulfilledAction = (action: unknown) => {
  const payload = getActionPayload(action)
  const meta = getActionMeta(action)
  const message = isRecord(payload) ? payload.message : undefined
  const method = meta?.baseQueryMeta?.request?.method
  const hideToast =
    meta?.baseQueryMeta?.request?.headers?.get("hideSuccessToast") === "true" ||
    method === "GET" ||
    typeof message !== "string" ||
    !message

  if (!hideToast) {
    toast.success(message, { duration: getToastDuration(message) })
  }

  if (isRecord(action)) {
    action.payload = getFulfilledPayload(payload)
  }
}

const hasOwnKey = (value: object, key: PropertyKey) =>
  Object.prototype.hasOwnProperty.call(value, key)

const isRecord = (value: unknown): value is Record<PropertyKey, unknown> =>
  isObject(value)

const getActionPayload = (action: unknown) =>
  isRecord(action) ? action.payload : undefined

const getActionMeta = (action: unknown): QueryActionMeta | undefined => {
  if (!isRecord(action) || !isRecord(action.meta)) {
    return undefined
  }

  return action.meta as QueryActionMeta
}

const isApiMeta = (value: unknown): value is ApiMeta =>
  isRecord(value) &&
  (hasOwnKey(value, "totalItems") ||
    hasOwnKey(value, "currentPage") ||
    hasOwnKey(value, "totalPages") ||
    hasOwnKey(value, "total") ||
    hasOwnKey(value, "page"))

function attachMetaToList<TItem>(data: TItem[], meta: ApiMeta) {
  Object.defineProperty(data, "meta", {
    configurable: true,
    enumerable: false,
    value: meta,
    writable: true,
  })

  return data
}

const getFulfilledPayload = (payload: unknown) => {
  if (!isRecord(payload) || !hasOwnKey(payload, "data")) {
    return payload
  }

  const response = payload as { data: unknown; meta?: unknown }

  if (Array.isArray(response.data) && isApiMeta(response.meta)) {
    return attachMetaToList(response.data, response.meta)
  }

  return response.data
}

const getErrorMessage = (status: number | undefined, message: unknown) => {
  const fallbackMessage = typeof message === "string" ? message : undefined

  switch (status) {
    case 0:
      return "Server unreachable. Check your internet connection"
    case 429:
      return "Too many requests: You have exceeded the rate limit"
    case 503:
      return "Service temporarily unavailable: Please try again later"
    default:
      if (typeof status === "number" && status >= 500) {
        return fallbackMessage || "Sorry! Something went wrong with server"
      }

      return fallbackMessage || "Sorry! Something went wrong"
  }
}

const getToastDuration = (message: string) => {
  const baseDuration = 3000
  const lengthFactor = 40

  return Math.min(baseDuration + message.length * lengthFactor, 10000)
}
