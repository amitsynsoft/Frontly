"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

import { PageContainer } from "@/components/layouts/page-container"
import { Button } from "@/components/ui/button"
import { useCreateServiceMutation } from "@/store/api/service.api"

import { MasterServiceForm } from "../_components/master-service-form"

export default function AddMasterServicePage() {
  const router = useRouter()
  const [createService, { isLoading }] = useCreateServiceMutation()

  const handleSubmit = async (payload: any) => {
    try {
      await createService(payload).unwrap()
      router.push("/dashboard/master-services")
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
          onClick={() => router.push("/dashboard/master-services")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to master services
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          Add Master Service
        </h1>
        <p className="text-sm text-muted-foreground">
          Create a new global service catalog template.
        </p>
      </div>

      <div className="mt-6">
        <MasterServiceForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onCancel={() => router.push("/dashboard/master-services")}
        />
      </div>
    </PageContainer>
  )
}
