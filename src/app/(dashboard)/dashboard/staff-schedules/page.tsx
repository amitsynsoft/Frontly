import { Metadata } from "next"

import { StaffSchedulesClient } from "./_components/staff-schedules-client"

export const metadata: Metadata = {
   title: "Staff Schedules | Scheduler System",
   description: "Manage staff schedules and their availability.",
}

export default function StaffSchedulesPage() {
   return <StaffSchedulesClient />
}