"use client";

import { CreditCard } from "lucide-react";
import { useMyBookings } from "@/hooks/use-my-bookings";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function PaymentsPage() {
  const { bookings, loading, error } = useMyBookings();

  // A payment row per booking: use a recorded payment if present, otherwise the
  // booking's own amount/status (payment is arranged when the trip is confirmed).
  const rows = bookings.map((b) => {
    const payment = b.payments?.[0];
    return {
      id: b.id,
      reference: b.reference,
      title: b.package?.title ?? "Trip booking",
      date: payment?.createdAt ?? b.createdAt,
      amount: Number(payment?.amount ?? b.total),
      currency: b.currency,
      status: payment?.status ?? (b.status === "confirmed" ? "paid" : "pending"),
    };
  });

  return (
    <div className="mx-auto max-w-4xl">
      <header>
        <h1 className="font-display text-2xl font-bold text-navy-900 md:text-3xl">Payments</h1>
        <p className="mt-1 text-sm text-ink/50">
          A record of the amounts on your bookings. Our team arranges secure payment when your trip is confirmed.
        </p>
      </header>

      <div className="mt-8">
        {loading && <div className="h-40 animate-pulse rounded-2xl bg-white/70" />}

        {!loading && error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-600">
            We couldn&apos;t load your payments just now. Please refresh in a moment.
          </div>
        )}

        {!loading && !error && rows.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-navy-700/15 bg-white p-10 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-navy-50 text-navy-700">
              <CreditCard className="h-6 w-6" />
            </span>
            <p className="text-ink/60">No payments yet. They&apos;ll appear here once you book a trip.</p>
            <Button href="/packages" variant="gold" size="sm">
              Browse packages
            </Button>
          </div>
        )}

        {!loading && !error && rows.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-navy-700/8 bg-white shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-navy-700/8 text-left text-xs uppercase tracking-wide text-ink/50">
                    <th className="px-5 py-3 font-semibold">Booking</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Amount</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-b border-navy-700/5 last:border-0">
                      <td className="px-5 py-4">
                        <p className="font-medium text-navy-900">{r.title}</p>
                        <p className="font-mono text-xs text-ink/50">Ref {r.reference}</p>
                      </td>
                      <td className="px-5 py-4 text-ink/70">{formatDate(r.date)}</td>
                      <td className="px-5 py-4 font-semibold text-navy-900">
                        {formatCurrency(r.amount, r.currency)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={r.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
