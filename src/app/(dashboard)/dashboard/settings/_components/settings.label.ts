import type { SettingsSection } from "@/app/(dashboard)/dashboard/settings/_components/types"

export const mockSettingsSections: SettingsSection[] = [
  {
    id: "profile",
    title: "Profile Settings",
    description:
      "Update your personal profile details and organization profile settings.",
  },
  {
    id: "subscription",
    title: "Subscription Settings",
    description:
      "Manage subscription plans, check current plan status, and billing.",
  },
  {
    id: "tenant-theme",
    title: "Appearance",
    description:
      "Session-only colors, radius, sidebar density, and typography.",
  },
]
