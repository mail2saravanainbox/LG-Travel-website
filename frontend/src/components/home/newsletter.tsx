"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  const [done, setDone] = useState(false);

  return (
    <section className="container-lux pb-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-navy-700 px-6 py-14 text-center text-white md:px-16 md:py-20">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-navy-400/30 blur-3xl" />

          <div className="relative mx-auto max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-300">
              The Journal
            </span>
            <h2 className="mt-4 text-balance font-display text-3xl font-bold md:text-4xl">
              Travel inspiration, delivered beautifully
            </h2>
            <p className="mt-4 text-balance text-white/70">
              Join 40,000+ travellers. Get curated itineraries, member-only fares and stories
              from the road — never spam.
            </p>

            {done ? (
              <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-medium text-gold-300">
                <CheckCircle2 className="h-5 w-5" /> You&apos;re in! Check your inbox.
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setDone(true);
                }}
                className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
              >
                <Input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="h-12 flex-1 border-white/20 bg-white/10 text-white placeholder:text-white/50 focus-visible:border-gold-400 focus-visible:ring-gold-400/30"
                />
                <Button type="submit" variant="gold" size="lg">
                  Subscribe <Send className="h-4 w-4" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
