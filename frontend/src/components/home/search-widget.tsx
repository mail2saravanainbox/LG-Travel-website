"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Plane, Search, Users, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const TABS = [
  { id: "packages", label: "Packages", icon: Plane },
  { id: "hotels", label: "Hotels", icon: MapPin },
  { id: "flights", label: "Flights", icon: Plane },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function SearchWidget({ className }: { className?: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("packages");

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push("/packages");
  }

  return (
    <div className={cn("glass-light w-full rounded-3xl p-2 shadow-lift", className)}>
      {/* Tabs */}
      <div className="flex gap-1 p-1.5">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              "relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              tab === id ? "text-navy-900" : "text-navy-700/60 hover:text-navy-800",
            )}
          >
            {tab === id && (
              <motion.span
                layoutId="search-tab"
                className="absolute inset-0 rounded-full bg-white shadow-soft"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <Icon className="relative h-4 w-4" />
            <span className="relative">{label}</span>
          </button>
        ))}
      </div>

      {/* Fields */}
      <form
        onSubmit={onSearch}
        className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-navy-700/8 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_0.9fr_auto]"
      >
        <Field icon={MapPin} label="Destination" placeholder="Where to?" />
        <Field icon={CalendarDays} label="Dates" type="date" />
        <Field icon={Users} label="Travelers" placeholder="2 adults" />
        <Field icon={Wallet} label="Budget" placeholder="Any" />
        <div className="flex items-stretch bg-white p-2 sm:col-span-2 lg:col-span-1">
          <Button type="submit" variant="gold" className="w-full lg:w-14 lg:px-0" aria-label="Search">
            <Search className="h-5 w-5" />
            <span className="lg:hidden">Search</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  placeholder,
  type = "text",
}: {
  icon: React.ElementType;
  label: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="group flex cursor-text flex-col bg-white px-4 py-3 transition-colors hover:bg-mist">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-navy-700/50">
        {label}
      </span>
      <span className="mt-1 flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-gold-500" />
        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-navy-900 placeholder:text-navy-700/35 focus:outline-none"
        />
      </span>
    </label>
  );
}
