import * as React from "react"

import { cn } from "@/lib/utils/cn.utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  const hasValue = "value" in props
  const textareaProps = hasValue
    ? { ...props, value: props.value ?? "" }
    : props

  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/35 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30",
        className
      )}
      {...textareaProps}
    />
  )
}

export { Textarea }
