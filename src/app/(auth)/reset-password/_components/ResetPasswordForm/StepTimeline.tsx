"use client"

import { CheckCircle2,Lock, Shield } from "lucide-react"
import { ReactNode } from "react"

import { cn } from "@/lib/utils/cn.utils"

interface TimelineStep {
  id: "otp" | "reset"
  title: string
  description: string
  icon: ReactNode
}

const timelineSteps: TimelineStep[] = [
  {
    id: "otp",
    title: "Verify OTP",
    description: "Confirm your email code",
    icon: <Shield className="size-4" />,
  },
  {
    id: "reset",
    title: "Set New Password",
    description: "Create a secure password",
    icon: <Lock className="size-4" />,
  },
]

interface StepTimelineProps {
  step: "otp" | "reset"
}

export function StepTimeline({ step }: StepTimelineProps) {
  const currentStepIndex = timelineSteps.findIndex((item) => item.id === step)

  return (
    <div className="rounded-2xl border bg-card px-5 py-6 shadow-sm">
      <div className="grid grid-cols-2">
        {timelineSteps.map((item, index) => {
          const isActive = index === currentStepIndex
          const isCompleted = index < currentStepIndex
          const isPending = index > currentStepIndex
          const showConnector = index < timelineSteps.length - 1
          const isConnectorCompleted = currentStepIndex > index

          return (
            <div
              key={item.id}
              className="relative flex flex-col items-center text-center"
            >
              {showConnector && (
                <div
                  className={cn(
                    "absolute top-5 left-1/2 h-px w-full transition-colors",
                    isConnectorCompleted ? "bg-primary" : "bg-border"
                  )}
                />
              )}

              <div
                className={cn(
                  "relative z-10 flex size-10 items-center justify-center rounded-full border bg-background transition-all",
                  isActive &&
                    "border-primary bg-primary text-primary-foreground ring-4 ring-primary/10",
                  isCompleted &&
                    "border-primary bg-primary text-primary-foreground",
                  isPending && "border-border bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? <CheckCircle2 className="size-4" /> : item.icon}
              </div>

              <div className="mt-3 space-y-1">
                <p
                  className={cn(
                    "leading-none font-medium transition-colors",
                    isActive || isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.title}
                </p>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
