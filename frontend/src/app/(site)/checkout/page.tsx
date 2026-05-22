"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { CreditCard, Lock, ShieldCheck } from "lucide-react";
import { useBooking } from "@/store/booking";
import { createBooking } from "@/services/bookings.service";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const { draft, total, reset } = useBooking();
  const [processing, setProcessing] = useState(false);

  const hasBooking = Boolean(draft.packageTitle);
  const currency = draft.currency ?? "INR";
  const subtotal = total();
  const taxes = Math.round(subtotal * 0.05);
  const grand = subtotal + taxes;

  async function pay(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setProcessing(true);
    const fd = new FormData(e.currentTarget);
    try {
      // Creates a real booking via the API (payment gateway is a placeholder).
      // The endpoint requires a signed-in user; /checkout is gated by proxy.ts.
      const token = (await getToken()) ?? undefined;
      const booking = await createBooking(
        {
          packageSlug: draft.packageSlug ?? "",
          travelers: draft.travelers ?? 1,
          startDate: draft.startDate || undefined,
          leadName: String(fd.get("leadName") ?? ""),
          leadEmail: String(fd.get("leadEmail") ?? ""),
          leadPhone: String(fd.get("leadPhone") ?? "") || undefined,
        },
        token,
      );
      reset();
      const q = new URLSearchParams({
        ref: booking.reference,
        total: booking.total,
        currency: booking.currency,
      });
      router.push(`/payment/success?${q}`);
    } catch (err) {
      router.push(`/payment/failed?reason=${encodeURIComponent((err as Error).message)}`);
    }
  }

  return (
    <div className="container-lux pt-28 pb-20 md:pt-32">
      <h1 className="font-display text-3xl font-bold text-navy-900 md:text-4xl">Secure checkout</h1>
      <p className="mt-2 text-ink/60">Complete your details to confirm your journey.</p>

      {!hasBooking ? (
        <div className="mt-10 rounded-3xl border border-dashed border-navy-700/15 bg-white p-12 text-center">
          <p className="text-ink/60">No trip selected yet.</p>
          <Button href="/packages" variant="gold" className="mt-4">Browse packages</Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-3">
          <form onSubmit={pay} className="space-y-8 lg:col-span-2">
            {/* Traveller details */}
            <section className="rounded-3xl border border-navy-700/8 bg-white p-6 shadow-soft md:p-8">
              <h2 className="font-display text-xl font-bold text-navy-900">Lead traveller</h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <Label>Full name</Label>
                  <Input name="leadName" required placeholder="Jane Doe" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input name="leadEmail" required type="email" placeholder="you@example.com" />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input name="leadPhone" required placeholder="+971 50 000 0000" />
                </div>
                <div>
                  <Label>Nationality</Label>
                  <Input name="nationality" placeholder="e.g. Emirati" />
                </div>
              </div>
            </section>

            {/* Payment */}
            <section className="rounded-3xl border border-navy-700/8 bg-white p-6 shadow-soft md:p-8">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-navy-900">Payment</h2>
                <span className="flex items-center gap-1.5 text-xs text-emerald-600">
                  <Lock className="h-4 w-4" /> Encrypted
                </span>
              </div>
              <p className="mt-1 text-sm text-ink/50">
                Demo gateway — no real charge. Swap for Stripe / Razorpay / Telr in production.
              </p>
              <div className="mt-5 space-y-5">
                <div>
                  <Label>Card number</Label>
                  <div className="relative">
                    <Input placeholder="4242 4242 4242 4242" />
                    <CreditCard className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/30" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <Label>Expiry</Label>
                    <Input placeholder="MM / YY" />
                  </div>
                  <div>
                    <Label>CVC</Label>
                    <Input placeholder="123" />
                  </div>
                </div>
              </div>
            </section>

            <Button type="submit" variant="gold" size="lg" disabled={processing} className="w-full">
              {processing ? "Processing payment…" : `Pay ${formatCurrency(grand, currency)}`}
            </Button>
          </form>

          {/* Order summary */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-3xl border border-navy-700/8 bg-white p-6 shadow-lift">
              <h2 className="font-display text-lg font-bold text-navy-900">Order summary</h2>
              <div className="mt-4 rounded-2xl bg-mist p-4">
                <Badge variant="navy">Selected trip</Badge>
                <p className="mt-2 font-display text-lg font-semibold text-navy-900">
                  {draft.packageTitle}
                </p>
                <p className="text-sm text-ink/55">
                  {draft.travelers} traveller(s)
                  {draft.startDate ? ` · from ${draft.startDate}` : ""}
                </p>
              </div>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink/60">
                    {formatCurrency(draft.price ?? 0, currency)} × {draft.travelers}
                  </dt>
                  <dd className="font-medium text-navy-800">{formatCurrency(subtotal, currency)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink/60">Taxes & fees (5%)</dt>
                  <dd className="font-medium text-navy-800">{formatCurrency(taxes, currency)}</dd>
                </div>
                <div className="flex justify-between border-t border-navy-700/8 pt-3">
                  <dt className="font-display text-base font-bold text-navy-900">Total</dt>
                  <dd className="font-display text-base font-bold text-navy-900">
                    {formatCurrency(grand, currency)}
                  </dd>
                </div>
              </dl>
              <p className="mt-5 flex items-center gap-2 text-xs text-ink/50">
                <ShieldCheck className="h-4 w-4 text-emerald-500" /> Financial protection included
              </p>
              <Link href="/packages" className="mt-4 block text-center text-sm text-navy-600 hover:underline">
                ← Back to packages
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
