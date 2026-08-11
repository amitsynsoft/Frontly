import * as React from "react"
import { CalendarDays } from "lucide-react"
import { TestingBookingForm } from "@/app/book4me/_components/testing-booking-form"

export default function Book4MePage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background p-4">
      {/* Decorative background glow */}
      <div className="absolute top-[-10%] right-[-10%] h-[300px] w-[300px] rounded-full bg-primary/20 blur-[80px]" />
      <div className="absolute bottom-[-10%] left-[-10%] h-[300px] w-[300px] rounded-full bg-secondary/20 blur-[80px]" />

      <div className="relative w-full max-w-2xl animate-in rounded-2xl border border-border/50 bg-card/65 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-xl duration-500 fade-in-50 zoom-in-95 sm:p-8 dark:bg-card/30">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <CalendarDays className="size-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Test Booking Sandbox
          </h1>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Fill in the details below to create a direct test booking. All
            fields are configured directly for API payloads.
          </p>
        </div>

        <TestingBookingForm />
      </div>
    </div>
  )
}
