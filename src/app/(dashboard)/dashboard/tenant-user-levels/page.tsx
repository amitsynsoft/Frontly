import { Metadata } from "next"

import { TenantUserLevelsClient } from "@/app/(dashboard)/dashboard/tenant-user-levels/_components/tenant-user-levels-client"

export const metadata: Metadata = {
  title: "User Level Management | Scheduler System",
  description: "Manage tenant user levels and their descriptions.",
}

export default function TenantUserLevelsPage() {
  return <TenantUserLevelsClient />
}
