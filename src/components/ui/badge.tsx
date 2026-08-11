import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils/cn.utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center rounded-md border px-2 py-0.5 font-medium whitespace-nowrap transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-xs",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive/10 text-destructive dark:bg-destructive/20",
        outline: "text-foreground",
        muted:
          "border-transparent bg-muted text-muted-foreground hover:bg-muted/80",
        success:
          "border-transparent bg-status-completed/15 text-status-completed",
        warning: "border-transparent bg-status-pending/15 text-status-pending",
        info: "border-transparent bg-status-confirmed/15 text-status-confirmed",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
