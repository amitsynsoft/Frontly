"use client"

import * as React from "react"

import { cn } from "@/lib/utils/cn.utils"

type BrandLogoVariant = "full" | "mark"

type BrandLogoProps = {
  brandName: string
  className?: string
  imgClassName?: string
  logoSrc?: string | null
  showSystemFallback?: boolean
  variant?: BrandLogoVariant
}

function BrandLogo({
  brandName,
  className,
  imgClassName,
  logoSrc,
  showSystemFallback = true,
  variant = "full",
}: BrandLogoProps) {
  const [failedLogo, setFailedLogo] = React.useState<string | null>(null)
  const normalizedLogo = logoSrc?.trim() ?? ""
  const showTenantLogo = Boolean(
    normalizedLogo && failedLogo !== normalizedLogo
  )

  if (showTenantLogo) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={normalizedLogo}
        alt={brandName}
        onError={() => setFailedLogo(normalizedLogo)}
        className={cn("object-contain", imgClassName ?? className)}
      />
    )
  }

  if (!showSystemFallback) {
    return null
  }

  return (
    <SystemLogo ariaLabel={brandName} className={className} variant={variant} />
  )
}

type SystemLogoProps = {
  ariaLabel: string
  className?: string
  variant?: BrandLogoVariant
}

function SystemLogo({
  ariaLabel,
  className,
  variant = "full",
}: SystemLogoProps) {
  const isMark = variant === "mark"

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={isMark ? "/favicon.svg" : "/logo.png"}
      alt={ariaLabel}
      className={cn("object-contain", className)}
    />
  )
}

export { BrandLogo, SystemLogo }
