"use client"

import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"

import { PageContainer } from "@/components/layouts/page-container"
import { Button } from "@/components/ui/button"
import { useGetCustomerBookingByIdQuery } from "@/store/api/booking.api"
import {
  BookingServiceResponseDto,
  CustomerBookingDto,
} from "@/types/dtos/booking.dto"

import { BookingHeader } from "./booking-header"
import { BranchDetails } from "./branch-details"
import { CancellationBanner } from "./cancellation-banner"
import { CustomerDetails } from "./customer-details"
import { CustomerNotes } from "./customer-notes"
import { PaymentBilling } from "./payment-billing"
import { ScheduledServices } from "./scheduled-services"
import { CallTranscriptCard } from "./call-transcript"

interface BookingDetailClientProps {
  id: string
}

export function BookingDetailClient({ id }: BookingDetailClientProps) {
  const router = useRouter()
  const { data: booking, isLoading, error } = useGetCustomerBookingByIdQuery(id)

  const bookingData =
    (
      booking as unknown as {
        result?: CustomerBookingDto
        data?: CustomerBookingDto
      }
    )?.result ??
    (
      booking as unknown as {
        result?: CustomerBookingDto
        data?: CustomerBookingDto
      }
    )?.data ??
    (booking as CustomerBookingDto)

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex h-64 items-center justify-center rounded-2xl border border-border/30 bg-background/50 backdrop-blur-xs">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageContainer>
    )
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !bookingData) {
    return (
      <PageContainer>
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 text-destructive">
          <p className="text-base font-semibold">
            Failed to load booking details
          </p>
          <p className="text-sm text-muted-foreground">
            Please check the ID and try again.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 rounded-xl"
            onClick={() => router.push("/dashboard/bookings")}
          >
            Back to Bookings
          </Button>
        </div>
      </PageContainer>
    )
  }

  const isCancelled =
    bookingData.status === "cancelled" || bookingData.status === "Cancelled"

  const svcs = (bookingData.bookingServices ||
    bookingData.services ||
    []) as BookingServiceResponseDto[]

  return (
    <PageContainer>
      {/* ── Back + Header ─────────────────────────────────────────────── */}
      <BookingHeader bookingId={bookingData.id} />

      {/* ── Cancellation Banner ───────────────────────────────────────── */}
      <CancellationBanner
        isCancelled={isCancelled}
        cancellationReason={bookingData.cancellationReason}
        cancellationDate={bookingData.cancellationDate}
        cancelledBy={bookingData.cancelledBy}
        cancelledUsing={bookingData.cancelledUsing}
      />

      {/* ── Details Grid ──────────────────────────────────────────────── */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Scheduled Services & Billing Details (2/3 width) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Scheduled Services Card */}
          <ScheduledServices services={svcs} />

          {/* AI FrontDesk Call Transcript */}
          <CallTranscriptCard />

          {/* Payment & Billing Card */}
          {/* <PaymentBilling bookingData={bookingData} /> */}

          {/* Customer Notes */}
          <CustomerNotes notes={bookingData.notes} />
        </div>

        {/* Right Column: Customer Info & Location Info (1/3 width) */}
        <div className="space-y-6 lg:col-span-1">
          {/* Customer Info Card */}
          <CustomerDetails
            customerId={bookingData.customerId}
            customer={bookingData.customer}
          />

          {/* Location Details Card */}
          <BranchDetails
            branchId={bookingData.branchId}
            branch={bookingData.branch}
          />
        </div>
      </div>
    </PageContainer>
  )
}
