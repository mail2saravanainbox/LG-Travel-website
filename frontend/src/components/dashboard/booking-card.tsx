import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";
import type { MyBooking } from "@/services/bookings.service";
import { formatCurrency } from "@/lib/utils";
import { StatusBadge } from "./status-badge";

function formatDate(value: string | null) {
  if (!value) return "Dates flexible";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Dates flexible";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/** A single booking summary card for the customer dashboard. */
export function BookingCard({ booking }: { booking: MyBooking }) {
  const pkg = booking.package;
  const title = pkg?.title ?? "Trip booking";
  return (
    <div className="flex flex-col gap-4 overflow-hidden rounded-2xl border border-navy-700/8 bg-white p-4 shadow-soft sm:flex-row">
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-44">
        {pkg?.heroImage ? (
          <Image src={pkg.heroImage} alt={title} fill sizes="(max-width:640px) 100vw, 176px" className="object-cover" />
        ) : (
          <div className="h-full w-full bg-navy-50" />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-display text-base font-semibold text-navy-900">{title}</h3>
            <p className="mt-0.5 font-mono text-xs text-ink/50">Ref {booking.reference}</p>
          </div>
          <StatusBadge status={booking.status} />
        </div>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-ink/60">
          {pkg?.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-gold-500" /> {pkg.location}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-gold-500" /> {formatDate(booking.startDate)}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-gold-500" /> {booking.travelers}{" "}
            {booking.travelers === 1 ? "traveller" : "travellers"}
          </span>
        </div>
        <div className="mt-auto flex items-end justify-between pt-3">
          <span className="text-lg font-bold text-navy-900">
            {formatCurrency(Number(booking.total), booking.currency)}
          </span>
          {pkg?.slug && (
            <Link href={`/packages/${pkg.slug}`} className="text-sm font-semibold text-gold-600 hover:text-gold-700">
              View package →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
