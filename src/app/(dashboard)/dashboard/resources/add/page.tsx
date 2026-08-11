"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

import { PageContainer } from "@/components/layouts/page-container"
import { Button } from "@/components/ui/button"
import { DASHBOARD_ROUTES } from "@/constants/routes"
import { useCreateResourceMutation } from "@/store/api/resource.api"

import { ResourceForm } from "../_components/resource-form"

export default function AddResourcePage() {
  const router = useRouter()
  const [createResource, { isLoading }] = useCreateResourceMutation()

  const handleCancel = () => {
    router.push(DASHBOARD_ROUTES.resources)
  }

  const handleSubmit = async (values: any) => {
    try {
      await createResource(values).unwrap()
      router.push(DASHBOARD_ROUTES.resources)
    } catch {
      // Errors are handled by the RTK query logger middleware
    }
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit gap-1.5 pl-0 text-muted-foreground hover:text-foreground"
          onClick={handleCancel}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to resources
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Add Resource</h1>
        <p className="text-sm text-muted-foreground">
          Create a new resource and assign it to a location.
        </p>
      </div>

      <div className="mt-6">
        <ResourceForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onCancel={handleCancel}
        />
      </div>
    </PageContainer>
  )
}
