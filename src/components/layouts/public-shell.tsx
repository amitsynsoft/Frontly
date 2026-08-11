"use client"

import { Moon, Sun } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import * as React from "react"

import { BrandLogo } from "@/components/shared/brand-logo"
import { Button } from "@/components/ui/button"
import { useTenantTheme } from "@/providers/theme-provider"

interface PublicShellProps {
  children: React.ReactNode
  isAuthenticated?: boolean
}

function PublicShell({ children, isAuthenticated = false }: PublicShellProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const { tenantTheme } = useTenantTheme()

  return (
    <div className="min-h-svh bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5"
          >
            <BrandLogo
              brandName={tenantTheme.brandName}
              logoSrc={tenantTheme.logo}
              className="h-8 w-auto max-w-[190px]"
              imgClassName="h-8 max-w-[150px]"
            />
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              <Sun className="hidden size-5 dark:block" />
              <Moon className="size-5 dark:hidden" />
            </Button>

            {isAuthenticated ? (
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" className="hidden sm:flex">
                  <Link href="/login">Login</Link>
                </Button>

                <Button asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto min-h-[calc(100svh-4rem)] max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}

export { PublicShell }
