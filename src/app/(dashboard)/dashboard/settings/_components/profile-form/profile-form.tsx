"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Save } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

import { Form } from "@/components/forms/form"
import { FormFileUpload } from "@/components/forms/form-file-upload"
import { FormInput } from "@/components/forms/form-input"
import { FormTextarea } from "@/components/forms/form-textarea"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { UserDTO } from "@/types/dtos/user.dto"

import { getProfileDefaultValues } from "./profile-form.config"
import { profileFormSchema } from "./profile-form.schema"
import type { ProfileFormValues } from "./profile-form.type"

interface ProfileFormProps {
  user?: UserDTO
  isLoading?: boolean
  isSaving?: boolean
  onSubmit: (values: ProfileFormValues) => void
}

export function ProfileForm({
  user,
  isLoading = false,
  isSaving = false,
  onSubmit,
}: ProfileFormProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: getProfileDefaultValues(user),
  })

  useEffect(() => {
    if (user) {
      form.reset(getProfileDefaultValues(user))
    }
  }, [user, form])

  return (
    <Card className="border border-border/50 bg-background/50 shadow-xl backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Update your personal details and avatar image.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormInput
                  name="fullName"
                  label="Full Name"
                  required
                  placeholder="John Doe"
                />

                <FormInput
                  name="email"
                  label="Email Address"
                  disabled
                  placeholder="john.doe@example.com"
                />

                <div className="col-span-full">
                  <FormFileUpload
                    name="profilePic"
                    label="Profile Picture"
                    acceptedFileTypes={["image/*"]}
                    maxSizeMB={3}
                    placeholder="Upload profile picture"
                    uploadType="profile"
                  />
                </div>

                <div className="col-span-full">
                  <FormTextarea
                    name="bio"
                    label="Bio"
                    placeholder="Write a short bio about yourself..."
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  )
}
