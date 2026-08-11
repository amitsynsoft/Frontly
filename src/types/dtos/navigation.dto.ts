import type { LucideIcon } from "lucide-react"

import type { UserRole } from "@/lib/permissions"

export type NavigationItem = {
  title: string
  href: string
  icon: LucideIcon
  roles?: UserRole[]
  description?: string
}
