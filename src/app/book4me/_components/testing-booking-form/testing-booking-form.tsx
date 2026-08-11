"use client"

import * as React from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Loader2, Plus, Trash2, CalendarDays } from "lucide-react"

import { useCreateCustomerBookingMutation } from "@/store/api/booking.api"
import { useGetLocationsQuery } from "@/store/api/location.api"
import { useGetBranchServicesQuery } from "@/store/api/branchservices.api"
import { useGetUsersQuery } from "@/store/api/user.api"
import { useGetResourcesQuery } from "@/store/api/resource.api"
import { useAuth } from "@/hooks/useAuth"
import { getApiList } from "@/hooks/useApiListData"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/forms/form"
import { FormInput } from "@/components/forms/form-input"
import { FormTextarea } from "@/components/forms/form-textarea"
import { FormSelect } from "@/components/forms/form-select"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { testingBookingSchema } from "./testing-booking-form.schema"
import { defaultTestingBookingValues } from "./testing-booking-form.config"

export function TestingBookingForm() {
  const { user } = useAuth()
  const tenantId = user?.tenantId

  const [mounted, setMounted] = React.useState(false)
  const [createBooking, { isLoading }] = useCreateCustomerBookingMutation()

  const form = useForm({
    resolver: zodResolver(testingBookingSchema),
    defaultValues: defaultTestingBookingValues as any,
  })

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Synchronize tenantId from store user object
  React.useEffect(() => {
    if (tenantId && mounted) {
      form.setValue("tenantId", Number(tenantId))
    }
  }, [tenantId, mounted, form])

  // Watch selected branchId to filter branch services
  const watchedBranchId = form.watch("branchId")

  // API Queries
  const { data: branchesResponse } = useGetLocationsQuery(
    { all: true, tenantId: tenantId ? String(tenantId) : undefined },
    { skip: !tenantId }
  )
  const branches = React.useMemo(
    () => getApiList<any>(branchesResponse),
    [branchesResponse]
  )

  const { data: branchServicesResponse } = useGetBranchServicesQuery(
    { tenantId: tenantId ? Number(tenantId) : undefined, all: true },
    { skip: !tenantId }
  )
  const allBranchServices = React.useMemo(
    () => getApiList<any>(branchServicesResponse),
    [branchServicesResponse]
  )

  const { data: staffResponse } = useGetUsersQuery(
    { tenantId: tenantId ? Number(tenantId) : undefined, all: true },
    { skip: !tenantId }
  )
  const allStaff = React.useMemo(
    () => getApiList<any>(staffResponse),
    [staffResponse]
  )

  const { data: resourcesResponse } = useGetResourcesQuery(
    {
      tenantId: tenantId ? Number(tenantId) : undefined,
      branchId: watchedBranchId ? Number(watchedBranchId) : undefined,
      all: true,
    },
    { skip: !tenantId || !watchedBranchId }
  )
  const allResources = React.useMemo(
    () => getApiList<any>(resourcesResponse),
    [resourcesResponse]
  )

  // Map locations to FormSelect options list
  const branchOptions = React.useMemo(() => {
    return branches.map((b: any) => ({
      label: b.name || `Branch #${b.id}`,
      value: Number(b.id),
    }))
  }, [branches])

  // Filter services based on selected branch
  const filteredBranchServices = React.useMemo(() => {
    if (!watchedBranchId) return []
    return allBranchServices.filter(
      (s: any) => String(s.branchId) === String(watchedBranchId)
    )
  }, [allBranchServices, watchedBranchId])

  const serviceOptions = React.useMemo(() => {
    return filteredBranchServices.map((s: any) => ({
      label: s.serviceMaster?.name || `Service #${s.id}`,
      value: Number(s.id),
    }))
  }, [filteredBranchServices])

  const { fields, append, remove } = useFieldArray({
    control: form.control as any,
    name: "services",
  })

  const onSubmit = async (values: any) => {
    try {
      await createBooking(values).unwrap()
      toast.success("Booking created successfully!", {
        description: "Your test booking has been successfully recorded.",
      })
      form.reset({
        ...defaultTestingBookingValues,
        tenantId: tenantId ? Number(tenantId) : ("" as any),
      } as any)
    } catch (err: any) {
      const errorMsg =
        err?.data?.message || err?.message || "Failed to create booking"
      toast.error("Booking Creation Failed", {
        description: errorMsg,
      })
    }
  }

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm">Initializing form...</p>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Core details grid using built-in FormInput */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput
            name="tenantId"
            label="Tenant ID"
            type="number"
            placeholder="Loading Tenant ID..."
            disabled
          />

          <FormSelect
            name="branchId"
            label="Branch"
            placeholder={tenantId ? "Select a branch" : "No tenant loaded"}
            options={branchOptions}
            required
            disabled={!tenantId}
          />

          <FormInput
            name="customerId"
            label="Customer ID"
            type="number"
            placeholder="Leave empty / i.e. 1"
            required
          />

          <FormInput
            name="bookingTypeId"
            label="Booking Type ID"
            type="number"
            placeholder="Leave empty / i.e. 1"
            required
          />

          <FormInput
            name="currencyId"
            label="Currency ID"
            type="number"
            placeholder="Leave empty / i.e. 1"
            required
          />
        </div>

        {/* Dynamic Services Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/40 pb-2">
            <h3 className="text-md flex items-center gap-2 font-semibold text-foreground">
              <CalendarDays className="h-4 w-4 text-primary" />
              Services Details
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  branchServicesId: "" as any,
                  tenantUserId: "" as any,
                  branchResourceId: "" as any,
                  appointmentDate: "",
                  startTime: "",
                })
              }
              className="h-8 gap-1 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Service
            </Button>
          </div>

          {form.formState.errors.services?.root?.message && (
            <p className="text-xs font-medium text-destructive">
              {String(form.formState.errors.services.root.message)}
            </p>
          )}

          <div className="space-y-4">
            {fields.map((item, index) => {
              const selectedBranchServicesId = form.watch(
                `services.${index}.branchServicesId`
              )

              const selectedBranchService = filteredBranchServices.find(
                (s: any) => Number(s.id) === Number(selectedBranchServicesId)
              )
              const masterServiceId = selectedBranchService?.serviceId

              // Map all tenant users to staff dropdown options
              const rowStaffOptions = allStaff.map((s: any) => ({
                label: s.fullName || `User #${s.id}`,
                value: Number(s.id),
              }))

              // Filter resources based on assignment to selected branch service
              const rowResourceOptions =
                selectedBranchService?.resources &&
                selectedBranchService.resources.length > 0
                  ? selectedBranchService.resources.map((r: any) => ({
                      label: r.name || `Resource #${r.id}`,
                      value: Number(r.id),
                    }))
                  : allResources.map((r: any) => ({
                      label: r.name || `Resource #${r.id}`,
                      value: Number(r.id),
                    }))

              return (
                <div
                  key={item.id}
                  className="group relative flex flex-col gap-4 rounded-xl border border-border/50 bg-muted/10 p-5 dark:bg-muted/5 animate-in fade-in-50 duration-300"
                >
                  {/* Service Header Row */}
                  <div className="flex items-center justify-between border-b border-border/40 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
                      Service Entry #{index + 1}
                    </span>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="h-8 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive gap-1 transition-all duration-200"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </Button>
                    )}
                  </div>

                  {/* Row 1: Assignments */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Service Selector */}
                    <FormField
                      control={form.control as any}
                      name={`services.${index}.branchServicesId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold">
                            Service
                          </FormLabel>
                          <Select
                            disabled={!watchedBranchId}
                            value={
                              field.value !== undefined && field.value !== null
                                ? String(field.value)
                                : ""
                            }
                            onValueChange={(val) => field.onChange(Number(val))}
                          >
                            <FormControl>
                              <SelectTrigger className="h-10 w-full text-sm">
                                <SelectValue placeholder="Select service" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {serviceOptions.map((opt: any) => (
                                <SelectItem
                                  key={opt.value}
                                  value={String(opt.value)}
                                  className="text-sm"
                                >
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Staff Selector */}
                    <FormField
                      control={form.control as any}
                      name={`services.${index}.tenantUserId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold">
                            Staff Member
                          </FormLabel>
                          <Select
                            disabled={!selectedBranchServicesId}
                            value={
                              field.value !== undefined && field.value !== null
                                ? String(field.value)
                                : ""
                            }
                            onValueChange={(val) => field.onChange(Number(val))}
                          >
                            <FormControl>
                              <SelectTrigger className="h-10 w-full text-sm">
                                <SelectValue placeholder="Select staff" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {rowStaffOptions.map((opt: any) => (
                                <SelectItem
                                  key={opt.value}
                                  value={String(opt.value)}
                                  className="text-sm"
                                >
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Resource Selector */}
                    <FormField
                      control={form.control as any}
                      name={`services.${index}.branchResourceId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold">
                            Resource
                          </FormLabel>
                          <Select
                            disabled={!selectedBranchServicesId}
                            value={
                              field.value !== undefined && field.value !== null
                                ? String(field.value)
                                : ""
                            }
                            onValueChange={(val) => field.onChange(Number(val))}
                          >
                            <FormControl>
                              <SelectTrigger className="h-10 w-full text-sm">
                                <SelectValue placeholder="Select resource" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {rowResourceOptions.map((opt: any) => (
                                <SelectItem
                                  key={opt.value}
                                  value={String(opt.value)}
                                  className="text-sm"
                                >
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Row 2: Date & Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control as any}
                      name={`services.${index}.appointmentDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold">
                            Date
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              className="h-10 text-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control as any}
                      name={`services.${index}.startTime`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold">
                            Start Time
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              className="h-10 text-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Notes using built-in FormTextarea */}
        <FormTextarea
          name="notes"
          label="Notes (Optional)"
          placeholder="Enter booking notes..."
        />

        <Button
          type="submit"
          className="h-10 w-full font-semibold"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Test Booking...
            </>
          ) : (
            "Create Booking"
          )}
        </Button>
      </form>
    </Form>
  )
}
