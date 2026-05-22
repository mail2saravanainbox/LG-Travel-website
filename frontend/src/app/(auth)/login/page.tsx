"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});
type Values = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  // Placeholder: replace with Clerk's <SignIn /> or signIn() in production.
  async function onSubmit() {
    await new Promise((r) => setTimeout(r, 600));
    router.push("/dashboard");
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage your trips and bookings."
      footer={
        <>
          New to LG Travels?{" "}
          <Link href="/register" className="font-semibold text-navy-700 hover:text-gold-600">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label>Email</Label>
          <Input type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email && <p className="mt-1.5 text-xs text-rose-500">{errors.email.message}</p>}
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label>Password</Label>
            <Link href="#" className="text-xs text-navy-600 hover:underline">Forgot?</Link>
          </div>
          <Input type="password" placeholder="••••••••" {...register("password")} />
          {errors.password && <p className="mt-1.5 text-xs text-rose-500">{errors.password.message}</p>}
        </div>
        <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="mt-6 flex items-center gap-3 text-xs text-ink/40">
        <span className="h-px flex-1 bg-navy-700/10" /> or continue with{" "}
        <span className="h-px flex-1 bg-navy-700/10" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Button variant="outline" type="button">Google</Button>
        <Button variant="outline" type="button">Apple</Button>
      </div>
    </AuthShell>
  );
}
