"use client"

import { ChevronDown, LogOut, Settings, User as UserIcon } from "lucide-react"
import { useRouter } from "next/navigation"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils/cn.utils"

interface ProfileCardProps {
  className?: string
}

function ProfileCard({ className }: ProfileCardProps) {
  const { displayName, logout, primaryRole, user } = useAuth()
  const router = useRouter()

  if (!user) return null

  const email = user.email ?? ""
  const avatarSeed = displayName || email || "User"
  const profilePic =
    typeof user.profilePic === "string" &&
    user.profilePic.trim() &&
    user.profilePic.trim() !== "null" &&
    user.profilePic.trim() !== "undefined"
      ? user.profilePic.trim()
      : null
  const initials = avatarSeed
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
  const roleName = primaryRole?.replaceAll("_", " ").toLowerCase() ?? "user"

  const handleLogout = () => {
    logout()
    router.replace("/login")
    router.refresh()
  }

  return (
    <div className={cn("flex items-center", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "group relative h-12 rounded-xl",
              "border border-border",
              "bg-background",
              "hover:border-border hover:bg-accent",
              "shadow-sm",
              "text-foreground",
              "transition-all duration-200",
              "focus-visible:ring-2 focus-visible:ring-ring",
              "flex items-center gap-3 px-3"
            )}
          >
            <div className="hidden min-w-0 flex-col items-end text-right sm:flex">
              <span className="max-w-[140px] truncate text-sm leading-none font-semibold text-foreground">
                {displayName}
              </span>
              <span className="mt-1 max-w-[140px] truncate text-xs text-muted-foreground capitalize">
                {roleName}
              </span>
            </div>

            <div className="relative shrink-0">
              <Avatar
                className={cn(
                  "size-9 border border-border",
                  "shadow-sm transition-transform duration-200",
                  "group-hover:scale-105"
                )}
              >
                {profilePic ? (
                  <AvatarImage src={profilePic} alt={displayName} />
                ) : null}
                <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-background bg-emerald-500" />
            </div>

            <ChevronDown
              className={cn(
                "hidden size-4 text-muted-foreground transition-transform duration-200",
                "group-data-[state=open]:rotate-180 sm:block"
              )}
            />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={10}
          className={cn(
            "w-64 rounded-xl border border-border",
            "bg-popover text-popover-foreground",
            "p-2 shadow-xl"
          )}
        >
          <DropdownMenuLabel className="px-3 py-2">
            <div className="flex items-center gap-3">
              <Avatar className="size-10 border border-border">
                {profilePic ? (
                  <AvatarImage src={profilePic} alt={displayName} />
                ) : null}
                <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {displayName}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {email}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => router.push("/dashboard/profile")}
            className={cn(
              "cursor-pointer rounded-lg px-3 py-2.5",
              "transition-all duration-200",
              "hover:bg-accent hover:text-accent-foreground",
              "focus:bg-accent focus:text-accent-foreground"
            )}
          >
            <UserIcon className="mr-2 size-4" />
            <span className="text-sm">Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push("/dashboard/settings")}
            className={cn(
              "cursor-pointer rounded-lg px-3 py-2.5",
              "transition-all duration-200",
              "hover:bg-accent hover:text-accent-foreground",
              "focus:bg-accent focus:text-accent-foreground"
            )}
          >
            <Settings className="mr-2 size-4" />
            <span className="text-sm">Account Settings</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogout}
            className={cn(
              "cursor-pointer rounded-lg px-3 py-2.5",
              "text-destructive transition-all duration-200",
              "hover:bg-destructive/10 hover:text-destructive",
              "focus:bg-destructive/10 focus:text-destructive"
            )}
          >
            <LogOut className="mr-2 size-4" />
            <span className="text-sm">Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export { ProfileCard }
