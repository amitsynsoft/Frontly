"use client"

import { Scissors } from "lucide-react"
import * as React from "react"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

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

const chartConfig = {
  value: {
    label: "Share",
  },
  "Hair Styling": {
    label: "Hair Styling",
    color: "var(--primary)",
  },
  "Spa & Facial": {
    label: "Spa & Facial",
    color: "#10b981",
  },
  "Nail Care": {
    label: "Nail Care",
    color: "#f59e0b",
  },
  Consultations: {
    label: "Consultations",
    color: "#6366f1",
  },
} satisfies ChartConfig

interface ServiceCategoryPoint {
  name: string
  value: number
  color: string
}

interface ServiceDistributionChartProps {
  data?: ServiceCategoryPoint[]
}

export function ServiceDistributionChart({ data = [] }: ServiceDistributionChartProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)

  const safeData = data || []
  const totalValue = safeData.reduce(
    (acc, curr) => acc + (curr?.value || 0),
    0
  )

  return (
    <Card className="flex flex-col border-border/80 shadow-xs transition-all duration-300 hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/25">
      <CardHeader className="items-start pb-0">
        <CardTitle className="text-md font-bold tracking-tight">
          Service category breakdown
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Distribution of bookings by category.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pt-2 pb-4">
        {safeData.length === 0 ? (
          <div className="flex h-[240px] flex-col items-center justify-center text-muted-foreground">
            <Scissors className="mb-2 size-8 opacity-40" />
            <p className="text-sm font-medium">No service breakdown data available</p>
          </div>
        ) : (
          <>
            <div className="relative flex h-[180px] items-center justify-center">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[160px] w-full"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={safeData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={70}
                    strokeWidth={3}
                    stroke="var(--card)"
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    {safeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color || "var(--primary)"}
                        className="transition-all duration-200"
                        style={{
                          opacity:
                            activeIndex === null || activeIndex === index ? 1 : 0.6,
                          transform:
                            activeIndex === index ? "scale(1.05)" : "scale(1)",
                          transformOrigin: "center",
                        }}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-foreground">
                  {activeIndex !== null && safeData[activeIndex]
                    ? `${safeData[activeIndex].value || 0}%`
                    : `${totalValue}%`}
                </span>
                <span className="text-xs font-semibold tracking-wider text-muted-foreground/80 uppercase">
                  {activeIndex !== null && safeData[activeIndex]
                    ? safeData[activeIndex].name || "Metric"
                    : "Total"}
                </span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {safeData.map((item, index) => (
                <div
                  key={item.name || index}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-border/50 px-2.5 py-1.5 transition-all select-none hover:bg-muted/40"
                  style={{
                    borderColor: activeIndex === index ? item.color || "var(--primary)" : "transparent",
                  }}
                >
                  <div
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color || "var(--primary)" }}
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      {item.name || "Unknown"}
                    </span>
                    <span className="mt-0.5 text-sm leading-none font-bold text-foreground">
                      {item.value || 0}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
