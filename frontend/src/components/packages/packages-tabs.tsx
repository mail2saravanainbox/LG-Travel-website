"use client";

import { useState } from "react";
import type { TourPackage } from "@/types";
import { PackagesExplorer } from "./packages-explorer";
import { cn } from "@/lib/utils";

interface Group {
  id: string;
  label: string;
  blurb: string;
  data: TourPackage[];
}

/**
 * Tabbed Packages view: switch between International and Domestic trips.
 * The International tab is omitted when the admin has disabled it.
 */
export function PackagesTabs({
  international,
  domestic,
  internationalEnabled,
  initialSearch,
  initialTab,
}: {
  international: TourPackage[];
  domestic: TourPackage[];
  internationalEnabled: boolean;
  initialSearch?: string;
  initialTab?: string;
}) {
  const groups: Group[] = [];
  if (internationalEnabled) {
    groups.push({
      id: "international",
      label: "International",
      blurb: "Hand-crafted journeys to the planet's most extraordinary places.",
      data: international,
    });
  }
  groups.push({
    id: "domestic",
    label: "Domestic",
    blurb: "Discover the beauty of India — palaces, beaches, mountains and more.",
    data: domestic,
  });

  const validInitial = groups.find((g) => g.id === initialTab)?.id;
  const [active, setActive] = useState(validInitial ?? groups[0]?.id ?? "international");
  const current = groups.find((g) => g.id === active) ?? groups[0];
  if (!current) return null;

  return (
    <div>
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {groups.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setActive(g.id)}
            className={cn(
              "shrink-0 rounded-full px-6 py-2.5 text-sm font-semibold transition-all",
              active === g.id
                ? "bg-navy-700 text-white shadow-soft"
                : "border border-navy-700/15 text-navy-700 hover:border-navy-700/40",
            )}
          >
            {g.label}
            <span className={cn("ml-2 text-xs", active === g.id ? "text-white/70" : "text-ink/40")}>
              {g.data.length}
            </span>
          </button>
        ))}
      </div>

      <p className="mt-6 max-w-2xl text-ink/65">{current.blurb}</p>

      <div className="mt-6">
        {current.data.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-navy-700/15 bg-white p-12 text-center text-ink/60">
            No {current.label.toLowerCase()} packages yet — check back soon.
          </div>
        ) : (
          <PackagesExplorer key={current.id} packages={current.data} initialSearch={initialSearch} />
        )}
      </div>
    </div>
  );
}
