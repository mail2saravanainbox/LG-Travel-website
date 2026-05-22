"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Heart, MapPin, Star, Users } from "lucide-react";
import type { TourPackage } from "@/types";
import { cn, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useWishlist } from "@/store/wishlist";

export function PackageCard({ pkg }: { pkg: TourPackage }) {
  const { ids, toggle } = useWishlist();
  const wished = ids.includes(pkg.id);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-navy-700/8 bg-white shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[3/2] overflow-hidden">
        <Image
          src={pkg.heroImage}
          alt={pkg.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          {pkg.badge ? (
            <Badge variant="solid" className="bg-navy-900/85 backdrop-blur">
              {pkg.badge}
            </Badge>
          ) : (
            <Badge variant="glass">{pkg.category}</Badge>
          )}
          <button
            onClick={() => toggle(pkg.id)}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/85 text-navy-800 backdrop-blur transition-colors hover:bg-white"
          >
            <Heart className={cn("h-4.5 w-4.5", wished && "fill-rose-500 text-rose-500")} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span className="flex items-center gap-1.5 text-xs text-ink/50">
          <MapPin className="h-3.5 w-3.5" /> {pkg.location}
        </span>
        <h3 className="mt-1.5 font-display text-lg font-semibold text-navy-900">
          <Link href={`/packages/${pkg.slug}`} className="after:absolute after:inset-0">
            {pkg.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/60">{pkg.summary}</p>

        <div className="mt-4 flex items-center gap-4 text-xs text-ink/60">
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-gold-500" /> {pkg.durationDays}D / {pkg.durationNights}N
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-gold-500" /> {pkg.groupSize}
          </span>
          <span className="ml-auto flex items-center gap-1 font-medium text-navy-800">
            <Star className="h-4 w-4 fill-gold-400 text-gold-400" /> {pkg.rating}
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-navy-700/8 pt-4">
          <div>
            {pkg.oldPrice && (
              <span className="mr-1.5 text-sm text-ink/40 line-through">
                {formatCurrency(pkg.oldPrice, pkg.currency)}
              </span>
            )}
            <span className="font-display text-xl font-bold text-navy-900">
              {formatCurrency(pkg.price, pkg.currency)}
            </span>
            <span className="text-xs text-ink/50"> /person</span>
          </div>
          <span className="relative z-10 text-sm font-semibold text-gold-600 transition-colors group-hover:text-gold-500">
            View trip →
          </span>
        </div>
      </div>
    </article>
  );
}
