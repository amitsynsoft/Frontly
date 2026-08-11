"use client"

import * as React from "react"

import { ErrorState } from "@/components/shared/error-state"
import { cn } from "@/lib/utils/cn.utils"

type RouteErrorProps = {
  className?: string
  error: Error & { digest?: string }
  reset: () => void
  title?: string
}

function RouteError({
  className,
  error,
  reset,
  title = "Something went wrong",
}: RouteErrorProps) {
  React.useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div
      className={cn(
        "grid min-h-[60svh] place-items-center bg-background p-6",
        className
      )}
    >
      <ErrorState
        title={title}
        message={error.message || "The view could not be rendered."}
        details={error.digest ? `Digest: ${error.digest}` : undefined}
        onRetry={reset}
        secondaryHref="/dashboard"
      />
    </div>
  )
}

export { RouteError }
