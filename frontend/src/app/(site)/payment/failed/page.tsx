import type { Metadata } from "next";
import { Headset, RefreshCw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Payment Failed",
  robots: { index: false },
};

export default function PaymentFailedPage() {
  return (
    <div className="container-lux grid min-h-[80vh] place-items-center py-28">
      <div className="w-full max-w-lg text-center">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-rose-100 text-rose-500">
          <XCircle className="h-11 w-11" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold text-navy-900 md:text-4xl">
          Payment unsuccessful
        </h1>
        <p className="mt-3 text-ink/65">
          Something went wrong and your payment didn&apos;t go through. Don&apos;t worry — you
          haven&apos;t been charged. Please try again or reach out and we&apos;ll help right away.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/checkout" variant="gold" size="lg">
            <RefreshCw className="h-5 w-5" /> Try again
          </Button>
          <Button href="/contact" variant="outline" size="lg">
            <Headset className="h-5 w-5" /> Contact support
          </Button>
        </div>
      </div>
    </div>
  );
}
