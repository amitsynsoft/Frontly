"use client"

import * as React from "react"

import { BrandLogo } from "@/components/shared/brand-logo"
import { useTenantTheme } from "@/providers/theme-provider"

type AuthShellProps = {
  title: string
  description: string
  children: React.ReactNode
}

function AuthShell({ children, description, title }: AuthShellProps) {
  const { tenantTheme } = useTenantTheme()

  return (
    <main className="grid min-h-svh place-items-center bg-background px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="mb-6 flex items-center">
          <BrandLogo
            brandName={tenantTheme.brandName}
            logoSrc={tenantTheme.logo}
            className="h-12 w-auto max-w-[260px]"
            imgClassName="h-12 max-w-[260px]"
          />
        </div>
        <div className="relative overflow-visible rounded-lg border bg-card p-6 shadow-xs">
          <div className="mb-5">
            <h1 className="text-xl font-semibold">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          {children}
        </div>
      </div>
    </main>
  )
}

export { AuthShell }
