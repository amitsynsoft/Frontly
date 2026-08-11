export const sidebarStyles = [
  "compact",
  "comfortable",
  "spacious",
  "minimal",
] as const

export type SidebarStyle = (typeof sidebarStyles)[number]

export type TenantTheme = {
  brandName: string
  logo: string
  primaryColor: string
  primaryForegroundColor: string
  secondaryColor: string
  secondaryForegroundColor: string
  radius: string
  fontFamily: string
  sidebarStyle: SidebarStyle
}
