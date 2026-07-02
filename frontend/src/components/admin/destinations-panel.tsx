"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ExternalLink, Loader2, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { fetchDestinationDetail, fetchDestinations } from "@/services/destinations.service";
import { adminDeleteDestination } from "@/services/admin.service";
import { useAdmin } from "@/store/admin";
import type { Destination } from "@/types";
import { DestinationForm } from "./destination-form";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

type Mode = { kind: "list" } | { kind: "add" } | { kind: "edit"; dest: Destination };

export function DestinationsPanel() {
  const token = useAdmin((s) => s.token);
  const [items, setItems] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>({ kind: "list" });
  const [opening, setOpening] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetchDestinations()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  async function startEdit(slug: string) {
    setOpening(slug);
    try {
      const { destination } = await fetchDestinationDetail(slug);
      if (destination) setMode({ kind: "edit", dest: destination });
    } finally {
      setOpening(null);
    }
  }

  async function handleDelete(slug: string, name: string) {
    if (!token) {
      window.alert("Your session has expired — please sign in again.");
      return;
    }
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(slug);
    try {
      await adminDeleteDestination(token, slug);
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
        <button onClick={() => setMode({ kind: "list" })}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-navy-700 hover:text-gold-600">
          <ArrowLeft className="h-4 w-4" /> Back to all destinations
        </button>
        <DestinationForm initial={mode.kind === "edit" ? mode.dest : undefined} onSaved={load} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink/60">
          {loading ? "Loading…" : `${items.length} destination${items.length === 1 ? "" : "s"} live on the site`}
        </p>
        <Button variant="gold" size="sm" onClick={() => setMode({ kind: "add" })}>
          <Plus className="h-4 w-4" /> Add destination
        </Button>
      </div>

      {loading ? (
        <div className="mt-10 flex justify-center text-navy-600">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <p className="mt-10 text-center text-ink/50">No destinations yet.</p>
      ) : (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((d) => (
            <li key={d.id}
              className="overflow-hidden rounded-2xl border border-navy-700/8 bg-white shadow-soft">
              <div className="relative h-32 w-full bg-mist">
                {d.heroImage ? (
                  <Image src={d.heroImage} alt={d.name} fill className="object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-xs text-ink/40">No image</div>
                )}
                {d.featured && (
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-gold-400 px-2 py-0.5 text-[11px] font-semibold text-navy-900">
                    <Star className="h-3 w-3" /> Featured
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="truncate font-display text-sm font-bold text-navy-900">{d.name}</p>
                <p className="mt-0.5 text-xs text-ink/50">{d.country} · {d.continent}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-navy-800">
                    from {formatCurrency(d.startingPrice, d.currency)}
                  </span>
                  <a href={`/destinations/${d.slug}`} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-navy-700 hover:text-gold-600">
                    View <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="mt-3 flex gap-2 border-t border-navy-700/8 pt-3">
                  <button onClick={() => startEdit(d.slug)} disabled={opening === d.slug}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-navy-700/15 py-1.5 text-xs font-medium text-navy-700 hover:border-navy-700/40 disabled:opacity-50">
                    {opening === d.slug ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Pencil className="h-3.5 w-3.5" />}
                    Edit
                  </button>
                  <button onClick={() => handleDelete(d.slug, d.name)} disabled={deleting === d.slug}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-500 hover:bg-rose-50 disabled:opacity-50">
                    {deleting === d.slug ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
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
