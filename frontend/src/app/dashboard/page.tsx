"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, Heart, MapPin, Plane, TrendingUp } from "lucide-react";
import { packages } from "@/data/packages";
import { useWishlist } from "@/store/wishlist";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

const upcoming = packages.slice(0, 2);

export default function DashboardPage() {
  const { ids } = useWishlist();
  const wished = packages.filter((p) => ids.includes(p.id));

  const stats = [
    { label: "Upcoming trips", value: "2", icon: Plane },
    { label: "Total bookings", value: "7", icon: CalendarCheck },
    { label: "Wishlist", value: String(ids.length), icon: Heart },
    { label: "Loyalty points", value: "12,400", icon: TrendingUp },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-ink/50">Welcome back,</p>
          <h1 className="font-display text-2xl font-bold text-navy-900 md:text-3xl">Jane Doe</h1>
        </div>
        <Button href="/packages" variant="gold">Plan a new trip</Button>
      </header>

      {/* Stat widgets */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-navy-700/8 bg-white p-5 shadow-soft">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-50 text-navy-700">
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-4 font-display text-2xl font-bold text-navy-900">{value}</p>
            <p className="text-sm text-ink/50">{label}</p>
          </div>
        ))}
      </div>

      {/* Upcoming trips */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-bold text-navy-900">Upcoming trips</h2>
        <div className="mt-4 space-y-4">
          {upcoming.map((p) => (
            <div
              key={p.id}
              className="flex flex-col gap-4 rounded-2xl border border-navy-700/8 bg-white p-4 shadow-soft sm:flex-row sm:items-center"
            >
              <div className="relative h-28 w-full overflow-hidden rounded-xl sm:h-20 sm:w-28">
                <Image src={p.heroImage} alt={p.title} fill sizes="120px" className="object-cover" />
              </div>
              <div className="flex-1">
                <Badge variant="navy">{p.category}</Badge>
                <h3 className="mt-1.5 font-display text-lg font-semibold text-navy-900">{p.title}</h3>
                <p className="flex items-center gap-1.5 text-sm text-ink/55">
                  <MapPin className="h-3.5 w-3.5" /> {p.location}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-lg font-bold text-navy-900">
                  {formatCurrency(p.price, p.currency)}
                </p>
                <Badge variant="gold">Confirmed</Badge>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Wishlist */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-navy-900">Your wishlist</h2>
          <Link href="/packages" className="text-sm font-semibold text-gold-600">Browse more →</Link>
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
                  <Image src={p.heroImage} alt={p.title} fill sizes="33vw" className="object-cover transition-transform group-hover:scale-105" />
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
