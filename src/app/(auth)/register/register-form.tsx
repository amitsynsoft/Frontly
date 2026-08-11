"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { FormProvider, useForm } from "react-hook-form"

import DatePickerField from "@/components/forms/datepickerfield"
import { FormInput } from "@/components/forms/form-input"
import { FormSelect } from "@/components/forms/form-select"
import { PhoneField } from "@/components/forms/phonefield"
import { Button } from "@/components/ui/button"
import { useRegisterMutation } from "@/store/api/auth.api"
import {
  RegisterFormValues,
  registerSchema,
} from "./_components/register-form.schema"

function RegisterForm() {
  const router = useRouter()

  const [register, { isLoading }] = useRegisterMutation()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phone: "",
      dateOfBirth: "",
      gender: undefined,
    },
  })

  async function onSubmit(values: RegisterFormValues) {
    try {
      const signupPayload = {
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        phone: values.phone as string, // ← add this cast

        // already formatted as YYYY-MM-DD
        dateOfBirth: values.dateOfBirth,

        gender: values.gender,
        roleType: "user",
        signupType: "credentials",
      }

      await register(signupPayload).unwrap()

      router.push("/login")
    } catch (err: any) {
      console.log("Registration failed:", err)

      const errorMsg =
        err?.data?.message || err?.message || "Failed to create account."
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Row 1 */}
        <div className="grid gap-4 md:grid-cols-1">
          <FormInput name="fullName" label="Full name" placeholder="John Doe" />

          <FormInput
            name="email"
            label="Email"
            type="email"
            placeholder="john@example.com"
          />
        </div>

        {/* Row 2 */}
        <div className="grid gap-4">
          <PhoneField
            form={form}
            name="phone"
            label="Phone number"
            placeholder="Enter phone number"
            required
            defaultCountry="in"
            preferredCountries={["in"]}
          />

          <FormSelect
            name="gender"
            label="Gender"
            placeholder="Select gender"
            options={[
              {
                label: "Male",
                value: "male",
              },
              {
                label: "Female",
                value: "female",
              },
              {
                label: "Other",
                value: "other",
              },
            ]}
          />
        </div>

        {/* Row 3 */}
        <div className="grid gap-4">
          <DatePickerField
            form={form}
            name="dateOfBirth"
            label="Date of birth"
            placeholder="Select date of birth"
            required
            allowPastDates
          />

          <FormInput
            name="password"
            label="Password"
            type="password"
            placeholder="Enter password"
          />
        </div>

        <Button
          type="submit"
          className="group relative h-11 w-full overflow-hidden shadow-md shadow-primary/10 transition-all duration-300 hover:shadow-primary/20"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            <span className="flex items-center justify-center gap-1.5 font-semibold">
              Create account
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          )}
        </Button>
      </form>
    </FormProvider>
  )
}

export { RegisterForm }
