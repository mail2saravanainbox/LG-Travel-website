import { BadgeDollarSign, Headset, ShieldCheck, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal, RevealGroup } from "@/components/shared/reveal";

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
    <section className="bg-mist py-20 md:py-28">
      <div className="container-lux">
        <SectionHeading
          eyebrow="Why LG Travels"
          title="Luxury travel, engineered to feel effortless"
          description="We obsess over the details so you can be fully present for the moments that matter."
        />

        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <Reveal key={title}>
              <div className="group h-full rounded-3xl border border-navy-700/8 bg-white p-7 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift">
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
