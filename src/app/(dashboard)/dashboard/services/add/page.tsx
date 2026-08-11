"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

import { PageContainer } from "@/components/layouts/page-container"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { ROLES } from "@/lib/permissions/roles"
import { useCreateBranchServiceMutation } from "@/store/api/branchservices.api"

import { ServiceForm } from "../_components/service-form"

export default function AddServicePage() {
  const router = useRouter()
  const { user, roles } = useAuth()
  const [createService, { isLoading }] = useCreateBranchServiceMutation()

  const isSuperAdmin = roles.includes(ROLES.SUPER_ADMIN)
  const currentUserTenantId = user?.tenantId ? Number(user.tenantId) : undefined

  const handleSubmit = async (payload: any) => {
    try {
      await createService(payload).unwrap()
      router.push("/dashboard/services")
    } catch {
      // Surfaced by RTK Query logger middleware
    }
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit gap-1.5 pl-0 text-muted-foreground hover:text-foreground"
          onClick={() => router.push("/dashboard/services")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to services
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Add Service</h1>
        <p className="text-sm text-muted-foreground">
          Create a new configurable service catalog item.
        </p>
      </div>

      <div className="mt-6">
        <ServiceForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onCancel={() => router.push("/dashboard/services")}
          isSuperAdmin={isSuperAdmin}
          currentUserTenantId={currentUserTenantId}
        />
      </div>
    </PageContainer>
  )
}
