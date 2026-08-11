"use client"

import { Loader2 } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { dashboardNavigation } from "@/config/navigation"
import { useAuth } from "@/hooks/useAuth"

export function RoleRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { roles, isAuthenticated } = useAuth()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      setChecking(false)
      return
    }

    // Find if the path is restricted by matching with dashboardNavigation items
    const matchedItem = dashboardNavigation.find((item) => {
      if (item.href === "/dashboard") {
        return pathname === "/dashboard"
      }
      return pathname.startsWith(item.href)
    })

    if (matchedItem && matchedItem.roles && matchedItem.roles.length > 0) {
      const hasAccess = matchedItem.roles.some((r) => roles.includes(r))
      if (!hasAccess) {
        router.replace("/dashboard")
        return
      }
    }

    setChecking(false)
  }, [pathname, roles, isAuthenticated, router])

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}
