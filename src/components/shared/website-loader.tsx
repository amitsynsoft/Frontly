"use client"

import { motion } from "framer-motion"
import { Landmark } from "lucide-react"

import { cn } from "@/lib/utils/cn.utils"

type WebsiteLoaderProps = {
  className?: string
  description?: string
  label?: string
}

function WebsiteLoader({
  className,
  label = "Loading workspace",
}: WebsiteLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn(
        "relative flex min-h-80 w-full flex-col items-center justify-center gap-5 bg-transparent p-8 text-center",
        className
      )}
    >
      {/* Soft Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 size-72 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full bg-primary/4 blur-3xl" />

      {/* Shining Logo Container */}
      <div className="relative flex items-center justify-center">
        <motion.div
          className="relative overflow-hidden"
          animate={{
            scale: [0.98, 1, 0.98],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Logo"
            className="h-10 w-auto select-none object-contain dark:brightness-0 dark:invert"
          />

          {/* Shimmer / Shine Sweep */}
          <motion.div
            className="absolute inset-y-0 -inset-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-20 pointer-events-none"
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 1,
            }}
            style={{ mixBlendMode: "overlay" }}
          />
        </motion.div>
      </div>

      {/* Crisp Minimal Spinner */}
      <div className="relative flex size-10 items-center justify-center">
        <motion.div
          className="size-7 rounded-full border-[3px] border-primary/15 border-t-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.85, ease: "linear", repeat: Infinity }}
        />
      </div>
    </div>
  )
}

export { WebsiteLoader }
