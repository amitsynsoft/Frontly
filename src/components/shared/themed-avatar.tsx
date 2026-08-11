"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils/cn.utils"

interface ThemedAvatarProps {
  src?: string | null
  alt: string
  fallbackText: string
  className?: string
}

export function ThemedAvatar({
  src,
  alt,
  fallbackText,
  className,
}: ThemedAvatarProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl bg-primary/10 p-0.5 shadow-sm ring-1 ring-primary/20 transition-all duration-200 hover:ring-primary/40 dark:ring-primary/30 size-11 shrink-0",
        className
      )}
    >
      <Avatar className="size-full !rounded-[inherit] bg-muted/40">
        {src ? (
          <AvatarImage
            src={src}
            alt={alt}
            className="!rounded-[inherit] object-cover"
          />
        ) : null}
        <AvatarFallback className="!rounded-[inherit] bg-primary/10 text-sm font-semibold text-primary dark:bg-primary/20 dark:text-primary">
          {fallbackText}
        </AvatarFallback>
      </Avatar>
    </div>
  )
}
