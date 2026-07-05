"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { TourPackage } from "@/types";
import { fetchPackages } from "@/services/packages.service";
import { useWishlist } from "@/store/wishlist";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export default function WishlistPage() {
  const { ids } = useWishlist();
  const [allPackages, setAllPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages()
      .then(setAllPackages)
      .catch(() => setAllPackages([]))
      .finally(() => setLoading(false));
  }, []);

  const wished = allPackages.filter((p) => ids.includes(p.id));

  return (
    <div className="mx-auto max-w-5xl">
      <header>
        <h1 className="flex items-center gap-2 font-display text-2xl font-bold text-navy-900 md:text-3xl">
          <Heart className="h-6 w-6 text-rose-400" /> Wishlist
          <span className="text-base font-normal text-ink/40">({wished.length})</span>
        </h1>
        <p className="mt-1 text-sm text-ink/50">Packages you&apos;ve saved. Saved on this device.</p>
      </header>

      <div className="mt-8">
        {loading && <div className="h-40 animate-pulse rounded-2xl bg-white/70" />}

        {!loading && wished.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-navy-700/15 bg-white p-10 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-navy-50 text-rose-400">
              <Heart className="h-6 w-6" />
            </span>
            <p className="text-ink/60">Your wishlist is empty. Tap the ♥ on any package to save it here.</p>
            <Button href="/packages" variant="gold" size="sm">
              Browse packages
            </Button>
          </div>
        )}

        {!loading && wished.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {wished.map((p) => (
              <Link
                key={p.id}
                href={`/packages/${p.slug}`}
                className="group overflow-hidden rounded-2xl border border-navy-700/8 bg-white shadow-soft"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={p.heroImage}
                    alt={p.title}
                    fill
                    sizes="(max-width:640px) 100vw, 33vw"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-base font-semibold text-navy-900">{p.title}</h3>
                  <p className="text-sm text-gold-600">{formatCurrency(p.price, p.currency)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
