import "./globals.css"

import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"
import type { CSSProperties } from "react"

import { defaultTenantTheme } from "@/config/theme"
import { cn } from "@/lib/utils/cn.utils"
import { AppProvider } from "@/providers/app-provider"
import BProgressProviders from "@/providers/bprogress-providers"
import { ToastProvider } from "@/providers/toast-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Frontly",
  description: "Enterprise appointment platform foundation",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const theme = defaultTenantTheme

  const themeStyles = {
    "--primary": theme.primaryColor,
    "--primary-foreground": theme.primaryForegroundColor,
    "--secondary": theme.secondaryColor,
    "--secondary-foreground": theme.secondaryForegroundColor,
    "--ring": theme.primaryColor,
    "--chart-1": theme.primaryColor,
    "--chart-2": theme.secondaryColor,
    "--sidebar-primary": theme.primaryColor,
    "--sidebar-primary-foreground": theme.primaryForegroundColor,
    "--sidebar-accent": `color-mix(in oklab, ${theme.primaryColor} 10%, transparent)`,
    "--sidebar-ring": theme.primaryColor,
    "--accent": `color-mix(in oklab, ${theme.primaryColor} 9%, transparent)`,
    "--radius": theme.radius,
    "--tenant-font-family": theme.fontFamily,
  } as CSSProperties

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(inter.variable, fontMono.variable)}
      style={themeStyles}
      data-sidebar-style={theme.sidebarStyle}
      data-tenant={theme.brandName}
    >
      <body className="min-h-svh bg-background text-foreground antialiased">
        <AppProvider tenantTheme={theme}>
          <BProgressProviders>
            {children}
            <ToastProvider />
          </BProgressProviders>
        </AppProvider>
      </body>
    </html>
  )
}
