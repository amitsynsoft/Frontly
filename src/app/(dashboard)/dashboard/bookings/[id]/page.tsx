import { Metadata } from "next"

import { BookingDetailClient } from "./_components/booking-detail-client"

interface BookingDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: BookingDetailPageProps): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Booking #${id} Details | Scheduler System`,
    description: `View customer, service, billing, and branch details for booking #${id}.`,
  }
}

export default async function BookingDetailPage({
  params,
}: BookingDetailPageProps) {
  const { id } = await params
  return <BookingDetailClient id={id} />
}

