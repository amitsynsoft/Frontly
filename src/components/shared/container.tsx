import * as React from "react"

import { cn } from "@/lib/utils/cn.utils"

type ContainerProps = React.ComponentProps<"div"> & {
  size?: "sm" | "md" | "lg" | "xl"
}

const containerSizes = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-[1440px]",
}

function Container({ className, size = "lg", ...props }: ContainerProps) {
  return (
    <div
      data-slot="container"
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        containerSizes[size],
        className
      )}
      {...props}
    />
  )
}

export { Container }
