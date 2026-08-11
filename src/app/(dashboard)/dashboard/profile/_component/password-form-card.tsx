"use client"

import { Loader2, Lock } from "lucide-react"
import { UseFormReturn } from "react-hook-form"

import { Form } from "@/components/forms/form"
import TextField from "@/components/forms/textfield"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { PasswordFormValues } from "./profile-schema"

interface PasswordFormCardProps {
  form: UseFormReturn<PasswordFormValues>
  isLoading: boolean
  onSubmit: (data: PasswordFormValues) => void
}

export function PasswordFormCard({
  form,
  isLoading,
  onSubmit,
}: PasswordFormCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Password & Security</CardTitle>

        <CardDescription>
          Update your password to keep your account secure.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TextField
              form={form}
              name="currentPassword"
              label="Current password"
              type="password"
              icon={Lock}
              required
              placeholder="Enter current password"
            />

            <TextField
              form={form}
              name="newPassword"
              label="New password"
              type="password"
              icon={Lock}
              required
              placeholder="Enter new password"
            />

            <TextField
              form={form}
              name="confirmPassword"
              label="Confirm password"
              type="password"
              icon={Lock}
              required
              placeholder="Confirm new password"
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="mr-2 h-4 w-4" />
                )}
                Update password
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
