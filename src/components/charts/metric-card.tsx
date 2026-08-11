"use client"

import { motion } from "framer-motion"
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  Minus, 
  CalendarDays, 
  Coins, 
  Activity, 
  Users, 
  TrendingUp,
  Building2,
  CreditCard,
  Globe
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils/cn.utils"

const iconMap: Record<string, React.ComponentType<any>> = {
  "bookings today": CalendarDays,
  "revenue today": Coins,
  "utilization": Activity,
  "retention rate": Users,
  "total tenants": Building2,
  "active tenants": Building2,
  "recent tenants": Building2,
  "tenant growth": TrendingUp,
}

type MetricCardProps = {
  label: string
  value: string
  delta: string
  tone?: "neutral" | "positive" | "warning"
  index?: number
}

function MetricCard({
  delta,
  label,
  tone = "neutral",
  value,
  index,
}: MetricCardProps) {
  const DeltaIcon =
    tone === "positive"
      ? ArrowUpRight
      : tone === "warning"
        ? ArrowDownRight
        : Minus

  const lowercaseLabel = (label || "").toLowerCase()
  let FeatureIcon = iconMap[lowercaseLabel]
  if (!FeatureIcon) {
    if (lowercaseLabel.includes("tenant")) {
      FeatureIcon = Building2
    } else if (lowercaseLabel.includes("subscription") || lowercaseLabel.includes("plan")) {
      FeatureIcon = CreditCard
    } else if (lowercaseLabel.includes("revenue") || lowercaseLabel.includes("mrr") || lowercaseLabel.includes("sales")) {
      FeatureIcon = Coins
    } else if (lowercaseLabel.includes("user") || lowercaseLabel.includes("customer")) {
      FeatureIcon = Users
    } else {
      FeatureIcon = TrendingUp
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.45, 
        delay: index !== undefined ? index * 0.08 : 0,
        ease: [0.16, 1, 0.3, 1]
      }}
      whileHover={{ y: -5, transition: { duration: 0.2, ease: "easeOut" } }}
      className="h-full"
    >
      <Card className="group relative h-full overflow-hidden border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-black/5 dark:bg-card/30 dark:hover:bg-card/50 dark:hover:shadow-black/20">
        {/* Glow Line Indicator */}
        <div className={cn(
          "h-[3px] w-full transition-all duration-300",
          tone === "positive" && "bg-primary shadow-[0_1px_6px_var(--primary)]",
          tone === "warning" && "bg-amber-500 shadow-[0_1px_6px_rgba(245,158,11,0.3)]",
          tone === "neutral" && "bg-muted-foreground/30"
        )} />
        
        {/* Decorative Background Mesh Glow */}
        <div className={cn(
          "absolute -right-12 -top-12 size-36 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100",
          tone === "positive" && "bg-primary/10 dark:bg-primary/15",
          tone === "warning" && "bg-amber-500/10 dark:bg-amber-500/15",
          tone === "neutral" && "bg-primary/10 dark:bg-primary/15"
        )} />

        <CardHeader className="p-5 pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <CardDescription className="text-xs font-bold tracking-wider text-muted-foreground/80 uppercase">
                {label}
              </CardDescription>
              <CardTitle className="text-3xl font-black tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary/95">
                {value}
              </CardTitle>
            </div>
            
            <div className={cn(
              "flex size-11 items-center justify-center rounded-2xl shadow-xs transition-all duration-500 group-hover:scale-110 group-hover:shadow-md",
              tone === "positive" && "bg-primary/10 text-primary dark:bg-primary/20 group-hover:bg-primary group-hover:text-primary-foreground",
              tone === "warning" && "bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 group-hover:bg-amber-500 group-hover:text-white",
              tone === "neutral" && "bg-primary/10 text-primary dark:bg-primary/20 group-hover:bg-primary group-hover:text-primary-foreground"
            )}>
              <FeatureIcon className="size-5 transition-transform duration-500" />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-5 pt-0">
          <div
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-xs transition-colors duration-300",
              tone === "positive" &&
                "bg-primary/10 text-primary dark:bg-primary/20",
              tone === "warning" &&
                "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
              tone === "neutral" && "bg-muted/60 text-muted-foreground dark:bg-muted/20"
            )}
          >
            <DeltaIcon className="size-3.5" />
            <span>{delta}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export { MetricCard }
