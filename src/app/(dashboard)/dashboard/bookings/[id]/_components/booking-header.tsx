"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"

import { Button } from "@/components/ui/button"

interface BookingHeaderProps {
  bookingId: string | number
}

export function BookingHeader({ bookingId }: BookingHeaderProps) {
  const router = useRouter()

  return (
    <div className="flex animate-in flex-col gap-4 duration-300 fade-in slide-in-from-top-3">
      <Button
        variant="ghost"
        size="sm"
        className="w-fit gap-2 pl-0 text-muted-foreground transition-all duration-200 hover:text-foreground"
        onClick={() => router.push("/dashboard/bookings")}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-xs font-semibold tracking-wider">
          Back to Bookings
        </span>
      </Button>

      <div className="flex flex-col gap-5 border-b border-border/20 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Booking Details
            </h1>
            <span className="rounded-xl border border-border/20 bg-muted/40 px-3 py-1 font-mono text-sm font-semibold text-muted-foreground">
              #{bookingId}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
