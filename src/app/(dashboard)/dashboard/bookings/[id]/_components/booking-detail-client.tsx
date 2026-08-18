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

const DEFAULT_MOCK_BOOKING: CustomerBookingDto = {
  id: 21,
  tenantId: 1,
  branchId: 101,
  customerId: 1001,
  bookingTypeId: 1,
  currencyId: 1,
  status: "pending",
  notes:
    "Routine dental checkup and cleaning scheduled via Ava Virtual Receptionist. Preferred phone number updated on patient account.",
  paymentMethod: "Cash",
  createdAt: "2026-08-18T10:15:00.000Z",
  updatedAt: "2026-08-18T10:15:00.000Z",
  bookingNumber: "BK-2026-0827",
  finalAmount: "50.00",
  customer: {
    id: 1001,
    tenantId: 1,
    fullName: "David Miller",
    phone: "713-555-0198",
    isActive: true,
    createdAt: "2024-03-18",
    updatedAt: "2026-08-18",
  },
  branch: {
    id: 101,
    tenantId: 1,
    name: "Arlington Dental Branch",
    address: "123 Healthcare Ave, Suite 400",
    city: "Arlington",
    state: "TX",
    country: "USA",
    postalCode: "77024",
    frontdeskNumber: "713-555-0100",
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  bookingServices: [
    {
      id: 501,
      tenantId: 1,
      branchId: 101,
      customerBookingId: 21,
      branchServicesId: 1,
      serviceName: "Dental Cleaning and Exam",
      tenantUserId: 23,
      appointmentDate: "2026-08-27",
      durationInMinutes: 30,
      startTime: "15:00",
      endTime: "15:30",
      cost: "50.00",
      discountAmount: "0.00",
      finalCost: "50.00",
      status: "confirmed",
      currencyId: 1,
      createdAt: "2026-08-18",
      updatedAt: "2026-08-18",
      tenantUser: {
        id: 23,
        tenantId: 1,
        email: "ecarter@smilesdental.com",
        fullName: "Dr. Emily Carter",
        profilePic: "",
        status: "Active",
        bio: "Senior General Dentist",
      },
    },
  ],
  payments: [
    {
      id: 901,
      customerBookingId: 21,
      amount: "50.00",
      currencyId: 1,
      transactionDate: "2026-08-18",
      paymentMethod: "Cash",
      transactionStatus: "Pending",
    },
  ],
}

export function BookingDetailClient({ id }: BookingDetailClientProps) {
  const router = useRouter()
  const { data: booking, isLoading, error } = useGetCustomerBookingByIdQuery(id, {
    skip: true,
  })

  const bookingData = {
    ...DEFAULT_MOCK_BOOKING,
    id: id ? (isNaN(Number(id)) ? 21 : Number(id)) : 21,
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
