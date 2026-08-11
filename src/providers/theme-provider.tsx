"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import * as React from "react"

import {
  defaultTenantTheme,
  normalizeTenantLogo,
  type TenantTheme,
} from "@/config/theme"

const TENANT_THEME_STORAGE_KEY = "serviceos:tenant-theme"
const TENANT_THEME_CHANGE_EVENT = "serviceos:theme-change"

let cachedThemeRaw: string | null = null
let cachedTheme: TenantTheme = defaultTenantTheme
let hasLoadedStoredTheme = false

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider> & {
  tenantTheme?: TenantTheme
}

type TenantThemeContextValue = {
  tenantTheme: TenantTheme
  updateTenantTheme: (theme: Partial<TenantTheme>) => void
  resetTenantTheme: () => void
}

const TenantThemeContext = React.createContext<TenantThemeContextValue | null>(
  null
)

function ThemeProvider({
  children,
  tenantTheme = defaultTenantTheme,
  ...props
}: ThemeProviderProps) {
  const subscribe = React.useCallback(
    (onStoreChange: () => void) =>
      subscribeTenantTheme(onStoreChange, tenantTheme),
    [tenantTheme]
  )

  const activeTenantTheme = React.useSyncExternalStore(
    subscribe,
    getTenantThemeSnapshot,
    () => tenantTheme
  )

  React.useEffect(() => {
    const root = document.documentElement

    // Remove legacy inline style properties that override standard class variables
    const inlineProps = [
      "--primary",
      "--primary-foreground",
      "--secondary",
      "--secondary-foreground",
      "--ring",
      "--chart-1",
      "--chart-2",
      "--sidebar-primary",
      "--sidebar-primary-foreground",
      "--sidebar-accent",
      "--sidebar-ring",
      "--accent",
      "--radius",
      "--tenant-font-family",
    ]
    inlineProps.forEach((prop) => root.style.removeProperty(prop))

    root.dataset.sidebarStyle = activeTenantTheme.sidebarStyle
    root.dataset.tenant = activeTenantTheme.brandName

    let styleEl = document.getElementById("tenant-theme-styles") as HTMLStyleElement | null
    if (!styleEl) {
      styleEl = document.createElement("style")
      styleEl.id = "tenant-theme-styles"
      document.head.appendChild(styleEl)
    }

    styleEl.textContent = `
      :root {
        --primary: ${activeTenantTheme.primaryColor};
        --primary-foreground: ${activeTenantTheme.primaryForegroundColor};
        --secondary: ${activeTenantTheme.secondaryColor};
        --secondary-foreground: ${activeTenantTheme.secondaryForegroundColor};
        --ring: ${activeTenantTheme.primaryColor};
        --chart-1: ${activeTenantTheme.primaryColor};
        --chart-2: ${activeTenantTheme.secondaryColor};
        --sidebar-primary: ${activeTenantTheme.primaryColor};
        --sidebar-primary-foreground: ${activeTenantTheme.primaryForegroundColor};
        --sidebar-accent: color-mix(in oklab, ${activeTenantTheme.primaryColor} 10%, transparent);
        --sidebar-ring: ${activeTenantTheme.primaryColor};
        --accent: color-mix(in oklab, ${activeTenantTheme.primaryColor} 9%, transparent);
        --radius: ${activeTenantTheme.radius};
        --tenant-font-family: ${activeTenantTheme.fontFamily};
      }

      .dark {
        --primary: ${activeTenantTheme.primaryColor};
        --primary-foreground: ${activeTenantTheme.primaryForegroundColor};
        --secondary: color-mix(in oklab, ${activeTenantTheme.primaryColor} 8%, var(--card));
        --secondary-foreground: oklch(0.985 0 0);
        --ring: ${activeTenantTheme.primaryColor};
        --chart-1: ${activeTenantTheme.primaryColor};
        --chart-2: color-mix(in oklab, ${activeTenantTheme.primaryColor} 20%, var(--card));
        --sidebar-primary: ${activeTenantTheme.primaryColor};
        --sidebar-primary-foreground: ${activeTenantTheme.primaryForegroundColor};
        --sidebar-accent: color-mix(in oklab, ${activeTenantTheme.primaryColor} 12%, transparent);
        --sidebar-ring: ${activeTenantTheme.primaryColor};
        --accent: color-mix(in oklab, ${activeTenantTheme.primaryColor} 12%, transparent);
      }
    `

    return () => {
      // Clean up dynamic style element on unmount
      const styleNode = document.getElementById("tenant-theme-styles")
      if (styleNode) {
        styleNode.remove()
      }
    }
  }, [activeTenantTheme])

  const updateTenantTheme = React.useCallback((theme: Partial<TenantTheme>) => {
    writeTenantTheme({
      ...getTenantThemeSnapshot(),
      ...theme,
    })
  }, [])
  const resetTenantTheme = React.useCallback(() => {
    clearTenantTheme(tenantTheme)
  }, [tenantTheme])

  const value = React.useMemo<TenantThemeContextValue>(
    () => ({
      tenantTheme: activeTenantTheme,
      updateTenantTheme,
      resetTenantTheme,
    }),
    [activeTenantTheme, resetTenantTheme, updateTenantTheme]
  )

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <TenantThemeContext.Provider value={value}>
        {children}
      </TenantThemeContext.Provider>
    </NextThemesProvider>
  )
}

function subscribeTenantTheme(
  onStoreChange: () => void,
  fallbackTheme: TenantTheme
) {
  if (typeof window === "undefined") {
    return () => undefined
  }

  if (!hasLoadedStoredTheme) {
    hasLoadedStoredTheme = true

    if (hydrateTenantThemeFromStorage(fallbackTheme)) {
      queueMicrotask(onStoreChange)
    }
  }

  function handleStoreChange() {
    hydrateTenantThemeFromStorage(fallbackTheme)
    onStoreChange()
  }

  window.addEventListener("storage", handleStoreChange)
  window.addEventListener(TENANT_THEME_CHANGE_EVENT, handleStoreChange)

  return () => {
    window.removeEventListener("storage", handleStoreChange)
    window.removeEventListener(TENANT_THEME_CHANGE_EVENT, handleStoreChange)
  }
}

function getTenantThemeSnapshot() {
  return cachedTheme
}

function hydrateTenantThemeFromStorage(fallbackTheme = defaultTenantTheme) {
  if (typeof window === "undefined") {
    return false
  }

  try {
    clearLegacyTenantThemeStorage()

    const storedTheme = window.sessionStorage.getItem(TENANT_THEME_STORAGE_KEY)

    if (!storedTheme) {
      const changed = cachedTheme !== fallbackTheme || cachedThemeRaw !== null

      cachedThemeRaw = null
      cachedTheme = fallbackTheme

      return changed
    }

    if (storedTheme === cachedThemeRaw) {
      return false
    }

    cachedThemeRaw = storedTheme
    cachedTheme = {
      ...defaultTenantTheme,
      ...(JSON.parse(storedTheme) as Partial<TenantTheme>),
    }
    cachedTheme.logo = normalizeTenantLogo(cachedTheme.logo)

    return true
  } catch {
    const changed = cachedTheme !== defaultTenantTheme

    cachedThemeRaw = null
    cachedTheme = defaultTenantTheme

    return changed
  }
}

function writeTenantTheme(theme: TenantTheme) {
  if (typeof window === "undefined") {
    return
  }

  const nextTheme = {
    ...theme,
    logo: normalizeTenantLogo(theme.logo),
  }
  const themeStr = JSON.stringify(nextTheme)
  cachedThemeRaw = themeStr
  cachedTheme = nextTheme

  try {
    window.sessionStorage.setItem(TENANT_THEME_STORAGE_KEY, themeStr)
  } catch {
    // Keep the in-memory theme even if browser storage is unavailable
  }

  clearLegacyTenantThemeStorage()

  window.dispatchEvent(new Event(TENANT_THEME_CHANGE_EVENT))
}

function clearTenantTheme(fallbackTheme = defaultTenantTheme) {
  if (typeof window === "undefined") {
    return
  }

  cachedThemeRaw = null
  cachedTheme = fallbackTheme

  try {
    window.sessionStorage.removeItem(TENANT_THEME_STORAGE_KEY)
  } catch {
    // Ignore storage cleanup errors
  }

  clearLegacyTenantThemeStorage()

  window.dispatchEvent(new Event(TENANT_THEME_CHANGE_EVENT))
}

function clearLegacyTenantThemeStorage() {
  try {
    window.localStorage.removeItem(TENANT_THEME_STORAGE_KEY)
  } catch {
    // Ignore storage cleanup errors
  }

  try {
    document.cookie = `${TENANT_THEME_STORAGE_KEY}=; path=/; max-age=0; SameSite=Lax`
  } catch {
    // Ignore cookie cleanup errors
  }
}

function useTenantTheme() {
  const context = React.useContext(TenantThemeContext)

  if (!context) {
    throw new Error("useTenantTheme must be used inside ThemeProvider")
  }

  return context
}

export { ThemeProvider, useTenantTheme }
