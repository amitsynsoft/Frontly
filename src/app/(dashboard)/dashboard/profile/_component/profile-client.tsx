"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { skipToken } from "@reduxjs/toolkit/query"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { PageContainer } from "@/components/layouts/page-container"
import { PageHeader } from "@/components/layouts/page-header"
import { Section } from "@/components/shared/section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  useChangePasswordMutation,
  useGetProfileQuery,
} from "@/store/api/auth.api"
import { useAppSelector } from "@/store/hooks"

import { PasswordFormCard } from "./password-form-card"
import { ProfileFormCard } from "./profile-form-card"
import {
  PasswordFormValues,
  passwordSchema,
  ProfileFormValues,
  profileSchema,
} from "./profile-schema"

function getErrorMessage(error: unknown, fallback: string) {
  if (!error || typeof error !== "object" || !("data" in error)) {
    return fallback
  }

  const data = (error as { data?: unknown }).data

  if (!data || typeof data !== "object" || !("message" in data)) {
    return fallback
  }

  const message = (data as { message?: unknown }).message

  return typeof message === "string" && message ? message : fallback
}

export default function ProfileClient() {
  /*
    |--------------------------------------------------------------------------
    | Token
    |--------------------------------------------------------------------------
    */

  const token = useAppSelector((state) => state.user.token)

  /*
    |--------------------------------------------------------------------------
    | Profile Query
    |--------------------------------------------------------------------------
    */

  const { data: user, isLoading: isProfileLoading } = useGetProfileQuery(
    token ?? skipToken,
    {
      refetchOnMountOrArgChange: true,
    }
  )

  /*
    |--------------------------------------------------------------------------
    | Change Password
    |--------------------------------------------------------------------------
    */

  const [changePassword, { isLoading }] = useChangePasswordMutation()

  /*
    |--------------------------------------------------------------------------
    | Profile Form
    |--------------------------------------------------------------------------
    */

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),

    defaultValues: {
      fullName: "",
      email: "",
      mobileNumber: "",
    },
  })

  /*
    |--------------------------------------------------------------------------
    | Password Form
    |--------------------------------------------------------------------------
    */

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),

    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  /*
    |--------------------------------------------------------------------------
    | Prefill Form
    |--------------------------------------------------------------------------
    */

  useEffect(() => {
    if (!user) return

    profileForm.reset({
      email: user.email || "",
    })
  }, [user, profileForm])

  /*
    |--------------------------------------------------------------------------
    | Profile Submit
    |--------------------------------------------------------------------------
    */

  const onProfileSubmit = async (data: ProfileFormValues) => {
    try {
      console.log(data)

      toast.success("Profile updated")
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to update profile"))
    }
  }

  /*
    |--------------------------------------------------------------------------
    | Password Submit
    |--------------------------------------------------------------------------
    */

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap()

      passwordForm.reset()
    } catch {
      // Errors are handled by the RTK query logger middleware.
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Profile settings"
        description="Manage your profile and security settings."
      />

      <Section>
        <Tabs defaultValue="profile" className="w-full">
          <TabsList>
            <TabsTrigger value="profile">Update Profile</TabsTrigger>

            <TabsTrigger value="password">Change Password</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <div className="max-w-4xl">
              <ProfileFormCard
                form={profileForm}
                isLoading={isProfileLoading}
                onSubmit={onProfileSubmit}
              />
            </div>
          </TabsContent>

          <TabsContent value="password" className="mt-6">
            <div className="max-w-2xl">
              <PasswordFormCard
                form={passwordForm}
                isLoading={isLoading}
                onSubmit={onPasswordSubmit}
              />
            </div>
          </TabsContent>
        </Tabs>
      </Section>
    </PageContainer>
  )
}
