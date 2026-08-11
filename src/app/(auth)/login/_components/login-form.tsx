"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormProvider, useForm } from "react-hook-form"

import { FormInput } from "@/components/forms/form-input"
import { Button } from "@/components/ui/button"
import { DASHBOARD_ROUTES, SUBSCRIPTION_ROUTES } from "@/constants/routes"
import { requiresSubscriptionForRoles } from "@/lib/utils/subscription-utils/subscription-access"
import { useAuth } from "@/hooks/useAuth"
import { getRolesFromSources } from "@/lib/permissions/role-normalization"
import { useLoginMutation } from "@/store/api/auth.api"
import { LoginFormValues, loginSchema } from "./loginform-schema"

function LoginForm() {
  const router = useRouter()
  const { setUser } = useAuth()
  const [login, { isLoading }] = useLoginMutation()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: LoginFormValues) {
    try {
      const response = await login(values).unwrap()
      const { accessToken, user } = response
      const roles = getRolesFromSources(user.roles, user.role)
      const needsSubscription = requiresSubscriptionForRoles(roles)
      const redirectPath = needsSubscription
        ? SUBSCRIPTION_ROUTES.onboarding
        : DASHBOARD_ROUTES.dashboard

      setUser(user, accessToken)
      router.replace(redirectPath)
      router.refresh()
    } catch {
      // The API layer displays the error toast.
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormInput
          name="email"
          label="Email"
          type="email"
          placeholder="Eg: example@email.com"
        />

        {/* Password field with eye toggle */}
        <div className="relative">
          <FormInput
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
          />
        </div>

        <Button
          type="submit"
          className="group relative mt-2 h-11 w-full overflow-hidden shadow-md shadow-primary/10 transition-all duration-300 hover:shadow-primary/20"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <span className="flex items-center justify-center gap-1.5 font-semibold">
              Sign in
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          )}
        </Button>
      </form>

      <div className="mt-2 flex w-full justify-end">
        <Link
          href="/forgot-password"
          className="text-xs font-semibold text-primary underline-offset-4 transition-colors duration-200 hover:text-primary/80 hover:underline"
        >
          Forgot password?
        </Link>
      </div>
    </FormProvider>
  )
}

export { LoginForm }
