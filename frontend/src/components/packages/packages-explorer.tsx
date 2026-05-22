"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import type { PackageCategory, TourPackage } from "@/types";
import { PackageCard } from "@/components/shared/package-card";
import { cn } from "@/lib/utils";

const CATEGORIES: ("All" | PackageCategory)[] = [
  "All",
  "Luxury",
  "Honeymoon",
  "Adventure",
  "Family",
  "Wellness",
  "Cultural",
];

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating", label: "Top Rated" },
] as const;

export function PackagesExplorer({ packages }: { packages: TourPackage[] }) {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("featured");

  const visible = useMemo(() => {
    let list = cat === "All" ? packages : packages.filter((p) => p.category === cat);
    list = [...list];
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return list;
  }, [packages, cat, sort]);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                cat === c
                  ? "bg-navy-700 text-white shadow-soft"
                  : "border border-navy-700/15 text-navy-700 hover:border-navy-700/40",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <label className="flex shrink-0 items-center gap-2 text-sm text-ink/60">
          <SlidersHorizontal className="h-4 w-4" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="rounded-full border border-navy-700/15 bg-white px-4 py-2.5 text-sm font-medium text-navy-800 focus:border-navy-500 focus:outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-6 text-sm text-ink/50">{visible.length} journeys</p>

      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <PackageCard key={p.id} pkg={p} />
        ))}
      </div>
    </div>
  );
}
