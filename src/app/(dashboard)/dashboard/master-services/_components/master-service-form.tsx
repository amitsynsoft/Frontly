"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import * as React from "react"
import { FormProvider,useForm } from "react-hook-form"
import { z } from "zod"

import { FormInput } from "@/components/forms/form-input"
import { FormTextarea } from "@/components/forms/form-textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { ServiceDTO } from "@/types/dtos/services.dto"

// ── Schema ─────────────────────────────────────────────────────────────────────

const masterServiceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  description: z.string().optional().default(""),
})

type MasterServiceFormValues = z.infer<typeof masterServiceSchema>

const defaultValues: MasterServiceFormValues = {
  name: "",
  description: "",
}

// ── Props ──────────────────────────────────────────────────────────────────────

interface MasterServiceFormProps {
  onSubmit: (values: any) => Promise<void> | void
  initialData?: ServiceDTO | null
  isLoading?: boolean
  onCancel: () => void
}

// ── Component ──────────────────────────────────────────────────────────────────

export function MasterServiceForm({
  onSubmit,
  initialData,
  isLoading = false,
  onCancel,
}: MasterServiceFormProps) {
  const isEdit = !!initialData

  const form = useForm<MasterServiceFormValues>({
    resolver: zodResolver(masterServiceSchema) as any,
    defaultValues,
  })

  // ── Populate when editing ──────────────────────────────────────────────────
  React.useEffect(() => {
    if (initialData) {
      const data =
        (initialData as any).result || (initialData as any).data || initialData
      form.reset({
        name: data?.name ?? "",
        description: data?.description ?? "",
      })
    } else {
      form.reset(defaultValues)
    }
  }, [initialData, form])

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (values: MasterServiceFormValues) => {
    await onSubmit(values)
  }

  return (
    <Card className="border border-border/50 bg-background/50 shadow-xl backdrop-blur-sm">
      <CardContent className="px-6 py-5">
        <FormProvider {...form}>
          <form
            id="master-service-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-5">
              <FormInput
                name="name"
                label="Service Name"
                required
                placeholder="e.g. Haircut, Dental Cleaning, Massage Therapy"
              />

              <FormTextarea
                name="description"
                label="Description"
                placeholder="Describe this service..."
              />
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-end gap-2 border-t border-border/50 pt-5">
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
                  "Update Master Service"
                ) : (
                  "Create Master Service"
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}
