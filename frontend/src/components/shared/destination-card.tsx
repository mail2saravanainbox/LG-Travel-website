import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Star } from "lucide-react";
import type { Destination } from "@/types";
import { formatCurrency } from "@/lib/utils";

export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className="group relative block overflow-hidden rounded-3xl shadow-soft transition-all duration-500 hover:shadow-lift"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={destination.heroImage}
          alt={destination.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/15 to-transparent" />

        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-navy-800 backdrop-blur">
          <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
          {destination.rating}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <span className="flex items-center gap-1.5 text-xs text-white/70">
            <MapPin className="h-3.5 w-3.5" /> {destination.country}
          </span>
          <h3 className="mt-1 font-display text-2xl font-semibold">{destination.name}</h3>
          <p className="mt-1 line-clamp-1 text-sm text-white/70">{destination.tagline}</p>

          <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-4">
            <span className="text-sm">
              <span className="text-white/60">from </span>
              <span className="font-display text-lg font-bold">
                {formatCurrency(destination.startingPrice, destination.currency)}
              </span>
            </span>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15 backdrop-blur transition-all duration-300 group-hover:bg-gold-400 group-hover:text-navy-900">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
