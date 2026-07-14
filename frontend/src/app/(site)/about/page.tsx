import type { Metadata } from "next";
import Image from "next/image";
import {
  Briefcase,
  CalendarCheck,
  Car,
  FileCheck,
  Handshake,
  Headset,
  Hotel,
  MapPin,
  Plane,
  Scale,
  Settings2,
  ShieldCheck,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal, RevealGroup } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Trusted travel management & tourism solutions since 2014. LG Travels serves government institutions, corporate organizations and individual travellers across Northeast India.",
};

const whyChoose = [
  { icon: CalendarCheck, title: "Established in 2014" },
  { icon: ShieldCheck, title: "Trusted by Government & Leisure Travellers" },
  { icon: Users, title: "Experienced Travel Consultants" },
  { icon: Scale, title: "Transparent Pricing & Ethical Business Practices" },
  { icon: Handshake, title: "Strong Airline & Hospitality Partnerships" },
  { icon: Headset, title: "Dedicated Customer Support" },
  { icon: Settings2, title: "Customized Travel Solutions" },
  { icon: MapPin, title: "Presence Across Northeast India" },
];

const services = [
  {
    icon: Plane,
    title: "Flight Tickets",
    description: "Domestic and international air ticketing at the best available fares.",
  },
  {
    icon: Hotel,
    title: "Hotels & Holiday Packages",
    description: "Handpicked stays and ready-to-go holiday packages across India and abroad.",
  },
  {
    icon: FileCheck,
    title: "Visa Assistance & Travel Insurance",
    description: "End-to-end visa support and travel insurance for worry-free journeys.",
  },
  {
    icon: Car,
    title: "Car Rental",
    description: "Comfortable, reliable ground transport and chauffeur-driven cars.",
  },
  {
    icon: Briefcase,
    title: "Corporate Travel",
    description: "Managed travel programmes for organizations, teams and institutions.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our story"
        title="Trusted Travel Management & Tourism Solutions Since 2014"
        description="Serving government institutions, corporate organizations, and individual travellers across Northeast India with reliable, professional, and personalized travel services."
        image="https://res.cloudinary.com/dzevugvgg/image/upload/v1779640593/lg-travels/site/images/1488085061387-422e29b40080.jpg"
        crumbs={[{ label: "About" }]}
        actions={
          <>
            <Button href="/packages" variant="gold" size="lg">
              Explore Packages
            </Button>
            <Button href="/contact" variant="glass" size="lg">
              Contact Our Travel Experts
            </Button>
          </>
        }
      />

      {/* Our Story */}
      <section className="container-lux grid items-start gap-12 py-16 md:py-24 lg:grid-cols-2">
        <Reveal>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lift lg:sticky lg:top-28">
            <Image
              src="https://res.cloudinary.com/dzevugvgg/image/upload/v1779640594/lg-travels/site/images/1469854523086-cc02fe5d8800.jpg"
              alt="LG Travels journeys across India and beyond"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <div>
          <SectionHeading align="left" eyebrow="Our story" title="Built on trust since 2014" />
          <div className="mt-6 space-y-4 text-ink/70">
            <p>
              LG Travels was established in 2014 with a simple vision — to provide dependable,
              transparent, and professional travel management services for travellers and
              organizations across India.
            </p>
            <p>
              What began as a small initiative has grown into a trusted travel partner for
              government institutions, corporate organizations, educational institutions, and
              individual travellers. Over the years, we have built our reputation through consistent
              service quality, ethical business practices, and a commitment to understanding the
              unique travel needs of every client.
            </p>
            <p>
              Headquartered in Guwahati, Assam, LG Travels combines local expertise with a strong
              network of airline, hotel, and transportation partners to deliver seamless travel
              experiences across India and international destinations.
            </p>
            <p>
              At LG Travels, we believe travel is not simply about reaching a destination. It is
              about creating smooth journeys, memorable experiences, and lasting relationships built
              on trust and reliability.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose LG Travels */}
      <section className="bg-mist py-16 md:py-24">
        <div className="container-lux">
          <SectionHeading
            eyebrow="Why choose us"
            title="Why choose LG Travels"
            description="A travel partner organizations and travellers across Northeast India rely on."
          />
          <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChoose.map(({ icon: Icon, title }) => (
              <Reveal key={title}>
                <div className="flex h-full items-start gap-4 rounded-3xl border border-navy-700/8 bg-white p-6 shadow-soft">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gold-100 text-gold-700">
                    <Icon className="h-6 w-6" />
                  </span>
                  <p className="mt-1 font-display text-base font-semibold leading-snug text-navy-900">
                    {title}
                  </p>
                </div>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Our Services */}
      <section className="container-lux py-16 md:py-24">
        <SectionHeading
          eyebrow="What we do"
          title="Our services"
          description="Everything you need for a smooth journey, handled by one trusted team."
        />
        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, description }) => (
            <Reveal key={title}>
              <div className="h-full rounded-3xl border border-navy-700/8 bg-white p-7 shadow-soft">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-navy-50 text-navy-700">
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="mt-6 font-display text-lg font-semibold text-navy-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{description}</p>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
        <div className="mt-12 flex flex-wrap gap-4">
          <Button href="/packages" variant="primary" size="lg">
            Explore Packages
          </Button>
          <Button href="/contact" variant="outline" size="lg">
            Contact Our Travel Experts
          </Button>
        </div>
      </section>
    </>
  );
}
