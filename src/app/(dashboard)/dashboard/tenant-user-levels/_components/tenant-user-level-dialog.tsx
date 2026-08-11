"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import * as React from "react"
import { FormProvider,useForm } from "react-hook-form"
import { z } from "zod"

import { FormInput } from "@/components/forms/form-input"
import { FormSelect } from "@/components/forms/form-select"
import { FormTextarea } from "@/components/forms/form-textarea"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  useCreateTenantUserLevelMutation,
  useUpdateTenantUserLevelMutation,
} from "@/store/api/tenant-user-level.api"
import { useGetCompaniesQuery } from "@/store/api/tenent.api"
import type { TenantUserLevelDto } from "@/types/dtos/tenant-user-levels.dto"

const tenantUserLevelSchema = z.object({
  level: z.string().min(1, "Level Name is required"),
  description: z.string().optional(),
  tenantId: z.string().min(1, "Tenant is required"),
})

type TenantUserLevelFormValues = z.infer<typeof tenantUserLevelSchema>

interface TenantUserLevelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingLevel: TenantUserLevelDto | null
  isSuperAdmin: boolean
  currentUserTenantId?: number
}

export function TenantUserLevelDialog({
  open,
  onOpenChange,
  editingLevel,
  isSuperAdmin,
  currentUserTenantId,
}: TenantUserLevelDialogProps) {
  const isEdit = !!editingLevel
  const [createLevel, { isLoading: isCreating }] =
    useCreateTenantUserLevelMutation()
  const [updateLevel, { isLoading: isUpdating }] =
    useUpdateTenantUserLevelMutation()

  const { data: companiesData, isLoading: isLoadingCompanies } =
    useGetCompaniesQuery({ all: true }, { skip: !isSuperAdmin })

  const companyOptions = React.useMemo(() => {
    if (!companiesData) return []
    const list = Array.isArray(companiesData)
      ? companiesData
      : (companiesData as any)?.result || (companiesData as any)?.data || []
    return list.map((c: any) => ({
      label: c.name,
      value: String(c.id),
    }))
  }, [companiesData])

  const form = useForm<TenantUserLevelFormValues>({
    resolver: zodResolver(tenantUserLevelSchema),
    defaultValues: {
      level: "",
      description: "",
      tenantId: "",
    },
  })

  React.useEffect(() => {
    if (open) {
      form.reset({
        level: editingLevel?.level ?? "",
        description: editingLevel?.description ?? "",
        tenantId: editingLevel
          ? String(editingLevel.tenantId)
          : currentUserTenantId
            ? String(currentUserTenantId)
            : "",
      })
    }
  }, [open, editingLevel, currentUserTenantId, form])

  const onSubmit = async (values: TenantUserLevelFormValues) => {
    try {
      const payload = {
        level: values.level.trim(),
        description: values?.description?.trim() || "",
        tenantId: Number(values.tenantId),
      }

      if (isEdit && editingLevel) {
        await updateLevel({
          id: editingLevel.id,
          body: payload,
        }).unwrap()
      } else {
        await createLevel(payload).unwrap()
      }
      onOpenChange(false)
    } catch {
      // Handled by API middleware
    }
  }

  const isLoading = isCreating || isUpdating

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit User Level" : "Add User Level"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update details of the user level."
              : "Create a new user level to classify staff members."}
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-2"
          >
            {isSuperAdmin && (
              <FormSelect
                name="tenantId"
                label="Tenant"
                required
                placeholder={
                  isLoadingCompanies ? "Loading tenants..." : "Select tenant"
                }
                options={companyOptions}
                disabled={isLoadingCompanies}
              />
            )}

            <FormInput
              name="level"
              label="Level Name"
              required
              placeholder="e.g. Level 1, Senior Stylist, Junior"
            />

            <FormTextarea
              name="description"
              label="Description"
              placeholder="Provide a description of this level..."
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Saving...
                  </span>
                ) : isEdit ? (
                  "Save changes"
                ) : (
                  "Create Level"
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
