"use client";

import { useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import {
  adminCreateBlogPost,
  adminUpdateBlogPost,
  uploadImage,
  type NewBlogInput,
} from "@/services/admin.service";
import { useAdmin } from "@/store/admin";
import type { BlogPost } from "@/types";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

const inputClass =
  "w-full rounded-xl border border-navy-700/15 bg-white px-4 py-2.5 text-sm text-ink/90 outline-none focus:border-navy-500";

const CATEGORIES = ["Inspiration", "Destinations", "Adventure", "Wellness", "Guides", "News"];

const toTags = (v: string) =>
  v.split(",").map((s) => s.trim()).filter(Boolean);

export function BlogForm({ initial, onSaved }: { initial?: BlogPost; onSaved?: () => void }) {
  const token = useAdmin((s) => s.token);
  const isEdit = Boolean(initial);
  const editSlug = initial?.slug;

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [category, setCategory] = useState(initial?.category ?? "Inspiration");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
  const [coverImage, setCoverImage] = useState(initial?.cover ?? "");
  const [published, setPublished] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doneSlug, setDoneSlug] = useState<string | null>(null);

  async function handleCover(file: File | undefined) {
    if (!file || !token) return;
    setUploading(true);
    setError(null);
    try {
      const { url } = await uploadImage(token, file, "lg-travels/blog");
      setCoverImage(url);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    setError(null);
    try {
      const payload: NewBlogInput = {
        title,
        slug: slug || undefined,
        category,
        excerpt: excerpt || undefined,
        content: content || undefined,
        coverImage: coverImage || undefined,
        tags: tags ? toTags(tags) : undefined,
        published,
      };
      const saved =
        isEdit && editSlug
          ? await adminUpdateBlogPost(token, editSlug, payload)
          : await adminCreateBlogPost(token, payload);
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
          {isEdit ? "Post updated ✓" : "Post published ✓"}
        </p>
        <p className="mt-2 text-sm text-emerald-700">It appears on the journal within ~30 seconds:</p>
        <a
          href={`/blog/${doneSlug}`}
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-block font-medium text-navy-700 underline"
        >
          /blog/{doneSlug}
        </a>
        {!isEdit && (
          <div className="mt-5">
            <Button variant="gold" onClick={() => setDoneSlug(null)}>
              Write another post
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5 rounded-2xl border border-navy-700/8 bg-white p-6 shadow-soft">
      <div>
        <h2 className="font-display text-lg font-bold text-navy-900">
          {isEdit ? `Edit: ${initial?.title}` : "New blog post"}
        </h2>
        <p className="text-sm text-ink/50">Title is required. Published posts go live automatically.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label>Title *</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required
            placeholder="Five Hidden Beaches in the Maldives" />
        </div>
        <div>
          <Label>Slug (web address)</Label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto from title" />
        </div>
        <div>
          <Label>Category</Label>
          <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div>
        <Label>Excerpt (short summary on cards)</Label>
        <Textarea rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
      </div>

      <div>
        <Label>Content (separate paragraphs with a blank line)</Label>
        <Textarea rows={10} value={content} onChange={(e) => setContent(e.target.value)} />
      </div>

      <div>
        <Label>Tags (comma separated)</Label>
        <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="maldives, beaches, guide" />
      </div>

      <div>
        <Label>Cover image</Label>
        <div className="mt-1 flex items-center gap-4">
          {coverImage ? (
            <div className="relative h-24 w-40 overflow-hidden rounded-lg">
              <Image src={coverImage} alt="cover" fill className="object-cover" />
              <button type="button" onClick={() => setCoverImage("")}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white">
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : null}
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-navy-700/25 px-4 py-3 text-sm text-navy-700 hover:border-navy-700/50">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            {coverImage ? "Replace" : "Upload cover"}
            <input type="file" accept="image/*" className="hidden" disabled={uploading}
              onChange={(e) => handleCover(e.target.files?.[0])} />
          </label>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-ink/80">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)}
          className="h-4 w-4" />
        Publish now (uncheck to save as a hidden draft)
      </label>

      {error && <p className="text-sm text-rose-500">{error}</p>}

      <Button type="submit" variant="gold" size="lg" disabled={submitting || !title}>
        {submitting ? "Saving…" : isEdit ? "Save changes" : "Publish post"}
      </Button>
    </form>
  );
}
