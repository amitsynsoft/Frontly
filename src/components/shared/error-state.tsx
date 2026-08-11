"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Home, RefreshCcw } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils/cn.utils"

type ErrorStateProps = {
  className?: string
  details?: string
  message?: string
  onRetry?: () => void
  retryLabel?: string
  secondaryHref?: string
  secondaryLabel?: string
  title?: string
}

function ErrorState({
  className,
  details,
  title = "Unable to load this view",
  message = "Refresh the page or try again after a moment.",
  retryLabel = "Try again",
  secondaryHref,
  secondaryLabel = "Go to dashboard",
  onRetry,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className={cn("w-full max-w-lg", className)}
    >
      <Card className="border-dashed border-destructive/30 bg-card text-card-foreground">
        <CardHeader className="items-center text-center">
          <div className="grid size-12 place-items-center rounded-lg border border-destructive/20 bg-destructive/10 text-destructive">
            <AlertTriangle className="size-5" />
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="max-w-sm">{message}</CardDescription>
        </CardHeader>

        {details ? (
          <CardContent>
            <p className="rounded-md border bg-muted/40 px-3 py-2 font-mono text-xs text-muted-foreground">
              {details}
            </p>
          </CardContent>
        ) : null}

        {(onRetry || secondaryHref) && (
          <CardFooter className="justify-center gap-2">
            {onRetry ? (
              <Button type="button" size="sm" onClick={onRetry}>
                <RefreshCcw data-icon="inline-start" />
                {retryLabel}
              </Button>
            ) : null}
            {secondaryHref ? (
              <Button asChild variant="outline" size="sm">
                <Link href={secondaryHref}>
                  <Home data-icon="inline-start" />
                  {secondaryLabel}
                </Link>
              </Button>
            ) : null}
          </CardFooter>
        )}
      </Card>
    </motion.div>
  )
}

export { ErrorState }
