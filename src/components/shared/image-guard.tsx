"use client"

import { motion } from "framer-motion"
import { ImageOff } from "lucide-react"
import Image from "next/image"
import * as React from "react"

import { cn } from "@/lib/utils/cn.utils"

type ImageGuardProps = {
  src?: string | null
  alt: string
  width?: number
  height?: number
  className?: string
}

function ImageGuard({
  alt,
  className,
  height = 360,
  src,
  width = 640,
}: ImageGuardProps) {
  const [hasError, setHasError] = React.useState(false)
  const shouldShowFallback = hasError || !src

  if (shouldShowFallback) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover="hover"
        className={cn(
          "relative grid aspect-video w-full place-items-center overflow-hidden rounded-xl border border-muted/50 shadow-xs transition-all duration-300",
          "bg-card bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-[size:16px_16px]",
          className
        )}
      >
        {/* Soft gradient overlay for depth */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-muted/20" />

        <div className="relative z-10 grid justify-items-center gap-3 text-center">
          <motion.div
            variants={{
              hover: { scale: 1.12, rotate: -5, y: -2 },
            }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="flex size-14 items-center justify-center rounded-full border border-muted/80 bg-background/80 text-muted-foreground/80 shadow-md backdrop-blur-xs"
          >
            <ImageOff className="size-6" />
          </motion.div>
          <div className="grid gap-0.5">
            <div className="text-sm font-semibold tracking-wide text-foreground/80">
              Image Unavailable
            </div>
            <div className="max-w-[200px] text-xs text-muted-foreground">
              The requested media asset could not be loaded
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover="hover"
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-xl border border-muted/30 shadow-xs",
        className
      )}
    >
      <motion.div
        variants={{
          hover: { scale: 1.04 },
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="h-full w-full"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          onError={() => setHasError(true)}
          className="h-full w-full object-cover"
        />
      </motion.div>
    </motion.div>
  )
}

export { ImageGuard }
