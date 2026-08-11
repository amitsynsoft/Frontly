"use client"

import { CreditCard, Globe, Wallet } from "lucide-react"
import * as React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils/cn.utils"
import { CustomerBookingDto } from "@/types/dtos/booking.dto"

interface PaymentBillingProps {
  bookingData: CustomerBookingDto
}

export function PaymentBilling({ bookingData }: PaymentBillingProps) {
  const finalPaymentMethod =
    bookingData?.payments?.[0]?.paymentMethod ||
    bookingData.paymentMethod ||
    "—"

  const finalPaymentStatus = bookingData.paymentStatus || "Pending"

  return (
    <Card className="overflow-hidden rounded-2xl border border-border/30 bg-card shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      <CardHeader className="border-b border-border/20 bg-muted/10 pb-4">
        <CardTitle className="flex items-center gap-2.5 text-base font-bold text-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CreditCard className="h-4 w-4" />
          </div>
          Payment & Billing Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 divide-y divide-border/20 md:grid-cols-2 md:divide-x md:divide-y-0">
          {/* Left Side: Invoice Summary */}
          <div className="space-y-4 p-5">
            <p className="text-[10px] font-bold tracking-wider text-muted-foreground/70 uppercase">
              INVOICE SUMMARY
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="font-medium">Subtotal</span>
                <span className="font-semibold text-foreground">
                  {/* {bookingData.currency?.symbol || "$"} */}$
                  {bookingData.subTotalAmount || "0.00"}
                </span>
              </div>
              {parseFloat(bookingData.discountAmount || "0") > 0 && (
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                  <span className="font-medium">Discount</span>
                  <span className="font-semibold">
                    {/* -{bookingData.currency?.symbol || "$"} */}-$
                    {bookingData.discountAmount}
                  </span>
                </div>
              )}
              {parseFloat(bookingData.taxAmount || "0") > 0 && (
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="font-medium">Tax</span>
                  <span className="font-semibold text-foreground">
                    {/* +{bookingData.currency?.symbol || "$"} */}$
                    {bookingData.taxAmount}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-dashed border-border/30 pt-3">
                <span className="font-bold text-foreground">Final Amount</span>
                <span className="text-xl font-extrabold text-primary">
                  {/* {bookingData.currency?.symbol || "₹"} */}$
                  {bookingData.finalAmount || "0.00"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Transaction Details */}
          <div className="space-y-4 p-5">
            <p className="text-[10px] font-bold tracking-wider text-muted-foreground/70 uppercase">
              TRANSACTION DETAILS
            </p>
            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-muted-foreground">
                  Payment Method
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-foreground capitalize">
                  <Wallet className="h-4 w-4 text-muted-foreground/70" />
                  {finalPaymentMethod}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-muted-foreground">
                  Payment Status
                </span>
                <span
                  className={cn(
                    "shadow-3xs rounded-md border px-2.5 py-0.5 text-xs font-bold capitalize",
                    finalPaymentStatus === "paid" ||
                      finalPaymentStatus === "Paid"
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                  )}
                >
                  {finalPaymentStatus}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border/10 pt-3 text-sm">
                <span className="font-medium text-muted-foreground">
                  Booking Channel
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-foreground capitalize">
                  <Globe className="h-4 w-4 text-muted-foreground/70" />
                  {bookingData.bookingType?.name || "Direct"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
