"use client"

import {
  ArrowRight,
  CalendarDays,
  Download,
  Settings2,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Container } from "@/components/shared/container"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { ImageGuard } from "@/components/shared/image-guard"
import { Section } from "@/components/shared/section"
import { StatusBadge } from "@/components/shared/status-badge"
import { SuccessState } from "@/components/shared/success-state"
import { Typography } from "@/components/shared/typography"
import { WebsiteLoader } from "@/components/shared/website-loader"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const buttonVariants = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const

const buttonSizes = ["xs", "sm", "default", "lg", "icon"] as const

export default function AppComponentsPage() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <header className="border-b bg-background/90 backdrop-blur">
        <Container className="flex h-16 items-center justify-between">
          <Link href="/dashboard" className="text-sm font-semibold">
            Frontly
          </Link>
          <Button asChild size="sm">
            <Link href="/dashboard/settings">
              Theme admin
              <ArrowRight />
            </Link>
          </Button>
        </Container>
      </header>

      <Section className="pt-14" containerSize="md">
        <div className="grid gap-4">
          <Typography variant="display">
            Application component system
          </Typography>
          <Typography variant="lead">
            A public reference page for semantic tokens, reusable layout
            primitives, controls, cards, loaders, image fallbacks, and form
            elements.
          </Typography>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status="confirmed" />
            <StatusBadge status="pending" />
            <StatusBadge status="completed" />
            <StatusBadge status="cancelled" />
          </div>
        </div>
      </Section>

      <Section
        title="Buttons"
        description="Every button variant uses semantic theme tokens, so admin theme changes reflect here automatically."
      >
        <div className="grid gap-5">
          <div className="flex flex-wrap items-center gap-3">
            {buttonVariants.map((variant) => (
              <Button key={variant} variant={variant}>
                {variant === "default" ? "primary" : variant}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {buttonSizes.map((size) => (
              <Button
                key={size}
                size={size}
                aria-label={size === "icon" ? "Settings" : undefined}
              >
                {size === "icon" ? <Settings2 /> : size}
              </Button>
            ))}
            <Button variant="outline">
              <Download />
              Export
            </Button>
            <ConfirmDialog
              title="Archive component?"
              description="This demonstrates the reusable destructive confirmation pattern."
              confirmLabel="Archive"
              variant="destructive"
            >
              <Button variant="destructive">
                <Trash2 />
                Confirm dialog
              </Button>
            </ConfirmDialog>
          </div>
        </div>
      </Section>

      <Section
        title="Toasts"
        description="Globally accessible notifications using Sonner. Highly customized design matching theme properties."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            onClick={() =>
              toast("Hello World", {
                description: "This is a simple system toast notification.",
              })
            }
          >
            Default
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.success("Action Completed", {
                description:
                  "Data successfully synced with the tenant database.",
              })
            }
          >
            Success
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.error("System Error", {
                description: "Unable to process payment gateway transaction.",
              })
            }
          >
            Error
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.warning("Warning Alert", {
                description: "Your current session will expire in 5 minutes.",
              })
            }
          >
            Warning
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.info("New Update", {
                description:
                  "Branch settings were modified by another administrator.",
              })
            }
          >
            Info
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              toast("Delete Appointment", {
                description:
                  "Are you sure you want to permanently remove this appointment?",
                action: {
                  label: "Confirm",
                  onClick: () => toast.success("Appointment deleted"),
                },
                cancel: {
                  label: "Cancel",
                  onClick: () => {},
                },
              })
            }}
          >
            Action Toast
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const promise = () =>
                new Promise((resolve) => setTimeout(resolve, 2000))
              toast.promise(promise, {
                loading: "Updating database schema...",
                success: "Database successfully updated!",
                error: "Database schema update failed.",
              })
            }}
          >
            Loading/Promise
          </Button>
        </div>
      </Section>

      <Section
        title="Container and section"
        description="Layout primitives keep page rhythm consistent across dashboard, customer portal, and public pages."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {["sm", "md", "lg"].map((size) => (
            <div key={size} className="rounded-lg border bg-card p-4 shadow-sm">
              <Typography variant="h3">{size.toUpperCase()}</Typography>
              <Typography variant="muted">
                Container size token for predictable responsive composition.
              </Typography>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography">
        <div className="grid gap-3">
          <Typography variant="h1">Heading one</Typography>
          <Typography variant="h2">Heading two</Typography>
          <Typography variant="h3">Heading three</Typography>
          <Typography variant="body">
            Body copy is compact and readable for operational SaaS screens.
          </Typography>
          <Typography variant="muted">
            Muted text carries helper copy and secondary metadata.
          </Typography>
          <Typography variant="code">org_tony_salon / branch_mumbai</Typography>
        </div>
      </Section>

      <Section
        title="Cards"
        description="Cards are reserved for repeated items and framed tools."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Bookings", "38", "Confirmed appointments today"],
            ["Revenue", "₹1.42L", "Collected across active branches"],
            ["Utilization", "76%", "Average staff schedule occupancy"],
          ].map(([title, value, description]) => (
            <Card key={title}>
              <CardHeader>
                <CardDescription>{title}</CardDescription>
                <CardTitle className="text-2xl">{value}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {description}
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="Image guard"
        description="When media is missing or fails to load, the component renders a designed placeholder."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <ImageGuard src={null} alt="Missing branch image" />
          <div className="grid content-center gap-4 rounded-lg border bg-card p-5">
            <Typography variant="h3">Fallback behavior</Typography>
            <Typography variant="muted">
              Use this for tenant logos, branch photos, staff avatars, service
              thumbnails, and public booking media.
            </Typography>
          </div>
        </div>
      </Section>

      <Section title="Website loader">
        <WebsiteLoader />
      </Section>

      <Section
        title="Form elements"
        description="Base controls are theme-aware and ready to wrap with React Hook Form and Zod."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="component-name">Text input</Label>
            <Input id="component-name" placeholder="Service name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="component-phone">Phone input</Label>
            <Input
              id="component-phone"
              type="tel"
              placeholder="+91 98765 12345"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="component-date">Date input</Label>
            <div className="relative">
              <Input id="component-date" type="date" />
              <CalendarDays className="pointer-events-none absolute top-2.5 right-3 size-4 text-muted-foreground" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Branch select</Label>
            <Select defaultValue="mumbai">
              <SelectTrigger className="w-full" aria-label="Branch select">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mumbai">Mumbai Branch</SelectItem>
                <SelectItem value="pune">Pune Branch</SelectItem>
                <SelectItem value="delhi">Delhi Branch</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="component-notes">Textarea</Label>
            <Textarea
              id="component-notes"
              placeholder="Internal booking notes"
            />
          </div>
          <div className="grid gap-4 md:col-span-2">
            <Label>Checkbox variants</Label>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border/50 bg-card/30 p-3 shadow-xs transition-all hover:bg-card/50">
                <Checkbox id="cb-unchecked" />
                <span className="text-sm font-medium text-foreground">
                  Unchecked
                </span>
              </label>
              <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border/50 bg-card/30 p-3 shadow-xs transition-all hover:bg-card/50">
                <Checkbox id="cb-checked" defaultChecked />
                <span className="text-sm font-medium text-foreground">
                  Checked
                </span>
              </label>
              <label className="flex cursor-not-allowed items-center gap-2.5 rounded-lg border border-border/50 bg-card/10 p-3 opacity-60">
                <Checkbox id="cb-disabled-unchecked" disabled />
                <span className="text-sm font-medium text-foreground">
                  Disabled
                </span>
              </label>
              <label className="flex cursor-not-allowed items-center gap-2.5 rounded-lg border border-border/50 bg-card/10 p-3 opacity-60">
                <Checkbox id="cb-disabled-checked" defaultChecked disabled />
                <span className="text-sm font-medium text-foreground">
                  Disabled Checked
                </span>
              </label>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Operational states" className="border-b-0">
        <div className="grid gap-6 md:grid-cols-3">
          <EmptyState
            title="Empty state"
            message="No services match the current filters."
            actionLabel="Reset filters"
          />
          <ErrorState
            title="Error state"
            message="The backend request failed and can be retried."
            retryLabel="Try again"
            onRetry={() => {}}
          />
          <SuccessState
            title="Success state"
            message="Theme settings were saved for this tenant."
            actionLabel="View settings"
          />
        </div>
      </Section>
    </main>
  )
}
