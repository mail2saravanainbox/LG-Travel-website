import { BadgeDollarSign, Headset, ShieldCheck, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal, RevealGroup } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";

// Cinematic stock footage (verified Pexels CDN; swap for Cloudinary in production).
const SHOWCASE_POSTER =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80";
const SHOWCASE_VIDEOS = [
  "https://videos.pexels.com/video-files/3214448/3214448-uhd_2560_1440_25fps.mp4",
  "https://videos.pexels.com/video-files/1739010/1739010-hd_1920_1080_30fps.mp4",
];

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
    <section id="why-lg-travels" className="bg-mist py-20 md:py-28">
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

        {/* Cinematic showcase band */}
        <Reveal className="mt-16">
          <div className="group relative overflow-hidden rounded-[2rem] shadow-lift">
            <video
              className="h-[52vh] min-h-[340px] w-full object-cover transition-transform duration-[1.2s] group-hover:scale-[1.03]"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={SHOWCASE_POSTER}
            >
              {SHOWCASE_VIDEOS.map((src) => (
                <source key={src} src={src} type="video/mp4" />
              ))}
            </video>

            {/* Premium gradient overlays */}
            <div className="hero-overlay absolute inset-0" aria-hidden />
            <div
              className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/25 to-navy-950/30"
              aria-hidden
            />

            {/* Overlaid copy */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-gold-300">
                A glimpse of what awaits
              </span>
              <h3 className="mt-5 max-w-3xl text-balance font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                Every journey, cinematic from the very first moment
              </h3>
              <p className="mt-4 max-w-xl text-balance text-base text-white/80 sm:text-lg">
                From private villas to glacier railways — we choreograph each detail so all
                that&apos;s left for you is to arrive and be amazed.
              </p>
              <Button href="/packages" variant="gold" size="lg" className="mt-7">
                Explore Packages
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
