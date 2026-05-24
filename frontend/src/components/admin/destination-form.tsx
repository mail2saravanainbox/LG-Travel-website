"use client";

import { useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Plus, X } from "lucide-react";
import {
  adminCreateDestination,
  adminUpdateDestination,
  uploadImage,
  type NewDestinationInput,
} from "@/services/admin.service";
import { useAdmin } from "@/store/admin";
import type { Destination } from "@/types";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

const CONTINENTS = ["Asia", "Europe", "Middle East", "Africa", "Americas", "Oceania"];
const inputClass =
  "w-full rounded-xl border border-navy-700/15 bg-white px-4 py-2.5 text-sm text-ink/90 outline-none focus:border-navy-500";

const lines = (v: string) => v.split("\n").map((s) => s.trim()).filter(Boolean);

export function DestinationForm({
  initial,
  onSaved,
}: {
  initial?: Destination;
  onSaved?: () => void;
}) {
  const token = useAdmin((s) => s.token);
  const isEdit = Boolean(initial);
  const editSlug = initial?.slug;

  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [country, setCountry] = useState(initial?.country ?? "");
  const [continent, setContinent] = useState<string>(initial?.continent ?? "Asia");
  const [tagline, setTagline] = useState(initial?.tagline ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [startingPrice, setStartingPrice] = useState(initial?.startingPrice ?? 0);
  const [currency, setCurrency] = useState(initial?.currency ?? "INR");
  const [bestSeason, setBestSeason] = useState(initial?.bestSeason ?? "");
  const [highlights, setHighlights] = useState((initial?.highlights ?? []).join("\n"));
  const [isFeatured, setIsFeatured] = useState(Boolean(initial?.featured));

  const [heroImage, setHeroImage] = useState(initial?.heroImage ?? "");
  const [gallery, setGallery] = useState<string[]>(initial?.gallery ?? []);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doneSlug, setDoneSlug] = useState<string | null>(null);

  async function handleHero(file: File | undefined) {
    if (!file || !token) return;
    setUploadingHero(true);
    setError(null);
    try {
      const { url } = await uploadImage(token, file, "lg-travels/destinations");
      setHeroImage(url);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploadingHero(false);
    }
  }
  async function handleGallery(files: FileList | null) {
    if (!files?.length || !token) return;
    setUploadingGallery(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const { url } = await uploadImage(token, file, "lg-travels/destinations");
        setGallery((prev) => [...prev, url]);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploadingGallery(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    setError(null);
    try {
      const payload: NewDestinationInput = {
        name,
        slug: slug || undefined,
        country,
        continent,
        tagline: tagline || undefined,
        description: description || undefined,
        heroImage: heroImage || undefined,
        gallery: gallery.length ? gallery : undefined,
        startingPrice: Number(startingPrice) || 0,
        currency: currency || undefined,
        bestSeason: bestSeason || undefined,
        highlights: highlights ? lines(highlights) : undefined,
        isFeatured,
      };
      const saved =
        isEdit && editSlug
          ? await adminUpdateDestination(token, editSlug, payload)
          : await adminCreateDestination(token, payload);
      setDoneSlug(saved.slug);
      onSaved?.();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  if (doneSlug) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <p className="font-display text-lg font-bold text-emerald-800">
          {isEdit ? "Destination updated ✓" : "Destination created ✓"}
        </p>
        <p className="mt-2 text-sm text-emerald-700">The site updates within ~30 seconds:</p>
        <a
          href={`/destinations/${doneSlug}`}
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-block font-medium text-navy-700 underline"
        >
          /destinations/{doneSlug}
        </a>
        {!isEdit && (
          <div className="mt-5">
            <Button variant="gold" onClick={() => setDoneSlug(null)}>
              Add another destination
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-5 rounded-2xl border border-navy-700/8 bg-white p-6 shadow-soft"
    >
      <div>
        <h2 className="font-display text-lg font-bold text-navy-900">
          {isEdit ? `Edit: ${initial?.name}` : "New destination"}
        </h2>
        <p className="text-sm text-ink/50">Name, country and continent are required.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Name *</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required
            placeholder="Kerala Backwaters" />
        </div>
        <div>
          <Label>Slug (web address)</Label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto from name" />
        </div>
        <div>
          <Label>Country *</Label>
          <Input value={country} onChange={(e) => setCountry(e.target.value)} required
            placeholder="India" />
        </div>
        <div>
          <Label>Continent *</Label>
          <select className={inputClass} value={continent} onChange={(e) => setContinent(e.target.value)}>
            {CONTINENTS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div>
        <Label>Tagline (short, shown on cards)</Label>
        <Input value={tagline} onChange={(e) => setTagline(e.target.value)}
          placeholder="Houseboats, palm-lined canals, sunset breezes" />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label>Starting price (per person)</Label>
          <Input type="number" min={0} value={startingPrice}
            onChange={(e) => setStartingPrice(Number(e.target.value))} />
        </div>
        <div>
          <Label>Currency</Label>
          <select className={inputClass} value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {["INR", "USD", "EUR", "AED"].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <Label>Best season</Label>
          <Input value={bestSeason} onChange={(e) => setBestSeason(e.target.value)}
            placeholder="Oct – Mar" />
        </div>
      </div>

      <div>
        <Label>Highlights (one per line)</Label>
        <Textarea rows={3} value={highlights} onChange={(e) => setHighlights(e.target.value)}
          placeholder={"Houseboat stay\nSunset cruise\nKathakali show"} />
      </div>

      <label className="flex items-center gap-2 text-sm text-ink/80">
        <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)}
          className="h-4 w-4" />
        Feature on homepage
      </label>

      {/* Photos */}
      <div>
        <Label>Hero image</Label>
        <div className="mt-1 flex items-center gap-4">
          {heroImage && (
            <div className="relative h-24 w-32 overflow-hidden rounded-lg">
              <Image src={heroImage} alt="hero" fill className="object-cover" />
              <button type="button" onClick={() => setHeroImage("")}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white">
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-navy-700/25 px-4 py-3 text-sm text-navy-700 hover:border-navy-700/50">
            {uploadingHero ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            {heroImage ? "Replace" : "Upload hero"}
            <input type="file" accept="image/*" className="hidden" disabled={uploadingHero}
              onChange={(e) => handleHero(e.target.files?.[0])} />
          </label>
        </div>
      </div>

      <div>
        <Label>Gallery</Label>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          {gallery.map((url) => (
            <div key={url} className="relative h-20 w-28 overflow-hidden rounded-lg">
              <Image src={url} alt="gallery" fill className="object-cover" />
              <button type="button"
                onClick={() => setGallery((prev) => prev.filter((u) => u !== url))}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <label className="inline-flex h-20 w-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-navy-700/25 text-xs text-navy-700 hover:border-navy-700/50">
            {uploadingGallery ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add photos
            <input type="file" accept="image/*" multiple className="hidden" disabled={uploadingGallery}
              onChange={(e) => handleGallery(e.target.files)} />
          </label>
        </div>
      </div>

      {error && <p className="text-sm text-rose-500">{error}</p>}

      <Button type="submit" variant="gold" size="lg" disabled={submitting || !name}>
        {submitting ? "Saving…" : isEdit ? "Save changes" : "Create destination"}
      </Button>
    </form>
  );
}
