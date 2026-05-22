"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ExternalLink, Loader2, Plus, Star } from "lucide-react";
import { fetchPackages } from "@/services/packages.service";
import type { TourPackage } from "@/types";
import { PackageForm } from "./package-form";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export function PackagesPanel() {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    fetchPackages()
      .then(setPackages)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (adding) {
    return (
      <div>
        <button
          onClick={() => setAdding(false)}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-navy-700 hover:text-gold-600"
        >
          <ArrowLeft className="h-4 w-4" /> Back to all packages
        </button>
        <PackageForm
          onCreated={() => {
            load();
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink/60">
          {loading ? "Loading…" : `${packages.length} package${packages.length === 1 ? "" : "s"} live on the site`}
        </p>
        <Button variant="gold" size="sm" onClick={() => setAdding(true)}>
          <Plus className="h-4 w-4" /> Add package
        </Button>
      </div>

      {loading ? (
        <div className="mt-10 flex justify-center text-navy-600">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : packages.length === 0 ? (
        <p className="mt-10 text-center text-ink/50">No packages yet. Click “Add package”.</p>
      ) : (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((p) => (
            <li
              key={p.id}
              className="overflow-hidden rounded-2xl border border-navy-700/8 bg-white shadow-soft"
            >
              <div className="relative h-32 w-full bg-mist">
                {p.heroImage ? (
                  <Image src={p.heroImage} alt={p.title} fill className="object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-xs text-ink/40">No image</div>
                )}
                {p.featured && (
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-gold-400 px-2 py-0.5 text-[11px] font-semibold text-navy-900">
                    <Star className="h-3 w-3" /> Featured
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="truncate font-display text-sm font-bold text-navy-900">{p.title}</p>
                <p className="mt-0.5 text-xs text-ink/50">
                  {p.category} · {p.durationDays}D/{p.durationNights}N
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-navy-800">
                    {formatCurrency(p.price, p.currency)}
                  </span>
                  <a
                    href={`/packages/${p.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-navy-700 hover:text-gold-600"
                  >
                    View <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
