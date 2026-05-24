import type { Metadata } from "next";
import Image from "next/image";
import { Award, Globe2, HeartHandshake, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal, RevealGroup } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "LG Travels is a global luxury travel-tech brand designing cinematic, bespoke journeys with concierge-grade care.",
};

const stats = [
  { value: "120+", label: "Destinations" },
  { value: "18k+", label: "Journeys crafted" },
  { value: "4.9/5", label: "Average rating" },
  { value: "24/7", label: "Concierge care" },
];

const values = [
  { icon: Globe2, title: "Global, local roots", description: "Specialists embedded in every region, from the Gulf to the Alps to Southeast Asia." },
  { icon: HeartHandshake, title: "Designed around you", description: "No two travellers are alike. Every itinerary starts from a blank page and your story." },
  { icon: Award, title: "Uncompromising quality", description: "We only partner with properties and guides we'd send our own families to." },
  { icon: Users, title: "Human, always", description: "Technology makes us faster; people make us better. A real expert is always on call." },
];

const team = [
  { name: "Elena Vasquez", role: "Head of Travel Design", img: "https://i.pravatar.cc/400?img=47" },
  { name: "Omar Haddad", role: "Middle East Specialist", img: "https://i.pravatar.cc/400?img=59" },
  { name: "Sophie Dubois", role: "Europe Specialist", img: "https://i.pravatar.cc/400?img=25" },
  { name: "Marcus Lee", role: "Indian Ocean Specialist", img: "https://i.pravatar.cc/400?img=14" },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our story"
        title="Luxury travel, reimagined for a global generation"
        description="We're a travel-tech brand on a mission to make extraordinary journeys feel effortless — wherever in the world you call home."
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
            title="Born from a love of the journey, not just the destination"
          />
          <div className="mt-6 space-y-4 text-ink/70">
            <p>
              LG Travels began with a simple belief: that the world&apos;s most beautiful places
              deserve to be experienced beautifully. Not rushed, not generic — but designed with
              intention, by people who genuinely know each place.
            </p>
            <p>
              Today we serve travellers across the UAE, India, Europe and beyond, blending
              specialist human expertise with seamless technology. The result is a way of
              travelling that feels personal, cinematic and completely effortless.
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
          {stats.map((s) => (
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

      {/* Team */}
      <section id="careers" className="bg-mist py-16 md:py-24">
        <div className="container-lux">
          <SectionHeading
            eyebrow="The people"
            title="Meet your travel designers"
            description="A global team of specialists, each obsessed with their corner of the world."
          />
          <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m) => (
              <Reveal key={m.name}>
                <div className="group overflow-hidden rounded-3xl bg-white shadow-soft">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={m.img}
                      alt={m.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <p className="font-display text-lg font-semibold text-navy-900">{m.name}</p>
                    <p className="text-sm text-gold-600">{m.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
