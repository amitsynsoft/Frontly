import { Building2, Crown, Sparkles } from "lucide-react"

import {
  subscriptionOnboardingCopy,
  subscriptionPlanPresentation,
} from "@/app/(dashboard)/dashboard/settings/_components/tabs/_components/config/subscription-onboarding.config"
import type { SubscriptionPlan } from "@/app/(dashboard)/dashboard/settings/_components/tabs/_components/types/subscription-onboarding.types"
import type { SubscriptionPlanDTO } from "@/types/dtos/subscription.dto"

const planIcons = [Building2, Sparkles, Crown]

function getPlanName(plan: SubscriptionPlanDTO) {
  return (
    plan.title?.trim() ||
    plan.name?.trim() ||
    subscriptionOnboardingCopy.planFallback.name
  )
}

function getPlanDescription(plan: SubscriptionPlanDTO) {
  return plan.description?.trim() || null
}

function getPlanFeatures(plan: SubscriptionPlanDTO) {
  if (Array.isArray(plan.features) && plan.features.length) {
    return plan.features
  }

  if (typeof plan.features === "string" && plan.features.trim()) {
    return plan.features
      .split(/\r?\n|,/)
      .map((feature) => feature.trim())
      .filter(Boolean)
  }

  return []
}

function getCurrencyCode(plan: SubscriptionPlanDTO) {
  return plan.currency?.code?.trim().toUpperCase() || "USD"
}

function getCurrencySymbol(plan: SubscriptionPlanDTO) {
  return plan.currency?.symbol?.trim() || "$"
}

function getPriceAmount(plan: SubscriptionPlanDTO) {
  const amount =
    typeof plan.amount === "number" ? plan.amount : Number(plan.amount)

  return Number.isFinite(amount) ? amount : 0
}

function formatPlanPrice(plan: SubscriptionPlanDTO) {
  const amount = getPriceAmount(plan)
  const currencyCode = getCurrencyCode(plan)

  try {
    return new Intl.NumberFormat("en-US", {
      currency: currencyCode,
      maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
      style: "currency",
    }).format(amount)
  } catch {
    return `${getCurrencySymbol(plan)}${amount.toLocaleString("en-US")}`
  }
}

function getBillingPeriodLabel(plan: SubscriptionPlanDTO) {
  const interval = plan.interval ?? plan.type

  if (!interval) {
    return subscriptionOnboardingCopy.checkoutSummary.monthlySuffix
  }

  return `/ ${interval.toLowerCase()}`
}

function getSeatLimit(features: string[]) {
  return features[0] ?? null
}

export function mapSubscriptionPlan(
  plan: SubscriptionPlanDTO,
  index: number
): SubscriptionPlan {
  const presentation =
    subscriptionPlanPresentation[index] ??
    subscriptionPlanPresentation[subscriptionPlanPresentation.length - 1]
  const features = getPlanFeatures(plan)

  return {
    badge: presentation.badge,
    billingPeriodLabel: getBillingPeriodLabel(plan),
    description: getPlanDescription(plan),
    features,
    highlighted:
      "highlighted" in presentation ? presentation.highlighted : false,
    icon: presentation.icon ?? planIcons[index % planIcons.length],
    id: plan.id,
    name: getPlanName(plan),
    priceAmount: getPriceAmount(plan),
    priceLabel: formatPlanPrice(plan),
    seatLimit: getSeatLimit(features),
    status: plan.status,
    stripePriceId: plan.pricingPlanId ?? null,
  }
}

export function mapSubscriptionPlans(plans: SubscriptionPlanDTO[] = []) {
  return plans.map(mapSubscriptionPlan)
}
