import type { Metadata } from "next";
import { LegalPage } from "@/components/shared/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How LG Travels collects, uses and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="May 2026"
      sections={[
        {
          heading: "Introduction",
          body: [
            "This Privacy Policy explains how LG Travels (\"we\", \"us\") collects, uses and safeguards your information when you use our website and services.",
            "By using our platform you consent to the practices described here. We may update this policy from time to time; the latest version will always be available on this page.",
          ],
        },
        {
          heading: "Information we collect",
          body: [
            "We collect information you provide directly — such as your name, email, phone number and travel preferences — when you make an enquiry, create an account or complete a booking.",
            "We also automatically collect technical data such as IP address, device and browser type, and usage analytics to improve our service.",
          ],
        },
        {
          heading: "How we use your data",
          body: [
            "We use your information to design and deliver your trips, process payments, communicate with you, and personalise your experience. We never sell your personal data to third parties.",
          ],
        },
        {
          heading: "Data security",
          body: [
            "We apply industry-standard technical and organisational measures, including encryption in transit and at rest, to protect your data. Payments are processed via PCI-DSS compliant providers.",
          ],
        },
        {
          heading: "Your rights",
          body: [
            "Depending on your jurisdiction, you may have the right to access, correct, delete or export your personal data, and to object to certain processing. Contact us to exercise these rights.",
          ],
        },
        {
          heading: "Contact",
          body: ["For any privacy questions, email concierge@lgtravels.com."],
        },
      ]}
    />
  );
}
