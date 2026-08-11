"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, Loader2, Mail } from "lucide-react"
import { useForm } from "react-hook-form"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/forms/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { useForgotPasswordMutation } from "@/store/api/auth.api"
import {
  ForgotPasswordFormValues,
  forgotPasswordSchema,
} from "./forgetpassword.schema"

function ForgotPasswordForm() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation()

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(data: ForgotPasswordFormValues) {
    try {
      await forgotPassword(data).unwrap()

      form.reset()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium">Email</FormLabel>

              <FormControl>
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    className="h-11 pl-10 focus-visible:border-primary focus-visible:ring-primary"
                    {...field}
                  />
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="group relative h-11 w-full overflow-hidden shadow-md shadow-primary/10 transition-all duration-300 hover:shadow-primary/20"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending reset link...
            </>
          ) : (
            <span className="flex items-center justify-center gap-1.5 font-semibold">
              Send reset link
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          )}
        </Button>
      </form>
    </Form>
  )
}

export { ForgotPasswordForm }
