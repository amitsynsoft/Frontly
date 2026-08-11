"use client"

import { motion } from "framer-motion"
import { Inbox } from "lucide-react"

import { Button } from "@/components/ui/button"

type EmptyStateProps = {
  title: string
  message: string
  actionLabel?: string
  onAction?: () => void
}

function EmptyState({
  actionLabel,
  message,
  title,
  onAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover="hover"
      className="flex min-h-56 flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-muted/80 bg-card/40 p-6 text-center shadow-xs backdrop-blur-xs transition-colors duration-300 hover:border-primary/30"
    >
      <motion.div
        variants={{
          hover: { scale: 1.05, y: -2 },
        }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        className="relative flex size-12 items-center justify-center rounded-full border border-muted bg-muted/60 text-muted-foreground/80"
      >
        <Inbox className="size-5" />
      </motion.div>

      <div className="grid gap-1">
        <h3 className="text-sm font-semibold tracking-tight text-foreground/90">
          {title}
        </h3>
        <p className="max-w-xs text-xs leading-normal text-muted-foreground">
          {message}
        </p>
      </div>

      {actionLabel ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAction}
          className="h-8 rounded-lg text-xs font-medium shadow-2xs transition-all duration-200 hover:border-transparent hover:bg-primary hover:text-primary-foreground"
        >
          {actionLabel}
        </Button>
      ) : null}
    </motion.div>
  )
}

export { EmptyState }
