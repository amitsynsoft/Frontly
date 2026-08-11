"use client"

import { ArrowLeft, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { use, useEffect } from "react"

import { PageContainer } from "@/components/layouts/page-container"
import { Button } from "@/components/ui/button"
import { DASHBOARD_ROUTES } from "@/constants/routes"
import {
  useEditResourceMutation,
  useLazyGetResourceByIdQuery,
} from "@/store/api/resource.api"

import { ResourceForm } from "../../_components/resource-form"

export default function EditResourcePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()

  const [getResource, { data, isFetching }] =
    useLazyGetResourceByIdQuery()
  const [editResource, { isLoading: isUpdating }] = useEditResourceMutation()

  useEffect(() => {
    if (id) {
      getResource(id)
    }
  }, [id, getResource])

  const handleCancel = () => {
    router.push(DASHBOARD_ROUTES.resources)
  }

  const handleSubmit = async (values: any) => {
    try {
      await editResource({
        id,
        body: values,
      }).unwrap()
      router.push(DASHBOARD_ROUTES.resources)
    } catch {
      // Errors handled by RTK logger
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
        <h1 className="text-2xl font-bold tracking-tight">Edit Resource</h1>
        <p className="text-sm text-muted-foreground">
          Modify the details of an existing resource.
        </p>
      </div>

      <div className="mt-6">
        {isFetching ? (
          <div className="flex h-64 items-center justify-center rounded-lg border border-border/50 bg-background/50">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <ResourceForm
            initialData={data}
            onSubmit={handleSubmit}
            isLoading={isUpdating}
            onCancel={handleCancel}
          />
        )}
      </div>
    </PageContainer>
  )
}
