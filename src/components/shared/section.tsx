import * as React from "react"

import { Container } from "@/components/shared/container"
import { cn } from "@/lib/utils/cn.utils"

type SectionProps = React.ComponentProps<"section"> & {
  title?: string
  description?: string
  containerSize?: "sm" | "md" | "lg" | "xl"
}

function Section({
  children,
  className,
  containerSize = "lg",
  description,
  title,
  ...props
}: SectionProps) {
  return (
    <section className={cn("py-10", className)} {...props}>
      <Container size={containerSize} className="grid gap-6">
        {title ? (
          <div className="max-w-3xl">
            <h2 className="text-xl font-semibold tracking-normal md:text-2xl">
              {title}
            </h2>
            {description ? (
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
        ) : null}
        {children}
      </Container>
    </section>
  )
}

export { Section }
