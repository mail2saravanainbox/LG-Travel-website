"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  Pencil,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import { fetchPackage, fetchPackages } from "@/services/packages.service";
import { adminDeletePackage } from "@/services/admin.service";
import { useAdmin } from "@/store/admin";
import type { TourPackage } from "@/types";
import { PackageForm } from "./package-form";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

type Mode = { kind: "list" } | { kind: "add" } | { kind: "edit"; pkg: TourPackage };

export function PackagesPanel() {
  const token = useAdmin((s) => s.token);
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>({ kind: "list" });
  const [opening, setOpening] = useState<string | null>(null); // slug being loaded for edit
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetchPackages()
      .then(setPackages)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function startEdit(slug: string) {
    setOpening(slug);
    try {
      const full = await fetchPackage(slug); // includes itinerary
      if (full) setMode({ kind: "edit", pkg: full });
    } finally {
      setOpening(null);
    }
  }

  async function handleDelete(slug: string, title: string) {
    if (!token) return;
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(slug);
    try {
      await adminDeletePackage(token, slug);
      load();
    } catch (e) {
      window.alert((e as Error).message);
    } finally {
      setDeleting(null);
    }
  }

  if (mode.kind !== "list") {
    return (
      <div>
        <button
          onClick={() => setMode({ kind: "list" })}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-navy-700 hover:text-gold-600"
        >
          <ArrowLeft className="h-4 w-4" /> Back to all packages
        </button>
        <PackageForm
          initial={mode.kind === "edit" ? mode.pkg : undefined}
          onSaved={load}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink/60">
          {loading
            ? "Loading…"
            : `${packages.length} package${packages.length === 1 ? "" : "s"} live on the site`}
        </p>
        <Button variant="gold" size="sm" onClick={() => setMode({ kind: "add" })}>
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
                  <span className={p.tripType === "domestic" ? "text-emerald-600" : "text-navy-600"}>
                    {p.tripType === "domestic" ? "🇮🇳 Domestic" : "🌍 International"}
                  </span>
                  {" · "}{p.category} · {p.durationDays}D/{p.durationNights}N
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
                <div className="mt-3 flex gap-2 border-t border-navy-700/8 pt-3">
                  <button
                    onClick={() => startEdit(p.slug)}
                    disabled={opening === p.slug}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-navy-700/15 py-1.5 text-xs font-medium text-navy-700 hover:border-navy-700/40 disabled:opacity-50"
                  >
                    {opening === p.slug ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Pencil className="h-3.5 w-3.5" />
                    )}
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.slug, p.title)}
                    disabled={deleting === p.slug}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-500 hover:bg-rose-50 disabled:opacity-50"
                  >
                    {deleting === p.slug ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
