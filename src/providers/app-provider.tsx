"use client"

import * as React from "react"

import { TooltipProvider } from "@/components/ui/tooltip"
import { type TenantTheme } from "@/config/theme"
import { AuthProvider } from "@/providers/auth-provider"
import { RealtimeProvider } from "@/providers/realtime-provider"
import { ThemeProvider } from "@/providers/theme-provider"
import { StoreProvider } from "@/store/provider"

function AppProvider({
  children,
  tenantTheme,
}: {
  children: React.ReactNode
  tenantTheme?: TenantTheme
}) {
  return (
    <StoreProvider>
      <ThemeProvider tenantTheme={tenantTheme}>
        <TooltipProvider>
          <AuthProvider>
            <RealtimeProvider>{children}</RealtimeProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </StoreProvider>
  )
}

export { AppProvider }
