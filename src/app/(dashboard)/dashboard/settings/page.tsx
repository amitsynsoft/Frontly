"use client"

import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { PageContainer } from "@/components/layouts/page-container"
import { PageHeader } from "@/components/layouts/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockSettingsSections } from "@/app/(dashboard)/dashboard/settings/_components/settings.label"
import { useAuth } from "@/hooks/useAuth"
import { ROLES } from "@/lib/permissions/roles"
import { ProfileSettings } from "./_components/tabs/profile-settings"
import { SubscriptionSettings } from "./_components/tabs/subscription-settings"
import { ThemeCustomizer } from "./_components/tabs/theme-customizer"

function SettingsContent() {
  const { primaryRole } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isOrgAdmin = primaryRole === ROLES.ORGANIZATION_ADMIN

  const visibleSections = mockSettingsSections.filter((section) => {
    if (section.id === "subscription") {
      return isOrgAdmin
    }
    return true
  })

  const tabParam = searchParams.get("tab")
  const defaultTab = "profile"
  const activeTab =
    tabParam && visibleSections.some((s) => s.id === tabParam)
      ? tabParam
      : defaultTab

  const handleTabChange = (value: string) => {
    router.push(`/dashboard/settings?tab=${value}`)
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="mb-4 w-full justify-start overflow-x-auto sm:w-fit">
        {visibleSections.map((section) => (
          <TabsTrigger key={section.id} value={section.id}>
            {section.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {visibleSections.map((section) => (
        <TabsContent key={section.id} value={section.id}>
          {section.id === "profile" && <ProfileSettings />}
          {section.id === "subscription" && <SubscriptionSettings />}
          {section.id === "tenant-theme" && <ThemeCustomizer />}
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default function SettingsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Settings"
        description="Foundation for theme appearance, profile settings, and subscription configuration."
      />
      <Suspense
        fallback={
          <div className="h-40 w-full animate-pulse rounded-lg bg-muted/40" />
        }
      >
        <SettingsContent />
      </Suspense>
    </PageContainer>
  )
}
