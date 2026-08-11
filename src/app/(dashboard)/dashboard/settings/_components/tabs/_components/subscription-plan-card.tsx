import { Check, type LucideIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { SubscriptionPlan } from "@/app/(dashboard)/dashboard/settings/_components/tabs/_components/types/subscription-onboarding.types"
import { cn } from "@/lib/utils/cn.utils"

type SubscriptionPlanCardProps = {
  disabled?: boolean
  onSelect: (planId: SubscriptionPlan["id"]) => void
  plan: SubscriptionPlan
  selected: boolean
  isCurrent?: boolean
}

function SubscriptionPlanCard({
  disabled = false,
  onSelect,
  plan,
  selected,
  isCurrent = false,
}: SubscriptionPlanCardProps) {
  const Icon = plan.icon as LucideIcon

  // Dynamically color badges based on their tag copy
  const getBadgeClassName = (badgeText: string) => {
    const text = badgeText.toLowerCase()
    if (text.includes("popular")) {
      return "bg-amber-500/10 hover:bg-amber-500/15 text-amber-700 dark:text-amber-400 font-semibold px-3 py-0.5 rounded-full border-none text-[15px]"
    }
    if (
      text.includes("best") ||
      text.includes("value") ||
      text.includes("scale")
    ) {
      return "bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-semibold px-3 py-0.5 rounded-full border-none text-[15px]"
    }
    return "bg-blue-500/10 hover:bg-blue-500/15 text-blue-700 dark:text-blue-400 font-semibold px-3 py-0.5 rounded-full border-none text-[15px]"
  }

  return (
    <Card
      onClick={() => {
        if (!disabled && !isCurrent) {
          onSelect(plan.id)
        }
      }}
      className={cn(
        "group flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-xs transition-all duration-300 ease-out",
        selected
          ? "-translate-y-0.5 scale-[1.01] border-primary shadow-xl ring-2 shadow-primary/5 ring-primary/20"
          : "border-border hover:-translate-y-1 hover:border-primary/40 hover:shadow-md",
        disabled && !isCurrent && "pointer-events-none opacity-60"
      )}
    >
      <CardHeader className="w-full px-6 pt-6 pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground">
            <Icon className="size-5.5" strokeWidth={2.2} />
          </div>
          {plan.badge ? (
            <Badge className={getBadgeClassName(plan.badge)}>
              {plan.badge}
            </Badge>
          ) : null}
        </div>
        <CardTitle className="mt-4 text-xl font-bold text-foreground transition-colors duration-200 group-hover:text-primary">
          {plan.name}
        </CardTitle>
        {plan.description ? (
          <CardDescription className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {plan.description}
          </CardDescription>
        ) : null}
      </CardHeader>

      <CardContent className="flex w-full flex-1 flex-col gap-6 px-6 pb-6">
        <div className="flex items-baseline">
          <span className="text-3xl font-extrabold tracking-tight text-foreground">
            {plan.priceLabel}
          </span>
          <span className="ml-1 text-xs font-medium text-muted-foreground">
            {plan.billingPeriodLabel}
          </span>
        </div>

        {plan.features.length ? (
          <ul className="flex flex-1 flex-col gap-3 text-sm">
            {plan.features.map((feature) => (
              <li
                className="flex items-start gap-2.5 text-xs text-muted-foreground"
                key={feature}
              >
                <div className="mt-0.5 flex shrink-0 items-center justify-center rounded-full bg-primary/10 p-0.5 text-primary">
                  <Check className="size-3" strokeWidth={3} />
                </div>
                <span className="leading-snug">{feature}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <Button
          disabled={disabled || isCurrent}
          className={cn(
            "mt-auto flex h-10.5 w-full items-center justify-center gap-2 rounded-lg border text-xs font-bold transition-all duration-300",
            selected
              ? "border-transparent bg-primary text-primary-foreground shadow-md shadow-primary/10 hover:bg-primary"
              : "border-primary/20 bg-transparent text-primary group-hover:scale-[1.01] hover:border-primary/50 hover:bg-primary/5",
            isCurrent &&
              "pointer-events-none cursor-default bg-primary/80 opacity-80"
          )}
          onClick={(e) => {
            e.stopPropagation()
            if (!disabled && !isCurrent) {
              onSelect(plan.id)
            }
          }}
          type="button"
          variant={selected ? "default" : "outline"}
        >
          <span>{isCurrent ? "Current plan" : "Choose plan"}</span>
        </Button>
      </CardContent>
    </Card>
  )
}

export { SubscriptionPlanCard }
