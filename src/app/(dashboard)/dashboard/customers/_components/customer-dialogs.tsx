"use client"

import {
  Calendar,
  Mail,
  Phone,
  User,
  Hash,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

import { StatusBadge } from "@/components/shared/status-badge"
import { ThemedAvatar } from "@/components/shared/themed-avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { CustomerDTO, CustomerStatus } from "@/types/dtos/customer.dto"
import { getCustomerInitials } from "./customer-columns"

// ── View Customer Details Modal ───────────────────────────────────────────────

interface ViewCustomerModalProps {
  customer: CustomerDTO | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewCustomerModal({
  customer,
  open,
  onOpenChange,
}: ViewCustomerModalProps) {
  if (!customer) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            Customer Profile
          </DialogTitle>
          <DialogDescription>
            Detailed information for customer record {customer.id}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Header Card */}
          <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/40 p-4">
            <ThemedAvatar
              src={customer.avatarUrl || ""}
              alt={customer.name}
              fallbackText={getCustomerInitials(customer.name, customer.email)}
              className="h-14 w-14 border border-border"
            />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">
                {customer.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs font-semibold text-primary">
                  {customer.id}
                </span>
                <StatusBadge status={customer.status} />
              </div>
            </div>
          </div>

          {/* Customer Info Grid */}
          <div className="grid gap-3 rounded-xl border border-border p-4 text-sm">
            <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                Email Address
              </span>
              <a
                href={`mailto:${customer.email}`}
                className="font-medium text-foreground hover:underline"
              >
                {customer.email}
              </a>
            </div>

            <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                Phone Number
              </span>
              <span className="font-medium text-foreground">
                {customer.phone}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Hash className="h-4 w-4 text-primary" />
                Total Bookings
              </span>
              <span className="font-semibold text-foreground">
                {customer.totalBookings ?? 0} appointments
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                Last Visit
              </span>
              <span className="font-medium text-foreground">
                {customer.lastVisit || "N/A"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                Joined Date
              </span>
              <span className="font-medium text-foreground">
                {customer.createdAt || "N/A"}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Customer Form Modal (Add / Edit) ─────────────────────────────────────────

type CustomerFormInputs = {
  name: string
  email: string
  phone: string
  status: CustomerStatus
}

interface CustomerFormModalProps {
  customer?: CustomerDTO | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: CustomerFormInputs, id?: string) => void
}

export function CustomerFormModal({
  customer,
  open,
  onOpenChange,
  onSave,
}: CustomerFormModalProps) {
  const isEditing = Boolean(customer)
  const { register, handleSubmit, reset, setValue, watch } =
    useForm<CustomerFormInputs>({
      defaultValues: {
        name: "",
        email: "",
        phone: "",
        status: "Active",
      },
    })

  const currentStatus = watch("status")

  useEffect(() => {
    if (customer) {
      reset({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        status: customer.status,
      })
    } else {
      reset({
        name: "",
        email: "",
        phone: "",
        status: "Active",
      })
    }
  }, [customer, reset, open])

  const onSubmit = (data: CustomerFormInputs) => {
    onSave(data, customer?.id)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEditing ? "Edit Customer Details" : "Add New Customer"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? `Update profile information for customer ${customer?.id}.`
              : "Enter customer details to register a new customer record."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="cust-name">Customer Name</Label>
            <Input
              id="cust-name"
              placeholder="e.g. Robert Wilson"
              {...register("name", { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cust-email">Email Address</Label>
            <Input
              id="cust-email"
              type="email"
              placeholder="e.g. rwilson@gmail.com"
              {...register("email", { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cust-phone">Phone Number</Label>
            <Input
              id="cust-phone"
              placeholder="e.g. 312-555-4827"
              {...register("phone", { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cust-status">Status</Label>
            <Select
              value={currentStatus}
              onValueChange={(val: CustomerStatus) => setValue("status", val)}
            >
              <SelectTrigger id="cust-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Save Changes" : "Create Customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
