export type SubscriptionCurrencyDTO = {
  code?: string | null
  id?: number
  name?: string | null
  symbol?: string | null
}

export type SubscriptionPlanDTO = {
  amount: number | string
  createdAt?: string
  currency?: SubscriptionCurrencyDTO | null
  currencyId?: number
  description?: string | null
  features?: string[] | string | null
  id: number
  interval?: string | null
  name?: string | null
  pricingPlanId?: string | null
  status?: string | null
  title?: string | null
  type?: string | null
  updatedAt?: string
}

export type CurrentSubscriptionDTO = {
  id: number
  tenantUserId: number
  tenantId: number
  subscriptionPlanId: number
  paymentGatewaySubscriptionId: string
  paymentGatewayCustomerId: string
  startDate: string
  endDate: string
  nextBillingDate: string
  isActive: boolean
  isSubscriptionCancelled: boolean
  status?: string | null
  cancelledAt: string | null
  createdAt: string
  updatedAt: string
  subscriptionPlan: {
    id: number
    title: string
    type: string
    pricingPlanId: string
    amount: string
    currencyId: number
    status: string
    features: string[]
    createdAt: string
    updatedAt: string
    currency: {
      id: number
      name: string
      symbol: string
    }
  }
  tenant: {
    id: number
    name: string
  }
}

export type SubscribeTenantRequestDTO = {
  planId: number
}

export type SubscribeTenantResponseDTO = {
  checkoutUrl: string
  status: string //pending_payment or paid or anything else as well
}

export type SubscriptionDTO = SubscriptionPlanDTO

export type CheckSubscriptionResponseDTO = {
  customerEmail: string
  paymentStatus: string //paid
  sessionId: string
  status: string //complete
}
