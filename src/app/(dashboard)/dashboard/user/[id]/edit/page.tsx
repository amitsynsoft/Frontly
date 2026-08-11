"use client"

import { ArrowLeft, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"
import { toast } from "sonner"

import { PageContainer } from "@/components/layouts/page-container"
import { Button } from "@/components/ui/button"
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "@/store/api/user.api"

import { UserForm } from "../../components/forms/user-form"

interface EditUserPageProps {
  params: Promise<{ id: string }>
}

export default function EditUserPage({ params }: EditUserPageProps) {
  const router = useRouter()
  const { id } = React.use(params)

  const {
    data: user,
    isLoading: isLoadingData,
    error,
  } = useGetUserByIdQuery(id)

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()

  const handleSubmit = async (payload: any) => {
    try {
      await updateUser({ id, body: payload }).unwrap()

      router.push("/dashboard/user")
    } catch (err: any) {
      const errorMsg =
        err?.data?.message || err?.message || "Failed to update user."
      console.log("User update failed:", errorMsg)
    }
  }

  // Safely extract user object if wrapped in data or result
  const userData = React.useMemo(() => {
    if (!user) return undefined
    return (user as any).result || (user as any).data || user
  }, [user])

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
        <h1 className="text-2xl font-bold tracking-tight">Edit User</h1>
        <p className="text-sm text-muted-foreground">
          Update user profile details, roles, and service associations.
        </p>
      </div>

      <div className="mt-6">
        {isLoadingData ? (
          <div className="flex h-64 items-center justify-center rounded-lg border border-border/50 bg-background/50">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error || !userData ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive">
            <p className="font-semibold">Failed to load user details</p>
            <p className="text-xs text-muted-foreground">
              Please check the ID and try again.
            </p>
          </div>
        ) : (
          <UserForm
            user={userData}
            onSubmit={handleSubmit}
            isSubmitting={isUpdating}
            onCancel={() => router.push("/dashboard/user")}
          />
        )}
      </div>
    </PageContainer>
  )
}
