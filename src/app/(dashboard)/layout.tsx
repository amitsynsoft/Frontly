import AuthGuard from "@/components/auth/AuthGuard"
import { RoleRouteGuard } from "@/components/auth/RoleRouteGuard"
import { DashboardShell } from "@/components/layouts/dashboard-shell"
import { SubscriptionRouteGuard } from "@/app/(dashboard)/dashboard/settings/_components/tabs/_components/subscription-route-guard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <SubscriptionRouteGuard>
        <RoleRouteGuard>
          <DashboardShell>{children}</DashboardShell>
        </RoleRouteGuard>
      </SubscriptionRouteGuard>
    </AuthGuard>
  )
}
