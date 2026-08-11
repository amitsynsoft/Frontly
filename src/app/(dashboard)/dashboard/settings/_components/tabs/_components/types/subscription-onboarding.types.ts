import type { LucideIcon } from "lucide-react"

export type SubscriptionPlan = {
  badge: string
  billingPeriodLabel: string
  description?: string | null
  features: string[]
  highlighted?: boolean
  icon: LucideIcon
  id: number
  name: string
  priceAmount: number
  priceLabel: string
  seatLimit?: string | null
  status?: string | null
  stripePriceId?: string | null
}
