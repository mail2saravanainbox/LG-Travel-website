import type { Metadata } from "next";
import { LegalPage } from "@/components/shared/legal-page";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms governing your use of LG Travels and our booking services.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      updated="May 2026"
      sections={[
        {
          heading: "Acceptance of terms",
          body: [
            "By accessing or using the LG Travels platform you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services.",
          ],
        },
        {
          heading: "Bookings & payments",
          body: [
            "All bookings are subject to availability and confirmation. A deposit may be required to secure your trip, with the balance payable before departure as specified in your booking confirmation.",
            "Prices are quoted in the currency shown and may be subject to change due to supplier costs, taxes or exchange-rate fluctuations until your booking is confirmed.",
          ],
        },
        {
          heading: "Cancellations & refunds",
          body: [
            "Cancellation terms vary by package and supplier and are provided in writing before payment. Refunds, where applicable, are processed according to those terms. We strongly recommend comprehensive travel insurance.",
          ],
        },
        {
          heading: "Traveller responsibilities",
          body: [
            "You are responsible for ensuring valid travel documentation, including passports, visas and health requirements. LG Travels provides guidance but is not liable for denied entry due to incomplete documentation.",
          ],
        },
        {
          heading: "Limitation of liability",
          body: [
            "LG Travels acts as an agent for third-party suppliers. To the extent permitted by law, our liability is limited to the value of the services booked through us.",
          ],
        },
        {
          heading: "Governing law",
          body: [
            "These terms are governed by the applicable laws of the jurisdiction in which LG Travels operates. Disputes are subject to the exclusive jurisdiction of its courts.",
          ],
        },
      ]}
    />
  );
}
