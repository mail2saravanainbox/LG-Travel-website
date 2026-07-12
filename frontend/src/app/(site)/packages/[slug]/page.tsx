import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check, Clock, MapPin, Star, Users, X } from "lucide-react";
import { fetchPackage, fetchPackageSlugs, fetchRelatedPackages } from "@/services/packages.service";
import { fetchTestimonials } from "@/services/testimonials.service";
import { faqs } from "@/data/faq";
import { ImageCarousel } from "@/components/shared/image-carousel";
import { ItineraryTimeline } from "@/components/packages/itinerary-timeline";
import { BookingBox } from "@/components/packages/booking-box";
import { PackageCard } from "@/components/shared/package-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { Accordion } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export async function generateStaticParams() {
  return (await fetchPackageSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await fetchPackage(slug);
  if (!p) return { title: "Package not found" };
  return {
    title: p.title,
    description: p.summary,
    openGraph: { images: [p.heroImage] },
  };
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = await fetchPackage(slug);
  if (!pkg) notFound();

  const [related, allTestimonials] = await Promise.all([
    fetchRelatedPackages(slug),
    fetchTestimonials(),
  ]);
  const reviews = allTestimonials.slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pkg.title,
    description: pkg.summary,
    image: pkg.heroImage,
    offers: {
      "@type": "Offer",
      price: pkg.price,
      priceCurrency: pkg.currency,
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: pkg.rating,
      reviewCount: pkg.reviewCount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container-lux pt-28 md:pt-32">
        {/* Title block */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="gold">{pkg.category}</Badge>
          {pkg.badge && <Badge variant="navy">{pkg.badge}</Badge>}
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold text-navy-900 md:text-5xl">
          {pkg.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink/60">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-gold-500" /> {pkg.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-gold-500" /> {pkg.durationDays} days / {pkg.durationNights} nights
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-gold-500" /> {pkg.groupSize}
          </span>
          <span className="flex items-center gap-1.5 font-medium text-navy-800">
            <Star className="h-4 w-4 fill-gold-400 text-gold-400" /> {pkg.rating} ({pkg.reviewCount} reviews)
          </span>
        </div>

        <div className="mt-6">
          <ImageCarousel images={[pkg.heroImage, ...pkg.gallery]} title={pkg.title} />
        </div>
      </div>

      {/* Main content + booking */}
      <div className="container-lux grid gap-12 py-16 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <h2 className="font-display text-2xl font-bold text-navy-900">Trip overview</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/70">{pkg.description}</p>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {pkg.highlights.map((h) => (
              <li key={h} className="flex items-center gap-3 text-ink/70">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold-100 text-gold-700">
                  <Check className="h-4 w-4" />
                </span>
                {h}
              </li>
            ))}
          </ul>

          {/* Itinerary */}
          <h2 className="mt-12 font-display text-2xl font-bold text-navy-900">Day-by-day itinerary</h2>
          <div className="mt-6">
            <ItineraryTimeline itinerary={pkg.itinerary} />
          </div>

          {/* Inclusions / Exclusions */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6">
              <h3 className="font-display text-lg font-semibold text-emerald-800">What&apos;s included</h3>
              <ul className="mt-4 space-y-3">
                {pkg.inclusions.map((i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-ink/70">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {i}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-6">
              <h3 className="font-display text-lg font-semibold text-rose-800">Not included</h3>
              <ul className="mt-4 space-y-3">
                {pkg.exclusions.map((i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-ink/70">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" /> {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Reviews */}
          <h2 className="mt-12 font-display text-2xl font-bold text-navy-900">Traveller reviews</h2>
          <div className="mt-6 space-y-4">
            {reviews.map((r) => (
              <figure key={r.id} className="rounded-2xl border border-navy-700/8 bg-white p-6 shadow-soft">
                <div className="flex items-center gap-3">
                  <Image
                    src={r.avatar}
                    alt={r.name}
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-navy-900">{r.name}</p>
                    <p className="text-xs text-ink/50">{r.location}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
                    ))}
                  </div>
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-ink/70">“{r.quote}”</blockquote>
              </figure>
            ))}
          </div>

          {/* FAQ */}
          <h2 className="mt-12 font-display text-2xl font-bold text-navy-900">Frequently asked</h2>
          <div className="mt-4">
            <Accordion items={faqs.slice(0, 5)} />
          </div>
        </div>

        <aside className="min-w-0 lg:col-span-1">
          <BookingBox pkg={pkg} />
        </aside>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-mist py-16 md:py-24">
          <div className="container-lux">
            <SectionHeading eyebrow="You may also like" title="Related journeys" />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PackageCard key={p.id} pkg={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
