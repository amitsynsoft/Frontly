"use client"

import { ChevronDown, ChevronsUpDown, LogOut, Settings, User } from "lucide-react"
import { useRouter } from "next/navigation"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils/cn.utils"

type ProfileMenuProps = {
  collapsed?: boolean
  className?: string
  id: string
  placement?: "sidebar" | "header"
}

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return initials || "U"
}

function formatRoleLabel(role: string | null) {
  return role?.replaceAll("_", " ").toLowerCase() ?? "user"
}

function getAvatarSrc(value: unknown) {
  if (typeof value !== "string") {
    return null
  }

  const src = value.trim()

  return src && src !== "null" && src !== "undefined" ? src : null
}

function ProfileAvatar({
  className,
  fallbackClassName,
  initials,
  src,
  title,
}: {
  className: string
  fallbackClassName: string
  initials: string
  src: string | null
  title: string
}) {
  if (!src) {
    return (
      <Avatar className={className}>
        <div
          className={cn(
            "flex size-full items-center justify-center rounded-[inherit]",
            fallbackClassName
          )}
        >
          {initials}
        </div>
      </Avatar>
    )
  }

  return (
    <Avatar className={className}>
      <AvatarImage src={src} alt={title} />
      <AvatarFallback className={fallbackClassName}>{initials}</AvatarFallback>
    </Avatar>
  )
}

function ProfileMenu({
  collapsed = false,
  className,
  id,
  placement = "sidebar",
}: ProfileMenuProps) {
  const router = useRouter()

  const { displayName, logout, primaryRole, user } = useAuth()

  const initials = getInitials(displayName)
  const roleLabel = formatRoleLabel(primaryRole)
  const avatarSrc = getAvatarSrc(user?.profilePic)

  const isHeader = placement === "header"

  /*
   |--------------------------------------------------------------------------
   | Navigation Handlers
   |--------------------------------------------------------------------------
   */

  const handleProfileRedirect = () => {
    router.push("/dashboard/settings?tab=profile")
  }

  const handleSettingsRedirect = () => {
    router.push("/dashboard/settings?tab=tenant-theme")
  }

  const handleLogout = () => {
    logout()
    router.replace("/login")
    router.refresh()
  }

  /*
   |--------------------------------------------------------------------------
   | Trigger
   |--------------------------------------------------------------------------
   */

  const trigger = isHeader ? (
    <DropdownMenuTrigger asChild>
      <button
        id={`${id}-trigger`}
        type="button"
        className={cn(
          "group relative grid size-10 cursor-pointer place-items-center rounded-lg border border-border/40 bg-background/50 transition-all duration-200 hover:bg-accent/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-95",
          className
        )}
        aria-label="User settings"
      >
        <ProfileAvatar
          className="size-7 border border-border/60 transition-transform duration-200 group-hover:scale-105"
          fallbackClassName="bg-primary text-xs font-semibold text-primary-foreground"
          initials={initials}
          src={avatarSrc}
          title={displayName}
        />

        <span className="absolute right-1 bottom-1 size-2 rounded-full border border-background bg-emerald-500" />
      </button>
    </DropdownMenuTrigger>
  ) : collapsed ? (
    <div className={cn("flex justify-center", className)}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <button
              id={`${id}-trigger`}
              type="button"
              className="group relative grid size-10 cursor-pointer place-items-center rounded-xl border border-sidebar-border bg-sidebar-accent/10 transition-all duration-200 hover:border-primary/25 hover:bg-sidebar-accent/25 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none active:scale-95"
              aria-label="User settings"
            >
              <ProfileAvatar
                className="size-7 border border-sidebar-border/80 transition-transform duration-200 group-hover:scale-105"
                fallbackClassName="bg-primary text-xs font-semibold text-primary-foreground"
                initials={initials}
                src={avatarSrc}
                title={displayName}
              />

              <span className="absolute right-0 bottom-0 size-2 rounded-full border border-sidebar bg-emerald-500" />
            </button>
          </DropdownMenuTrigger>
        </TooltipTrigger>

        <TooltipContent side="right" className="text-xs">
          <div className="font-semibold">{displayName}</div>
          <div className="text-xs text-muted-foreground capitalize">
            {roleLabel}
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  ) : (
    <DropdownMenuTrigger asChild>
      <button
        id={`${id}-trigger`}
        type="button"
        className={cn(
          "group flex w-full items-center gap-3.5 rounded-2xl border border-primary/10 bg-primary/[0.03] p-4 text-left transition-all duration-200 hover:border-primary/20 hover:bg-primary/[0.06] focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none active:scale-[0.98] dark:border-zinc-800/80 dark:bg-zinc-900/30 dark:hover:bg-zinc-900/60",
          className
        )}
      >
        <div className="relative shrink-0">
          <ProfileAvatar
            className="size-12 border border-primary/10 transition-transform duration-200 group-hover:scale-105 dark:border-zinc-800"
            fallbackClassName="bg-primary text-sm font-bold text-primary-foreground"
            initials={initials}
            src={avatarSrc}
            title={displayName}
          />

          <span className="absolute right-0.5 bottom-0.5 size-3 rounded-full border-2 border-white bg-emerald-500 shadow-xs dark:border-zinc-950" />
        </div>

        <div className="min-w-0 flex-1">
          <div
            className={cn(
              "text-zinc-900 dark:text-zinc-100 transition-colors duration-200 group-hover:text-primary break-words line-clamp-2",
              displayName.length > 20
                ? "text-xs leading-tight font-bold"
                : "text-sm font-bold"
            )}
            title={displayName}
          >
            {displayName}
          </div>

          <div className="mt-0.5 truncate text-xs font-semibold text-primary capitalize">
            {roleLabel}
          </div>
        </div>

        <ChevronDown className="size-4 shrink-0 text-zinc-400 transition-all duration-200 group-hover:scale-110 group-hover:text-primary dark:text-zinc-500" />
      </button>
    </DropdownMenuTrigger>
  )

  return (
    <DropdownMenu>
      {trigger}

      <DropdownMenuContent
        side={isHeader ? "bottom" : collapsed ? "right" : "top"}
        align={collapsed ? "center" : "end"}
        sideOffset={12}
        className="w-56 rounded-xl border border-border/60 bg-popover/98 p-1 shadow-lg backdrop-blur-md"
      >
        <DropdownMenuItem
          onClick={handleProfileRedirect}
          className="group flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 font-medium transition-all duration-150 hover:translate-x-0.5 hover:bg-primary/10 hover:text-primary"
        >
          <span className="flex items-center gap-2">
            <User className="size-5 text-primary transition-colors duration-150" />
            <span>Profile</span>
          </span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleSettingsRedirect}
          className="group flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 font-medium transition-all duration-150 hover:translate-x-0.5 hover:bg-primary/10 hover:text-primary"
        >
          <span className="flex items-center gap-2">
            <Settings className="size-5 text-primary transition-colors duration-150" />
            <span>Account settings</span>
          </span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 bg-border/40" />

        <DropdownMenuItem
          className="group flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 font-medium transition-all duration-150 hover:translate-x-0.5 hover:bg-destructive/10 hover:text-destructive"
          onClick={handleLogout}
        >
          <span className="flex items-center gap-2">
            <LogOut className="size-5 text-destructive transition-colors duration-150" />
            <span>Sign out</span>
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { ProfileMenu }
