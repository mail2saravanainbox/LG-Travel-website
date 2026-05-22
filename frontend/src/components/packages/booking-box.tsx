"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Minus, Plus, ShieldCheck } from "lucide-react";
import type { TourPackage } from "@/types";
import { cn, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/input";
import { useBooking } from "@/store/booking";
import { useWishlist } from "@/store/wishlist";

export function BookingBox({ pkg }: { pkg: TourPackage }) {
  const router = useRouter();
  const { setDraft } = useBooking();
  const { ids, toggle } = useWishlist();
  const wished = ids.includes(pkg.id);

  const [travelers, setTravelers] = useState(2);
  const [startDate, setStartDate] = useState("");
  const total = pkg.price * travelers;

  function proceed() {
    setDraft({
      packageSlug: pkg.slug,
      packageTitle: pkg.title,
      price: pkg.price,
      currency: pkg.currency,
      travelers,
      startDate,
    });
    router.push("/checkout");
  }

  return (
    <div className="sticky top-24 rounded-3xl border border-navy-700/8 bg-white p-6 shadow-lift">
      <div className="flex items-end justify-between">
        <div>
          {pkg.oldPrice && (
            <span className="text-sm text-ink/40 line-through">
              {formatCurrency(pkg.oldPrice, pkg.currency)}
            </span>
          )}
          <p className="font-display text-3xl font-bold text-navy-900">
            {formatCurrency(pkg.price, pkg.currency)}
          </p>
          <span className="text-sm text-ink/50">per person</span>
        </div>
        <button
          onClick={() => toggle(pkg.id)}
          aria-label="Toggle wishlist"
          className="grid h-11 w-11 place-items-center rounded-full border border-navy-700/15 text-navy-700 transition-colors hover:border-rose-300"
        >
          <Heart className={cn("h-5 w-5", wished && "fill-rose-500 text-rose-500")} />
        </button>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <Label htmlFor="start">Departure date</Label>
          <input
            id="start"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-12 w-full rounded-xl border border-navy-700/15 bg-white px-4 text-sm text-ink focus-visible:border-navy-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500/15"
          />
        </div>

        <div>
          <Label>Travelers</Label>
          <div className="flex items-center justify-between rounded-xl border border-navy-700/15 px-3 py-2">
            <button
              onClick={() => setTravelers((t) => Math.max(1, t - 1))}
              className="grid h-9 w-9 place-items-center rounded-lg bg-navy-50 text-navy-700 hover:bg-navy-100"
              aria-label="Fewer travelers"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="font-display text-lg font-semibold text-navy-900">{travelers}</span>
            <button
              onClick={() => setTravelers((t) => Math.min(12, t + 1))}
              className="grid h-9 w-9 place-items-center rounded-lg bg-navy-50 text-navy-700 hover:bg-navy-100"
              aria-label="More travelers"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-navy-700/8 pt-5">
        <span className="text-sm text-ink/60">
          {formatCurrency(pkg.price, pkg.currency)} × {travelers}
        </span>
        <span className="font-display text-xl font-bold text-navy-900">
          {formatCurrency(total, pkg.currency)}
        </span>
      </div>

      <Button onClick={proceed} variant="gold" size="lg" className="mt-5 w-full">
        Book this trip
      </Button>
      <Button href="/contact" variant="outline" size="lg" className="mt-3 w-full">
        Request a custom quote
      </Button>

      <p className="mt-4 flex items-center justify-center gap-2 text-xs text-ink/50">
        <ShieldCheck className="h-4 w-4 text-emerald-500" /> Free cancellation up to 30 days before
      </p>
    </div>
  );
}
