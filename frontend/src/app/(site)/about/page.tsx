import type { Metadata } from "next";
import Image from "next/image";
import { Award, Globe2, HeartHandshake, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal, RevealGroup } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { fetchSiteSettings } from "@/services/settings.service";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "LG Travels is a global luxury travel-tech brand designing cinematic, bespoke journeys with concierge-grade care.",
};

const values = [
  { icon: Globe2, title: "Global, local roots", description: "Specialists embedded in every region, from the Gulf to the Alps to Southeast Asia." },
  { icon: HeartHandshake, title: "Designed around you", description: "No two travellers are alike. Every itinerary starts from a blank page and your story." },
  { icon: Award, title: "Uncompromising quality", description: "We only partner with properties and guides we'd send our own families to." },
  { icon: Users, title: "Human, always", description: "Technology makes us faster; people make us better. A real expert is always on call." },
];

export default async function AboutPage() {
  const site = await fetchSiteSettings();
  return (
    <>
      <PageHeader
        eyebrow="Our story"
        title="Luxury travel, curated for you — from India to the world"
        description="LG Travels crafts bespoke luxury journeys across India and beyond — private stays, extraordinary landscapes and concierge-grade care from the first idea to the final sunset."
        image="https://res.cloudinary.com/dzevugvgg/image/upload/v1779640593/lg-travels/site/images/1488085061387-422e29b40080.jpg"
        crumbs={[{ label: "About" }]}
      />

      {/* Story */}
      <section className="container-lux grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2">
        <Reveal>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lift">
            <Image
              src="https://res.cloudinary.com/dzevugvgg/image/upload/v1779640594/lg-travels/site/images/1469854523086-cc02fe5d8800.jpg"
              alt="Travellers on a journey"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <div>
          <SectionHeading
            align="left"
            eyebrow="Why we exist"
            title="Rooted in India, designed for the world"
          />
          <div className="mt-6 space-y-4 text-ink/70">
            <p>
              LG Travels was born from a simple belief: that a great journey should feel as
              considered as the destination itself. From our home in Guwahati, in India&apos;s
              beautiful Northeast, we design luxury travel that&apos;s personal rather than
              packaged — every trip shaped around the traveller, never a template.
            </p>
            <p>
              From the Himalayas and the landscapes of India to the Maldives, Dubai, Bali and
              beyond, our specialists pair genuine local knowledge with seamless, concierge-grade
              planning. Handpicked stays, thoughtful details and a real person on call at every
              step — that&apos;s what makes travelling with us feel effortless.
            </p>
          </div>
          <Button href="/packages" variant="primary" className="mt-8">
            Explore our journeys
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-navy-900 py-16 text-white">
        <div className="container-lux grid grid-cols-2 gap-8 md:grid-cols-4">
          {site.aboutStats
            .filter((s) => s.value || s.label)
            .map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-4xl font-bold text-gold-400 md:text-5xl">{s.value}</p>
              <p className="mt-2 text-sm text-white/60">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="container-lux py-16 md:py-24">
        <SectionHeading
          eyebrow="What we stand for"
          title="The principles behind every journey"
        />
        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, description }) => (
            <Reveal key={title}>
              <div className="h-full rounded-3xl border border-navy-700/8 bg-white p-7 shadow-soft">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gold-100 text-gold-700">
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="mt-6 font-display text-lg font-semibold text-navy-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{description}</p>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </section>
    </>
  );
}
