"use client"

import { FormInput } from "@/components/forms/form-input"

type FormPhoneInputProps = {
  name: string
  label: string
  placeholder?: string
}

function FormPhoneInput(props: FormPhoneInputProps) {
  return <FormInput {...props} type="tel" />
}

export { FormPhoneInput }
