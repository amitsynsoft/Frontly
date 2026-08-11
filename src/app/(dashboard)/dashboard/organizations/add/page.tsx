"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

import { PageContainer } from "@/components/layouts/page-container"
import { Button } from "@/components/ui/button"
import { useCreateCompanyMutation } from "@/store/api/tenent.api"
import type { TenantRequest } from "@/types/dtos/tenent.dto"

import { CompanyForm } from "../_components/company-form"

export default function AddOrganizationPage() {
  const router = useRouter()
  const [createCompany, { isLoading }] = useCreateCompanyMutation()

  const handleSubmit = async (values: TenantRequest) => {
    try {
      await createCompany(values).unwrap()
      router.push("/dashboard/organizations")
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
          onClick={() => router.push("/dashboard/organizations")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to tenants
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Add Tenant</h1>
        <p className="text-sm text-muted-foreground">
          Register a new tenant in the system.
        </p>
      </div>

      <div className="mt-6">
        <CompanyForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onCancel={() => router.push("/dashboard/organizations")}
        />
      </div>
    </PageContainer>
  )
}
