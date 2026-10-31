"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { ROLES } from "@/lib/constants"
import { login } from "@/lib/services/auth.service"
import { loginSchema, type LoginInput } from "@/lib/schemas"

import { Suspense } from "react"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [submitting, setSubmitting] = React.useState(false)

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const fillDemo = (email: string, pass: string) => {
    form.setValue("email", email, { shouldValidate: true })
    form.setValue("password", pass, { shouldValidate: true })
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true)
    try {
      const { user } = await login(values)
      toast.success(`Welcome to MendMyTools${user.sub ? `, ${user.sub.split("@")[0]}` : ""}.`)
      const next = searchParams.get("next")
      const target = next && next.startsWith("/") ? next : defaultDestination(user.role)
      router.replace(target)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed")
    } finally {
      setSubmitting(false)
    }
  })

  return (
    <div className="space-y-7">
      <div className="space-y-2 border-b border-border pb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
          MendMyTools · Cloud Access
        </p>
        <h2 className="font-vogue text-3xl font-bold tracking-tight">
          Enter the Atelier
        </h2>
        <p className="text-sm text-muted-foreground">
          Authenticate with your role credentials to manage repair tickets and SLA telemetry.
        </p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs uppercase tracking-wider">Email Address</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="admin@mendmytools.com"
            aria-invalid={form.formState.errors.email ? "true" : "false"}
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-xs text-destructive">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs uppercase tracking-wider">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={form.formState.errors.password ? "true" : "false"}
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="text-xs text-destructive">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full uppercase tracking-widest text-xs h-10" disabled={submitting}>
          {submitting && <Spinner className="mr-2" />}
          {submitting ? "Authenticating…" : "Sign In to MendMyTools"}
        </Button>
      </form>

      <div className="rounded-md border border-border bg-secondary/50 p-3.5 space-y-2.5">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Instant Live Demo Credentials (Click to Fill)
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs h-8"
            onClick={() => fillDemo("admin@mendmytools.com", "admin123")}
          >
            Admin Role
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs h-8"
            onClick={() => fillDemo("agent@mendmytools.com", "agent123")}
          >
            Specialist
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs h-8"
            onClick={() => fillDemo("employee@mendmytools.com", "employee123")}
          >
            Member
          </Button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground text-center">
        Need a new operator profile?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Register an account
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex h-40 items-center justify-center">
        <Spinner size={20} className="text-muted-foreground" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}

function defaultDestination(role: string): string {
  if (role === ROLES.ADMIN) return "/dashboard"
  return "/dashboard"
}
