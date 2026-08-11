"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import * as React from "react"
import { FormProvider,useForm } from "react-hook-form"
import { z } from "zod"

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
  useCreateSpecialityMutation,
  useUpdateSpecialityMutation,
} from "@/store/api/specialities.api"
import type { SpecialityDto } from "@/types/dtos/speciality.dto"

const specialitySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
})

type SpecialityFormValues = z.infer<typeof specialitySchema>

interface SpecialityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingSpeciality: SpecialityDto | null
}

export function SpecialityDialog({
  open,
  onOpenChange,
  editingSpeciality,
}: SpecialityDialogProps) {
  const isEdit = !!editingSpeciality
  const [createSpeciality, { isLoading: isCreating }] =
    useCreateSpecialityMutation()
  const [updateSpeciality, { isLoading: isUpdating }] =
    useUpdateSpecialityMutation()

  const form = useForm<SpecialityFormValues>({
    resolver: zodResolver(specialitySchema),
    defaultValues: {
      name: "",
    },
  })

  React.useEffect(() => {
    if (open) {
      form.reset({
        name: editingSpeciality?.name ?? "",
      })
    }
  }, [open, editingSpeciality, form])

  const onSubmit = async (values: SpecialityFormValues) => {
    try {
      if (isEdit && editingSpeciality) {
        await updateSpeciality({
          id: editingSpeciality.id,
          body: values,
        }).unwrap()
      } else {
        await createSpeciality(values).unwrap()
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
            {isEdit ? "Edit Speciality" : "Add Speciality"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update this speciality's name and details."
              : "Add a new speciality for staff members."}
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-2"
          >
            <FormInput
              name="name"
              label="Speciality Name"
              required
              placeholder="e.g. Keratin Treatment, Dental Consultation"
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
                  "Create Speciality"
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
