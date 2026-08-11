import { Clock, MapPin } from "lucide-react"
import * as React from "react"
import { Controller, useFormContext } from "react-hook-form"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import type { BranchServiceDTO } from "@/types/dtos/branchservices.dto"
import { cn } from "@/lib/utils/cn.utils"

interface ServiceRowItemProps {
  service: BranchServiceDTO
}

export function ServiceRowItem({ service }: ServiceRowItemProps) {
  const { control } = useFormContext()
  const sId = Number(service.id)

  return (
    <Controller
      control={control}
      name="branchServiceIds"
      render={({ field }) => {
        const isSelected =
          Array.isArray(field.value) && field.value.includes(sId)

        const handleToggle = () => {
          const currentValues: number[] = Array.isArray(field.value)
            ? field.value
            : []
          const next = isSelected
            ? currentValues.filter((id) => id !== sId)
            : [...currentValues, sId]
          field.onChange(next)
        }

        return (
          <div
            onClick={handleToggle}
            className={cn(
              "group flex cursor-pointer items-start gap-4 rounded-xl border p-5 transition-all duration-300 select-none hover:-translate-y-[1px] hover:shadow-md",
              isSelected
                ? "border-primary bg-primary/[0.04] shadow-sm ring-1 ring-primary/20 dark:bg-primary/[0.08]"
                : "border-border/60 bg-card hover:border-border hover:bg-muted/30"
            )}
          >
            {/* Checkbox */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="mt-1 flex shrink-0 items-center"
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={handleToggle}
                className="size-5 rounded-[6px] border-muted-foreground/35 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
              />
            </div>

            {/* Content Details */}
            <div className="min-w-0 flex-1 space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <span className="text-sm font-semibold tracking-tight text-foreground transition-colors duration-150 group-hover:text-primary sm:text-base">
                  {service.serviceMaster?.name || "Unnamed Service"}
                </span>

                {/* Price Label */}
                {/* <span className="shrink-0 text-sm font-extrabold text-primary sm:text-base tabular-nums">
                  {service.currency?.symbol || "₹"}
                  {service.cost}
                </span> */}
              </div>

              {service.serviceMaster?.description && (
                <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {service.serviceMaster.description}
                </p>
              )}

              {/* Highlighted Footer Info Row */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {/* Location Badge */}
                <Badge
                  variant="secondary"
                  className="inline-flex h-6 items-center gap-1.5 rounded-lg border border-status-confirmed/20 bg-status-confirmed/8 px-2 py-0 text-[10px] font-bold tracking-wider text-status-confirmed uppercase select-none"
                >
                  <MapPin className="size-3 shrink-0 text-status-confirmed" />
                  {service.branch?.name || "Global"}
                </Badge>

                {/* Duration Badge */}
                <Badge
                  variant="secondary"
                  className="inline-flex h-6 items-center gap-1.5 rounded-lg border border-status-pending/25 bg-status-pending/8 px-2 py-0 text-[10px] font-bold tracking-wider text-status-pending uppercase select-none"
                >
                  <Clock className="size-3 shrink-0 text-status-pending" />
                  Duration: {service.durationMinutes} min
                </Badge>
              </div>
            </div>
          </div>
        )
      }}
    />
  )
}
