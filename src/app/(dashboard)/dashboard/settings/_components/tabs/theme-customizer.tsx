"use client"

import { Palette, RotateCcw } from "lucide-react"
import type { ReactNode } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  tenantFontStacks,
  type TenantTheme,
} from "@/config/theme"
import { cn } from "@/lib/utils/cn.utils"
import { useTenantTheme } from "@/providers/theme-provider"

type ThemePalette = Pick<
  TenantTheme,
  | "primaryColor"
  | "primaryForegroundColor"
  | "secondaryColor"
  | "secondaryForegroundColor"
> & {
  label: string
  description: string
}

const colorPalettes: ThemePalette[] = [
  {
    label: "Ocean",
    description: "Clear blue with a calm surface tint",
    primaryColor: "#2563eb",
    primaryForegroundColor: "#ffffff",
    secondaryColor: "#dbeafe",
    secondaryForegroundColor: "#1e3a8a",
  },
  {
    label: "Teal",
    description: "Fresh service-brand greens",
    primaryColor: "#0f766e",
    primaryForegroundColor: "#ffffff",
    secondaryColor: "#ccfbf1",
    secondaryForegroundColor: "#134e4a",
  },
  {
    label: "Violet",
    description: "Polished admin accent color",
    primaryColor: "#763aee",
    primaryForegroundColor: "#ffffff",
    secondaryColor: "#ede9fe",
    secondaryForegroundColor: "#763aee",
  },
  {
    label: "Rose",
    description: "Warm booking and wellness tone",
    primaryColor: "#e11d48",
    primaryForegroundColor: "#ffffff",
    secondaryColor: "#ffe4e6",
    secondaryForegroundColor: "#881337",
  },
  {
    label: "Amber",
    description: "Bright, high-energy highlights",
    primaryColor: "#b45309",
    primaryForegroundColor: "#ffffff",
    secondaryColor: "#fef3c7",
    secondaryForegroundColor: "#78350f",
  },
  {
    label: "Slate",
    description: "Neutral, enterprise-style controls",
    primaryColor: "#334155",
    primaryForegroundColor: "#ffffff",
    secondaryColor: "#e2e8f0",
    secondaryForegroundColor: "#0f172a",
  },
]

const radiusOptions = [
  { label: "Sharp", value: "0.25rem" },
  { label: "Balanced", value: "0.5rem" },
  { label: "Soft", value: "0.75rem" },
  { label: "Round", value: "1rem" },
]

const sidebarOptions = [
  {
    label: "Compact",
    value: "compact",
    description: "Tighter rows for dense admin work.",
  },
  {
    label: "Comfortable",
    value: "comfortable",
    description: "The current balanced sidebar rhythm.",
  },
  {
    label: "Spacious",
    value: "spacious",
    description: "Larger targets and more breathing room.",
  },
  {
    label: "Minimal",
    value: "minimal",
    description: "Pill links with softer active states.",
  },
] satisfies Array<{
  label: string
  value: TenantTheme["sidebarStyle"]
  description: string
}>

const fontOptions = [
  {
    label: "Inter",
    value: tenantFontStacks.inter,
    sample: "Crisp and neutral for dashboards",
  },
  {
    label: "Segoe UI",
    value: tenantFontStacks.segoe,
    sample: "Clean Windows-style interface",
  },
  {
    label: "Arial",
    value: tenantFontStacks.arial,
    sample: "Simple, familiar, highly compatible",
  },
  {
    label: "Rounded",
    value: tenantFontStacks.rounded,
    sample: "Softer feel for service businesses",
  },
  {
    label: "Serif",
    value: tenantFontStacks.serif,
    sample: "Traditional, premium appointment brands",
  },
  {
    label: "Mono",
    value: tenantFontStacks.mono,
    sample: "Technical and operational",
  },
]

function ThemeCustomizer() {
  const { resetTenantTheme, tenantTheme, updateTenantTheme } = useTenantTheme()
  const selectedFont = fontOptions.find(
    (option) => option.value === tenantTheme.fontFamily
  )

  function updatePrimaryColor(primaryColor: string) {
    updateTenantTheme({
      primaryColor,
      ...(isHexColor(primaryColor)
        ? { primaryForegroundColor: getReadableTextColor(primaryColor) }
        : {}),
    })
  }

  function updateSecondaryColor(secondaryColor: string) {
    updateTenantTheme({
      secondaryColor,
      ...(isHexColor(secondaryColor)
        ? { secondaryForegroundColor: getReadableTextColor(secondaryColor) }
        : {}),
    })
  }

  function applyPalette(palette: ThemePalette) {
    updateTenantTheme({
      primaryColor: palette.primaryColor,
      primaryForegroundColor: palette.primaryForegroundColor,
      secondaryColor: palette.secondaryColor,
      secondaryForegroundColor: palette.secondaryForegroundColor,
    })
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="grid gap-1">
              <CardTitle>Appearance theme</CardTitle>
              <CardDescription>
                Changes stay in this signed-in browser session and reset on
                logout.
              </CardDescription>
            </div>
            <Badge variant="secondary">Session only</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          <ThemeSection
            title="Colors"
            description="Start from a balanced palette, then fine-tune individual tokens."
          >
            <ThemePalettePicker
              activeTheme={tenantTheme}
              onSelect={applyPalette}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <ThemeColorControl
                id="theme-primary-color"
                label="Primary color"
                value={tenantTheme.primaryColor}
                onChange={updatePrimaryColor}
              />
              <ThemeColorControl
                id="theme-secondary-color"
                label="Secondary color"
                value={tenantTheme.secondaryColor}
                onChange={updateSecondaryColor}
              />
              <ThemeColorControl
                id="theme-primary-text"
                label="Primary text"
                value={tenantTheme.primaryForegroundColor}
                onChange={(primaryForegroundColor) =>
                  updateTenantTheme({ primaryForegroundColor })
                }
              />
              <ThemeColorControl
                id="theme-secondary-text"
                label="Secondary text"
                value={tenantTheme.secondaryForegroundColor}
                onChange={(secondaryForegroundColor) =>
                  updateTenantTheme({ secondaryForegroundColor })
                }
              />
            </div>
          </ThemeSection>

          <ThemeSection
            title="Layout"
            description="Choose the overall shape, sidebar density, and typography."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Radius</Label>
                <Select
                  value={tenantTheme.radius}
                  onValueChange={(radius) => updateTenantTheme({ radius })}
                >
                  <SelectTrigger
                    aria-controls="theme-radius-select-content"
                    aria-label="Radius"
                    className="w-full"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent id="theme-radius-select-content">
                    {radiusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Sidebar style</Label>
                <Select
                  value={tenantTheme.sidebarStyle}
                  onValueChange={(sidebarStyle) =>
                    updateTenantTheme({
                      sidebarStyle: sidebarStyle as TenantTheme["sidebarStyle"],
                    })
                  }
                >
                  <SelectTrigger
                    aria-controls="theme-sidebar-style-select-content"
                    aria-label="Sidebar style"
                    className="w-full"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent id="theme-sidebar-style-select-content">
                    {sidebarOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2 sm:col-span-2">
                <Label>Font family</Label>
                <Select
                  value={tenantTheme.fontFamily}
                  onValueChange={(fontFamily) =>
                    updateTenantTheme({ fontFamily })
                  }
                >
                  <SelectTrigger
                    aria-controls="theme-font-family-select-content"
                    aria-label="Font family"
                    className="w-full"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent id="theme-font-family-select-content">
                    {fontOptions.map((option) => (
                      <SelectItem key={option.label} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div
                  className="rounded-md border bg-muted/40 p-3 text-sm"
                  style={{ fontFamily: tenantTheme.fontFamily }}
                >
                  <div className="font-semibold">
                    {selectedFont?.sample ?? "Custom tenant font stack"}
                  </div>
                  <p className="mt-1 text-muted-foreground">
                    Appointment confirmed for Tuesday at 10:30 AM.
                  </p>
                </div>
              </div>
            </div>
          </ThemeSection>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={resetTenantTheme}>
              <RotateCcw data-icon="inline-start" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
      <ThemePreview tenantTheme={tenantTheme} />
    </div>
  )
}

function ThemeSection({
  children,
  description,
  title,
}: {
  children: ReactNode
  description: string
  title: string
}) {
  return (
    <section className="grid gap-3">
      <div className="grid gap-1">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  )
}

function ThemePalettePicker({
  activeTheme,
  onSelect,
}: {
  activeTheme: TenantTheme
  onSelect: (palette: ThemePalette) => void
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-2">
        <Palette className="size-4 text-muted-foreground" />
        <Label>Quick palettes</Label>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {colorPalettes.map((palette) => {
          const isActive = isMatchingPalette(activeTheme, palette)

          return (
            <button
              key={palette.label}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelect(palette)}
              className={cn(
                "rounded-lg border bg-background p-3 text-left transition-colors hover:border-primary/50 hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                isActive && "border-primary bg-primary/5"
              )}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="grid gap-1">
                  <span className="text-sm font-medium">{palette.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {palette.description}
                  </span>
                </span>
                <span className="flex shrink-0 gap-1">
                  <span
                    className="size-7 rounded-full border"
                    style={{ background: palette.primaryColor }}
                  />
                  <span
                    className="size-7 rounded-full border"
                    style={{ background: palette.secondaryColor }}
                  />
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ThemeColorControl({
  id,
  label,
  onChange,
  value,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}) {
  const colorForPicker = normalizeColor(value)
  const isValid = isHexColor(value)

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id}>{label}</Label>
        <span
          className={cn(
            "text-xs",
            isValid ? "text-muted-foreground" : "text-destructive"
          )}
        >
          {isValid ? "Hex" : "Use #RRGGBB"}
        </span>
      </div>
      <div className="flex gap-2 rounded-md border bg-background p-2">
        <Input
          id={`${id}-picker`}
          type="color"
          aria-label={`${label} picker`}
          value={colorForPicker}
          onChange={(event) => onChange(event.target.value)}
          className="size-10 shrink-0 p-1"
        />
        <div className="min-w-0 flex-1">
          <Input
            id={id}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="font-mono text-xs uppercase"
          />
        </div>
      </div>
    </div>
  )
}

function ThemePreview({ tenantTheme }: { tenantTheme: TenantTheme }) {
  return (
    <Card
      className="overflow-hidden"
      style={{ fontFamily: tenantTheme.fontFamily }}
    >
      <div className="h-2 bg-primary" />
      <CardHeader>
        <CardTitle>Live preview</CardTitle>
        <CardDescription>Live semantic-token preview</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-2">
          <PreviewSwatch label="Primary" color={tenantTheme.primaryColor} />
          <PreviewSwatch label="Secondary" color={tenantTheme.secondaryColor} />
          <PreviewSwatch
            label="Primary text"
            color={tenantTheme.primaryForegroundColor}
          />
          <PreviewSwatch
            label="Secondary text"
            color={tenantTheme.secondaryForegroundColor}
          />
        </div>

        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-sm font-semibold">Appointment confirmed</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Buttons, focus rings, sidebar accents, charts, and active states use
            the same tenant tokens.
          </p>
          <div className="mt-4 flex gap-2">
            <Button type="button" size="sm">
              Primary
            </Button>
            <Button type="button" variant="secondary" size="sm">
              Secondary
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-sidebar p-3 text-sidebar-foreground">
          <div className="mb-3 text-xs font-medium text-muted-foreground uppercase">
            {tenantTheme.sidebarStyle} sidebar
          </div>
          <div className="grid gap-1">
            <div
              data-active="true"
              data-slot="sidebar-link"
              className="flex h-10 items-center rounded-lg bg-sidebar-primary px-3 text-sm font-semibold text-sidebar-primary-foreground shadow-xs"
            >
              Dashboard
            </div>
            <div
              data-active="false"
              data-slot="sidebar-link"
              className="flex h-10 items-center rounded-lg px-3 text-sm text-sidebar-foreground/75"
            >
              Bookings
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PreviewSwatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="grid gap-1">
      <div className="h-12 rounded-md border" style={{ background: color }} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

function isMatchingPalette(theme: TenantTheme, palette: ThemePalette) {
  return (
    theme.primaryColor.toLowerCase() === palette.primaryColor.toLowerCase() &&
    theme.secondaryColor.toLowerCase() === palette.secondaryColor.toLowerCase()
  )
}

function isHexColor(value: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(value)
}

function normalizeColor(value: string) {
  return isHexColor(value) ? value : "#763aee"
}

function getReadableTextColor(value: string) {
  const color = normalizeColor(value).slice(1)
  const red = Number.parseInt(color.slice(0, 2), 16) / 255
  const green = Number.parseInt(color.slice(2, 4), 16) / 255
  const blue = Number.parseInt(color.slice(4, 6), 16) / 255

  const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue

  return luminance > 0.58 ? "#0f172a" : "#ffffff"
}

export { ThemeCustomizer }
