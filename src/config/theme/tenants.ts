import type { TenantTheme } from "@/config/theme/types"

export const DEFAULT_TENANT_LOGO = ""
const DEPRECATED_DEFAULT_LOGOS = new Set([
  "logo.png",
  "./logo.png",
  "/logo.png",
])

export const tenantFontStacks = {
  inter: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
  system:
    'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  segoe: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  arial: "Arial, Helvetica, sans-serif",
  rounded: 'ui-rounded, "SF Pro Rounded", "Segoe UI", sans-serif',
  display: '"Aptos Display", "Avenir Next", "Segoe UI", sans-serif',
  serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
  mono: 'var(--font-mono), "SFMono-Regular", Consolas, "Liberation Mono", monospace',
} as const

export function normalizeTenantLogo(logo: string | null | undefined) {
  const value = logo?.trim() ?? ""

  if (!value) {
    return ""
  }

  if (DEPRECATED_DEFAULT_LOGOS.has(value)) {
    return DEFAULT_TENANT_LOGO
  }

  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value) || value.startsWith("/")) {
    return value
  }

  return `/${value.replace(/^\.?\//, "")}`
}

export const defaultTenantTheme: TenantTheme = {
  brandName: "Frontly",
  logo: DEFAULT_TENANT_LOGO,
  primaryColor: "#763aee",
  primaryForegroundColor: "#ffffff",
  secondaryColor: "#ede9fe",
  secondaryForegroundColor: "#763aee",
  radius: "0.5rem",
  fontFamily: tenantFontStacks.inter,
  sidebarStyle: "comfortable",
}

export const tenantThemes = {
  tonySalon: {
    brandName: "Frontly",
    logo: DEFAULT_TENANT_LOGO,
    primaryColor: "#0f766e",
    primaryForegroundColor: "#ffffff",
    secondaryColor: "#f1f5f9",
    secondaryForegroundColor: "#0f172a",
    radius: "0.5rem",
    fontFamily: tenantFontStacks.inter,
    sidebarStyle: "compact",
  },
} satisfies Record<string, TenantTheme>
