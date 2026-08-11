import { cookies } from "next/headers"
import Link from "next/link"

import { PublicShell } from "@/components/layouts/public-shell"
import { Button } from "@/components/ui/button"

export default async function HomePage() {
  const cookieStore = await cookies()

  const token = cookieStore.get("token")?.value

  return (
    <PublicShell isAuthenticated={!!token}>
      <section className="flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center rounded-full border bg-muted px-4 py-1.5 text-sm text-muted-foreground">
          Enterprise Appointment Platform
        </div>

        <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
          Modern scheduling for service businesses
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Manage bookings, staff, customers, branches, and analytics from one
          centralized platform.
        </p>

        {!token && (
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/register">Get Started</Link>
            </Button>

            <Button asChild variant="outline" size="lg">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        )}
      </section>
    </PublicShell>
  )
}
