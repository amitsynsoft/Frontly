"use client"

import { ArrowLeft, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"

import { PageContainer } from "@/components/layouts/page-container"
import { Button } from "@/components/ui/button"
import {
  useEditLocationMutation,
  useGetLocationByIdQuery,
} from "@/store/api/location.api"
import type { LocationRequest } from "@/types/dtos/location.dto"

import { LocationForm } from "../../_components/location-form"

interface EditLocationPageProps {
  params: Promise<{ id: string }>
}

export default function EditLocationPage({ params }: EditLocationPageProps) {
  const router = useRouter()
  const { id } = React.use(params)

  const {
    data: location,
    isLoading: isLoadingData,
    error,
  } = useGetLocationByIdQuery(id)
  const [editLocation, { isLoading: isUpdating }] = useEditLocationMutation()

  const handleSubmit = async (values: LocationRequest) => {
    try {
      await editLocation({ locationId: id, body: values }).unwrap()
      router.push("/dashboard/branches")
    } catch {
      // Surfaced by RTK Query logger middleware
    }
  }

  const locationData =
    (location as any)?.result || (location as any)?.data || location

  return (
    <PageContainer>
      <div className="flex flex-col gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit gap-1.5 pl-0 text-muted-foreground hover:text-foreground"
          onClick={() => router.push("/dashboard/branches")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to branches
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Edit Branch</h1>
        <p className="text-sm text-muted-foreground">
          Update tenant location details and settings.
        </p>
      </div>

      <div className="mt-6">
        {isLoadingData ? (
          <div className="flex h-64 items-center justify-center rounded-lg border border-border/50 bg-background/50">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive">
            <p className="font-semibold">Failed to load location details</p>
            <p className="text-xs text-muted-foreground">
              Please check the ID and try again.
            </p>
          </div>
        ) : (
          <LocationForm
            initialData={locationData}
            onSubmit={handleSubmit}
            isLoading={isUpdating}
            onCancel={() => router.push("/dashboard/branches")}
          />
        )}
      </div>
    </PageContainer>
  )
}
