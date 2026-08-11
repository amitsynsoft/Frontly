import type { DesignationFormValues } from "./DesignationForm.schema"
import type {
  DesignationRequest,
  DesignationResponse,
} from "@/types/dtos/designation.dto"

export const DESIGNATION_FORM_DEFAULTS: DesignationFormValues = {
  name: "",
  description: "",
}

/**
 * Maps DesignationResponse to form values
 */
export function mapResponseToFormValues(
  data?: DesignationResponse | null
): DesignationFormValues {
  if (!data) return DESIGNATION_FORM_DEFAULTS
  return {
    name: data.name,
    description: data.description ?? "",
  }
}

/**
 * Maps Form values to API payload
 */
export function mapFormValuesToPayload(
  values: DesignationFormValues
): DesignationRequest {
  return {
    name: values.name.trim(),
    description: values.description?.trim() || undefined,
  }
}

export const DESIGNATION_FORM_LABELS = {
  name: "Designation Name",
  namePlaceholder: "Hair Stylist, Makeup Artist, Manager, etc.",
  description: "Description",
  descriptionPlaceholder: "Provide a description of this designation...",
  cancel: "Cancel",
  submitCreate: "Create Designation",
  submitEdit: "Save changes",
  saving: "Saving...",
} as const
