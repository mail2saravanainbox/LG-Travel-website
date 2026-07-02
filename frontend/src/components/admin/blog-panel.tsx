"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ExternalLink, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { fetchBlogPost, fetchBlogPosts } from "@/services/blog.service";
import { adminDeleteBlogPost } from "@/services/admin.service";
import { useAdmin } from "@/store/admin";
import type { BlogPost } from "@/types";
import { BlogForm } from "./blog-form";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

type Mode = { kind: "list" } | { kind: "add" } | { kind: "edit"; post: BlogPost };

export function BlogPanel() {
  const token = useAdmin((s) => s.token);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>({ kind: "list" });
  const [opening, setOpening] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetchBlogPosts({ allowMock: false })
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function startEdit(slug: string) {
    setOpening(slug);
    try {
      const full = await fetchBlogPost(slug);
      if (full) setMode({ kind: "edit", post: full });
    } finally {
      setOpening(null);
    }
  }

  async function handleDelete(slug: string, title: string) {
    if (!token) {
      window.alert("Your session has expired — please sign in again.");
      return;
    }
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(slug);
    try {
      await adminDeleteBlogPost(token, slug);
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
          <ArrowLeft className="h-4 w-4" /> Back to all posts
        </button>
        <BlogForm initial={mode.kind === "edit" ? mode.post : undefined} onSaved={load} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink/60">
          {loading ? "Loading…" : `${posts.length} post${posts.length === 1 ? "" : "s"} in the journal`}
        </p>
        <Button variant="gold" size="sm" onClick={() => setMode({ kind: "add" })}>
          <Plus className="h-4 w-4" /> Write post
        </Button>
      </div>

      {loading ? (
        <div className="mt-10 flex justify-center text-navy-600">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {posts.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-4 rounded-2xl border border-navy-700/8 bg-white p-3 shadow-soft"
            >
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-mist">
                {p.cover && <Image src={p.cover} alt={p.title} fill className="object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm font-bold text-navy-900">{p.title}</p>
                <p className="mt-0.5 text-xs text-ink/50">
                  {p.category} · {formatDate(p.publishedAt)}
                </p>
              </div>
              <a
                href={`/blog/${p.slug}`}
                target="_blank"
                rel="noreferrer"
                className="hidden items-center gap-1 text-xs font-medium text-navy-700 hover:text-gold-600 sm:inline-flex"
              >
                View <ExternalLink className="h-3 w-3" />
              </a>
              <button
                onClick={() => startEdit(p.slug)}
                disabled={opening === p.slug}
                className="inline-flex items-center gap-1.5 rounded-lg border border-navy-700/15 px-3 py-1.5 text-xs font-medium text-navy-700 hover:border-navy-700/40 disabled:opacity-50"
              >
                {opening === p.slug ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Pencil className="h-3.5 w-3.5" />}
                Edit
              </button>
              <button
                onClick={() => handleDelete(p.slug, p.title)}
                disabled={deleting === p.slug}
                className="inline-flex items-center justify-center rounded-lg border border-rose-200 px-2.5 py-1.5 text-rose-500 hover:bg-rose-50 disabled:opacity-50"
              >
                {deleting === p.slug ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
