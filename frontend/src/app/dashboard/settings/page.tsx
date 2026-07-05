"use client";

import Link from "next/link";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { LogOut, Mail, ShieldCheck, UserCog } from "lucide-react";

export default function SettingsPage() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? "your account email";

  return (
    <div className="mx-auto max-w-3xl">
      <header>
        <h1 className="font-display text-2xl font-bold text-navy-900 md:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-ink/50">Manage your account, security, and communication.</p>
      </header>

      <div className="mt-8 space-y-4">
        {/* Account & security */}
        <section className="rounded-2xl border border-navy-700/8 bg-white p-6 shadow-soft">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-50 text-navy-700">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <h2 className="font-display text-lg font-semibold text-navy-900">Account &amp; security</h2>
              <p className="mt-1 text-sm text-ink/60">
                Update your name, password, connected sign-in methods, and review active sessions.
              </p>
              <Link
                href="/dashboard/profile"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-navy-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-navy-800"
              >
                <UserCog className="h-4 w-4" /> Manage profile
              </Link>
            </div>
          </div>
        </section>

        {/* Communication */}
        <section className="rounded-2xl border border-navy-700/8 bg-white p-6 shadow-soft">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-50 text-navy-700">
              <Mail className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <h2 className="font-display text-lg font-semibold text-navy-900">Communication</h2>
              <p className="mt-1 text-sm text-ink/60">
                Trip updates and booking confirmations are sent to{" "}
                <span className="font-medium text-navy-900">{email}</span>. To change your contact
                preferences, get in touch with your travel designer.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-navy-700/15 px-4 py-2.5 text-sm font-medium text-navy-800 transition-colors hover:bg-navy-50"
              >
                Contact us
              </Link>
            </div>
          </div>
        </section>

        {/* Session */}
        <section className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-rose-100 text-rose-500">
              <LogOut className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <h2 className="font-display text-lg font-semibold text-navy-900">Sign out</h2>
              <p className="mt-1 text-sm text-ink/60">Sign out of your account on this device.</p>
              <SignOutButton redirectUrl="/">
                <button
                  type="button"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-600"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </SignOutButton>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
