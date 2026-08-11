import type { DesignationFormValues } from "./DesignationForm.schema"

export type { DesignationFormValues }

export interface DesignationFormProps {
  onSubmit: (values: DesignationFormValues) => Promise<void>
  defaultValues?: Partial<DesignationFormValues>
  isLoading?: boolean
  submitLabel?: string
  onCancel: () => void
}
