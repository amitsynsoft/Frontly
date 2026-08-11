"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import * as React from "react"
import { FormProvider, useForm } from "react-hook-form"

import { FormInput } from "@/components/forms/form-input"
import { FormTextarea } from "@/components/forms/form-textarea"
import { Button } from "@/components/ui/button"

import { DESIGNATION_FORM_DEFAULTS, DESIGNATION_FORM_LABELS } from "./DesignationForm.config"
import { designationSchema, type DesignationFormValues } from "./DesignationForm.schema"
import type { DesignationFormProps } from "./DesignationForm.type"

export function DesignationForm({
  onSubmit,
  defaultValues = DESIGNATION_FORM_DEFAULTS,
  isLoading = false,
  submitLabel,
  onCancel,
}: DesignationFormProps) {
  const form = useForm<DesignationFormValues>({
    resolver: zodResolver(designationSchema),
    defaultValues,
  })

  // Reset form when defaultValues changes (e.g. switching between different edit modes or new item)
  React.useEffect(() => {
    form.reset(defaultValues)
  }, [defaultValues, form])

  const labels = DESIGNATION_FORM_LABELS

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
        <FormInput
          name="name"
          label={labels.name}
          required
          placeholder={labels.namePlaceholder}
          disabled={isLoading}
        />

        <FormTextarea
          name="description"
          label={labels.description}
          placeholder={labels.descriptionPlaceholder}
          disabled={isLoading}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            {labels.cancel}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {labels.saving}
              </span>
            ) : (
              submitLabel || labels.submitCreate
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
