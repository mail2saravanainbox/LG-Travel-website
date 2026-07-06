"use client";

import { useState } from "react";
import type { Continent, Destination } from "@/types";
import { DestinationCard } from "@/components/shared/destination-card";
import { cn } from "@/lib/utils";

// "India" is a country-level spotlight filter (LG Travels' home market), shown
// right after Asia; the rest filter by continent.
const FILTERS: ("All" | "India" | Continent)[] = [
  "All",
  "India",
  "Asia",
  "Europe",
  "Middle East",
  "Africa",
  "Americas",
  "Oceania",
];

const matches = (d: Destination, f: (typeof FILTERS)[number]) =>
  f === "All" ? true : f === "India" ? d.country === "India" : d.continent === f;

export function DestinationsGrid({ destinations }: { destinations: Destination[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const visible = destinations.filter((d) => matches(d, filter));

  return (
    <div>
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
        {FILTERS.map((f) => {
          const count = destinations.filter((d) => matches(d, f)).length;
          // Always show All + India (India is a deliberate spotlight tab);
          // hide continent tabs that currently have no destinations.
          if (f !== "All" && f !== "India" && count === 0) return null;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                filter === f
                  ? "bg-navy-700 text-white shadow-soft"
                  : "border border-navy-700/15 text-navy-700 hover:border-navy-700/40",
              )}
            >
              {f}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="py-20 text-center text-ink/50">No destinations in this region yet.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((d) => (
            <DestinationCard key={d.id} destination={d} />
          ))}
        </div>
      )}
    </div>
  );
}
