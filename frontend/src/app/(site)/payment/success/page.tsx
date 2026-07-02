import type { Metadata } from "next";
import { CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrintInvoiceButton } from "@/components/shared/print-invoice-button";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Payment Successful",
  robots: { index: false },
};

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; total?: string; currency?: string }>;
}) {
  const { ref, total, currency } = await searchParams;
  return (
    <div className="container-lux grid min-h-[80vh] place-items-center py-28">
      <div className="w-full max-w-lg text-center">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-11 w-11" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold text-navy-900 md:text-4xl">
          Booking confirmed!
        </h1>
        <p className="mt-3 text-ink/65">
          Thank you — your luxury journey is booked. A confirmation and invoice are on their way to
          your inbox.
        </p>
        <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-full bg-mist px-5 py-2.5 text-sm">
          {ref && (
            <span className="flex items-center gap-2">
              <span className="text-ink/50">Reference</span>
              <span className="font-display font-bold text-navy-900">{ref}</span>
            </span>
          )}
          {total && (
            <span className="flex items-center gap-2">
              <span className="text-ink/50">Total paid</span>
              <span className="font-display font-bold text-navy-900">
                {formatCurrency(Number(total), currency ?? "INR")}
              </span>
            </span>
          )}
        </div>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <PrintInvoiceButton />
          <Button href="/dashboard" variant="outline" size="lg">
            Go to dashboard
          </Button>
        </div>
        <p className="mt-8 flex items-center justify-center gap-2 text-sm text-ink/50">
          <Mail className="h-4 w-4" /> A travel designer will reach out within 24 hours.
        </p>
      </div>
    </div>
  );
}
