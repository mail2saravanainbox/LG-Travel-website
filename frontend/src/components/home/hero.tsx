"use client";

import { motion, type Variants } from "framer-motion";
import { Compass, Plane, ShieldCheck, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { EASE_LUX } from "@/lib/motion";
import { SearchWidget } from "./search-widget";

// Poster is delivered through Cloudinary transforms (f_auto/q_auto) and is the
// sole hero media on mobile and reduced-motion, so it must stay lightweight.
const POSTER =
  "https://res.cloudinary.com/dzevugvgg/image/upload/f_auto,q_auto,w_1920/v1779640602/lg-travels/site/images/1514282401047-d79a71a590e8.jpg";

// The original premium 4K drone master, compressed for delivery (f_auto serves
// webm/av1 where supported; q_auto + br_4m cap the size vs the 58 MB raw). It
// only loads on desktop — mobile shows the poster image — so the heavier premium
// clip doesn't hurt mobile performance. Swap this URL when the asset moves to AWS.
const HERO_VIDEO =
  "https://res.cloudinary.com/dzevugvgg/video/upload/f_auto,q_auto,w_1920,c_limit,br_4m/v1779640801/lg-travels/site/videos/pexels-2169880.mp4";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.12, ease: EASE_LUX },
  }),
};

export function Hero({
  designerEyebrow = "Your designer is online",
  designerTitle = "Plan a bespoke trip in minutes",
  trendingEyebrow = "Trending now",
  trendingBadge = "-14%",
  trendingTitle = "Maldives Overwater Escape",
  trendingSubtitle = "6 days · Private villa · Seaplane",
  trendingPrice = "₹3,48,600",
  trendingRating = "4.9",
}: {
  designerEyebrow?: string;
  designerTitle?: string;
  trendingEyebrow?: string;
  trendingBadge?: string;
  trendingTitle?: string;
  trendingSubtitle?: string;
  trendingPrice?: string;
  trendingRating?: string;
} = {}) {
  // Load the background video only on larger screens, and never when the user
  // prefers reduced motion. Mobile / slow-connection visitors get the poster
  // image instantly instead of downloading the clip. Starts false so the server
  // render and first client render match (no hydration mismatch); the effect
  // flips it on where appropriate.
  const [showVideo, setShowVideo] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
    );
    const update = () => setShowVideo(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <section className="relative flex items-start overflow-hidden md:min-h-[100svh] md:items-center">
      {/* Poster is painted instantly and is the only hero media on mobile /
          reduced-motion. The video mounts on top only where it's appropriate. */}
      <div
        className="absolute inset-0 h-full w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${POSTER})` }}
        aria-hidden
      />
      {showVideo && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={POSTER}
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
      )}

      {/* Gradient overlays for readability */}
      <div className="hero-overlay absolute inset-0" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-r from-navy-950/70 via-navy-950/20 to-transparent"
        aria-hidden
      />

      {/* Floating 3D-style objects */}
      <FloatingObjects />

      <div className="container-lux relative z-10 grid w-full items-center gap-12 pt-28 pb-16 md:pb-52 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <motion.span
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-white"
          >
            <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
            Rated 4.9/5 by 2,300+ luxury travellers
          </motion.span>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-6 max-w-3xl text-balance font-display text-5xl font-bold leading-[1.02] text-white sm:text-6xl lg:text-7xl"
          >
            The world,{" "}
            <span className="text-gold-gradient">curated</span> for the way you travel.
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-white/80"
          >
            Cinematic, bespoke journeys to the planet&apos;s most extraordinary places —
            designed end-to-end by experts, delivered with concierge-grade care.
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button href="/packages" variant="gold" size="lg">
              Explore Packages
            </Button>
            <Button href="/destinations" variant="glass" size="lg">
              <Compass className="h-5 w-5" />
              Browse Destinations
            </Button>
          </motion.div>

          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-white/70"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-gold-400" /> Secure booking
            </span>
            <span className="flex items-center gap-2">
              <Plane className="h-4 w-4 text-gold-400" /> 120+ destinations
            </span>
            <span className="flex items-center gap-2">
              <Star className="h-4 w-4 text-gold-400" /> 24/7 concierge
            </span>
          </motion.div>
        </div>

        {/* Floating stat card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:col-span-5 lg:block"
        >
          <div className="ml-auto w-full max-w-sm space-y-4">
            <div className="glass animate-float-slow rounded-3xl p-5 text-white shadow-glow">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">{trendingEyebrow}</span>
                {trendingBadge && (
                  <span className="rounded-full bg-gold-400 px-2.5 py-0.5 text-xs font-semibold text-navy-900">
                    {trendingBadge}
                  </span>
                )}
              </div>
              <p className="mt-2 font-display text-xl font-semibold">{trendingTitle}</p>
              <p className="text-sm text-white/60">{trendingSubtitle}</p>
              <div className="mt-4 flex items-end justify-between">
                <span className="text-2xl font-bold">{trendingPrice}</span>
                {trendingRating && (
                  <span className="flex items-center gap-1 text-sm text-gold-300">
                    <Star className="h-4 w-4 fill-gold-300" /> {trendingRating}
                  </span>
                )}
              </div>
            </div>
            <div className="glass animate-float-slower ml-8 rounded-2xl p-4 text-white shadow-glow">
              <p className="text-sm text-white/70">{designerEyebrow}</p>
              <p className="font-display text-base font-semibold">{designerTitle}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search widget anchored to bottom */}
      <div className="container-lux absolute inset-x-0 bottom-6 z-20 hidden md:block">
        <SearchWidget />
      </div>
    </section>
  );
}

function FloatingObjects() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="animate-float-slow absolute right-[12%] top-[22%] h-40 w-40 rounded-full bg-gold-400/20 blur-2xl" />
      <div className="animate-float-slower absolute left-[6%] bottom-[28%] h-52 w-52 rounded-full bg-navy-400/25 blur-3xl" />
      <Plane className="animate-float-slow absolute right-[20%] top-[34%] h-10 w-10 -rotate-12 text-white/30" />
    </div>
  );
}
