"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { ProfileMenu } from "@/components/layouts/profile-menu"
import { BrandLogo } from "@/components/shared/brand-logo"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getNavigationForRoles } from "@/config/navigation"
import { useAuth } from "@/hooks/useAuth"
import { hasSuperAdminRole } from "@/lib/permissions/role-normalization"
import { cn } from "@/lib/utils/cn.utils"
import { useTenantTheme } from "@/providers/theme-provider"

type AppSidebarProps = {
  collapsed?: boolean
  idPrefix: string
  onCollapseToggle?: () => void
  onNavigate?: () => void
  showProfileFooter?: boolean
}

function AppSidebar({
  collapsed = false,
  idPrefix,
  onCollapseToggle,
  onNavigate,
  showProfileFooter = true,
}: AppSidebarProps) {
  const pathname = usePathname()
  const { roles, primaryRole } = useAuth()
  const { tenantTheme } = useTenantTheme()
  const navigation = getNavigationForRoles(roles)
  const isSuperAdmin = hasSuperAdminRole(roles)
  const brandName = tenantTheme.brandName
  const logoSrc = isSuperAdmin ? null : tenantTheme.logo

  return (
    <aside
      className={cn(
        "group/sidebar relative flex h-full flex-col border-r border-zinc-100 bg-white text-foreground shadow-xs transition-all duration-300 ease-in-out dark:border-zinc-800 dark:bg-zinc-950",
        collapsed ? "w-20" : "w-72"
      )}
    >
      {/* Floating Toggle Button */}
      {onCollapseToggle && (
        <button
          type="button"
          onClick={onCollapseToggle}
          className="absolute top-5 -right-3 z-50 hidden size-6 items-center justify-center rounded-full border border-zinc-100 bg-background text-foreground opacity-0 shadow-xs transition-all duration-200 group-hover/sidebar:opacity-100 hover:scale-110 hover:bg-accent hover:text-accent-foreground lg:flex dark:border-zinc-800"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="size-3.5" />
          ) : (
            <ChevronLeft className="size-3.5" />
          )}
        </button>
      )}

      {/* Brand Header */}
      <div
        className={cn(
          "flex min-h-20 shrink-0 items-center transition-all duration-300 select-none",
          collapsed ? "justify-center px-0 py-4" : "gap-3 py-3 pr-4 pl-[24px]"
        )}
      >
        {isSuperAdmin && !collapsed ? (
          <BrandLogo
            brandName={tenantTheme.brandName}
            logoSrc={tenantTheme.logo}
            className="h-11 w-auto max-w-[260px]"
            imgClassName="h-11 max-w-[260px]"
          />
        ) : (
          <BrandLogo
            brandName={brandName}
            logoSrc={logoSrc}
            variant="mark"
            className={cn(
              "shrink-0 transition-transform duration-300 hover:scale-105",
              collapsed ? "size-11 rounded-lg" : "size-12"
            )}
            imgClassName={cn(
              "shrink-0 object-contain transition-all duration-300",
              collapsed ? "size-11 rounded-lg" : "size-12"
            )}
          />
        )}
        {!collapsed && !isSuperAdmin && (
          <div className="flex min-w-0 flex-1 flex-col justify-center transition-all duration-300 ease-in-out">
            <div
              className={cn(
                "tracking-tight text-foreground/90 transition-all duration-200 break-words line-clamp-2",
                brandName.length > 22
                  ? "text-xs leading-tight font-semibold"
                  : brandName.length > 14
                    ? "text-sm leading-snug font-bold"
                    : "text-base leading-snug font-bold"
              )}
              title={brandName}
            >
              {brandName}
            </div>
            <span className="mt-0.5 truncate text-[10px] leading-none font-semibold tracking-widest text-muted-foreground/60 uppercase select-none">
              {"Operations"}
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="grid gap-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive =
              item.href === "/dashboard"
                ? pathname === item.href
                : pathname.startsWith(item.href)
            const link = (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                data-active={isActive ? "true" : "false"}
                data-slot="sidebar-link"
                className={cn(
                  "group relative flex items-center rounded-xl transition-all duration-300",
                  collapsed
                    ? "mx-auto size-12 justify-center"
                    : "h-12 gap-3 px-3.5",
                  isActive
                    ? "bg-primary font-semibold text-primary-foreground shadow-md shadow-primary/20"
                    : "text-zinc-700 hover:bg-zinc-50 hover:text-primary dark:text-zinc-300 dark:hover:bg-zinc-900/50"
                )}
              >
                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-white/15 text-white"
                      : "bg-primary/[0.06] text-primary/85 group-hover:bg-primary/12 group-hover:text-primary dark:bg-zinc-900 dark:text-zinc-400"
                  )}
                >
                  <Icon
                    className={cn(
                      "size-5 transition-transform duration-300",
                      isActive ? "scale-100" : "group-hover:scale-105"
                    )}
                  />
                </div>
                {!collapsed && (
                  <span
                    className={cn(
                      "transition-all duration-200 break-words line-clamp-2",
                      item.title.length > 18
                        ? "text-[13px] leading-tight font-medium"
                        : "text-[15px] font-medium"
                    )}
                  >
                    {item.title}
                  </span>
                )}

                {isActive && !collapsed && (
                  <ChevronRight className="ml-auto size-4 shrink-0 text-white/90" />
                )}
              </Link>
            )

            if (!collapsed) {
              return link
            }

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right" className="text-xs">
                  {item.title}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      {showProfileFooter && (
        <div className="border-t border-zinc-100 p-4 dark:border-zinc-800">
          <ProfileMenu
            collapsed={collapsed}
            id={`${idPrefix}-user-menu`}
            placement="sidebar"
          />
        </div>
      )}
    </aside>
  )
}

export { AppSidebar }
