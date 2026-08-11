"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"

import { PageContainer } from "@/components/layouts/page-container"
import { Button } from "@/components/ui/button"
import { useCreateLocationMutation } from "@/store/api/location.api"
import type { LocationRequest } from "@/types/dtos/location.dto"

import { LocationForm } from "../_components/location-form"

export default function AddLocationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tenantIdParam = searchParams.get("tenantId")
  const tenantId =
    tenantIdParam && tenantIdParam !== "null" ? tenantIdParam : undefined

  const [createLocation, { isLoading }] = useCreateLocationMutation()

  const handleSubmit = async (values: LocationRequest) => {
    try {
      await createLocation(values).unwrap()
      router.push("/dashboard/branches")
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
          onClick={() => router.push("/dashboard/branches")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to branches
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Add Branch</h1>
        <p className="text-sm text-muted-foreground">
          Register a new tenant location.
        </p>
      </div>

      <div className="mt-6">
        <LocationForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onCancel={() => router.push("/dashboard/branches")}
        />
      </div>
    </PageContainer>
  )
}
