"use client"

import { Bell, Menu, Moon, Search, Sun } from "lucide-react"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"

import { ProfileMenu } from "@/components/layouts/profile-menu"
import { Button } from "@/components/ui/button"

type AppNavbarProps = {
  onMenuClick: () => void
}

function AppNavbar({ onMenuClick }: AppNavbarProps) {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()

  const breadcrumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => segment.replaceAll("-", " "))
  return (
    <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center gap-3 border-b border-zinc-100 bg-white px-6 shadow-sm shadow-zinc-100/40 transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-10 rounded-xl border border-zinc-100/50 bg-zinc-50 text-zinc-600 transition-all duration-200 hover:border-primary/10 hover:bg-primary/[0.04] hover:text-primary active:scale-95 lg:hidden dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:bg-primary/10 dark:hover:text-primary"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <Menu className="size-4.5" />
      </Button>

      {/* Workspace Breadcrumbs */}
      <div className="hidden min-w-0 flex-1 md:block">
        <div className="text-[10px] font-bold tracking-widest text-muted-foreground/50 uppercase select-none">
          Workspace
        </div>
        <div className="mt-1 truncate text-base font-bold text-zinc-900 capitalize dark:text-zinc-50">
          {breadcrumbs.length ? breadcrumbs.join(" / ") : "dashboard"}
        </div>
      </div>

      {/* Actions (Search, Notifications, Theme, User Menu) */}
      <div className="ml-auto flex items-center gap-3">
        {/* Search Button */}
        {/* <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative size-10 rounded-xl border border-zinc-100/50 bg-zinc-50 text-zinc-600 transition-all duration-200 hover:border-primary/10 hover:bg-primary/[0.04] hover:text-primary active:scale-95 dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:bg-primary/10 dark:hover:text-primary"
          aria-label="Search"
        >
          <Search className="size-4.5" />
        </Button> */}

        {/* Notifications Button with Pulsing Badge */}
        {/* <Button
          type="button"
          variant="ghost"
          size="icon"
          className="group relative size-10 rounded-xl bg-zinc-50 border border-zinc-100/50 text-zinc-600 hover:border-primary/10 hover:bg-primary/[0.04] hover:text-primary transition-all duration-200 active:scale-95 dark:bg-zinc-900/60 dark:text-zinc-400 dark:border-zinc-800/80 dark:hover:bg-primary/10 dark:hover:text-primary"
          aria-label="Notifications"
        >
          <Bell className="size-4.5 transition-transform duration-200 group-hover:rotate-15" />
          <span className="absolute top-2.5 right-2.5 size-2 animate-pulse rounded-full border border-white bg-destructive dark:border-zinc-950" />
        </Button> */}

        {/* Dark Mode Toggle */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative size-10 rounded-xl border border-zinc-100/50 bg-zinc-50 text-zinc-600 transition-all duration-200 hover:border-primary/10 hover:bg-primary/[0.04] hover:text-primary active:scale-95 dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:bg-primary/10 dark:hover:text-primary"
          aria-label="Toggle theme"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          <Sun className="hidden size-4.5 rotate-90 transition-transform duration-300 dark:block dark:rotate-0" />
          <Moon className="block size-4.5 rotate-0 transition-transform duration-300 dark:hidden dark:rotate-90" />
        </Button>

        <ProfileMenu
          className="lg:hidden"
          id="mobile-navbar-user-menu"
          placement="header"
        />
      </div>
    </header>
  )
}

export { AppNavbar }
