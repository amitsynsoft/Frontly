"use client"

import dayjs from "dayjs"
import { CalendarDays, Clock, Layers,Sparkles } from "lucide-react"
import * as React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatTime } from "@/lib/utils/formatters"
import { BookingServiceResponseDto } from "@/types/dtos/booking.dto"

const getStaffInitials = (name?: string) => {
  if (!name) return "S"
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

interface ScheduledServicesProps {
  services: BookingServiceResponseDto[]
}

export function ScheduledServices({ services }: ScheduledServicesProps) {
  return (
    <Card className="overflow-hidden rounded-2xl border border-border/30 bg-card shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      <CardHeader className="border-b border-border/20 bg-muted/10 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <CalendarDays className="h-5 w-5 text-primary" />
            Scheduled Services
          </CardTitle>
          <span className="rounded-md border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {services.length} Service{services.length !== 1 ? "s" : ""}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {services.length ? (
          <div className="divide-y divide-border/20">
            {services.map((svc: BookingServiceResponseDto, idx: number) => {
              const staffInitials = getStaffInitials(
                svc.tenantUser?.fullName || `Staff #${svc.tenantUserId}`
              )
              const tags = (svc.tags || svc.branchService?.tags) as string[] | undefined

              return (
                <div
                  key={idx}
                  className="p-5 transition-colors duration-200 hover:bg-muted/5 flex flex-col gap-4"
                >
                  {/* Service Header: Icon + Name & Tags */}
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-bold tracking-tight text-foreground leading-snug">
                        {svc.serviceName || `Service #${svc.branchServicesId}`}
                      </h4>
                      {/* Service Tags */}
                      {tags?.length ? (
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {tags.map((tag, tagIdx) => (
                            <span
                              key={tagIdx}
                              className="inline-flex items-center rounded-md border border-primary/20 bg-primary/5 px-2 py-0.5 text-[9px] font-bold text-primary uppercase tracking-wider"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Horizontal Metadata Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-y border-border/10 py-3.5 my-1 md:divide-x md:divide-border/10 md:gap-0">
                    {/* Duration */}
                    <div className="flex items-center gap-2.5 md:px-4 md:first:pl-0">
                      <Clock className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                      <div>
                        <p className="text-[10px] text-muted-foreground/70 font-semibold uppercase leading-none mb-1">
                          Duration
                        </p>
                        <p className="text-xs font-bold text-foreground">
                          {svc.durationInMinutes || "—"} mins
                        </p>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2.5 md:px-4">
                      <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                      <div>
                        <p className="text-[10px] text-muted-foreground/70 font-semibold uppercase leading-none mb-1">
                          Date
                        </p>
                        <p className="text-xs font-bold text-foreground">
                          {svc.appointmentDate
                            ? dayjs(svc.appointmentDate).format("MMM D, YYYY")
                            : "—"}
                        </p>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-2.5 md:px-4">
                      <Clock className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                      <div>
                        <p className="text-[10px] text-muted-foreground/70 font-semibold uppercase leading-none mb-1">
                          Time
                        </p>
                        <p className="text-xs font-bold text-foreground">
                          {formatTime(svc.startTime)} - {formatTime(svc.endTime)}
                        </p>
                      </div>
                    </div>

                    {/* Resource */}
                    <div className="flex items-center gap-2.5 md:px-4">
                      <Layers className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                      <div>
                        <p className="text-[10px] text-muted-foreground/70 font-semibold uppercase leading-none mb-1">
                          Resource
                        </p>
                        <p className="text-xs font-bold text-foreground truncate max-w-[120px]" title={svc.branchResource?.name}>
                          {svc.branchResource?.name || "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Staff Member Info */}
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">
                      {staffInitials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] leading-none font-bold tracking-wider text-muted-foreground/70 uppercase mb-1">
                        Staff Member
                      </p>
                      <p className="text-xs font-bold text-foreground">
                        {svc.tenantUser?.fullName || `Staff #${svc.tenantUserId}`}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
              <CalendarDays className="h-6 w-6 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-semibold text-foreground">
              No services attached
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              This booking doesn&apos;t have any specific services scheduled.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
