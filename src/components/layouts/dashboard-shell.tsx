"use client"

import * as React from "react"

import { AppNavbar } from "@/components/layouts/app-navbar"
import { AppSidebar } from "@/components/layouts/app-sidebar"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils/cn.utils"

function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <div className="min-h-svh bg-muted/25">
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden transition-all duration-300 ease-in-out lg:block",
          collapsed ? "w-20" : "w-72"
        )}
      >
        <AppSidebar
          collapsed={collapsed}
          idPrefix="desktop-sidebar"
          onCollapseToggle={() => setCollapsed((value) => !value)}
        />
      </div>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription>Application navigation menu</SheetDescription>
          </SheetHeader>
          <AppSidebar
            idPrefix="mobile-sidebar"
            onNavigate={() => setMobileOpen(false)}
            showProfileFooter={false}
          />
        </SheetContent>
      </Sheet>
      <div
        className={cn(
          "min-h-svh transition-all duration-300 ease-in-out lg:pl-72",
          collapsed && "lg:pl-20"
        )}
      >
        <AppNavbar onMenuClick={() => setMobileOpen(true)} />
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}

export { DashboardShell }
