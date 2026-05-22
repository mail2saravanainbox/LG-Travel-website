"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Check, Copy, Loader2, UploadCloud } from "lucide-react";
import { uploadImage } from "@/services/admin.service";
import { useAdmin } from "@/store/admin";

interface Uploaded {
  url: string;
  publicId: string;
}

/**
 * Signed direct-to-Cloudinary uploader for the admin panel.
 * Flow: ask our API for a signature → POST the file straight to Cloudinary.
 * The API secret never reaches the browser.
 */
export function ImageUploader({ folder = "lg-travels" }: { folder?: string }) {
  const token = useAdmin((s) => s.token);
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Uploaded[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files?.length || !token) return;
    setBusy(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const uploaded = await uploadImage(token, file, folder);
        setItems((prev) => [uploaded, ...prev]);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="rounded-2xl border border-navy-700/8 bg-white p-6 shadow-soft">
      <h2 className="font-display text-lg font-bold text-navy-900">Media library</h2>
      <p className="mt-1 text-sm text-ink/50">
        Upload images to Cloudinary, then copy the URL or public ID into your content.
      </p>

      <label
        className="mt-5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-navy-700/15 bg-mist/50 px-6 py-10 text-center transition-colors hover:border-navy-700/40"
      >
        {busy ? (
          <Loader2 className="h-7 w-7 animate-spin text-navy-600" />
        ) : (
          <UploadCloud className="h-7 w-7 text-navy-600" />
        )}
        <span className="text-sm font-medium text-navy-800">
          {busy ? "Uploading…" : "Click to choose images"}
        </span>
        <span className="text-xs text-ink/40">PNG, JPG, WebP — uploaded to /{folder}</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={busy}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {error && <p className="mt-3 text-sm text-rose-500">{error}</p>}

      {items.length > 0 && (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {items.map((it) => (
            <li
              key={it.publicId}
              className="flex items-center gap-3 rounded-xl border border-navy-700/8 p-2.5"
            >
              <Image
                src={it.url}
                alt={it.publicId}
                width={56}
                height={56}
                className="h-14 w-14 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-ink/70">{it.publicId}</p>
                <button
                  onClick={() => copy(it.url)}
                  className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-navy-700 hover:text-gold-600"
                >
                  {copied === it.url ? (
                    <>
                      <Check className="h-3.5 w-3.5" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy URL
                    </>
                  )}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
