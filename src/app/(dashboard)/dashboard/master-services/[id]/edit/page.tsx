"use client"

import { ArrowLeft, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"

import { PageContainer } from "@/components/layouts/page-container"
import { Button } from "@/components/ui/button"
import {
  useGetServiceByIdQuery,
  useUpdateServiceMutation,
} from "@/store/api/service.api"

import { MasterServiceForm } from "../../_components/master-service-form"

interface EditMasterServicePageProps {
  params: Promise<{ id: string }>
}

export default function EditMasterServicePage({
  params,
}: EditMasterServicePageProps) {
  const router = useRouter()
  const { id } = React.use(params)

  const {
    data: service,
    isLoading: isLoadingData,
    error,
  } = useGetServiceByIdQuery(id)
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation()

  const handleSubmit = async (payload: any) => {
    try {
      await updateService({ id, body: payload }).unwrap()
      router.push("/dashboard/master-services")
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
          onClick={() => router.push("/dashboard/master-services")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to master services
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          Edit Master Service
        </h1>
        <p className="text-sm text-muted-foreground">
          Update the global service catalog template.
        </p>
      </div>

      <div className="mt-6">
        {isLoadingData ? (
          <div className="flex h-64 items-center justify-center rounded-lg border border-border/50 bg-background/50">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive">
            <p className="font-semibold">
              Failed to load service template details
            </p>
            <p className="text-xs text-muted-foreground">
              Please check the ID and try again.
            </p>
          </div>
        ) : (
          <MasterServiceForm
            initialData={serviceData}
            onSubmit={handleSubmit}
            isLoading={isUpdating}
            onCancel={() => router.push("/dashboard/master-services")}
          />
        )}
      </div>
    </PageContainer>
  )
}
