"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Plus, Trash2, X } from "lucide-react";
import {
  adminCreatePackage,
  uploadImage,
  type ItineraryDayInput,
  type NewPackageInput,
} from "@/services/admin.service";
import { fetchDestinations } from "@/services/destinations.service";
import { useAdmin } from "@/store/admin";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

const CATEGORIES = ["Luxury", "Honeymoon", "Adventure", "Family", "Wellness", "Cultural"];

const inputClass =
  "w-full rounded-xl border border-navy-700/15 bg-white px-4 py-2.5 text-sm text-ink/90 outline-none focus:border-navy-500";

/** Split a textarea (one item per line) into a trimmed string array. */
const lines = (v: string) => v.split("\n").map((s) => s.trim()).filter(Boolean);

export function PackageForm({ onCreated }: { onCreated?: () => void }) {
  const token = useAdmin((s) => s.token);
  const [destinations, setDestinations] = useState<{ slug: string; name: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doneSlug, setDoneSlug] = useState<string | null>(null);

  // Core fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Luxury");
  const [location, setLocation] = useState("");
  const [destinationSlug, setDestinationSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [durationDays, setDurationDays] = useState(5);
  const [durationNights, setDurationNights] = useState(4);
  const [price, setPrice] = useState(0);
  const [oldPrice, setOldPrice] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [groupSize, setGroupSize] = useState("");
  const [badge, setBadge] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [highlights, setHighlights] = useState("");
  const [inclusions, setInclusions] = useState("");
  const [exclusions, setExclusions] = useState("");

  // Images
  const [heroImage, setHeroImage] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Itinerary
  const [itinerary, setItinerary] = useState<ItineraryDayInput[]>([]);

  useEffect(() => {
    fetchDestinations()
      .then((d) => setDestinations(d.map((x) => ({ slug: x.slug, name: x.name }))))
      .catch(() => setDestinations([]));
  }, []);

  async function handleHero(file: File | undefined) {
    if (!file || !token) return;
    setUploadingHero(true);
    setError(null);
    try {
      const { url } = await uploadImage(token, file);
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
        const { url } = await uploadImage(token, file);
        setGallery((prev) => [...prev, url]);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploadingGallery(false);
    }
  }

  function addDay() {
    setItinerary((prev) => [
      ...prev,
      { dayNumber: prev.length + 1, title: "", description: "", stay: "" },
    ]);
  }
  function updateDay(i: number, patch: Partial<ItineraryDayInput>) {
    setItinerary((prev) => prev.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));
  }
  function removeDay(i: number) {
    setItinerary((prev) =>
      prev.filter((_, idx) => idx !== i).map((d, idx) => ({ ...d, dayNumber: idx + 1 })),
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    setError(null);
    setDoneSlug(null);
    try {
      const payload: NewPackageInput = {
        title,
        slug: slug || undefined,
        category,
        location: location || undefined,
        destinationSlug: destinationSlug || undefined,
        summary: summary || undefined,
        description: description || undefined,
        durationDays: Number(durationDays),
        durationNights: Number(durationNights),
        price: Number(price),
        oldPrice: oldPrice ? Number(oldPrice) : undefined,
        currency: currency || undefined,
        groupSize: groupSize || undefined,
        badge: badge || undefined,
        isFeatured,
        heroImage: heroImage || undefined,
        gallery: gallery.length ? gallery : undefined,
        highlights: highlights ? lines(highlights) : undefined,
        inclusions: inclusions ? lines(inclusions) : undefined,
        exclusions: exclusions ? lines(exclusions) : undefined,
        itinerary: itinerary.length
          ? itinerary.filter((d) => d.title.trim())
          : undefined,
      };
      const created = await adminCreatePackage(token, payload);
      setDoneSlug(created.slug);
      onCreated?.();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  if (doneSlug) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <p className="font-display text-lg font-bold text-emerald-800">Package created ✓</p>
        <p className="mt-2 text-sm text-emerald-700">
          It will appear on the site within ~30 seconds at:
        </p>
        <a
          href={`/packages/${doneSlug}`}
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-block font-medium text-navy-700 underline"
        >
          /packages/{doneSlug}
        </a>
        <div className="mt-5">
          <Button variant="gold" onClick={() => setDoneSlug(null)}>
            Add another package
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-6 rounded-2xl border border-navy-700/8 bg-white p-6 shadow-soft"
    >
      <div>
        <h2 className="font-display text-lg font-bold text-navy-900">New package</h2>
        <p className="text-sm text-ink/50">
          Fields marked * are required. The page goes live automatically once saved.
        </p>
      </div>

      {/* Basics */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label>Title *</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required
            placeholder="Maldives Overwater Escape" />
        </div>
        <div>
          <Label>Slug (web address)</Label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)}
            placeholder="auto from title" />
        </div>
        <div>
          <Label>Category</Label>
          <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <Label>Location</Label>
          <Input value={location} onChange={(e) => setLocation(e.target.value)}
            placeholder="Malé, Maldives" />
        </div>
        <div>
          <Label>Destination (optional)</Label>
          <select className={inputClass} value={destinationSlug}
            onChange={(e) => setDestinationSlug(e.target.value)}>
            <option value="">— none —</option>
            {destinations.map((d) => <option key={d.slug} value={d.slug}>{d.name}</option>)}
          </select>
        </div>
      </div>

      <div>
        <Label>Summary (short, shown on cards)</Label>
        <Textarea rows={2} value={summary} onChange={(e) => setSummary(e.target.value)}
          placeholder="A week of overwater villas and glass-clear lagoons." />
      </div>
      <div>
        <Label>Description (full)</Label>
        <Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      {/* Numbers */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div><Label>Days *</Label>
          <Input type="number" min={1} value={durationDays}
            onChange={(e) => setDurationDays(Number(e.target.value))} required /></div>
        <div><Label>Nights *</Label>
          <Input type="number" min={0} value={durationNights}
            onChange={(e) => setDurationNights(Number(e.target.value))} required /></div>
        <div><Label>Group size</Label>
          <Input value={groupSize} onChange={(e) => setGroupSize(e.target.value)}
            placeholder="2–8 guests" /></div>
        <div><Label>Price *</Label>
          <Input type="number" min={0} value={price}
            onChange={(e) => setPrice(Number(e.target.value))} required /></div>
        <div><Label>Old price (optional)</Label>
          <Input type="number" min={0} value={oldPrice}
            onChange={(e) => setOldPrice(e.target.value)} /></div>
        <div><Label>Currency</Label>
          <select className={inputClass} value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {["INR", "USD", "EUR", "AED"].map((c) => <option key={c} value={c}>{c}</option>)}
          </select></div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label>Badge (optional)</Label>
          <Input value={badge} onChange={(e) => setBadge(e.target.value)}
            placeholder="Bestseller" /></div>
        <label className="flex items-center gap-2 pt-7 text-sm text-ink/80">
          <input type="checkbox" checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)} className="h-4 w-4" />
          Feature on homepage
        </label>
      </div>

      {/* Lists */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div><Label>Highlights (one per line)</Label>
          <Textarea rows={4} value={highlights} onChange={(e) => setHighlights(e.target.value)} /></div>
        <div><Label>Inclusions (one per line)</Label>
          <Textarea rows={4} value={inclusions} onChange={(e) => setInclusions(e.target.value)} /></div>
        <div><Label>Exclusions (one per line)</Label>
          <Textarea rows={4} value={exclusions} onChange={(e) => setExclusions(e.target.value)} /></div>
      </div>

      {/* Photos */}
      <div>
        <Label>Hero image</Label>
        <div className="mt-1 flex items-center gap-4">
          {heroImage ? (
            <div className="relative h-24 w-32 overflow-hidden rounded-lg">
              <Image src={heroImage} alt="hero" fill className="object-cover" />
              <button type="button" onClick={() => setHeroImage("")}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white">
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : null}
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
          {gallery.map((url, i) => (
            <div key={url} className="relative h-20 w-28 overflow-hidden rounded-lg">
              <Image src={url} alt={`gallery ${i + 1}`} fill className="object-cover" />
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

      {/* Itinerary */}
      <div>
        <div className="flex items-center justify-between">
          <Label>Itinerary (optional)</Label>
          <button type="button" onClick={addDay}
            className="inline-flex items-center gap-1 text-sm font-medium text-navy-700 hover:text-gold-600">
            <Plus className="h-4 w-4" /> Add day
          </button>
        </div>
        <div className="mt-2 space-y-3">
          {itinerary.map((d, i) => (
            <div key={i} className="rounded-xl border border-navy-700/10 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-navy-800">Day {d.dayNumber}</span>
                <button type="button" onClick={() => removeDay(i)} className="text-rose-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <Input placeholder="Title" value={d.title}
                  onChange={(e) => updateDay(i, { title: e.target.value })} />
                <Input placeholder="Stay (hotel)" value={d.stay ?? ""}
                  onChange={(e) => updateDay(i, { stay: e.target.value })} />
              </div>
              <Textarea className="mt-2" rows={2} placeholder="What happens this day"
                value={d.description ?? ""}
                onChange={(e) => updateDay(i, { description: e.target.value })} />
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-rose-500">{error}</p>}

      <Button type="submit" variant="gold" size="lg" disabled={submitting || !title}>
        {submitting ? "Saving…" : "Create package"}
      </Button>
    </form>
  );
}
