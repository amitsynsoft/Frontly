import type * as React from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils/cn.utils"

type StatusBadgeProps = {
  status: string
}

const statusVariantMap: Record<
  string,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  active: "success",
  completed: "success",
  confirmed: "info",
  draft: "muted",
  inactive: "muted",
  new: "info",
  on_leave: "warning",
  past_due: "destructive",
  paused: "warning",
  pending: "warning",
  trial: "info",
  trialing: "info",
  archived: "muted",
  cancelled: "destructive",
}

const statusColorClasses: Record<string, { badge: string; dot: string }> = {
  success: {
    badge:
      "border-emerald-500/20 bg-emerald-500/8 text-emerald-700 dark:text-emerald-300 dark:bg-emerald-500/10",
    dot: "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]",
  },
  warning: {
    badge:
      "border-amber-500/20 bg-amber-500/8 text-amber-700 dark:text-amber-300 dark:bg-amber-500/10",
    dot: "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]",
  },
  info: {
    badge:
      "border-blue-500/20 bg-blue-500/8 text-blue-700 dark:text-blue-300 dark:bg-blue-500/10",
    dot: "bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]",
  },
  destructive: {
    badge:
      "border-rose-500/20 bg-rose-500/8 text-rose-700 dark:text-rose-300 dark:bg-rose-500/10",
    dot: "bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.5)]",
  },
  muted: {
    badge:
      "border-slate-500/20 bg-slate-500/8 text-slate-600 dark:text-slate-400 dark:bg-slate-500/10",
    dot: "bg-slate-400 dark:bg-slate-500",
  },
}

function StatusBadge({ status }: StatusBadgeProps) {
  const label = status.replaceAll("_", " ")
  const normalizedStatus = status.toLowerCase()
  const variant = statusVariantMap[normalizedStatus] ?? "outline"

  // Custom classes for premium feel, falling back to standard badge classes if unknown
  const themeClasses = statusColorClasses[variant as string]

  // These statuses get a pulsing dot animation to show they represent active/ongoing states
  const shouldPulse = ["active", "new", "trialing", "pending"].includes(
    normalizedStatus
  )

  return (
    <Badge
      variant={variant}
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-semibold tracking-wide capitalize transition-all duration-200",
        themeClasses?.badge
      )}
    >
      <span
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          themeClasses?.dot ?? "bg-current",
          shouldPulse && "animate-pulse"
        )}
      />
      {label}
    </Badge>
  )
}

export { StatusBadge }
