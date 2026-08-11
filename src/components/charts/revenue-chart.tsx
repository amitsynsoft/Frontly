"use client"

import { TrendingUp, Users, Wallet } from "lucide-react"
import * as React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
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
import { formatCurrency, formatCompactCurrency } from "@/lib/utils/formatters"

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--primary)",
  },
  bookings: {
    label: "Bookings",
    color: "#10b981",
  },
} satisfies ChartConfig

interface RevenuePoint {
  label: string
  bookings: number
  revenue: number
}

interface RevenueChartProps {
  data?: RevenuePoint[]
  currency?: any
  currencies?: any[]
}

export function RevenueChart({
  data = [],
  currency = "INR",
  currencies,
}: RevenueChartProps) {
  const [activeMetric, setActiveMetric] = React.useState<
    "revenue" | "bookings"
  >("revenue")

  const safeData = data || []
  const totalRevenue = safeData.reduce(
    (acc, curr) => acc + (curr?.revenue || 0),
    0
  )
  const totalBookings = safeData.reduce(
    (acc, curr) => acc + (curr?.bookings || 0),
    0
  )

  return (
    <Card className="col-span-1 border-border/80 shadow-xs transition-all duration-300 hover:shadow-md hover:shadow-black/5 lg:col-span-2 dark:hover:shadow-black/25">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b border-border/60 p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5.5">
          <CardTitle className="text-lg font-bold tracking-tight">
            Performance trend
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Weekly analytics for bookings and revenue volume.
          </CardDescription>
        </div>
        <div className="flex border-t border-border/60 sm:border-t-0">
          <button
            type="button"
            data-active={activeMetric === "revenue"}
            onClick={() => setActiveMetric("revenue")}
            className="relative z-30 flex flex-1 cursor-pointer flex-col justify-center gap-1 border-r border-border/60 px-6 py-4 text-left transition-colors select-none hover:bg-muted/30 data-[active=true]:bg-muted/50 sm:border-r sm:border-l"
          >
            <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground/80 uppercase">
              Total revenue
            </span>
            <span className="text-lg leading-none font-bold text-foreground sm:text-xl">
              {formatCurrency(totalRevenue, currency, currencies)}
            </span>
          </button>
          <button
            type="button"
            data-active={activeMetric === "bookings"}
            onClick={() => setActiveMetric("bookings")}
            className="relative z-30 flex flex-1 cursor-pointer flex-col justify-center gap-1 px-6 py-4 text-left transition-colors select-none hover:bg-muted/30 data-[active=true]:bg-muted/50"
          >
            <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground/80 uppercase">
              Total bookings
            </span>
            <span className="text-lg leading-none font-bold text-foreground sm:text-xl">
              {totalBookings}
            </span>
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {safeData.length === 0 ? (
          <div className="flex h-[280px] flex-col items-center justify-center text-muted-foreground">
            <TrendingUp className="mb-2 size-8 opacity-40" />
            <p className="text-sm font-medium">
              No performance trend data available
            </p>
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
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
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
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--primary"
                    stopOpacity={0.25}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--primary"
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
                dataKey="label"
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
                tickFormatter={(value) =>
                  activeMetric === "revenue"
                    ? formatCompactCurrency(value, currency, currencies)
                    : value
                }
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
                          {activeMetric === "revenue"
                            ? formatCurrency(value as number, currency, currencies)
                            : value}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              {activeMetric === "revenue" ? (
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  animationDuration={300}
                />
              ) : (
                <Area
                  type="monotone"
                  dataKey="bookings"
                  name="Bookings"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorBookings)"
                  animationDuration={300}
                />
              )}
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
