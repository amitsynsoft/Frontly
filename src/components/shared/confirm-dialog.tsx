"use client"

import { AlertCircle, AlertTriangle, HelpCircle } from "lucide-react"
import * as React from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils/cn.utils"

type ConfirmDialogProps = {
  children: React.ReactNode
  title: string
  description: string
  confirmLabel?: string
  variant?: "default" | "destructive" | "warning"
  onConfirm?: () => void
}

function ConfirmDialog({
  children,
  confirmLabel = "Confirm",
  description,
  onConfirm,
  title,
  variant = "default",
}: ConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-md rounded-2xl border border-muted/50 bg-background/95 p-6 shadow-xl backdrop-blur-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-4">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full border sm:mx-0 sm:size-10",
              variant === "destructive" &&
                "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400",
              variant === "warning" &&
                "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
              variant === "default" &&
                "border-primary/20 bg-primary/10 text-primary dark:bg-primary/20"
            )}
          >
            {variant === "destructive" && <AlertTriangle className="size-5" />}
            {variant === "warning" && <AlertCircle className="size-5" />}
            {variant === "default" && <HelpCircle className="size-5" />}
          </div>
          <div className="grid gap-1 text-center sm:text-left">
            <AlertDialogTitle className="text-base font-semibold tracking-tight">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </AlertDialogDescription>
          </div>
        </div>
        <AlertDialogFooter className="mt-2 sm:gap-3">
          <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={cn(
              "rounded-lg font-medium",
              variant === "destructive" &&
                "border-transparent bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-600 dark:text-white dark:hover:bg-rose-700"
            )}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { ConfirmDialog }
