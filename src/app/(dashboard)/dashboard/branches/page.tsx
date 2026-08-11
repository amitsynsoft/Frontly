import { Metadata } from "next"

import { LocationsClient } from "./_components/location-client"

export const metadata: Metadata = {
  title: "Branch Management | Scheduler System",
  description: "Manage branches, and their lifecycle status.",
}

export default function LocationManagementPage() {
  return <LocationsClient />
}
