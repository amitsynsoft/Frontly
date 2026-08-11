"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import * as React from "react"
import { FormProvider, useForm } from "react-hook-form"

import { FormInput } from "@/components/forms/form-input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  useCreateResourceTypeMutation,
  useEditResourceTypeMutation,
} from "@/store/api/resource-master.api"
import type { ResourceTypeResponse } from "@/types/dtos/resource-master.dto"

import {
  type CreateResourceTypeFormValues,
  createResourceTypeSchema,
} from "./resource-types-schema"

interface ResourceTypeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingResourceType: ResourceTypeResponse | null
}

export function ResourceTypeDialog({
  open,
  onOpenChange,
  editingResourceType,
}: ResourceTypeDialogProps) {
  const isEdit = !!editingResourceType
  const [createResourceType, { isLoading: isCreating }] =
    useCreateResourceTypeMutation()
  const [editResourceType, { isLoading: isUpdating }] =
    useEditResourceTypeMutation()

  const form = useForm<CreateResourceTypeFormValues>({
    resolver: zodResolver(createResourceTypeSchema),
    defaultValues: {
      name: "",
    },
  })

  React.useEffect(() => {
    if (open) {
      form.reset({
        name: editingResourceType?.name ?? "",
      })
    }
  }, [open, editingResourceType, form])

  const onSubmit = async (values: CreateResourceTypeFormValues) => {
    try {
      if (isEdit && editingResourceType) {
        await editResourceType({
          id: editingResourceType.id,
          body: values,
        }).unwrap()
      } else {
        await createResourceType(values).unwrap()
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
            {isEdit ? "Edit Resource Type" : "Add Resource Type"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update this resource type's name."
              : "Add a new resource type for tenants."}
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-2"
          >
            <FormInput
              name="name"
              label="Resource Name"
              required
              placeholder="e.g. Room, Chair, etc."
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
                  <span className="flex items-center gap-1">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Saving...
                  </span>
                ) : isEdit ? (
                  "Save changes"
                ) : (
                  "Create Resource Type"
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
