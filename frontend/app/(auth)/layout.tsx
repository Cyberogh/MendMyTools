import * as React from "react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex relative overflow-hidden border-r border-border bg-card">
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="MendMyTools" className="size-9 rounded-[9px] object-cover shadow-xs shrink-0" />
            <div className="font-vogue-brand text-xl font-bold tracking-wide">
              MendMyTools
            </div>
          </div>

          <div className="space-y-6 max-w-md">
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-balance">
                Resolve tickets faster, together.
              </h1>
              <p className="text-sm leading-relaxed text-muted-foreground">
                A calm, focused workspace for support teams and the people they serve.
                Track issues, route work, and close the loop — all in one place.
              </p>
            </div>

            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 size-1.5 rounded-full bg-emerald-500" />
                <div>
                  <div className="font-medium">Built-in lifecycle</div>
                  <div className="text-muted-foreground">
                    Tickets move through open → assigned → in progress → resolved → closed.
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 size-1.5 rounded-full bg-amber-500" />
                <div>
                  <div className="font-medium">Role-aware</div>
                  <div className="text-muted-foreground">
                    Employees, agents, and admins each get the right tools.
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 size-1.5 rounded-full bg-sky-500" />
                <div>
                  <div className="font-medium">Conversation-first</div>
                  <div className="text-muted-foreground">
                    Every ticket keeps a clean thread of context.
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} <span className="font-vogue-brand font-semibold text-foreground">MendMyTools</span> · Devashish Chaudhry & Devansh Ranjan
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  )
}
