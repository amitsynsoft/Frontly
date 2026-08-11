"use client"

import { XCircle } from "lucide-react"
import * as React from "react"

interface CancellationBannerProps {
  isCancelled: boolean
  cancellationReason?: string | null
  cancellationDate?: string | null
  cancelledBy?: string | null
  cancelledUsing?: string | null
}

export function CancellationBanner({
  isCancelled,
  cancellationReason,
  cancellationDate,
  cancelledBy,
  cancelledUsing,
}: CancellationBannerProps) {
  if (!isCancelled) return null

  return (
    <div className="mt-6 flex animate-in items-start gap-3.5 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-destructive shadow-2xs duration-300 fade-in slide-in-from-bottom-2">
      <XCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
      <div className="flex-1 space-y-1">
        <h3 className="text-base font-semibold tracking-tight">
          This booking has been cancelled
        </h3>
        {cancellationReason && (
          <p className="text-sm leading-relaxed font-medium text-destructive/90">
            Reason: {cancellationReason}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1.5 text-xs font-medium text-muted-foreground/80">
          {cancellationDate && (
            <span>
              Date:{" "}
              {new Date(cancellationDate).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          )}
          {cancelledBy && <span>Cancelled by: {cancelledBy}</span>}
          {cancelledUsing && <span>Via: {cancelledUsing}</span>}
        </div>
      </div>
    </div>
  )
}
