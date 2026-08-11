import * as React from "react"

import { cn } from "@/lib/utils/cn.utils"

type TypographyProps = React.ComponentProps<"div"> & {
  variant:
    | "display"
    | "h1"
    | "h2"
    | "h3"
    | "lead"
    | "body"
    | "small"
    | "muted"
    | "code"
}

const typographyVariants: Record<TypographyProps["variant"], string> = {
  display: "text-4xl font-semibold tracking-normal md:text-5xl",
  h1: "text-3xl font-semibold tracking-normal",
  h2: "text-2xl font-semibold tracking-normal",
  h3: "text-lg font-semibold tracking-normal",
  lead: "text-base leading-7 text-muted-foreground md:text-lg",
  body: "text-sm leading-6",
  small: "text-xs font-medium",
  muted: "text-sm text-muted-foreground",
  code: "font-mono text-xs text-muted-foreground",
}

function Typography({ className, variant, ...props }: TypographyProps) {
  return (
    <div
      data-slot="typography"
      className={cn(typographyVariants[variant], className)}
      {...props}
    />
  )
}

export { Typography, typographyVariants }
