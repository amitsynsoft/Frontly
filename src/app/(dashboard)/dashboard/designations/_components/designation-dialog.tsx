"use client"

import * as React from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  useCreateDesignationMutation,
  useEditDesignationMutation,
} from "@/store/api/designation.api"
import type { DesignationResponse } from "@/types/dtos/designation.dto"

import { DesignationForm } from "./DesignationForm"
import {
  mapResponseToFormValues,
  mapFormValuesToPayload,
  type DesignationFormValues,
  DESIGNATION_FORM_LABELS,
} from "./DesignationForm"

interface DesignationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingDesignation: DesignationResponse | null
}

export function DesignationDialog({
  open,
  onOpenChange,
  editingDesignation,
}: DesignationDialogProps) {
  const isEdit = !!editingDesignation
  const [createDesignation, { isLoading: isCreating }] =
    useCreateDesignationMutation()
  const [editDesignation, { isLoading: isUpdating }] =
    useEditDesignationMutation()

  const defaultValues = React.useMemo(
    () => mapResponseToFormValues(editingDesignation),
    [editingDesignation]
  )

  const handleSubmit = async (values: DesignationFormValues) => {
    try {
      const payload = mapFormValuesToPayload(values)
      if (isEdit && editingDesignation) {
        await editDesignation({
          id: editingDesignation.id,
          body: payload,
        }).unwrap()
      } else {
        await createDesignation(payload).unwrap()
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
            {isEdit ? "Edit Designation" : "Add Designation"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update this designation's details."
              : "Add a new designation for staff members."}
          </DialogDescription>
        </DialogHeader>

        <DesignationForm
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          isLoading={isLoading}
          submitLabel={
            isEdit
              ? DESIGNATION_FORM_LABELS.submitEdit
              : DESIGNATION_FORM_LABELS.submitCreate
          }
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
