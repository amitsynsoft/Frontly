import type * as React from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils/cn.utils"

export interface ResourceTypeBadgeProps {
  typeName: string
  className?: string
}

export function ResourceTypeBadge({
  typeName,
  className,
}: ResourceTypeBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex w-fit items-center rounded-full border border-primary/20 bg-primary/8 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-primary capitalize transition-all duration-200 hover:bg-primary/12",
        className
      )}
    >
      {typeName}
    </Badge>
  )
}
