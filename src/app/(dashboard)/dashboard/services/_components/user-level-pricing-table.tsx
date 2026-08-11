"use client"

import * as React from "react"
import { Controller, useFormContext } from "react-hook-form"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ServiceFormValues } from "./service-form.config"

interface UserLevelPricingTableProps {
  isLoadingUserLevels: boolean
  userLevelOptions: Array<{ id: string; name: string; description: string }>
}

export function UserLevelPricingTable({
  isLoadingUserLevels,
  userLevelOptions,
}: UserLevelPricingTableProps) {
  const form = useFormContext<ServiceFormValues>()
  const levelCosts = form.watch("levelCosts") || []

  if (isLoadingUserLevels) {
    return (
      <div className="space-y-2 rounded-lg border border-border p-4">
        <div className="h-6 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-10 w-full animate-pulse rounded bg-muted" />
        <div className="h-10 w-full animate-pulse rounded bg-muted" />
      </div>
    )
  }

  if (userLevelOptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/80 bg-muted/20 p-6 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          No user levels found
        </p>
        <p className="mt-1 text-xs text-muted-foreground/80">
          Create user levels in the User Levels section first to set
          custom group pricing.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-primary/20 bg-primary/[0.02] shadow-md shadow-primary/[0.02] transition-all duration-300 hover:border-primary/30 dark:bg-primary/[0.04]">
      <Table>
        <TableHeader className="bg-primary/[0.06] border-b border-primary/10">
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead className="h-12 text-sm font-semibold text-foreground">
              User Level
            </TableHead>
            <TableHead className="h-12 text-sm font-semibold text-foreground">
              Description
            </TableHead>
            <TableHead className="h-12 text-right text-sm font-semibold text-foreground">
              Custom Price
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userLevelOptions.map((opt, index) => {
            const itemIndex = levelCosts.findIndex(
              (item: any) => String(item?.branchLevelId) === String(opt.id)
            )
            const targetIndex = itemIndex !== -1 ? itemIndex : index
            const levelCostName = `levelCosts.${targetIndex}` as const
            const isChecked = form.watch(`${levelCostName}.isChecked` as any)
            const error = (form.formState.errors.levelCosts as any)?.[targetIndex]?.cost?.message

            return (
              <TableRow
                key={opt.id}
                className="border-b border-border/50 hover:bg-muted/10 last:border-b-0"
              >
                <TableCell className="w-[50px]">
                  <Controller
                    control={form.control}
                    name={`${levelCostName}.isChecked` as any}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <Checkbox
                        checked={!!value}
                        onCheckedChange={(checked) => {
                          onChange(checked)
                          if (checked) {
                            const currentCost = form.getValues(
                              `${levelCostName}.cost` as any
                            )
                            if (!currentCost) {
                              form.setValue(
                                `${levelCostName}.cost` as any,
                                String(form.getValues("cost") || "0.00")
                              )
                            }
                          } else {
                            form.clearErrors(`${levelCostName}.cost` as any)
                          }
                        }}
                        onBlur={onBlur}
                        aria-label={`Select ${opt.name}`}
                      />
                    )}
                  />
                </TableCell>
                <TableCell className="py-4 text-sm font-medium text-foreground">
                  {opt.name}
                </TableCell>
                <TableCell
                  className="max-w-[250px] text-sm truncate text-muted-foreground"
                  title={opt.description}
                >
                  {opt.description || "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end gap-1">
                    <Controller
                      control={form.control}
                      name={`${levelCostName}.cost` as any}
                      render={({ field }) => (
                        <Input
                          type="number"
                          placeholder="0.00"
                          disabled={!isChecked}
                          aria-invalid={Boolean(error)}
                          className="h-9 w-32 bg-background/50 text-right disabled:bg-muted/10"
                          {...field}
                          value={field.value ?? ""}
                        />
                      )}
                    />
                    {error && (
                      <span className="mt-0.5 text-xs text-destructive">
                        {error}
                      </span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between border-t border-border bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
        <span>Check a level to set a custom price for that group.</span>
        <Badge variant="success" className="px-2.5 py-0.5 text-xs font-semibold">
          {(form.watch("levelCosts") || []).filter((item: any) => item.isChecked).length} / {userLevelOptions.length} selected
        </Badge>
      </div>
    </div>
  )
}
