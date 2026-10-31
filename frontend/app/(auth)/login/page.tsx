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
      toast.success(`Welcome back${user.sub ? `, ${user.sub.split("@")[0]}` : ""}.`)
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
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Sign in</h2>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access <span className="font-vogue-brand font-semibold text-foreground">MendMyTools</span>.
        </p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
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
          <Label htmlFor="password">Password</Label>
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

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting && <Spinner className="mr-2" />}
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="flex items-center justify-center gap-2 pt-1">
        <span className="text-xs text-muted-foreground">Quick fill:</span>
        <button
          type="button"
          onClick={() => fillDemo("admin@mendmytools.com", "admin123")}
          className="rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Admin
        </button>
        <button
          type="button"
          onClick={() => fillDemo("agent@mendmytools.com", "agent123")}
          className="rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Agent
        </button>
        <button
          type="button"
          onClick={() => fillDemo("employee@mendmytools.com", "employee123")}
          className="rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Employee
        </button>
      </div>

      <p className="text-sm text-muted-foreground text-center">
        New here?{" "}
        <Link href="/register" className="font-medium text-foreground hover:underline">
          Create an account
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
