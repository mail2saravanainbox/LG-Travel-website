"use client";

import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8">
        <h1 className="font-display text-2xl font-bold text-navy-900 md:text-3xl">Profile</h1>
        <p className="mt-1 text-sm text-ink/50">
          Manage your name, email, password, and connected accounts.
        </p>
      </header>

      <UserProfile
        routing="hash"
        appearance={{
          elements: {
            rootBox: "w-full",
            cardBox: "w-full max-w-none shadow-soft border border-navy-700/8",
          },
        }}
      />
    </div>
  );
}
