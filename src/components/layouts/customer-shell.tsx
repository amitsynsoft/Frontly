"use client"

import { CalendarCheck2, Home, Scissors, UserRound } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils/cn.utils"

const customerNavigation = [
  { title: "Services", href: "/customer/services", icon: Scissors },
  { title: "Booking", href: "/customer/booking", icon: CalendarCheck2 },
  { title: "Bookings", href: "/customer/bookings", icon: Home },
  { title: "Profile", href: "/customer/profile", icon: UserRound },
]

function CustomerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-svh bg-background pb-20">
      <header className="sticky top-0 z-30 border-b bg-background/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/customer/services" className="text-sm font-semibold">
            Tony Salon
          </Link>
          <Button asChild size="sm">
            <Link href="/customer/booking">Book</Link>
          </Button>
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl px-4 py-5">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t bg-background md:hidden">
        <div className="grid grid-cols-4">
          {customerNavigation.map((item) => {
            const Icon = item.icon
            const active = pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-16 flex-col items-center justify-center gap-1 text-xs text-muted-foreground",
                  active && "text-primary"
                )}
              >
                <Icon className="size-4" />
                {item.title}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

export { CustomerShell }
