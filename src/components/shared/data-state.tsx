"use client"

import type { ReactNode } from "react"

import { ErrorState } from "@/components/shared/error-state"
import { WebsiteLoader } from "@/components/shared/website-loader"
import { cn } from "@/lib/utils/cn.utils"

type DataStateProps = {
  children: ReactNode
  className?: string
  error?: unknown
  errorTitle?: string
  isLoading?: boolean
  loadingDescription?: string
  loadingLabel?: string
  onRetry?: () => void
}

function DataState({
  children,
  className,
  error,
  errorTitle = "Unable to load records",
  isLoading = false,
  loadingDescription = "Fetching the latest records and preparing the table.",
  loadingLabel = "Loading data",
  onRetry,
}: DataStateProps) {
  if (isLoading) {
    return (
      <WebsiteLoader
        label={loadingLabel}
        description={loadingDescription}
        className={cn("min-h-64", className)}
      />
    )
  }

  if (error) {
    return (
      <ErrorState
        title={errorTitle}
        message={getErrorMessage(error)}
        onRetry={onRetry}
        className={className}
      />
    )
  }

  return <>{children}</>
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  if (typeof error === "string") {
    return error
  }

  if (isRecord(error)) {
    const data = error.data

    if (isRecord(data) && typeof data.message === "string") {
      return data.message
    }

    if (typeof error.message === "string") {
      return error.message
    }

    if (typeof error.status === "number") {
      return `Request failed with status ${error.status}.`
    }
  }

  return "Refresh the page or try again after a moment."
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object"
}

export { DataState, getErrorMessage }
