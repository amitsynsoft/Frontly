"use client"

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2, // CheckCircle2 often looks a bit more modern than CheckCircle
  Info,
  Loader2,
} from "lucide-react"
import { Toaster as Sonner } from "sonner"

export function ToastProvider() {
  return (
    <Sonner
      position="top-center"
      className="toaster group"
      closeButton
      duration={4000}
      icons={{
        success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
        info: <Info className="h-5 w-5 text-blue-500" />,
        warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
        error: <AlertCircle className="h-5 w-5 text-rose-500" />,
        loading: <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border/50 group-[.toaster]:shadow-xl group-[.toaster]:shadow-black/5 group-[.toaster]:rounded-xl !p-4 !pr-14 !items-start !gap-3 font-sans w-full sm:w-[356px]",

          content: "pr-2", // give the text container a bit of breathing room

          title:
            "group-[.toast]:font-medium group-[.toast]:text-md group-[.toast]:leading-normal",
          description:
            "group-[.toast]:text-muted-foreground group-[.toast]:text-sm group-[.toast]:mt-1.5 group-[.toast]:leading-relaxed",

          icon: "group-[.toast]:mt-1",

          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:font-medium group-[.toast]:rounded-lg group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-sm transition-all hover:group-[.toast]:brightness-110",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:font-medium group-[.toast]:rounded-lg group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-sm transition-all hover:group-[.toast]:bg-muted/80",

          closeButton:
            " !text-foreground !bg-muted !border-none !absolute !right-4 !top-4 !left-auto transition-colors h-6 w-6 flex items-center justify-center rounded-md",
        },
      }}
    />
  )
}
