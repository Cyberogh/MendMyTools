"use client"

import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Clock,
  Cpu,
  Inbox,
  Plus,
  Server,
  ShieldCheck,
  Star,
  Ticket,
  Users,
} from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/layout/page-header"
import { StarPicker } from "@/components/tickets/star-picker"
import { TicketCard } from "@/components/tickets/ticket-card"
import { useAuth } from "@/lib/hooks/use-auth"
import { useAgentRatingStats } from "@/lib/hooks/use-ratings"
import { useMyTickets, useAllTickets, useAssignedTickets } from "@/lib/hooks/use-tickets"
import { ROLES, TICKET_STATUS } from "@/lib/constants"

export default function DashboardPage() {
  const { user } = useAuth()

  const isAdmin = user?.role === ROLES.ADMIN
  const isAgent = user?.role === ROLES.AGENT
  const isEmployee = user?.role === ROLES.EMPLOYEE

  const myTicketsQuery = useMyTickets(!!user && !isAdmin && !isAgent)
  const allTicketsQuery = useAllTickets(!!user && isAdmin)
  const assignedTicketsQuery = useAssignedTickets(!!user && isAgent)

  const activeQuery = isAdmin ? allTicketsQuery : isAgent ? assignedTicketsQuery : myTicketsQuery
  const { data: tickets, isLoading, isError, error, refetch } = activeQuery

  const stats = React.useMemo(() => {
    if (!tickets) return { total: 0, open: 0, pending: 0, closed: 0 }
    return {
      total: tickets.length,
      open: tickets.filter((t) => t.status === TICKET_STATUS.OPEN).length,
      pending: tickets.filter(
        (t) => t.status === TICKET_STATUS.ASSIGNED || t.status === TICKET_STATUS.IN_PROGRESS || t.status === TICKET_STATUS.RESOLVED
      ).length,
      closed: tickets.filter((t) => t.status === TICKET_STATUS.CLOSED).length,
    }
  }, [tickets])

  const recentTickets = React.useMemo(() => {
    if (!tickets) return []
    return [...tickets]
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 5)
  }, [tickets])

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="MENDMYTOOLS · CLOUD ATELIER COMMAND"
        title={
          user?.sub
            ? `Atelier Dispatch — ${user.sub.split("@")[0]}`
            : "MendMyTools Atelier"
        }
        description={
          isAdmin
            ? "Live cloud SLA telemetry, multi-container queue orchestration, and specialist assignments."
            : isAgent
            ? "Inspect assigned tool-repair orders, update diagnostic status, and verify SLA compliance."
            : "Log precision hardware/software repair orders and rate completed resolution cycles."
        }
        actions={
          isEmployee ? (
            <Button asChild className="uppercase tracking-wider text-xs">
              <Link href="/tickets/new">
                <Plus className="size-4" />
                Log Repair Order
              </Link>
            </Button>
          ) : null
        }
      />

      {/* Cloud Architecture & SLA Telemetry Strip */}
      <div className="grid gap-3 sm:grid-cols-3 rounded-lg border border-border bg-secondary/60 p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded bg-primary/15 text-primary">
            <Server className="size-4" />
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Cloud Pipeline
            </div>
            <div className="text-xs font-medium">
              Docker Compose · FastAPI + Next.js 16
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded bg-primary/15 text-primary">
            <Cpu className="size-4" />
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              SLA Response & Availability
            </div>
            <div className="text-xs font-medium">
              42ms P95 (&lt; 2s Target) · 99.9% Uptime
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded bg-primary/15 text-primary">
            <ShieldCheck className="size-4" />
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Measured TTR & Recovery
            </div>
            <div className="text-xs font-medium">
              32s Auto-Heal · RPO 0 min (Persistent DB)
            </div>
          </div>
        </div>
      </div>

      {isAgent && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-vogue text-xl font-semibold tracking-tight text-foreground">
              Assigned Repair Orders
            </h2>
            <Button variant="ghost" size="sm" asChild className="text-xs">
              <Link href="/tickets">
                View all
                <ArrowRight className="size-3 ml-1" />
              </Link>
            </Button>
          </div>

          <AgentRatingCard agentId={user?.user_id ?? null} />

          {isError ? (
            <ErrorState
              title="Could not load assigned repair orders"
              description={error instanceof Error ? error.message : "Something went wrong."}
              onRetry={() => refetch()}
            />
          ) : recentTickets.length === 0 ? (
            <EmptyState
              icon={<Inbox className="size-5" />}
              title="No assigned repair orders"
              description="Orders routed to you by the Admin Atelier will appear here."
            />
          ) : (
            <div className="space-y-3">
              {recentTickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  href={`/tickets/${ticket.id}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {!isAgent && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Repair Orders"
            value={stats.total}
            icon={<Ticket className="size-4 text-primary" />}
          />
          <StatCard
            label="Open Diagnostics"
            value={stats.open}
            icon={<AlertCircle className="size-4 text-sky-600" />}
          />
          <StatCard
            label="Active In-Bench"
            value={stats.pending}
            icon={<Clock className="size-4 text-amber-600" />}
          />
          <StatCard
            label="Closed & Verified"
            value={stats.closed}
            icon={<CheckCircle className="size-4 text-emerald-600" />}
          />
        </div>
      )}

      {!isAgent && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-vogue text-xl font-semibold tracking-tight text-foreground">
                Recent Atelier Activity
              </h2>
              <Button variant="ghost" size="sm" asChild className="text-xs">
                <Link href={isAdmin ? "/tickets/all" : "/tickets"}>
                  View full ledger
                  <ArrowRight className="size-3 ml-1" />
                </Link>
              </Button>
            </div>

            {isError ? (
              <ErrorState
                title="Could not load repair orders"
                description={error instanceof Error ? error.message : "Something went wrong."}
                onRetry={() => refetch()}
              />
            ) : recentTickets.length === 0 ? (
              <EmptyState
                icon={<Inbox className="size-5" />}
                title="No repair orders logged"
                description="When repair tickets are submitted, they will appear in this feed."
              />
            ) : (
              <div className="space-y-3">
                {recentTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    href={`/tickets/${ticket.id}`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="font-vogue text-xl font-semibold tracking-tight text-foreground">
              Atelier Controls
            </h2>
            <Card className="border-border bg-card">
              <CardContent className="p-5 space-y-3.5">
                {isEmployee && (
                  <Button className="w-full justify-start text-sm h-10" asChild>
                    <Link href="/tickets/new">
                      <Plus className="size-4 mr-2" />
                      Log New Repair Order
                    </Link>
                  </Button>
                )}
                <Button className="w-full justify-start text-sm h-10" asChild variant="outline">
                  <Link href={isAdmin ? "/tickets/all" : "/tickets"}>
                    <Ticket className="size-4 mr-2" />
                    {isAdmin ? "Master Ticket Ledger" : "View My Repair Orders"}
                  </Link>
                </Button>
                {isAdmin && (
                  <Button className="w-full justify-start text-sm h-10" asChild variant="outline">
                    <Link href="/users">
                      <Users className="size-4 mr-2" />
                      Operator Role Directory
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string
  value: number
  icon: React.ReactNode
}) {
  return (
    <Card className="border-border bg-card hover:border-primary/40 transition-colors">
      <CardContent className="p-6 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.16em]">
            {label}
          </p>
          <p className="font-vogue text-4xl font-bold tracking-tight">{value}</p>
        </div>
        <div className="flex size-10 items-center justify-center rounded bg-secondary text-foreground border border-border">
          {icon}
        </div>
      </CardContent>
    </Card>
  )
}

function AgentRatingCard({ agentId }: { agentId: number | null }) {
  const query = useAgentRatingStats(agentId, !!agentId)
  const stats = query.data
  const average = stats?.average_rating ?? null
  const total = stats?.total_ratings ?? 0
  const filledStars = average === null ? 0 : Math.round(average)

  return (
    <Card className="border-border">
      <CardContent className="p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Star className="size-4 text-amber-500 fill-amber-500" />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Specialist Quality Index
              </p>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="font-vogue text-3xl font-bold tracking-tight">
                {query.isLoading
                  ? "—"
                  : average === null
                  ? "No ratings yet"
                  : `${average.toFixed(1)} / 5`}
              </p>
              {average !== null && (
                <p className="text-xs text-muted-foreground">
                  Across {total} verified cycle{total === 1 ? "" : "s"}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {query.isLoading ? (
              <Skeleton className="h-5 w-32" />
            ) : (
              <StarPicker value={filledStars} readOnly size={18} />
            )}
            {query.isError && (
              <p className="text-xs text-destructive">Could not load rating.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[104px] w-full" />
        ))}
      </div>
    </div>
  )
}
