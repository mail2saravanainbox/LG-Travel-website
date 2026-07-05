import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ContactForm } from "@/components/contact/contact-form";
import { fetchSiteSettings } from "@/services/settings.service";
import { formatAddress, formatPhone } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Speak with an LG Travels designer and start planning your bespoke luxury journey.",
};

export default async function ContactPage() {
  const site = await fetchSiteSettings();
  const details = [
    { icon: MapPin, label: site.addressLabel, value: formatAddress(site.address) },
    { icon: Phone, label: "Call us", value: `${formatPhone(site.phone)}\n(${site.hours})` },
    { icon: Mail, label: "Email", value: site.email },
    { icon: Clock, label: "Working hours", value: site.hours },
  ];
  return (
    <>
      <PageHeader
        eyebrow="We'd love to hear from you"
        title="Let's design your next journey"
        description="Tell us what you're dreaming of and a dedicated travel designer will craft a proposal — no obligation."
        image="https://res.cloudinary.com/dzevugvgg/image/upload/v1779640596/lg-travels/site/images/1436491865332-7a61a109cc05.jpg"
        crumbs={[{ label: "Contact" }]}
      />

      <section className="container-lux grid gap-12 py-16 md:py-24 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <h2 className="font-display text-2xl font-bold text-navy-900">Get in touch</h2>
          <p className="mt-3 text-ink/65">
            Visit us, call, or send an enquiry — our specialists reply within 24 hours.
          </p>
          <ul className="mt-8 space-y-6">
            {details.map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-navy-700 text-gold-400">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm text-ink/50">{label}</p>
                  <p className="whitespace-pre-line font-medium text-navy-900">{value}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-navy-700/8 bg-white p-6 shadow-lift md:p-8 lg:col-span-3">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
