"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ImagePlus, Loader2, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { fetchTestimonials } from "@/services/testimonials.service";
import {
  adminCreateTestimonial,
  adminDeleteTestimonial,
  adminUpdateTestimonial,
  uploadImage,
  type NewTestimonialInput,
} from "@/services/admin.service";
import { useAdmin } from "@/store/admin";
import type { Testimonial } from "@/types";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

const inputClass =
  "w-full rounded-xl border border-navy-700/15 bg-white px-4 py-2.5 text-sm text-ink/90 outline-none focus:border-navy-500";

type Mode = { kind: "list" } | { kind: "add" } | { kind: "edit"; t: Testimonial };

function TestimonialForm({
  initial,
  onSaved,
}: {
  initial?: Testimonial;
  onSaved: () => void;
}) {
  const token = useAdmin((s) => s.token);
  const isEdit = Boolean(initial);
  const [name, setName] = useState(initial?.name ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [trip, setTrip] = useState(initial?.trip ?? "");
  const [quote, setQuote] = useState(initial?.quote ?? "");
  const [rating, setRating] = useState(initial?.rating ?? 5);
  const [avatarUrl, setAvatarUrl] = useState(initial?.avatar ?? "");
  const [isFeatured, setIsFeatured] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAvatar(file: File | undefined) {
    if (!file || !token) return;
    setUploading(true);
    setError(null);
    try {
      const { url } = await uploadImage(token, file, "lg-travels/testimonials");
      setAvatarUrl(url);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      window.alert("Your session has expired — please sign in again.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payload: NewTestimonialInput = {
        name,
        quote,
        location: location || undefined,
        trip: trip || undefined,
        avatarUrl: avatarUrl || undefined,
        rating: Number(rating),
        isFeatured,
      };
      if (isEdit && initial) {
        await adminUpdateTestimonial(token, initial.id, payload);
      } else {
        await adminCreateTestimonial(token, payload);
      }
      onSaved();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-navy-700/8 bg-white p-6 shadow-soft">
      <h2 className="font-display text-lg font-bold text-navy-900">
        {isEdit ? `Edit testimonial · ${initial?.name}` : "New testimonial"}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Name *</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Aisha Al-Rashid" />
        </div>
        <div>
          <Label>Location</Label>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Dubai, UAE" />
        </div>
        <div>
          <Label>Trip taken</Label>
          <Input value={trip} onChange={(e) => setTrip(e.target.value)} placeholder="Maldives Overwater Escape" />
        </div>
        <div>
          <Label>Rating (1–5)</Label>
          <select className={inputClass} value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
          </select>
        </div>
      </div>

      <div>
        <Label>Quote *</Label>
        <Textarea rows={3} required value={quote} onChange={(e) => setQuote(e.target.value)}
          placeholder="From the seaplane to the sandbank dinner, every detail was flawless." />
      </div>

      <div>
        <Label>Avatar</Label>
        <div className="mt-1 flex items-center gap-4">
          {avatarUrl && (
            <Image src={avatarUrl} alt="avatar" width={56} height={56} className="h-14 w-14 rounded-full object-cover" />
          )}
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-navy-700/25 px-4 py-2.5 text-sm text-navy-700 hover:border-navy-700/50">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            {avatarUrl ? "Replace" : "Upload avatar"}
            <input type="file" accept="image/*" className="hidden" disabled={uploading}
              onChange={(e) => handleAvatar(e.target.files?.[0])} />
          </label>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-ink/80">
        <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)}
          className="h-4 w-4" />
        Featured (sort to the top on the homepage)
      </label>

      {error && <p className="text-sm text-rose-500">{error}</p>}

      <Button type="submit" variant="gold" size="lg" disabled={submitting || !name || !quote}>
        {submitting ? "Saving…" : isEdit ? "Save changes" : "Add testimonial"}
      </Button>
    </form>
  );
}

export function TestimonialsPanel() {
  const token = useAdmin((s) => s.token);
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>({ kind: "list" });
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetchTestimonials({ allowMock: false })
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  async function handleDelete(id: string, name: string) {
    if (!token) {
      window.alert("Your session has expired — please sign in again.");
      return;
    }
    if (!window.confirm(`Remove "${name}"'s testimonial?`)) return;
    setDeleting(id);
    try {
      await adminDeleteTestimonial(token, id);
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
          <ArrowLeft className="h-4 w-4" /> Back to all testimonials
        </button>
        <TestimonialForm
          initial={mode.kind === "edit" ? mode.t : undefined}
          onSaved={() => { load(); setMode({ kind: "list" }); }}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink/60">
          {loading ? "Loading…" : `${items.length} testimonial${items.length === 1 ? "" : "s"} on the site`}
        </p>
        <Button variant="gold" size="sm" onClick={() => setMode({ kind: "add" })}>
          <Plus className="h-4 w-4" /> Add testimonial
        </Button>
      </div>

      {loading ? (
        <div className="mt-10 flex justify-center text-navy-600">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((t) => (
            <li key={t.id} className="flex items-start gap-4 rounded-2xl border border-navy-700/8 bg-white p-4 shadow-soft">
              {t.avatar && (
                <Image src={t.avatar} alt={t.name} width={48} height={48}
                  className="h-12 w-12 shrink-0 rounded-full object-cover" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-display text-sm font-bold text-navy-900">{t.name}</p>
                  {t.location && <span className="text-xs text-ink/50">· {t.location}</span>}
                  <span className="ml-auto flex items-center gap-0.5 text-gold-500">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-gold-500" />
                    ))}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-ink/70">“{t.quote}”</p>
                {t.trip && <p className="mt-1 text-xs text-ink/40">Trip: {t.trip}</p>}
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => setMode({ kind: "edit", t })}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-navy-700/15 px-3 py-1.5 text-xs font-medium text-navy-700 hover:border-navy-700/40">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button onClick={() => handleDelete(t.id, t.name)} disabled={deleting === t.id}
                  className="inline-flex items-center justify-center rounded-lg border border-rose-200 px-2.5 py-1.5 text-rose-500 hover:bg-rose-50 disabled:opacity-50">
                  {deleting === t.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
