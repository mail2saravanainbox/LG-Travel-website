"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Photo carousel: a large main image with left/right arrows, a clickable
 * thumbnail strip, a photo counter, and a fullscreen lightbox (also navigable
 * with arrows / keyboard). Used on destination and package detail pages.
 */
export function ImageCarousel({ images, title }: { images: string[]; title: string }) {
  const photos = Array.from(new Set(images.filter(Boolean)));
  const count = photos.length;
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + count) % count),
    [count],
  );

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen, go]);

  if (!count) return null;

  return (
    <div>
      {/* Main image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-navy-50 md:aspect-[16/9]">
        <Image
          key={index}
          src={photos[index]}
          alt={`${title} — photo ${index + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 66vw"
          priority={index === 0}
          className="object-cover"
        />

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-navy-900 shadow-soft backdrop-blur transition hover:bg-white"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-navy-900 shadow-soft backdrop-blur transition hover:bg-white"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <span className="absolute bottom-3 left-3 rounded-full bg-navy-950/50 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              {index + 1} / {count}
            </span>
          </>
        )}

        <button
          type="button"
          onClick={() => setFullscreen(true)}
          aria-label="View fullscreen"
          className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-xl bg-navy-950/50 text-white backdrop-blur transition hover:bg-navy-950/70"
        >
          <Expand className="h-5 w-5" />
        </button>
      </div>

      {/* Thumbnail strip */}
      {count > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2.5 overflow-x-auto pb-1">
          {photos.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1}`}
              className={cn(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-xl ring-2 transition md:h-20 md:w-28",
                i === index
                  ? "ring-gold-400"
                  : "opacity-70 ring-transparent hover:opacity-100",
              )}
            >
              <Image src={src} alt={`${title} thumbnail ${i + 1}`} fill sizes="112px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen lightbox */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFullscreen(false)}
            className="fixed inset-0 z-[70] grid place-items-center bg-navy-950/92 p-4 backdrop-blur"
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setFullscreen(false)}
              className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </button>
            {count > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous photo"
                  onClick={(e) => { e.stopPropagation(); go(-1); }}
                  className="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <ChevronLeft className="h-7 w-7" />
                </button>
                <button
                  type="button"
                  aria-label="Next photo"
                  onClick={(e) => { e.stopPropagation(); go(1); }}
                  className="absolute right-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <ChevronRight className="h-7 w-7" />
                </button>
              </>
            )}
            <motion.div
              initial={{ scale: 0.94 }}
              animate={{ scale: 1 }}
              className="relative aspect-[3/2] w-full max-w-5xl overflow-hidden rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={photos[index]} alt={title} fill className="object-contain" />
            </motion.div>
            <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
              {index + 1} / {count}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
