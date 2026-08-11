"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import React, { useEffect } from "react"
import type { SubmitHandler } from "react-hook-form"
import { FormProvider, useForm } from "react-hook-form"

import { FormFileUpload } from "@/components/forms/form-file-upload"
import { FormInput } from "@/components/forms/form-input"
import { FormSelect } from "@/components/forms/form-select"
import { FormTagsInput } from "@/components/forms/form-tags-input"
import { FormTextarea } from "@/components/forms/form-textarea"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useGetCurrenciesQuery } from "@/store/api/currency.api"
import { TenantRequest } from "@/types/dtos/tenent.dto"

import {
  COMPANY_STATUS,
  type CreateCompanyFormValues,
  createCompanySchema,
  statusOptions,
} from "./company-schema"

interface CompanyFormProps {
  onSubmit: (values: TenantRequest) => Promise<void> | void
  initialData?: (TenantRequest & { id?: string | number }) | null
  isLoading?: boolean
  onCancel: () => void
  title?: string
  description?: string
}

export function CompanyForm({
  onSubmit,
  initialData,
  isLoading = false,
  onCancel,
  title,
  description,
}: CompanyFormProps) {
  const isEdit = !!initialData

  /* -------------------- CURRENCIES -------------------- */
  const { data: currencyRes, isLoading: currencyLoading } =
    useGetCurrenciesQuery(undefined, {
      refetchOnMountOrArgChange: true,
    })

  const currencyOptions = React.useMemo(
    () =>
      currencyRes?.map((c) => ({
        label: `${c.name} (${c.symbol})`,
        value: Number(c.id),
      })) ?? [],
    [currencyRes]
  )

  /* -------------------- FORM -------------------- */
  const form = useForm<CreateCompanyFormValues>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      name: "",
      currencyId: 1,
      logo: "",
      description: "",
      languagesSupported: [],
      website: "",
      status: COMPANY_STATUS.ACTIVE,
    },
  })

  /* -------------------- SAFE HYDRATION -------------------- */

  useEffect(() => {
    if (!initialData) return
    if (!currencyOptions.length) return

    const data =
      (initialData as any).result || (initialData as any).data || initialData

    // Ensure we capture status correctly from various possible formats
    let parsedStatus: "Active" | "InActive" = COMPANY_STATUS.ACTIVE
    if (data.status) {
      const s = String(data.status).toLowerCase()
      if (s === "inactive" || s === "false") {
        parsedStatus = COMPANY_STATUS.INACTIVE
      }
    } else if (data.isActive === false) {
      parsedStatus = COMPANY_STATUS.INACTIVE
    }

    form.reset({
      name: data.name ?? "",
      currencyId: Number(data.currency?.id || data.currencyId || 1),
      logo: data.logo ?? "",
      description: data.description ?? "",
      languagesSupported: Array.isArray(data.languagesSupported)
        ? data.languagesSupported
        : [],
      website: data.website ?? "",
      status: parsedStatus,
    })
  }, [initialData, currencyOptions, form])

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit: SubmitHandler<CreateCompanyFormValues> = async (
    values
  ) => {
    await onSubmit(values)
  }

  return (
    <Card className="border border-border/50 bg-background/50 shadow-xl backdrop-blur-sm">
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="px-6 py-5">
        <FormProvider {...form}>
          <form
            id="company-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* NAME */}
              <FormInput
                name="name"
                label="Tenant Name"
                required
                placeholder="Acme Corp"
              />

              {/* WEBSITE */}
              <FormInput
                name="website"
                label="Website"
                required
                placeholder="https://acme.com"
              />

              {/* LOGO */}
              <FormFileUpload
                name="logo"
                label="Logo"
                required
                acceptedFileTypes={["image/*"]}
                maxSizeMB={3}
                placeholder="Upload logo"
                uploadType="profile"
              />

              {/* CURRENCY */}
              <FormSelect
                name="currencyId"
                label="Currency"
                required
                disabled={currencyLoading}
                placeholder={
                  currencyLoading ? "Loading currencies..." : "Select currency"
                }
                options={currencyOptions}
              />

              {/* LANGUAGES */}
              <FormTagsInput
                name="languagesSupported"
                label="Supported Languages"
                required
                placeholder="Add language (e.g. en) and press Enter"
              />

              {/* STATUS */}
              <FormSelect
                name="status"
                label="Status"
                required
                placeholder="Select status"
                options={statusOptions.map((s) => ({
                  label: s.label,
                  value: s.value,
                }))}
              />

              {/* DESCRIPTION */}
              <div className="col-span-full">
                <FormTextarea
                  name="description"
                  label="Description"
                  placeholder="A brief description of this tenant"
                />
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex items-center justify-end gap-2 border-t border-border/50 pt-5">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving...
                  </span>
                ) : isEdit ? (
                  "Update Tenant"
                ) : (
                  "Create Tenant"
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}
