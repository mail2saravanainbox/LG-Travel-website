"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

const schema = z
  .object({
    name: z.string().min(2, "Please enter your name"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Minimum 6 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });
type Values = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  // Placeholder: replace with Clerk's <SignUp /> in production.
  async function onSubmit() {
    await new Promise((r) => setTimeout(r, 600));
    router.push("/dashboard");
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join 40,000+ travellers and start planning your next escape."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-navy-700 hover:text-gold-600">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label>Full name</Label>
          <Input placeholder="Jane Doe" {...register("name")} />
          {errors.name && <p className="mt-1.5 text-xs text-rose-500">{errors.name.message}</p>}
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email && <p className="mt-1.5 text-xs text-rose-500">{errors.email.message}</p>}
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label>Password</Label>
            <Input type="password" placeholder="••••••••" {...register("password")} />
            {errors.password && <p className="mt-1.5 text-xs text-rose-500">{errors.password.message}</p>}
          </div>
          <div>
            <Label>Confirm</Label>
            <Input type="password" placeholder="••••••••" {...register("confirm")} />
            {errors.confirm && <p className="mt-1.5 text-xs text-rose-500">{errors.confirm.message}</p>}
          </div>
        </div>
        <Button type="submit" variant="gold" size="lg" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}
