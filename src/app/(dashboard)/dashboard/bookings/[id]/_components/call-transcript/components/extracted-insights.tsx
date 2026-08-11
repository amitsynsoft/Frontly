"use client"

import {
  Calendar,
  CheckCircle2,
  Clock,
  FileCheck,
  Mail,
  Phone,
  ShieldCheck,
  User,
  UserCheck,
} from "lucide-react"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

import { CapturedInfo } from "../call-transcript.types"

interface ExtractedInsightsProps {
  info: CapturedInfo
}

export function ExtractedInsights({ info }: ExtractedInsightsProps) {
  const details = [
    {
      label: "Patient Name",
      value: info.patientName,
      icon: User,
    },
    {
      label: "Phone Number",
      value: info.phone,
      icon: Phone,
    },
    {
      label: "Email Address",
      value: info.email,
      icon: Mail,
    },
    {
      label: "Patient Classification",
      value: info.patientType,
      icon: UserCheck,
    },
    {
      label: "Appointment Type",
      value: info.appointmentType,
      icon: FileCheck,
    },
    {
      label: "Insurance Provider",
      value: info.insurance,
      icon: ShieldCheck,
    },
    {
      label: "Assigned Provider",
      value: info.provider,
      icon: User,
    },
    {
      label: "Booked Slot",
      value: info.appointmentDateTime,
      icon: Calendar,
    },
  ]

  return (
    <div className="space-y-6 py-2">
      {/* ── Captured Information Grid ───────────────────────────────── */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Captured Details from AI Call
          </h4>
          <Badge variant="secondary" className="text-[10px] font-semibold">
            100% Extraction Accuracy
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {details.map((item, idx) => {
            const Icon = item.icon
            return (
              <Card
                key={idx}
                className="overflow-hidden rounded-xl border border-border/30 bg-muted/20 shadow-none transition-colors hover:border-border/60 hover:bg-muted/30"
              >
                <CardContent className="flex items-start gap-3 p-3.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="truncate text-xs font-bold text-foreground">
                      {item.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* ── Automated Follow-up Actions Checklist ───────────────────── */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Automated Follow-up Actions Executed by AI
        </h4>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {info.followUpActions.map((act) => (
            <div
              key={act.id}
              className="flex items-center gap-2.5 rounded-xl border border-border/30 bg-background/50 px-3.5 py-2.5 text-xs shadow-xs"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
              <span className="font-semibold text-foreground/90">
                {act.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
