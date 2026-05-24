import Image from "next/image";
import { BadgeDollarSign, Headset, ShieldCheck, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal, RevealGroup } from "@/components/shared/reveal";

// Himalayan scenery, gently animated with a slow zoom/pan ("Ken Burns") so the
// still image feels like cinematic footage — no external video dependency.
const BG_IMAGE =
  "https://res.cloudinary.com/dzevugvgg/image/upload/v1779640604/lg-travels/site/images/1605649487212-47bdab064df7.jpg";

const features = [
  {
    icon: BadgeDollarSign,
    title: "Best-Price Promise",
    description: "Transparent pricing with no hidden fees — and we'll match any comparable luxury quote.",
  },
  {
    icon: Headset,
    title: "24/7 Concierge",
    description: "A real human on call around the clock, in your timezone, for the entire journey.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Booking",
    description: "Bank-grade encryption and financial protection on every payment you make.",
  },
  {
    icon: Sparkles,
    title: "Curated by Experts",
    description: "Every itinerary is hand-designed by specialists who know each region intimately.",
  },
];

export function WhyChooseUs() {
  return (
    <section id="why-lg-travels" className="relative overflow-hidden py-20 md:py-28">
      {/* Cinematic scenery background — slow zoom/pan makes the still feel like film */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <Image
          src={BG_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="animate-ken-burns object-cover"
        />
      </div>

      {/* Dark overlays keep the white cards & heading readable over the video */}
      <div className="absolute inset-0 bg-navy-950/70" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-b from-navy-950/85 via-navy-950/45 to-navy-950/85"
        aria-hidden
      />

      <div className="container-lux relative z-10">
        <SectionHeading
          light
          eyebrow="Why LG Travels"
          title="Luxury travel, engineered to feel effortless"
          description="We obsess over the details so you can be fully present for the moments that matter."
        />

        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <Reveal key={title}>
              <div className="group h-full rounded-3xl border border-white/10 bg-white/95 p-7 shadow-lift backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:bg-white">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-navy-700 text-gold-400 transition-colors duration-500 group-hover:bg-gold-400 group-hover:text-navy-900">
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="mt-6 font-display text-xl font-semibold text-navy-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{description}</p>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
