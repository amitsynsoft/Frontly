"use client"

import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"

type SuccessStateProps = {
  title: string
  message: string
  actionLabel?: string
  onAction?: () => void
}

function SuccessState({
  actionLabel,
  message,
  title,
  onAction,
}: SuccessStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover="hover"
      className="flex min-h-56 flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-emerald-500/25 bg-emerald-500/5 p-6 text-center shadow-xs backdrop-blur-xs transition-colors duration-300 hover:border-emerald-500/40 dark:bg-emerald-950/5"
    >
      <motion.div
        variants={{
          hover: { scale: 1.05, y: -2 },
        }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        className="relative flex size-12 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
      >
        <CheckCircle2 className="size-5" />
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
          className="h-8 rounded-lg text-xs font-medium shadow-2xs transition-all duration-200 hover:border-transparent hover:bg-emerald-600 hover:text-white"
        >
          {actionLabel}
        </Button>
      ) : null}
    </motion.div>
  )
}

export { SuccessState }
