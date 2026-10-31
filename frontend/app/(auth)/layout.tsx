import * as React from "react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full grid lg:grid-cols-12 bg-background">
      <div className="hidden lg:flex lg:col-span-7 relative overflow-hidden border-r border-border bg-[#141210] text-[#FAF7F2]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#8B1E24_0%,transparent_55%)] opacity-35" />
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <div className="space-y-2 border-b border-white/15 pb-6">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.28em] text-[#D6C7B2]">
              <span>ISSUE NO. 01 · CLOUD SERVICE ATELIER</span>
              <span>AWS · DOCKER · SLA 99.9%</span>
            </div>
            <div className="font-vogue text-5xl xl:text-6xl font-bold tracking-[0.12em] uppercase text-[#FAF7F2] pt-1">
              MENDMYTOOLS
            </div>
          </div>

          <div className="space-y-8 max-w-xl my-auto py-8">
            <div className="space-y-4">
              <span className="inline-block border border-[#8B1E24] bg-[#8B1E24]/20 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-[#F5D0D2]">
                Enterprise Repair & Diagnostics Pipeline
              </span>
              <h1 className="font-vogue text-4xl xl:text-5xl font-semibold tracking-tight leading-[1.12] text-[#FAF7F2]">
                Precision care for the tools that power your cloud.
              </h1>
              <p className="text-sm leading-relaxed text-[#C9C1B8]">
                An editorial-grade support and hardware repair command center. Route critical incidents, enforce sub-second SLA telemetry, and audit every resolution cycle in one unified workspace.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/15">
              <div>
                <div className="font-vogue text-2xl font-bold text-[#FAF7F2]">99.9%</div>
                <div className="text-[11px] uppercase tracking-wider text-[#B0A69B] mt-0.5">
                  Availability SLA
                </div>
              </div>
              <div>
                <div className="font-vogue text-2xl font-bold text-[#FAF7F2]">&lt; 45ms</div>
                <div className="text-[11px] uppercase tracking-wider text-[#B0A69B] mt-0.5">
                  P95 API Latency
                </div>
              </div>
              <div>
                <div className="font-vogue text-2xl font-bold text-[#FAF7F2]">32 sec</div>
                <div className="text-[11px] uppercase tracking-wider text-[#B0A69B] mt-0.5">
                  Measured Container TTR
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t border-white/15 pt-5 text-xs text-[#B0A69B]">
            <div>
              © {new Date().getFullYear()} <span className="font-vogue tracking-widest uppercase text-[#FAF7F2]">MENDMYTOOLS</span> · Cloud Computing Project
            </div>
            <div className="text-[11px] text-[#D6C7B2]">
              Devashish Chaudhry (24A12RES230) · Devansh Ranjan (24A12RES227)
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
