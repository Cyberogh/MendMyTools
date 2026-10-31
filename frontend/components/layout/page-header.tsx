import * as React from "react"

import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  eyebrow?: string
  className?: string
}

export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-b border-border pb-6 md:flex-row md:items-end md:justify-between md:gap-6",
        className,
      )}
    >
      <div className="space-y-1.5 min-w-0">
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            {eyebrow}
          </p>
        )}
        <h1 className="font-vogue text-3xl md:text-4xl font-bold tracking-tight text-balance">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground max-w-2xl text-pretty">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  )
}
