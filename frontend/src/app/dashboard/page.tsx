"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Compass, Heart } from "lucide-react";
import type { TourPackage } from "@/types";
import { fetchPackages } from "@/services/packages.service";
import { useWishlist } from "@/store/wishlist";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const { ids } = useWishlist();
  // Filter the real (live) package catalogue by the wishlist ids — the ids come
  // from live DB packages, so filtering the mock catalogue always returned empty.
  const [allPackages, setAllPackages] = useState<TourPackage[]>([]);
  useEffect(() => {
    fetchPackages()
      .then(setAllPackages)
      .catch(() => setAllPackages([]));
  }, []);
  const wished = allPackages.filter((p) => ids.includes(p.id));

  const firstName =
    (isLoaded && (user?.firstName || user?.fullName || user?.username)) || "traveller";

  return (
    <div className="mx-auto max-w-6xl">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-ink/50">Welcome back,</p>
          <h1 className="font-display text-2xl font-bold text-navy-900 md:text-3xl">{firstName}</h1>
        </div>
        <Button href="/packages" variant="gold">
          Plan a new trip
        </Button>
      </header>

      {/* Upcoming trips — populated once you make a booking */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-bold text-navy-900">Upcoming trips</h2>
        <div className="mt-4 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-navy-700/15 bg-white p-10 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-navy-50 text-navy-700">
            <Compass className="h-6 w-6" />
          </span>
          <p className="text-ink/60">
            You don&apos;t have any upcoming trips yet. Your bookings will appear here.
          </p>
          <Button href="/packages" variant="outline" size="sm">
            Browse packages
          </Button>
        </div>
      </section>

      {/* Wishlist */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-navy-900">
            <Heart className="h-5 w-5 text-rose-400" /> Your wishlist
            <span className="text-sm font-normal text-ink/40">({wished.length})</span>
          </h2>
          <Link href="/packages" className="text-sm font-semibold text-gold-600">
            Browse more →
          </Link>
        </div>
        {wished.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-navy-700/15 bg-white p-8 text-center text-ink/50">
            Your wishlist is empty. Tap the ♥ on any package to save it here.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                    sizes="33vw"
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
      </section>
    </div>
  );
}
