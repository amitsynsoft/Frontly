"use client"

import { FormInput } from "@/components/forms/form-input"

type FormDatePickerProps = {
  name: string
  label: string
}

function FormDatePicker(props: FormDatePickerProps) {
  return <FormInput {...props} type="date" />
}

export { FormDatePicker }
