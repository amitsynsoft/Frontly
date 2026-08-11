"use client"

import { Loader2, Mail, Phone, Save, User } from "lucide-react"
import { UseFormReturn } from "react-hook-form"

import { Form } from "@/components/forms/form"
import { PhoneField } from "@/components/forms/phonefield"
import TextField from "@/components/forms/textfield"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { ProfileFormValues } from "./profile-schema"

interface ProfileFormCardProps {
  form: UseFormReturn<ProfileFormValues>
  isLoading: boolean
  onSubmit: (data: ProfileFormValues) => void
}

export function ProfileFormCard({
  form,
  isLoading,
  onSubmit,
}: ProfileFormCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal information</CardTitle>

        <CardDescription>Update your personal details.</CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <TextField
                  form={form}
                  name="fullName"
                  label="Full name"
                  icon={User}
                  required
                />

                <TextField
                  form={form}
                  name="email"
                  label="Email"
                  icon={Mail}
                  disabled
                />

                <PhoneField
                  control={form.control}
                  name="mobileNumber"
                  label="Phone number"
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Save changes
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  )
}
