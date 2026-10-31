"use client"

import { Activity, LogOut, Moon, Search, Settings, ShieldCheck, Sun, UserCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { AvatarFallback, AvatarRoot } from "@/components/ui/avatar"
import { useAuth } from "@/lib/hooks/use-auth"
import { useTheme } from "@/components/theme-provider"
import { roleLabel, initialsOf } from "@/lib/utils/format"
import { ROLES } from "@/lib/constants"

export function Topbar() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { theme, toggle } = useTheme()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70 px-4 md:px-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search repair orders, tools, or telemetry…"
          className="h-9 pl-8 pr-12 bg-card/70"
          disabled
          aria-label="Search"
        />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 hidden md:inline-flex h-5 items-center gap-0.5 rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="hidden lg:flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-800 dark:text-emerald-300">
          <Activity className="size-3.5 text-emerald-600 animate-pulse" />
          <span>AWS EC2 · SLA 99.9% · TTR 32s</span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-md border border-border/70 bg-card px-2.5 py-1.5 text-sm hover:bg-muted/60 transition-colors">
            <AvatarRoot className="size-6">
              <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">
                {initialsOf(user?.sub?.split("@")[0])}
              </AvatarFallback>
            </AvatarRoot>
            <span className="hidden md:inline-block text-xs font-medium max-w-[130px] truncate">
              {user?.sub?.split("@")[0] ?? "Account"}
            </span>
            {user?.role === ROLES.ADMIN && (
              <ShieldCheck className="hidden md:block size-3.5 text-primary" />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{user?.sub}</span>
                <span className="text-xs text-muted-foreground">
                  Role: {roleLabel(user?.role ?? ROLES.EMPLOYEE)}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <UserCircle2 className="size-4" />
              Profile
              <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings className="size-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout()
                router.replace("/login")
              }}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
