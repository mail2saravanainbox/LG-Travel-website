"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, ShieldCheck, User } from "lucide-react";
import { adminLogin } from "@/services/admin.service";
import { useAdmin } from "@/store/admin";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export default function AdminLoginPage() {
  const router = useRouter();
  const setAuth = useAdmin((s) => s.setAuth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, user } = await adminLogin(username, password);
      setAuth(token, user.username);
      router.push("/admin");
    } catch (err) {
      setError((err as Error).message || "Login failed");
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-navy-900 px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image src="/logo-white.png" alt="LG Travels" width={416} height={275} className="h-16 w-auto" />
          <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-gold-300">
            <ShieldCheck className="h-4 w-4" /> Admin Console
          </span>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-3xl bg-white p-8 shadow-2xl"
        >
          <h1 className="font-display text-2xl font-bold text-navy-900">Sign in</h1>
          <p className="mt-1 text-sm text-ink/55">Manage bookings, leads and packages.</p>

          <div className="mt-6 space-y-4">
            <div>
              <Label>Username</Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />
                <Input
                  className="pl-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  autoComplete="username"
                  required
                />
              </div>
            </div>
            <div>
              <Label>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />
                <Input
                  className="pl-10"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-600">{error}</p>
          )}

          <Button type="submit" variant="primary" size="lg" disabled={loading} className="mt-6 w-full">
            {loading ? "Signing in…" : "Sign in to dashboard"}
          </Button>
        </form>
      </div>
    </div>
  );
}
