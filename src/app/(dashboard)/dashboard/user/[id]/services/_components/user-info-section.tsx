import { Briefcase, CalendarDays, Quote, ShieldCheck } from "lucide-react"
import dayjs from "dayjs"
import * as React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/shared/status-badge"
import { cn } from "@/lib/utils/cn.utils"

interface UserInfoSectionProps {
  email: string
  fullName?: string | null
  roles?: { id: number; name: string }[]
  profilePic?: string | null
  designation?: string
  status?: string
  bio?: string
  createdAt?: string
  size?: "sm" | "lg"
}

export function UserInfoSection({
  email,
  fullName,
  roles,
  profilePic,
  designation,
  status,
  bio,
  createdAt,
}: UserInfoSectionProps) {
  const uniqueRoles = React.useMemo(() => {
    const list = roles || []
    return list.filter(
      (role, index, self) => self.findIndex((r) => r.id === role.id) === index
    )
  }, [roles])

  const initial = React.useMemo(() => {
    const nameToUse = fullName || email || "U"
    return nameToUse[0].toUpperCase()
  }, [fullName, email])

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-6 rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-200 sm:flex-row sm:items-stretch"
      )}
    >
      {/* Info details and bio */}
      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
          {/* Avatar Wrapper with glow and circular padding */}
          <div className="relative shrink-0 self-start rounded-full bg-gradient-to-tr from-primary/5 to-primary/20 p-1 shadow-sm ring-1 ring-primary/15">
            <div className="rounded-full bg-background p-1">
              <Avatar className="h-20 w-20 rounded-full bg-muted/40">
                {profilePic ? (
                  <AvatarImage
                    src={profilePic}
                    alt={fullName || email || "User"}
                    className="!rounded-[inherit] object-cover"
                  />
                ) : null}
                <AvatarFallback className="!rounded-[inherit] bg-primary/10 text-xl font-bold text-primary dark:bg-primary/20 dark:text-primary">
                  {initial}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="text-xl leading-tight font-bold tracking-tight text-foreground">
              {fullName || "User Account"}
            </h3>
            <p className="text-sm text-muted-foreground select-all">{email}</p>
            {/* Details badges row */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 pt-1.5 text-sm">
              <div className="flex items-center gap-1.5 font-medium text-muted-foreground">
                <ShieldCheck className="size-4 text-muted-foreground/60" />
                <span>Role:</span>
                {uniqueRoles.length > 0 ? (
                  uniqueRoles.map((role) => (
                    <span
                      key={role.id}
                      className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary"
                    >
                      {role.name}
                    </span>
                  ))
                ) : (
                  <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                    No roles
                  </span>
                )}
              </div>
              {designation && (
                <>
                  <span className="text-muted-foreground/45">•</span>
                  <div className="flex items-center gap-1.5 font-medium text-muted-foreground">
                    <Briefcase className="size-4 text-muted-foreground/60" />
                    <span>Designation:</span>
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      {designation}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bio Section */}
        {bio && bio.trim() && (
          <div className="flex items-start gap-3 rounded-xl border border-primary/10 bg-primary/[0.03] p-4 dark:bg-primary/[0.02]">
            <Quote className="mt-0.5 size-5 shrink-0 text-primary/30" />
            <p className="text-sm leading-relaxed font-medium text-muted-foreground/90">
              {bio}
            </p>
          </div>
        )}
      </div>

      {/* Vertical divider line */}
      <div className="hidden w-[1px] self-stretch bg-border/60 sm:block" />

      {/* Right metadata column */}
      <div className="flex shrink-0 flex-col justify-center gap-5 border-t border-border/60 pt-5 sm:w-56 sm:border-t-0 sm:pt-0 sm:pl-6">
        {status && (
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold tracking-wider text-muted-foreground/80 uppercase">
              Account Status
            </span>
            <StatusBadge status={status} />
          </div>
        )}

        {status && createdAt && (
          <div className="hidden h-[1px] w-full bg-border/50 sm:block" />
        )}

        {createdAt && (
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold tracking-wider text-muted-foreground/80 uppercase">
              Member Since
            </span>
            <div className="flex items-center gap-2">
              <span className="shrink-0 rounded-lg border border-primary/10 bg-primary/5 p-2 text-primary">
                <CalendarDays className="size-4" />
              </span>
              <span className="text-sm font-semibold text-foreground">
                {dayjs(createdAt).format("MMM YYYY")}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
