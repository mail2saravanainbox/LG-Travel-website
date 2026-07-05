"use client";

import { CalendarCheck } from "lucide-react";
import { useMyBookings } from "@/hooks/use-my-bookings";
import { BookingCard } from "@/components/dashboard/booking-card";
import { Button } from "@/components/ui/button";

export default function BookingsPage() {
  const { bookings, loading, error } = useMyBookings();

  return (
    <div className="mx-auto max-w-4xl">
      <header>
        <h1 className="font-display text-2xl font-bold text-navy-900 md:text-3xl">My Bookings</h1>
        <p className="mt-1 text-sm text-ink/50">Every trip you&apos;ve requested or confirmed with us.</p>
      </header>

      <div className="mt-8 space-y-4">
        {loading && (
          <>
            <div className="h-36 animate-pulse rounded-2xl bg-white/70" />
            <div className="h-36 animate-pulse rounded-2xl bg-white/70" />
          </>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-600">
            We couldn&apos;t load your bookings just now. Please refresh in a moment.
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-navy-700/15 bg-white p-10 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-navy-50 text-navy-700">
              <CalendarCheck className="h-6 w-6" />
            </span>
            <p className="text-ink/60">You don&apos;t have any bookings yet.</p>
            <Button href="/packages" variant="gold" size="sm">
              Browse packages
            </Button>
          </div>
        )}

        {!loading &&
          !error &&
          bookings.map((b) => <BookingCard key={b.id} booking={b} />)}
      </div>
    </div>
  );
}
