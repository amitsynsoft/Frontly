import { Building2, Crown, Sparkles } from "lucide-react"

export const subscriptionOnboardingCopy = {
  checkout: {
    redirectingDescription:
      "Please wait while we open the secure Stripe checkout page.",
    redirectingTitle: "Redirecting to Payment Gateway",
    redirectUrlMissing:
      "Stripe checkout link was not returned. Please try again.",
    startFailedToast:
      "We could not start Stripe checkout. Please try again in a moment.",
  },
  checkoutSummary: {
    monthlySuffix: "/ month",
  },
  pageDescription:
    "Pick a plan, continue to Stripe checkout, and return here for activation.",
  pageDescriptionRedirecting:
    "You are being sent to Stripe to complete payment securely.",
  pageDescriptionSuccess:
    "Almost ready! Finalizing your workspace redirection.",
  pageTitle: "Choose your subscription",
  pageTitleRedirecting: "Redirecting to payment gateway",
  pageTitleSuccess: "Account activated",
  paymentSuccess: {
    actionLabel: "Try again",
    activationDescription:
      "Payment is confirmed. We are finalizing your workspace activation before opening the dashboard.",
    activationLabel: "Finalizing activation",
    activationTitle: "Finalizing subscription",
    backToPlansLabel: "Back to plans",
    dashboardLabel: "Opening dashboard",
    errorDescription:
      "We could not verify the checkout session. Please try again or choose a plan again.",
    errorTitle: "Payment verification failed",
    missingSessionDescription:
      "The checkout session is missing from the return URL. Please choose a plan again.",
    missingSessionTitle: "Checkout session missing",
    paidDescription:
      "Your subscription is active. Redirecting you to your dashboard.",
    paidTitle: "Subscription activated",
    pollingDescription:
      "Stripe has redirected you back. We are checking your subscription status.",
    pollingTitle: "Verifying payment",
    retryDescription:
      "Payment is not confirmed yet. Please choose a plan and try checkout again.",
    retryTitle: "Payment not completed",
  },
  paymentCancelled: {
    title: "Payment cancelled",
    description:
      "You have cancelled the payment process. No charges were made to your account. You can choose a plan to try again whenever you are ready.",
    backToPlansLabel: "Back to plans",
  },
  planFallback: {
    name: "Subscription plan",
  },
  plansEmpty: {
    description:
      "Subscription plans are not available yet. Please refresh or contact support.",
    retryLabel: "Refresh plans",
    title: "No plans available",
  },
  plansError: {
    description:
      "We could not load the subscription plans. Please refresh and try again.",
    retryLabel: "Try again",
    title: "Plans could not be loaded",
  },
  planAction: "Choose plan",
  processingFailedToast:
    "We could not confirm an active subscription yet. Please try again in a moment.",
  successToast: "Subscription activated.",
  trustItems: [
    "Hosted Stripe checkout",
    "Secure payment",
    "Automatic activation",
  ],
} as const

export const paymentSuccessVerificationConfig = {
  pollingIntervalMs: 2000,
  redirectDelayMs: 900,
} as const

export const subscriptionPlanPresentation = [
  {
    badge: "Launch",
    icon: Building2,
  },
  {
    badge: "Popular",
    highlighted: true,
    icon: Sparkles,
  },
  {
    badge: "Scale",
    icon: Crown,
  },
] as const
