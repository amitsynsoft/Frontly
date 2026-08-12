"use client"

import { Phone, User } from "lucide-react"
import * as React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const getCustomerInitials = (name?: string) => {
  if (!name) return "C"
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

interface CustomerDetailsProps {
  customerId: number | string
  customer?: {
    fullName: string
    phone?: string
  }
}

export function CustomerDetails({
  customerId,
  customer,
}: CustomerDetailsProps) {
  return (
    <Card className="overflow-hidden rounded-2xl border border-border/30 bg-card shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      <CardHeader className="border-b border-border/20 bg-muted/10 pb-4">
        <CardTitle className="flex items-center gap-2.5 text-base font-bold text-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <User className="h-4 w-4" />
          </div>
          Customer Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-5">
        {customer ? (
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm">
              {getCustomerInitials("Robert Wilson")}
            </div>
            <div className="min-w-0">
              <h4 className="truncate text-sm font-bold text-foreground">
                {/* {customer.fullName} */}
                Robert Wilson
              </h4>
              <p className="mt-0.5 text-xs font-semibold text-muted-foreground">
                Customer ID: #{customerId}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm font-bold text-foreground">
            Customer ID: #{customerId}
          </p>
        )}

        {customer?.phone && (
          <div className="flex w-full items-center gap-2.5 rounded-xl border border-border/25 bg-muted/20 px-3.5 py-2.5 text-xs transition-colors hover:bg-muted/30">
            <Phone className="h-4 w-4 shrink-0 text-muted-foreground/70" />
            <a
              href={`tel:${customer.phone}`}
              className="truncate font-semibold text-foreground transition-colors hover:text-primary"
            >
              {customer.phone}
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
