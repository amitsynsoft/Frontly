"use client"

import { TrendingUp, Building2 } from "lucide-react"
import * as React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { TenantGrowthTrend } from "@/types/dtos/dashboard.dto"

const chartConfig = {
  tenants: {
    label: "New Tenants",
    color: "var(--primary)",
  },
} satisfies ChartConfig

interface TenantGrowthChartProps {
  data?: TenantGrowthTrend[]
}

export function TenantGrowthChart({ data = [] }: TenantGrowthChartProps) {
  const safeData = data || []
  const totalTenants = safeData.reduce((acc, curr) => acc + (curr?.tenants || 0), 0)

  return (
    <Card className="col-span-1 border-border/80 shadow-xs transition-all duration-300 hover:shadow-md hover:shadow-black/5 lg:col-span-2 dark:hover:shadow-black/25">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b border-border/60 p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5">
          <CardTitle className="text-lg font-bold tracking-tight">
            Tenant growth trend
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Month-over-month registration growth.
          </CardDescription>
        </div>
        <div className="flex border-t border-border/60 sm:border-t-0 sm:border-l">
          <div className="flex flex-col justify-center gap-1 px-6 py-4 text-left">
            <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground/80 uppercase">
              <Building2 className="size-3.5 text-primary" />
              Total registered
            </span>
            <span className="text-lg leading-none font-bold text-foreground sm:text-xl">
              {totalTenants}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {safeData.length === 0 ? (
          <div className="flex h-[280px] flex-col items-center justify-center text-muted-foreground">
            <TrendingUp className="mb-2 size-8 opacity-40" />
            <p className="text-sm font-medium">No tenant growth data available</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[280px] w-full"
          >
            <AreaChart
              data={safeData}
              margin={{ left: 10, right: 10, top: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorTenants" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--primary)"
                    stopOpacity={0.25}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--primary)"
                    stopOpacity={0.0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="stroke-border/40"
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs font-medium text-muted-foreground"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs font-medium text-muted-foreground"
                tickFormatter={(value) => value}
              />
              <ChartTooltip
                cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    className="w-[160px]"
                    labelFormatter={(value) => `${value}`}
                    formatter={(value, name) => (
                      <div className="flex w-full items-center justify-between gap-2">
                        <span className="text-muted-foreground">{name}</span>
                        <span className="font-bold text-foreground">
                          {value}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="tenants"
                name="New Tenants"
                stroke="var(--primary)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTenants)"
                animationDuration={300}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
