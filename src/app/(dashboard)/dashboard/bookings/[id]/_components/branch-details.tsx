"use client"

import dayjs from "dayjs"
import {
  Accessibility,
  Building2,
  Calendar,
  Car,
  CheckCircle,
  Info,
  Mail,
  MapPin,
  Phone,
  PhoneCall,
  Smartphone,
  XCircle,
} from "lucide-react"
import * as React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BranchDetailsProps {
  branchId: number | string
  branch?: {
    id: number
    name: string
    address: string
    city: string
    state: string
    country: string
    postalCode: string
    frontdeskNumber?: string
    mobileNumber?: string
    tollFreeNumber?: string
    email?: string
    isActive: boolean
    createdAt: string
    updatedAt: string
    metadata?: {
      parking?: boolean
      facilities?: string[]
      wheelchairAccessible?: boolean
    }
  }
}

const FACILITY_LABELS: Record<string, string> = {
  meeting_room: "Meeting Room",
  cafeteria: "Cafeteria",
  wifi: "Wi-Fi",
}

const getFacilityLabel = (facility: string) => {
  return (
    FACILITY_LABELS[facility] ||
    facility
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  )
}

export function BranchDetails({ branchId, branch }: BranchDetailsProps) {
  // Use requested numbers and email as default fallbacks
  const frontdeskNumber = branch?.frontdeskNumber || "+13055551404"
  const mobileNumber = branch?.mobileNumber || "17865552404"
  const tollFreeNumber = branch?.tollFreeNumber || "800-555-1004"
  const email = branch?.email || "miami@urbanglowsalon.com"

  // Branch metadata with fallback to default demo metadata
  const parking = branch?.metadata?.parking ?? true
  const facilities = branch?.metadata?.facilities ?? [
    "meeting_room",
    "cafeteria",
    "wifi",
  ]
  const wheelchairAccessible = branch?.metadata?.wheelchairAccessible ?? true

  return (
    <Card className="overflow-hidden rounded-2xl border border-border/30 bg-card shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      <CardHeader className="border-b border-border/20 bg-muted/10 pb-4">
        <CardTitle className="flex items-center gap-2.5 text-base font-bold text-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MapPin className="h-4 w-4" />
          </div>
          Branch Details
        </CardTitle>
      </CardHeader>
      <CardContent className="divide-y divide-border/10 p-0">
        {/* Branch Header & Address */}
        <div className="flex items-start gap-3.5 p-5">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-foreground">
              {branch?.name || `Branch #${branchId}`}
            </h4>
            {branch && (
              <p className="mt-1 text-xs leading-relaxed font-semibold text-muted-foreground">
                {[
                  branch.address,
                  branch.city,
                  branch.state,
                  branch.country,
                  branch.postalCode,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-3.5 p-5">
          <p className="text-[10px] font-bold tracking-wider text-muted-foreground/70 uppercase">
            CONTACT INFORMATION
          </p>

          {/* Frontdesk Number */}
          <div className="flex items-center gap-3 text-xs">
            <Phone className="h-4 w-4 shrink-0 text-muted-foreground/70" />
            <div className="min-w-0 flex-1">
              <p className="mb-0.5 text-[9px] font-bold tracking-wider text-muted-foreground/60 uppercase">
                Frontdesk
              </p>
              <a
                href={`tel:${frontdeskNumber}`}
                className="block truncate font-bold text-foreground transition-colors hover:text-primary"
              >
                {frontdeskNumber}
              </a>
            </div>
          </div>

          {/* Mobile Number */}
          <div className="flex items-center gap-3 text-xs">
            <Smartphone className="h-4 w-4 shrink-0 text-muted-foreground/70" />
            <div className="min-w-0 flex-1">
              <p className="mb-0.5 text-[9px] font-bold tracking-wider text-muted-foreground/60 uppercase">
                Mobile
              </p>
              <a
                href={`tel:${mobileNumber}`}
                className="block truncate font-bold text-foreground transition-colors hover:text-primary"
              >
                {mobileNumber}
              </a>
            </div>
          </div>

          {/* Toll Free Number */}
          <div className="flex items-center gap-3 text-xs">
            <PhoneCall className="h-4 w-4 shrink-0 text-muted-foreground/70" />
            <div className="min-w-0 flex-1">
              <p className="mb-0.5 text-[9px] font-bold tracking-wider text-muted-foreground/60 uppercase">
                Toll Free
              </p>
              <a
                href={`tel:${tollFreeNumber}`}
                className="block truncate font-bold text-foreground transition-colors hover:text-primary"
              >
                {tollFreeNumber}
              </a>
            </div>
          </div>

          {/* Email Address */}
          <div className="flex items-center gap-3 text-xs">
            <Mail className="h-4 w-4 shrink-0 text-muted-foreground/70" />
            <div className="min-w-0 flex-1">
              <p className="mb-0.5 text-[9px] font-bold tracking-wider text-muted-foreground/60 uppercase">
                Email
              </p>
              <a
                href={`mailto:${email}`}
                className="block truncate text-xs font-bold break-all text-foreground transition-colors hover:text-primary"
              >
                {email}
              </a>
            </div>
          </div>
        </div>

        {/* Facilities & Accessibility */}
        <div className="space-y-3.5 p-5">
          <p className="text-[10px] font-bold tracking-wider text-muted-foreground/70 uppercase">
            FACILITIES & ACCESSIBILITY
          </p>

          <div className="grid grid-cols-2 gap-4 text-xs">
            {/* Parking */}
            <div className="flex items-center gap-2.5">
              <Car className="h-4 w-4 shrink-0 text-muted-foreground/70" />
              <div>
                <p className="mb-0.5 text-[9px] leading-none font-bold tracking-wider text-muted-foreground/60 uppercase">
                  Parking
                </p>
                <span className="font-bold text-foreground">
                  {parking ? "Available" : "Not Available"}
                </span>
              </div>
            </div>

            {/* Wheelchair Accessible */}
            <div className="flex items-center gap-2.5">
              <Accessibility className="h-4 w-4 shrink-0 text-muted-foreground/70" />
              <div>
                <p className="mb-0.5 text-[9px] leading-none font-bold tracking-wider text-muted-foreground/60 uppercase">
                  Wheelchair
                </p>
                <span className="font-bold text-foreground">
                  {wheelchairAccessible ? "Accessible" : "No Access"}
                </span>
              </div>
            </div>
          </div>

          {/* Facilities Badges */}
          {facilities && facilities.length > 0 && (
            <div className="space-y-2 border-t border-border/10 pt-2">
              <p className="text-[9px] font-bold tracking-wider text-muted-foreground/60 uppercase">
                ON-SITE FACILITIES
              </p>
              <div className="flex flex-wrap gap-1.5">
                {facilities.map((fac, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center rounded-md border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[9px] font-bold tracking-wider text-primary uppercase"
                  >
                    {getFacilityLabel(fac)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
