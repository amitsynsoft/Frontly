"use client"

import "./fullcalendar.css"

import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import multiMonthPlugin from "@fullcalendar/multimonth"
import FullCalendar from "@fullcalendar/react"
import rrulePlugin from "@fullcalendar/rrule"
import timeGridPlugin from "@fullcalendar/timegrid"
import { Clock, Loader2 } from "lucide-react"

import type { AvailabilitySlot } from "@/types/dtos/staff-service.dto"

type CalendarEventBase = Pick<
  AvailabilitySlot,
  "id" | "title" | "backgroundColor" | "borderColor" | "textColor"
> &
  Partial<Pick<AvailabilitySlot, "start" | "end">>

export type CalendarEvent = CalendarEventBase & {
  duration?: string
  rrule?: string
  extendedProps?: {
    timeSlot?: string
    type?: AvailabilitySlot["type"]
    isExpired?: boolean
    isAvailable?: boolean
  }
}

type Props = {
  events: CalendarEvent[]
  onDateRangeChange?: (startDate: string, endDate: string) => void
  isLoading?: boolean
}

function formatEventTime(date?: Date | null) {
  if (!date) return ""

  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

function getEventTimeSlot({
  end,
  fallback,
  start,
}: {
  end?: Date | null
  fallback?: string
  start?: Date | null
}) {
  if (fallback) return fallback
  if (!start || !end) return ""

  return `${formatEventTime(start)} - ${formatEventTime(end)}`
}

export function StaffScheduleCalendar({
  events,
  onDateRangeChange,
  isLoading,
}: Props) {
  return (
    <div className="relative rounded-xl border border-border bg-background p-4 shadow-sm">
      {isLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-xl bg-background/50 backdrop-blur-[1px] transition-all duration-200">
          <div className="flex animate-in flex-col items-center gap-2 rounded-lg border border-border bg-background p-4 shadow-md duration-200 zoom-in-95 fade-in">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-xs font-medium text-muted-foreground">
              Loading availability...
            </p>
          </div>
        </div>
      )}
      <FullCalendar
        contentHeight="auto"
        timeZone="local"
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          multiMonthPlugin,
          rrulePlugin,
        ]}
        initialView="timeGridWeek"
        events={events}
        datesSet={(dateInfo) => {
          onDateRangeChange?.(dateInfo.startStr, dateInfo.endStr)
        }}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "multiMonthMonth,timeGridWeek,timeGridDay",
        }}
        views={{
          multiMonthMonth: {
            type: "multiMonth",
            duration: { months: 1 },
            buttonText: "month",
          },
          timeGridWeek: {
            buttonText: "week",
          },
          timeGridDay: {
            buttonText: "day",
          },
        }}
        allDaySlot={false}
        slotDuration="00:30:00"
        slotLabelInterval="00:30:00"
        slotMinTime="08:00:00"
        slotMaxTime="18:00:00"
        editable={false}
        selectable={false}
        eventMaxStack={1}
        eventDisplay="block"
        eventClassNames={(arg) => [
          "event-type-" + (arg.event.extendedProps?.type || "available"),
        ]}
        slotLabelFormat={{
          hour: "numeric",
          minute: "2-digit",
          meridiem: "short",
        }}
        dayHeaderFormat={{
          weekday: "short",
        }}
        eventContent={(arg) => {
          const { extendedProps } = arg.event
          const isTimeGrid = arg.view.type.startsWith("timeGrid")
          const timeSlot = getEventTimeSlot({
            end: arg.event.end,
            fallback: extendedProps?.timeSlot,
            start: arg.event.start,
          })

          // Month View
          if (!isTimeGrid) {
            return (
              <div
                className="fc-custom-daygrid-event"
                style={{
                  color: arg.event.textColor ?? "inherit",
                }}
              >
                <div className="fc-custom-daygrid-event-header">
                  <Clock className="mr-1 inline-block h-3 w-3 align-text-bottom" />
                  <span>{timeSlot}</span>
                </div>

                <div className="fc-custom-daygrid-event-title">
                  {arg.event.title}
                </div>
              </div>
            )
          }

          // Week / Day View
          return (
            <div
              className="fc-timegrid-custom-content"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "100%",
                width: "100%",
                padding: "4px 8px",
                gap: "2px",
                boxSizing: "border-box",
                overflow: "hidden",
                color: arg.event.textColor ?? "inherit",
              }}
            >
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  lineHeight: "1.2",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                }}
              >
                {arg.event.title}
              </span>

              {timeSlot && (
                <span
                  style={{
                    fontSize: "0.65rem",
                    opacity: 0.85,
                  }}
                >
                  {timeSlot}
                </span>
              )}
            </div>
          )
        }}
      />
    </div>
  )
}
