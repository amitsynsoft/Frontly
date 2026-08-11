"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { toast } from "sonner"

import { PageContainer } from "@/components/layouts/page-container"
import { Button } from "@/components/ui/button"
import { useCreateUserMutation } from "@/store/api/user.api"

import { UserForm } from "../components/forms/user-form"

export default function AddUserPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tenantId = searchParams.get("tenantId") || undefined

  const [createUser, { isLoading }] = useCreateUserMutation()

  const handleSubmit = async (payload: any) => {
    try {
      await createUser(payload).unwrap()

      router.push("/dashboard/user")
    } catch (err: any) {
      const errorMsg =
        err?.data?.message || err?.message || "Failed to create user."
      console.log("User creation failed:", err)
    }
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit gap-1.5 pl-0 text-muted-foreground hover:text-foreground"
          onClick={() => router.push("/dashboard/user")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to users
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Add User</h1>
        <p className="text-sm text-muted-foreground">
          Create a new user account and assign roles and services.
        </p>
      </div>

      <div className="mt-6">
        <UserForm
          onSubmit={handleSubmit}
          isSubmitting={isLoading}
          onCancel={() => router.push("/dashboard/user")}
          defaultTenantId={tenantId}
        />
      </div>
    </PageContainer>
  )
}
