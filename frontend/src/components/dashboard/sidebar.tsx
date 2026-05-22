"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheck,
  CreditCard,
  Heart,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";

const items = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Bookings", href: "/dashboard/bookings", icon: CalendarCheck },
  { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
  { label: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-navy-700/8 bg-white p-6 lg:flex">
      <Logo />
      <nav className="mt-10 flex-1 space-y-1">
        {items.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                active
                  ? "bg-navy-700 text-white shadow-soft"
                  : "text-ink/70 hover:bg-navy-50 hover:text-navy-900",
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-2 flex items-center gap-3 rounded-xl border border-navy-700/8 px-3 py-2.5">
        <UserButton appearance={{ elements: { avatarBox: "h-9 w-9" } }} />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-navy-900">
            {user?.fullName ?? user?.firstName ?? "My account"}
          </p>
          <p className="truncate text-xs text-ink/50">
            {user?.primaryEmailAddress?.emailAddress ?? ""}
          </p>
        </div>
      </div>
      <SignOutButton redirectUrl="/">
        <button
          type="button"
          className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-rose-500 transition-colors hover:bg-rose-50"
        >
          <LogOut className="h-5 w-5" /> Sign out
        </button>
      </SignOutButton>
    </aside>
  );
}
