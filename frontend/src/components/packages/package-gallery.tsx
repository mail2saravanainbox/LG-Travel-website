"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function PackageGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-3 overflow-hidden rounded-3xl md:h-[460px]">
        {images.slice(0, 5).map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              "group relative overflow-hidden",
              i === 0 ? "col-span-4 row-span-2 md:col-span-2" : "col-span-2 md:col-span-1",
              "min-h-40",
            )}
          >
            <Image
              src={src}
              alt={`${title} ${i + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              priority={i === 0}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {i === 4 && images.length > 5 && (
              <span className="absolute inset-0 grid place-items-center bg-navy-950/55 text-sm font-semibold text-white">
                +{images.length - 5} photos
              </span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[60] grid place-items-center bg-navy-950/90 p-4 backdrop-blur"
          >
            <button
              aria-label="Close"
              className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </button>
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              className="relative aspect-[3/2] w-full max-w-4xl overflow-hidden rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={images[active]} alt={title} fill className="object-cover" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
