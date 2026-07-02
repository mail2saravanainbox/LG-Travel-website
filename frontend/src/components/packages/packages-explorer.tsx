"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, Search, X } from "lucide-react";
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

export function PackagesExplorer({
  packages,
  initialSearch = "",
}: {
  packages: TourPackage[];
  initialSearch?: string;
}) {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("featured");
  const [query, setQuery] = useState(initialSearch);

  const visible = useMemo(() => {
    let list = cat === "All" ? packages : packages.filter((p) => p.category === cat);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((p) =>
        [p.title, p.location, p.summary, p.destinationSlug]
          .filter(Boolean)
          .some((field) => field!.toLowerCase().includes(q)),
      );
    }
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
  }, [packages, cat, sort, query]);

  return (
    <div>
      <label className="mb-4 flex items-center gap-2 rounded-full border border-navy-700/15 bg-white px-4 py-2.5 focus-within:border-navy-500">
        <Search className="h-4 w-4 shrink-0 text-ink/40" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search destinations, e.g. Maldives, Kyoto…"
          className="w-full bg-transparent text-sm text-navy-900 placeholder:text-ink/40 focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="shrink-0 text-ink/40 hover:text-navy-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </label>

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

      <p className="mt-6 text-sm text-ink/50">
        {visible.length} journey{visible.length === 1 ? "" : "s"}
        {query.trim() && ` matching “${query.trim()}”`}
      </p>

      {visible.length === 0 ? (
        <div className="mt-4 rounded-3xl border border-dashed border-navy-700/15 bg-white p-12 text-center">
          <p className="text-ink/60">
            No journeys match your search
            {query.trim() ? <> for “{query.trim()}”</> : null}.
          </p>
          {(query.trim() || cat !== "All") && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCat("All");
              }}
              className="mt-3 text-sm font-semibold text-gold-600 hover:text-gold-500"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <PackageCard key={p.id} pkg={p} />
          ))}
        </div>
      )}
    </div>
  );
}
