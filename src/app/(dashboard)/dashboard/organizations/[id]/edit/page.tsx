"use client"

import { ArrowLeft, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"

import { PageContainer } from "@/components/layouts/page-container"
import { Button } from "@/components/ui/button"
import {
  useGetCompanyByIdQuery,
  useUpdateCompanyMutation,
} from "@/store/api/tenent.api"
import type { TenantRequest } from "@/types/dtos/tenent.dto"

import { CompanyForm } from "../../_components/company-form"

interface EditOrganizationPageProps {
  params: Promise<{ id: string }>
}

export default function EditOrganizationPage({
  params,
}: EditOrganizationPageProps) {
  const router = useRouter()
  const { id } = React.use(params)

  const {
    data: company,
    isLoading: isLoadingData,
    error,
  } = useGetCompanyByIdQuery(id)
  const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation()

  const handleSubmit = async (values: TenantRequest) => {
    try {
      await updateCompany({ id, body: values }).unwrap()
      router.push("/dashboard/organizations")
    } catch {
      console.log("error from updateCompany")
    }
  }

  const companyData =
    (company as any)?.result || (company as any)?.data || company

  return (
    <PageContainer>
      <div className="flex flex-col gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit gap-1.5 pl-0 text-muted-foreground hover:text-foreground"
          onClick={() => router.push("/dashboard/organizations")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to tenants
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Edit Tenant</h1>
        <p className="text-sm text-muted-foreground">
          Update the tenant's registry profile and settings.
        </p>
      </div>

      <div className="mt-6">
        {isLoadingData ? (
          <div className="flex h-64 items-center justify-center rounded-lg border border-border/50 bg-background/50">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive">
            <p className="font-semibold">Failed to load tenant details</p>
            <p className="text-xs text-muted-foreground">
              Please check the ID and try again.
            </p>
          </div>
        ) : (
          <CompanyForm
            initialData={companyData}
            onSubmit={handleSubmit}
            isLoading={isUpdating}
            onCancel={() => router.push("/dashboard/organizations")}
          />
        )}
      </div>
    </PageContainer>
  )
}
