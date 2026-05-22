"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { EASE_LUX } from "@/lib/motion";
import type { Testimonial } from "@/types";
import { SectionHeading } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";

export function TestimonialsSlider({ testimonials }: { testimonials: Testimonial[] }) {
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const t = testimonials[index];

  const paginate = (d: number) =>
    setState([(index + d + testimonials.length) % testimonials.length, d]);

  return (
    <section className="relative overflow-hidden bg-navy-900 py-20 text-white md:py-28">
      <div
        className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-gold-400/10 blur-3xl"
        aria-hidden
      />
      <div className="container-lux relative">
        <SectionHeading
          light
          eyebrow="Loved Worldwide"
          title="Stories from our travellers"
          description="Real journeys, real people — from Dubai to Mumbai, London to Lagos."
        />

        <div className="mx-auto mt-14 max-w-3xl">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.figure
              key={t.id}
              custom={dir}
              initial={{ opacity: 0, x: dir >= 0 ? 60 : -60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir >= 0 ? -60 : 60 }}
              transition={{ duration: 0.5, ease: EASE_LUX }}
              className="glass rounded-3xl p-8 text-center md:p-12"
            >
              <Quote className="mx-auto h-10 w-10 text-gold-400" />
              <blockquote className="mt-6 text-balance font-display text-xl font-medium leading-relaxed md:text-2xl">
                “{t.quote}”
              </blockquote>
              <div className="mt-6 flex justify-center gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <figcaption className="mt-6 flex items-center justify-center gap-3">
                <Image
                  src={t.avatar}
                  alt={t.name}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-gold-400/50"
                />
                <div className="text-left">
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-white/60">
                    {t.location} · {t.trip}
                  </p>
                </div>
              </figcaption>
            </motion.figure>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => paginate(-1)}
              aria-label="Previous"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/20 transition-colors hover:border-gold-400 hover:text-gold-300"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setState([i, i > index ? 1 : -1])}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    i === index ? "w-7 bg-gold-400" : "w-2 bg-white/30 hover:bg-white/50",
                  )}
                />
              ))}
            </div>
            <button
              onClick={() => paginate(1)}
              aria-label="Next"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/20 transition-colors hover:border-gold-400 hover:text-gold-300"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
