"use client"

import { ArrowLeft, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"

import { PageContainer } from "@/components/layouts/page-container"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { ROLES } from "@/lib/permissions/roles"
import {
  useGetBranchServiceByIdQuery,
  useUpdateBranchServiceMutation,
} from "@/store/api/branchservices.api"

import { ServiceForm } from "../../_components/service-form"

interface EditServicePageProps {
  params: Promise<{ id: string }>
}

export default function EditServicePage({ params }: EditServicePageProps) {
  const router = useRouter()
  const { id } = React.use(params)
  const { user, roles } = useAuth()

  const {
    data: service,
    isLoading: isLoadingData,
    error,
  } = useGetBranchServiceByIdQuery(id, {
    refetchOnMountOrArgChange: true,
  })
  const [updateService, { isLoading: isUpdating }] =
    useUpdateBranchServiceMutation()

  const isSuperAdmin = roles.includes(ROLES.SUPER_ADMIN)
  const currentUserTenantId = user?.tenantId ? Number(user.tenantId) : undefined

  const handleSubmit = async (payload: any) => {
    try {
      await updateService({ id, body: payload }).unwrap()
      router.push("/dashboard/services")
    } catch {
      // Surfaced by RTK Query logger middleware
    }
  }

  const serviceData =
    (service as any)?.result || (service as any)?.data || service

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
        <h1 className="text-2xl font-bold tracking-tight">Edit Service</h1>
        <p className="text-sm text-muted-foreground">
          Update service catalog details and configuration.
        </p>
      </div>

      <div className="mt-6">
        {isLoadingData ? (
          <div className="flex h-64 items-center justify-center rounded-lg border border-border/50 bg-background/50">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive">
            <p className="font-semibold">Failed to load service details</p>
            <p className="text-xs text-muted-foreground">
              Please check the ID and try again.
            </p>
          </div>
        ) : (
          <ServiceForm
            initialData={serviceData}
            onSubmit={handleSubmit}
            isLoading={isUpdating}
            onCancel={() => router.push("/dashboard/services")}
            isSuperAdmin={isSuperAdmin}
            currentUserTenantId={currentUserTenantId}
          />
        )}
      </div>
    </PageContainer>
  )
}
