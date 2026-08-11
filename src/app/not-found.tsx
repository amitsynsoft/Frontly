"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Home } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { useAppSelector } from "@/store/hooks"

export default function NotFound() {
  const router = useRouter()
  const token = useAppSelector((state) => state.user.token)
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-background p-4 text-foreground">
      {/* Background radial glow & grid patterns */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] bg-[size:24px_24px]" />
      <div className="absolute top-1/2 left-1/2 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial-[at_50%_50%] from-primary/10 via-transparent to-transparent blur-3xl" />

      {/* Main Centered 404 Hero Section */}
      <div className="flex flex-col items-center text-center">
        {/* Large Hero 404 Text */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
          className="text-8xl font-black tracking-tight select-none sm:text-9xl md:text-[10rem]"
        >
          <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
            404
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Lost in Time?
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-4 max-w-md text-base text-muted-foreground sm:text-lg"
        >
          The page you are looking for doesn&apos;t exist, has been rescheduled,
          or was moved to another date.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Button
            onClick={() => router.back()}
            variant="outline"
            size="lg"
            className="gap-2 border-border shadow-xs hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </Button>
          <Button asChild size="lg" className="gap-2 shadow-sm">
            <Link href={mounted && token ? "/dashboard" : "/"}>
              <Home className="size-4" />
              {mounted && token ? "Go to Dashboard" : "Return Home"}
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
